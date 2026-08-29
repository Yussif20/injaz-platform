-- Admin dashboard aggregates.
--
-- This migration is the clearest argument for the whole backend swap. The admin dashboard
-- previously assembled its numbers in the browser, and did it three separate wrong ways:
--
--   1. getDashboardStats() made four HTTP round-trips, one of which was `GET /Subscriptions`
--      — the entire subscriptions table, downloaded so the browser could run
--      `reduce((sum, sub) => sum + sub.finalAmount, 0)` and arrive at one number.
--
--   2. Four of its eight figures were not computed at all. `totalProfitsChange: 30`,
--      `newUsersChange: -15`, `subscribersChange: 20`, `filesChange: 10` were literals with
--      a `// placeholder` comment, rendered as trend badges next to the real figures. Staff
--      were reading invented business metrics presented identically to measured ones.
--
--   3. getProfitChartData() bucketed revenue by `date.getMonth()` alone, with no year. Every
--      January of every year summed into the same bar. The chart got quietly wronger the
--      longer the product ran.
--
-- All of it is one GROUP BY per question, computed where the data is. Trends are real,
-- buckets carry their year, and the browser receives numbers rather than a table.
--
-- Every function here is SECURITY DEFINER — it must see across all accounts — so every one
-- opens by checking that the caller is staff.

-- ─── Trend arithmetic ─────────────────────────────────────────────────────────
--
-- Growth from `previous` to `current`, as a percentage rounded to one decimal.
--
-- Growth from a base of zero has no percentage — the honest answer is "no comparison",
-- not "infinity" and not "0%". Null says that, and the badge can render it as a dash
-- rather than implying flat performance in a month that was actually the first with any
-- activity at all.

create or replace function public.percent_change(previous numeric, current numeric)
returns numeric
language sql
immutable
set search_path = ''
as $fn$
  select case
    when previous is null or previous = 0 then null
    else round(((current - previous) / previous) * 100, 1)
  end;
$fn$;

comment on function public.percent_change(numeric, numeric) is
  'Percentage change, or null when there is no base to compare against. The dashboard '
  'renders null as a dash instead of inventing a number, which is what the four '
  'hardcoded trend literals used to do.';

-- ─── Dashboard summary ────────────────────────────────────────────────────────

create or replace function public.admin_dashboard_stats()
returns json
language plpgsql
security definer
stable
set search_path = ''
as $fn$
declare
  this_month_start timestamptz := date_trunc('month', now());
  last_month_start timestamptz := date_trunc('month', now() - interval '1 month');
  result json;
begin
  if not public.is_admin() then
    raise exception 'admin role required' using errcode = '42501';
  end if;

  with revenue as (
    select
      coalesce(sum(final_amount), 0) as total,
      coalesce(sum(final_amount) filter (where subscribed_at >= this_month_start), 0)
        as this_month,
      coalesce(sum(final_amount) filter (
        where subscribed_at >= last_month_start and subscribed_at < this_month_start
      ), 0) as last_month
    from public.subscriptions
    where payment_status = 'completed'
  ),
  users as (
    select
      count(*) as total,
      count(*) filter (where created_at >= this_month_start) as this_month,
      count(*) filter (
        where created_at >= last_month_start and created_at < this_month_start
      ) as last_month
    from public.accounts
    where role = 'teacher'
  ),
  subscribers as (
    select
      count(distinct account_id) filter (where expires_at > now()) as active,
      count(distinct account_id) filter (
        where subscribed_at >= this_month_start
      ) as this_month,
      count(distinct account_id) filter (
        where subscribed_at >= last_month_start and subscribed_at < this_month_start
      ) as last_month
    from public.subscriptions
    where payment_status = 'completed'
  ),
  files as (
    select
      count(*) filter (where status = 'published') as published,
      count(*) filter (
        where status = 'published' and published_at >= this_month_start
      ) as this_month,
      count(*) filter (
        where status = 'published'
          and published_at >= last_month_start
          and published_at < this_month_start
      ) as last_month
    from public.portfolios
  )
  select json_build_object(
    'totalProfits',            revenue.total,
    'totalProfitsChange',      public.percent_change(revenue.last_month, revenue.this_month),
    'newUsersCount',           users.total,
    'newUsersChange',          public.percent_change(users.last_month, users.this_month),
    'activeSubscribersCount',  subscribers.active,
    'subscribersChange',       public.percent_change(subscribers.last_month, subscribers.this_month),
    'publishedFilesCount',     files.published,
    'filesChange',             public.percent_change(files.last_month, files.this_month)
  )
  into result
  from revenue, users, subscribers, files;

  return result;
