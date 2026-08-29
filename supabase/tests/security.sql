-- Security boundary assertions.
--
-- Every claim the README will make about who can see what is checked here, from the point
-- of view of each role, against a real database. Run with:
--
--     npm run db:test
--
-- Sessions are simulated the way PostgREST establishes them — set request.jwt.claims, then
-- `set local role` — so these tests exercise the same code path a real request does rather
-- than a convenient approximation. Testing as a superuser would pass regardless of whether
-- a single policy existed.
--
-- The whole file runs in one transaction and rolls back, so it leaves nothing behind. Its
-- assertions are written to hold whether or not supabase/seed.sql has run: fixtures use
-- names that cannot collide with seeded rows, and no assertion depends on an absolute
-- row count. What is asserted is the property — "anon sees no inactive row" — rather
-- than a total that only holds on an empty database.

begin;

create extension if not exists pgtap with schema extensions;

select plan(30);

create schema if not exists tests;

-- ─── Helpers ──────────────────────────────────────────────────────────────────

create or replace function tests.act_as(user_id uuid)
returns void language plpgsql as $fn$
begin
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', user_id::text, 'role', 'authenticated')::text,
    true
  );
  execute 'set local role authenticated';
end;
$fn$;

create or replace function tests.act_as_anon()
returns void language plpgsql as $fn$
begin
  perform set_config('request.jwt.claims', null, true);
  execute 'set local role anon';
end;
$fn$;

create or replace function tests.act_as_owner()
returns void language plpgsql as $fn$
begin
  perform set_config('request.jwt.claims', null, true);
  execute 'reset role';
end;
$fn$;

-- The helpers must stay callable while acting as anon or authenticated, which is their
-- entire purpose. This schema exists only inside this transaction and rolls back with
-- everything else, so the grant reaches nothing real.
grant usage on schema tests to anon, authenticated;
grant execute on all functions in schema tests to anon, authenticated;

-- ─── Fixtures ─────────────────────────────────────────────────────────────────
-- Built as the table owner, bypassing RLS, so the fixtures themselves are not a test.

do $seed$
declare
  teacher_a uuid := '11111111-1111-1111-1111-111111111111';
  teacher_b uuid := '22222222-2222-2222-2222-222222222222';
  admin_u   uuid := '33333333-3333-3333-3333-333333333333';
  year_id   bigint;
  type_id   bigint;
  section_id bigint;
  sub_id    bigint;
  portfolio_a bigint;
  portfolio_b bigint;
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                          email_confirmed_at, created_at, updated_at,
                          raw_app_meta_data, raw_user_meta_data)
  values
    (teacher_a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'a@example.test', '', now(), now(), now(), '{}', '{"full_name":"Teacher A"}'),
    (teacher_b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'b@example.test', '', now(), now(), now(), '{}', '{"full_name":"Teacher B"}'),
    (admin_u,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'admin@example.test', '', now(), now(), now(), '{}', '{"full_name":"Admin"}');

  -- handle_new_user created the accounts rows. Promote one, and give them PII we can
  -- later assert is not leaking.
  update public.accounts set role = 'admin' where id = admin_u;
  update public.accounts
     set national_id = '1234567890', address = 'Riyadh', gender = 'male',
         email = 'a@example.test', phone = '0500000000'
   where id = teacher_a;

  insert into public.academic_years (year_name, start_date, end_date, status)
  values ('SECURITY-TEST-YEAR', '2024-08-01', '2025-06-30', 'active')
  returning id into year_id;

  insert into public.profile_types (type_name_male, type_name_female, available_for)
  values ('SECURITY-TEST-TYPE-M', 'SECURITY-TEST-TYPE-F', 'both')
  returning id into type_id;

  insert into public.sections (profile_type_id, title, weight_percent, display_order)
  values (type_id, 'الإنجازات', 50, 1)
  returning id into section_id;

  insert into public.subsections (section_id, title, display_order)
  values (section_id, 'شهادات', 1);

  insert into public.portfolios (account_id, profile_type_id, academic_year_id, status)
  values (teacher_a, type_id, year_id, 'draft')
  returning id into portfolio_a;

  insert into public.portfolios (account_id, profile_type_id, academic_year_id, status)
  values (teacher_b, type_id, year_id, 'draft')
  returning id into portfolio_b;

  insert into public.share_links (portfolio_id, token)
  values (portfolio_a, repeat('a', 40));

  insert into public.reviews (content, rating, reviewer_name, is_active)
  values ('published review', 5, 'Someone', true),
         ('hidden review', 4, 'Someone Else', false);

  insert into public.system_parameters (key, value, is_active)
  values ('terms', 'the terms', true),
         ('secret_flag', 'internal', false);
end;
$seed$;

-- ══════════════════════════════════════════════════════════════════════════════
--  anon — the public web
-- ══════════════════════════════════════════════════════════════════════════════

select tests.act_as_anon();

select throws_ok(
  'select * from public.accounts',
  '42501',
  null,
  'anon is refused accounts at the grant level, not merely filtered to zero rows'
);

select throws_ok(
  'select * from public.portfolios',
  '42501',
  null,
  'anon cannot reach portfolios at all'
);

select throws_ok(
  'select * from public.share_links',
  '42501',
  null,
  'anon cannot enumerate share tokens'
);

