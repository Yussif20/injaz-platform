-- Row level security.
--
-- Two layers, deliberately. Policies decide which rows a role may touch; grants decide
-- whether the role may reach the table at all. `anon` is refused at the grant level for
-- everything it has no business reading, which produces a hard permission error rather
-- than a silently empty result — a clearer failure, and one that cannot be turned into a
-- leak by a later policy edit.
--
-- The threat model:
--   anon           — the public web. May read published marketing content and, holding a
--                    share token, one published portfolio. Nothing else.
--   authenticated  — a signed-in teacher. May read and write their own record and their
--                    own portfolios. Must not see another teacher's anything.
--   staff (admin)  — may read every account and portfolio, and manage reference data.
--                    Cannot read another user's file password digest.

-- ─── Baseline: deny everything ────────────────────────────────────────────────

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

alter table public.accounts               enable row level security;
alter table public.academic_years         enable row level security;
alter table public.ranks                  enable row level security;
alter table public.profile_types          enable row level security;
alter table public.sections               enable row level security;
alter table public.subsections            enable row level security;
alter table public.qualifications         enable row level security;
alter table public.career_jobs            enable row level security;
alter table public.portfolios             enable row level security;
alter table public.portfolio_images       enable row level security;
alter table public.share_links            enable row level security;
alter table public.subscriptions          enable row level security;
alter table public.subscription_discounts enable row level security;
alter table public.reviews                enable row level security;
alter table public.system_parameters      enable row level security;

-- ─── accounts ─────────────────────────────────────────────────────────────────

grant select, update on public.accounts to authenticated;

create policy accounts_select_own on public.accounts
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy accounts_update_own on public.accounts
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Role and is_active are not the account holder's to change. UPDATE policies cannot
-- protect individual columns, so a trigger does it: without this, the update policy above
-- would let any teacher set their own role to admin.
-- SECURITY INVOKER on purpose: the function needs to know which role is actually driving
-- the statement, and a DEFINER function would report its own owner instead.
create or replace function public.guard_account_privileges()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  -- Only end-user sessions are guarded. PostgREST switches to `authenticated` for a
  -- logged-in user, so that is exactly the population this needs to stop. Migrations and
  -- provisioning scripts run as the table owner and server-side code runs as
  -- service_role; if those were blocked too there would be no way to create the first
  -- administrator, since promotion requires an administrator.
  if current_user <> 'authenticated' then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'role may only be changed by an administrator'
      using errcode = '42501';
  end if;

  if new.is_active is distinct from old.is_active then
    raise exception 'is_active may only be changed by an administrator'
      using errcode = '42501';
  end if;

  return new;
end;
$fn$;

create trigger accounts_guard_privileges
  before update on public.accounts
  for each row execute function public.guard_account_privileges();

create policy accounts_admin_manage on public.accounts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Reference data: readable by any signed-in user, written by staff ─────────

grant select on public.academic_years, public.ranks, public.profile_types,
                public.sections, public.subsections
  to authenticated;

grant insert, update, delete on public.academic_years, public.ranks,
                                public.profile_types, public.sections,
                                public.subsections
  to authenticated;

create policy academic_years_read on public.academic_years
  for select to authenticated using (true);
create policy academic_years_write on public.academic_years
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy ranks_read on public.ranks
  for select to authenticated using (true);
create policy ranks_write on public.ranks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy profile_types_read on public.profile_types
  for select to authenticated using (true);
create policy profile_types_write on public.profile_types
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy sections_read on public.sections
  for select to authenticated using (true);
create policy sections_write on public.sections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy subsections_read on public.subsections
  for select to authenticated using (true);
create policy subsections_write on public.subsections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── The teacher's own record ─────────────────────────────────────────────────

grant select, insert, update, delete
  on public.qualifications, public.career_jobs
  to authenticated;

create policy qualifications_own on public.qualifications
  for all to authenticated
  using (account_id = (select auth.uid()) or public.is_admin())
  with check (account_id = (select auth.uid()));

create policy career_jobs_own on public.career_jobs
  for all to authenticated
  using (account_id = (select auth.uid()) or public.is_admin())
  with check (account_id = (select auth.uid()));

