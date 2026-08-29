-- Anonymous access to a shared portfolio.
--
-- A teacher publishes a portfolio and shares a link: /p/<token>. Whoever holds the token
-- may read that one portfolio. The token is the entire credential.
--
-- The shape of this matters. `anon` has no SELECT grant on portfolios, portfolio_images or
-- share_links, and no policy grants it one — check 0003 and you will not find `anon`
-- mentioned for any of them. So there is no query an anonymous caller can write that
-- reaches a portfolio. The only door is the function below, which requires the token, and
-- a SECURITY DEFINER function is what lets that door exist without a grant behind it.
--
-- This also means a revoked or mistyped token is indistinguishable from a portfolio that
-- was never shared: both return null. Nothing in the response reveals which.

create or replace function public.get_shared_portfolio(share_token text)
returns json
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  target_portfolio bigint;
  result json;
begin
  -- Reject anything that cannot be a token before touching the table. Not for security —
  -- the lookup below is safe either way — but so a malformed request costs nothing.
  if share_token is null or char_length(share_token) < 32 then
    return null;
  end if;

  select sl.portfolio_id
    into target_portfolio
  from public.share_links sl
  join public.portfolios p on p.id = sl.portfolio_id
  where sl.token = share_token
    and sl.revoked_at is null
    -- An unpublished portfolio is not readable even by someone holding a valid token.
    -- Unpublishing is how a teacher takes a file back, so it has to close this door too.
    and p.status = 'published';

  if target_portfolio is null then
    return null;
  end if;

  select json_build_object(
    'id',               p.id,
    'templateId',       p.template_id,
    'imagePath',        p.image_path,
    'status',           p.status,
    'publishedAt',      p.published_at,
    'isPasswordProtected', p.file_password_hash is not null,
    'academicYearName', ay.year_name,
    'profileTypeName',
      case when a.gender = 'female' then pt.type_name_female else pt.type_name_male end,
    'owner', json_build_object(
      'fullName',  a.full_name,
      'imagePath', a.image_path,
      'rank',
        case when a.gender = 'female' then r.title_female else r.title_male end,
      -- Deliberately partial. The public view shows who made the portfolio and how to
      -- recognise them; it does not carry the national id, birth date, address, phone or
      -- email that PersonalInfoDto holds for the owner's own eyes.
      'email', null
    ),
    'qualifications', coalesce((
      select json_agg(json_build_object(
        'id', q.id,
        'degreeType', q.degree_type,
        'institution', q.institution,
        'major', q.major,
        'graduationDate', q.graduation_date
      ) order by q.graduation_date desc)
      from public.qualifications q
      where q.account_id = p.account_id
    ), '[]'::json),
    'careerJobs', coalesce((
      select json_agg(json_build_object(
        'id', c.id,
        'jobTitle', c.job_title,
        'school', c.school,
        'educationalStage', c.educational_stage,
        'startYear', c.start_year,
        'endYear', c.end_year
      ) order by c.start_year desc)
      from public.career_jobs c
      where c.account_id = p.account_id
    ), '[]'::json),
    'sections', coalesce((
      select json_agg(section_json order by display_order)
      from (
        select
          s.display_order,
          json_build_object(
            'id', s.id,
            'title', s.title,
            'weightPercent', s.weight_percent,
            'displayOrder', s.display_order,
            'subsections', coalesce((
              select json_agg(json_build_object(
                'id', ss.id,
                'title', ss.title,
                'weightPercent', ss.weight_percent,
                'displayOrder', ss.display_order,
                'images', coalesce((
                  select json_agg(json_build_object(
                    'id', img.id,
                    'imagePath', img.storage_path,
                    'description', img.description,
                    'displayOrder', img.display_order
                  ) order by img.display_order)
                  from public.portfolio_images img
                  where img.portfolio_id = p.id
                    and img.subsection_id = ss.id
                ), '[]'::json)
              ) order by ss.display_order)
              from public.subsections ss
              where ss.section_id = s.id
            ), '[]'::json)
          ) as section_json
        from public.sections s
        where s.profile_type_id = p.profile_type_id
      ) ordered
    ), '[]'::json)
  )
  into result
  from public.portfolios p
  join public.accounts a on a.id = p.account_id
  join public.profile_types pt on pt.id = p.profile_type_id
  join public.academic_years ay on ay.id = p.academic_year_id
  left join public.ranks r on r.id = p.rank_id
  where p.id = target_portfolio;

  return result;
end;
$fn$;

comment on function public.get_shared_portfolio(text) is
  'Redeem a share token for one published portfolio. The only route by which an '
  'anonymous caller can read portfolio data; anon holds no SELECT grant on any of the '
  'tables involved. Returns null for a bad, revoked or unpublished target, without '
  'distinguishing between them.';

-- Counting a view mutates, so it cannot live in the STABLE read above. Kept separate so
-- the read stays cheap and a failure to count never costs someone their page.
create or replace function public.record_share_visit(share_token text)
returns void
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if share_token is null or char_length(share_token) < 32 then
    return;
  end if;

  update public.share_links
     set access_count = access_count + 1
   where token = share_token
     and revoked_at is null;
end;
$fn$;

-- ─── Keep-alive ───────────────────────────────────────────────────────────────
--
-- Supabase pauses a free project after seven days idle, so a weekly workflow has to touch
-- Postgres — not just the edge. This is the one function `anon` may execute, and calling
-- it with a token that cannot exist performs a real indexed lookup, returns null, and
-- discloses nothing.
--
-- GET /rest/v1/ is not a substitute: it answers 401 because Supabase restricts PostgREST's
-- OpenAPI root, and a 401 is also what a paused project's edge returns. The workflow must
-- assert on the body.

grant execute on function public.get_shared_portfolio(text) to anon, authenticated;
grant execute on function public.record_share_visit(text) to anon, authenticated;

-- ─── Listing a teacher's own portfolios ───────────────────────────────────────
--
-- Assembling ProfileDto in the client would mean a query per portfolio for its type, year
-- and rank names. RLS still applies inside this function because it is INVOKER, not
-- DEFINER: a teacher sees exactly the rows the portfolios policy lets them see, and the
-- function needs no authorisation check of its own precisely because it did not opt out.

create or replace function public.my_portfolios()
returns table (
  id bigint,
  profile_type_id bigint,
  profile_type_name text,
  academic_year_id bigint,
  academic_year_name text,
  rank_title text,
  template_id integer,
  image_path text,
  status public.portfolio_status,
  is_password_protected boolean,
  published_at timestamptz,
  created_at timestamptz,
  modified_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $fn$
  select
    p.id,
    p.profile_type_id,
    case when a.gender = 'female' then pt.type_name_female else pt.type_name_male end,
    p.academic_year_id,
    ay.year_name,
    case when a.gender = 'female' then r.title_female else r.title_male end,
    p.template_id,
    p.image_path,
    p.status,
    p.file_password_hash is not null,
    p.published_at,
    p.created_at,
    p.modified_at
  from public.portfolios p
  join public.accounts a on a.id = p.account_id
  join public.profile_types pt on pt.id = p.profile_type_id
  join public.academic_years ay on ay.id = p.academic_year_id
  left join public.ranks r on r.id = p.rank_id
  order by p.created_at desc;
$fn$;

grant execute on function public.my_portfolios() to authenticated;