select throws_ok(
  'select * from public.subscriptions',
  '42501',
  null,
  'anon cannot read subscriptions'
);

select throws_ok(
  'select * from public.qualifications',
  '42501',
  null,
  'anon cannot read qualifications'
);

select is(
  (select count(*) from public.reviews where not is_active)::int,
  0,
  'anon sees no unpublished review, however many exist'
);

select is(
  (select count(*) from public.system_parameters where not is_active)::int,
  0,
  'anon sees no inactive system parameter, however many exist'
);

select throws_ok(
  'select public.admin_dashboard_stats()',
  '42501',
  null,
  'anon cannot call the admin statistics function'
);

-- ─── The share-link door ──────────────────────────────────────────────────────

select ok(
  (public.get_shared_portfolio(repeat('a', 40))) is null,
  'a valid token for an unpublished portfolio returns nothing'
);

select ok(
  (public.get_shared_portfolio(repeat('z', 40))) is null,
  'an unknown token returns nothing'
);

select ok(
  (public.get_shared_portfolio('short')) is null,
  'a malformed token returns nothing'
);

select ok(
  (public.get_shared_portfolio(null)) is null,
  'a null token returns nothing'
);

-- ══════════════════════════════════════════════════════════════════════════════
--  teacher A — a signed-in owner
-- ══════════════════════════════════════════════════════════════════════════════

select tests.act_as('11111111-1111-1111-1111-111111111111'::uuid);

select is(
  (select count(*) from public.accounts)::int,
  1,
  'a teacher sees exactly one account: their own'
);

select is(
  (select full_name from public.accounts),
  'Teacher A',
  'and it is theirs'
);

select is(
  (select count(*) from public.portfolios)::int,
  1,
  'a teacher sees only their own portfolio, not the other teacher''s'
);

select throws_ok(
  $$update public.accounts set role = 'admin' where id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'a teacher cannot promote themselves to admin'
);

select throws_ok(
  $$update public.accounts set is_active = false where id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'a teacher cannot change their own active flag'
);

select lives_ok(
  $$update public.accounts set address = 'Jeddah' where id = '11111111-1111-1111-1111-111111111111'$$,
  'a teacher can still edit their own ordinary details'
);

select throws_ok(
  $$update public.portfolios set status = 'published'
      where account_id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'publishing without an active subscription is refused'
);

select throws_ok(
  $$insert into public.subscriptions
      (account_id, expires_at, base_amount, final_amount, payment_status)
    values ('11111111-1111-1111-1111-111111111111', now() + interval '1 year',
            100, 100, 'completed')$$,
  '42501',
  null,
  'a teacher cannot grant themselves a subscription'
);

select throws_ok(
  'select public.admin_dashboard_stats()',
  '42501',
  null,
  'a teacher cannot call the admin statistics function'
);

-- ══════════════════════════════════════════════════════════════════════════════
--  teacher B — the neighbour
-- ══════════════════════════════════════════════════════════════════════════════

select tests.act_as('22222222-2222-2222-2222-222222222222'::uuid);

select is(
  (select count(*) from public.accounts
    where id = '11111111-1111-1111-1111-111111111111')::int,
  0,
  'teacher B cannot read teacher A''s account by id'
);

select is(
  (select count(*) from public.qualifications)::int,
  0,
  'teacher B sees none of teacher A''s qualifications'
);

select is(
  (select count(*) from public.share_links)::int,
  0,
  'teacher B cannot see teacher A''s share links'
);

-- ══════════════════════════════════════════════════════════════════════════════
--  Publishing, once a subscription exists
-- ══════════════════════════════════════════════════════════════════════════════

select tests.act_as_owner();

insert into public.subscriptions
  (account_id, expires_at, base_amount, final_amount, payment_status)
values
  ('11111111-1111-1111-1111-111111111111', now() + interval '1 year', 100, 100, 'completed');

select tests.act_as('11111111-1111-1111-1111-111111111111'::uuid);

select lives_ok(
  $$update public.portfolios set status = 'published'
      where account_id = '11111111-1111-1111-1111-111111111111'$$,
  'publishing succeeds once the subscription is live'
);

-- ─── And now the share link opens ─────────────────────────────────────────────

select tests.act_as_anon();

select ok(
  public.get_shared_portfolio(repeat('a', 40)) is not null,
  'the same token now resolves, because the portfolio is published'
);

select ok(
  (public.get_shared_portfolio(repeat('a', 40)) -> 'owner' ->> 'email') is null,
  'the shared view carries no email address'
);

select ok(
  not ((public.get_shared_portfolio(repeat('a', 40))::jsonb -> 'owner') ? 'nationalId'),
  'the shared view has no national id field at all'
);

-- ══════════════════════════════════════════════════════════════════════════════
--  admin
-- ══════════════════════════════════════════════════════════════════════════════

select tests.act_as('33333333-3333-3333-3333-333333333333'::uuid);

select is(
  (select count(*) from public.accounts
    where id in ('11111111-1111-1111-1111-111111111111',
                 '22222222-2222-2222-2222-222222222222'))::int,
  2,
  'an admin sees other people''s accounts'
);

select lives_ok(
  'select public.admin_dashboard_stats()',
  'an admin can call the statistics function'
);

select * from finish();

rollback;