-- ─── Portfolios ───────────────────────────────────────────────────────────────
--
-- Note what is absent: no policy grants `anon` anything here. Public reads of a shared
-- portfolio go through get_shared_portfolio() in 0005, which matches on the capability
-- token. There is deliberately no path by which an anonymous caller reaches this table.

grant select, insert, update, delete on public.portfolios to authenticated;

create policy portfolios_own on public.portfolios
  for all to authenticated
  using (account_id = (select auth.uid()) or public.is_admin())
  with check (account_id = (select auth.uid()));

-- Publishing requires a live subscription. Enforced here rather than only in the API, so
-- it holds however the row is written.
-- SECURITY INVOKER for the same reason as guard_account_privileges: it needs to see which
-- role is actually driving the statement.
create or replace function public.guard_portfolio_publish()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  -- The paywall exists to stop a teacher publishing without paying, so it applies to
  -- end-user sessions. Seeds, migrations and server-side code set state directly and are
  -- not the population being constrained. Test 19 in supabase/tests/security.sql asserts
  -- the rule still holds for `authenticated`, which is where it matters.
  if current_user <> 'authenticated' then
    if new.status = 'published' and new.published_at is null then
      new.published_at = now();
    end if;
    return new;
  end if;

  if new.status = 'published'
     and (tg_op = 'INSERT' or old.status is distinct from 'published')
     and not public.has_active_subscription(new.account_id)
     and not public.is_admin()
  then
    raise exception 'an active subscription is required to publish a portfolio'
      using errcode = '42501';
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;

  return new;
end;
$fn$;

create trigger portfolios_guard_publish
  before insert or update on public.portfolios
  for each row execute function public.guard_portfolio_publish();

grant select, insert, update, delete on public.portfolio_images to authenticated;

create policy portfolio_images_own on public.portfolio_images
  for all to authenticated
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id
        and (p.account_id = (select auth.uid()) or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.account_id = (select auth.uid())
    )
  );

-- ─── Share links ──────────────────────────────────────────────────────────────
--
-- The owner manages their own links. `anon` gets no grant at all: the token is redeemed
-- through a SECURITY DEFINER function, so an anonymous caller never selects from here and
-- cannot enumerate tokens.

grant select, insert, update, delete on public.share_links to authenticated;

create policy share_links_own on public.share_links
  for all to authenticated
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id
        and (p.account_id = (select auth.uid()) or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.account_id = (select auth.uid())
    )
  );

-- ─── Subscriptions ────────────────────────────────────────────────────────────
--
-- Readable by the subscriber. Deliberately not writable by them: a teacher must not be
-- able to grant themselves a subscription, so rows are created by the payment flow
-- running with the service role, never from the browser.

grant select on public.subscriptions to authenticated;

create policy subscriptions_read_own on public.subscriptions
  for select to authenticated
  using (account_id = (select auth.uid()) or public.is_admin());

grant select on public.subscription_discounts to authenticated;
grant insert, update, delete on public.subscription_discounts to authenticated;

create policy subscription_discounts_read on public.subscription_discounts
  for select to authenticated using (true);
create policy subscription_discounts_write on public.subscription_discounts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Public content ───────────────────────────────────────────────────────────
--
-- The only tables `anon` may read, and only their published rows. The landing page shows
-- testimonials and the terms of service to logged-out visitors, so these need a real
-- anonymous grant.

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;

create policy reviews_read_active on public.reviews
  for select to anon, authenticated
  using (is_active or public.is_admin());

create policy reviews_write on public.reviews
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

grant select on public.system_parameters to anon, authenticated;
grant insert, update, delete on public.system_parameters to authenticated;

create policy system_parameters_read_active on public.system_parameters
  for select to anon, authenticated
  using (is_active or public.is_admin());

create policy system_parameters_write on public.system_parameters
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ─── Sequences ────────────────────────────────────────────────────────────────
-- Identity columns need usage on their sequences for the inserts permitted above.

grant usage, select on all sequences in schema public to authenticated;