end;
$fn$;

comment on function public.admin_dashboard_stats() is
  'The eight figures on the admin dashboard, in one round-trip. Replaces four HTTP calls '
  'plus a full download of the subscriptions table, and computes the four trend '
  'percentages that were previously hardcoded literals.';

-- ─── Time series ──────────────────────────────────────────────────────────────
--
-- Both charts share a shape: one bucket per month over a trailing window, with empty
-- months present and zeroed so the line does not skip them. The bucket key carries the
-- year, which is the bug fix.

create or replace function public.admin_revenue_by_month(months integer default 12)
returns table (bucket date, value numeric)
language plpgsql
security definer
stable
set search_path = ''
as $fn$
begin
  if not public.is_admin() then
    raise exception 'admin role required' using errcode = '42501';
  end if;

  return query
  with series as (
    select generate_series(
      date_trunc('month', now()) - make_interval(months => months - 1),
      date_trunc('month', now()),
      interval '1 month'
    )::date as bucket
  )
  select
    series.bucket,
    coalesce(sum(s.final_amount), 0)::numeric as value
  from series
  left join public.subscriptions s
    on date_trunc('month', s.subscribed_at)::date = series.bucket
   and s.payment_status = 'completed'
  group by series.bucket
  order by series.bucket;
end;
$fn$;

create or replace function public.admin_portfolios_by_month(months integer default 12)
returns table (bucket date, value bigint)
language plpgsql
security definer
stable
set search_path = ''
as $fn$
begin
  if not public.is_admin() then
    raise exception 'admin role required' using errcode = '42501';
  end if;

  return query
  with series as (
    select generate_series(
      date_trunc('month', now()) - make_interval(months => months - 1),
      date_trunc('month', now()),
      interval '1 month'
    )::date as bucket
  )
  select
    series.bucket,
    count(p.id) as value
  from series
  left join public.portfolios p
    on date_trunc('month', p.created_at)::date = series.bucket
  group by series.bucket
  order by series.bucket;
end;
$fn$;

-- ─── Recent activity ──────────────────────────────────────────────────────────
--
-- The subscriptions list previously fetched N rows and then issued one GET /Users/{id} per
-- distinct subscriber to resolve names and avatars — eleven round-trips to render a
-- ten-item sidebar. It is a join.

create or replace function public.admin_latest_subscriptions(row_limit integer default 10)
returns table (
  id bigint,
  account_name text,
  account_image_path text,
  subscribed_at timestamptz,
  amount numeric
)
language plpgsql
security definer
stable
set search_path = ''
as $fn$
begin
  if not public.is_admin() then
    raise exception 'admin role required' using errcode = '42501';
  end if;

  return query
  select
    s.id,
    a.full_name,
    a.image_path,
    s.subscribed_at,
    s.final_amount
  from public.subscriptions s
  join public.accounts a on a.id = s.account_id
  where s.payment_status = 'completed'
  order by s.subscribed_at desc
  limit least(greatest(row_limit, 1), 100);
end;
$fn$;

create or replace function public.admin_latest_portfolios(row_limit integer default 10)
returns table (
  id bigint,
  owner_name text,
  profile_type_name text,
  academic_year_name text,
  status public.portfolio_status,
  created_at timestamptz
)
language plpgsql
security definer
stable
set search_path = ''
as $fn$
begin
  if not public.is_admin() then
    raise exception 'admin role required' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    a.full_name,
    -- The displayed type name follows the owner's grammatical gender; see packages/domain.
    case when a.gender = 'female' then pt.type_name_female else pt.type_name_male end,
    ay.year_name,
    p.status,
    p.created_at
  from public.portfolios p
  join public.accounts a on a.id = p.account_id
  join public.profile_types pt on pt.id = p.profile_type_id
  join public.academic_years ay on ay.id = p.academic_year_id
  order by p.created_at desc
  limit least(greatest(row_limit, 1), 100);
end;
$fn$;

grant execute on function
  public.admin_dashboard_stats(),
  public.admin_revenue_by_month(integer),
  public.admin_portfolios_by_month(integer),
  public.admin_latest_subscriptions(integer),
  public.admin_latest_portfolios(integer)
to authenticated;
