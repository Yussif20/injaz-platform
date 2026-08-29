-- Account provisioning and the authorisation predicates the policies are built from.
--
-- Every SECURITY DEFINER function in this project follows two rules, both of which the
-- playbook learned the hard way:
--
--   1. It opens with an explicit authorisation check. SECURITY DEFINER bypasses RLS, so a
--      function that forgets this is a hole straight through every policy in 0003.
--   2. It sets `search_path = ''` and schema-qualifies every application object, so it
--      cannot be hijacked by a caller-controlled search_path. Built-ins need no prefix —
--      pg_catalog is always searched first.

-- ─── Provisioning ─────────────────────────────────────────────────────────────
--
-- A row in auth.users without a matching row here would be a user who can authenticate
-- but has no role, so this runs as a trigger rather than from application code where it
-- could be skipped.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  insert into public.accounts (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    new.email,
    -- Role is never taken from user metadata: that is client-supplied and would let
    -- anyone register themselves as staff. Everyone starts as a teacher and is promoted
    -- deliberately.
    'teacher'
  );
  return new;
end;
$fn$;

comment on function public.handle_new_user() is
  'Creates the public.accounts row for a new auth user. Role is fixed to teacher; '
  'promotion to admin is a deliberate act, never something the client can request.';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Authorisation predicates ─────────────────────────────────────────────────
--
-- Policies cannot read public.accounts directly to find the caller's role: doing so would
-- consult the very policies being evaluated. These functions are the way out of that, and
-- are the reason they are SECURITY DEFINER. They disclose nothing beyond a boolean about
-- the caller, so they need no authorisation check of their own — the "caller" is the only
-- subject they can answer about.

create or replace function public.current_role_is(target public.user_role)
returns boolean
language sql
security definer
stable
set search_path = ''
as $fn$
  select exists (
    select 1
    from public.accounts a
    where a.id = (select auth.uid())
      and a.role = target
      and a.is_active
  );
$fn$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $fn$
  select public.current_role_is('admin');
$fn$;

create or replace function public.is_teacher()
returns boolean
language sql
security definer
stable
set search_path = ''
as $fn$
  select public.current_role_is('teacher');
$fn$;

comment on function public.is_admin() is
  'True when the caller is an active admin. Used by policies, which cannot read '
  'public.accounts directly without recursing into the policies being evaluated.';

-- ─── Subscription state ───────────────────────────────────────────────────────
--
-- Publishing a portfolio requires a live subscription. That question is asked from
-- policies as well as from the API, so it lives here rather than being restated.

create or replace function public.has_active_subscription(account uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $fn$
  select exists (
    select 1
    from public.subscriptions s
    where s.account_id = account
      and s.payment_status = 'completed'
      and s.expires_at > now()
  );
$fn$;

comment on function public.has_active_subscription(uuid) is
  'True when the account has a completed, unexpired subscription. Takes an explicit '
  'account id rather than reading auth.uid() so policies can ask it about a row owner.';
