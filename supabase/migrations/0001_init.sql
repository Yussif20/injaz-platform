-- Injaz platform — enums, tables, indexes.
--
-- Derived from the captured contract in supabase/tests/fixtures/legacy-openapi.json,
-- which is all that remains of the .NET backend. Every enum below appears in that file
-- with its integer mapping spelled out; every table reproduces a DTO the two apps read.
--
-- Vocabulary note. The legacy API calls a teacher's achievement file a "Profile", and also
-- exposes the signed-in user at /api/Me with a "UserDto". Two different things, one word,
-- and the apps disagreed about which was which — the admin UI calls the same entity a
-- "file" (ملف). This schema resolves it:
--
--     legacy Profile / ProfileDto  ->  portfolios
--     legacy User / Me / UserDto   ->  accounts
--
-- The API layer keeps the legacy names on the wire so the contract still matches.

-- ─── Enums ────────────────────────────────────────────────────────────────────
--
-- These are the six enums the contract declares. In the legacy database they were free
-- text or loose integers, which is why the frontend still carries shims such as
-- `isApiSuccess(status: string | boolean)`. Here the illegal states cannot be written.

create type public.user_role as enum ('admin', 'teacher');

create type public.gender as enum ('male', 'female');

create type public.gender_availability as enum ('male', 'female', 'both');

create type public.portfolio_status as enum (
  'draft',
  'unpublished',
  'published',
  'pending_subscription'
);

create type public.payment_status as enum (
  'pending',
  'processing',
  'initiated',
  'completed',
  'failed',
  'unknown',
  'cancelled'
);

-- AcademicYearDto.status is a bare string in the contract. The only values the apps test
-- for are "Active"/"Inactive", with an archived state implied by the admin UI.
create type public.academic_year_status as enum ('active', 'inactive', 'archived');

-- ─── Accounts ─────────────────────────────────────────────────────────────────
--
-- One row per authenticated user, keyed by auth.users. Supabase owns identity, so no
-- password or OTP columns exist here — the contract's /Auth/send-registration-otp and
-- friends are handled by Supabase Auth rather than reimplemented.
--
-- The legacy contract types a user id as int32, but its own AuthData already declared
-- `userId: string | number`, so the apps tolerate the uuid this table uses.

create table public.accounts (
  id uuid primary key references auth.users (id) on delete cascade,

  role public.user_role not null default 'teacher',
  full_name text not null default '',
  phone text,
  gender public.gender,
  image_path text,

  -- PersonalInfoDto, inlined. It is one-to-one with the account and is always fetched
  -- with it, so a separate table would buy nothing but a join.
  national_id text,
  birth_date date,
  address text,
  email text,

  is_active boolean not null default true,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  modified_at timestamptz not null default now(),

  constraint accounts_national_id_length
    check (national_id is null or char_length(national_id) = 10)
);

comment on table public.accounts is
  'Legacy UserDto / MeDto. One row per auth.users row, created by handle_new_user.';

-- ─── Reference data ───────────────────────────────────────────────────────────
-- Admin-managed lookups. Readable by any signed-in user, writable only by staff.

create table public.academic_years (
  id bigint primary key generated always as identity,
  year_name text not null unique,
  start_date date not null,
  end_date date not null,
  status public.academic_year_status not null default 'inactive',
  created_at timestamptz not null default now(),

  constraint academic_years_dates check (end_date > start_date)
);

-- Arabic inflects job titles by gender, so the contract carries titleMale/titleFemale and
-- resolves `title` per user. That resolution lives in packages/domain, not in the column.
create table public.ranks (
  id bigint primary key generated always as identity,
  title_male text not null,
  title_female text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.profile_types (
  id bigint primary key generated always as identity,
  type_name_male text not null,
  type_name_female text not null,
  description text,
  available_for public.gender_availability not null default 'both',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  modified_at timestamptz not null default now()
);

create table public.sections (
  id bigint primary key generated always as identity,
  profile_type_id bigint not null
    references public.profile_types (id) on delete cascade,
  title text not null,
  weight_percent double precision not null default 0,
  display_order integer not null default 0,

  constraint sections_weight_range check (weight_percent between 0 and 100)
);

create table public.subsections (
  id bigint primary key generated always as identity,
  section_id bigint not null references public.sections (id) on delete cascade,
  title text not null,
  weight_percent double precision not null default 0,
  display_order integer not null default 0,
  max_image_count integer,
  max_image_size bigint,

  constraint subsections_weight_range check (weight_percent between 0 and 100),
  constraint subsections_max_image_count_positive
    check (max_image_count is null or max_image_count > 0)
);

create index sections_profile_type_id_idx on public.sections (profile_type_id, display_order);
create index subsections_section_id_idx on public.subsections (section_id, display_order);

-- ─── The teacher's own record ─────────────────────────────────────────────────

create table public.qualifications (
  id bigint primary key generated always as identity,
  account_id uuid not null references public.accounts (id) on delete cascade,
  degree_type text not null,
  institution text not null,
  major text,
  graduation_date date not null,
  created_at timestamptz not null default now()
);

create table public.career_jobs (
  id bigint primary key generated always as identity,
  account_id uuid not null references public.accounts (id) on delete cascade,
  job_title text not null,
  school text not null,
  educational_stage text,
  start_year integer not null,
  -- Null means "to date", which the UI offers explicitly.
  end_year integer,
  created_at timestamptz not null default now(),

  constraint career_jobs_years check (end_year is null or end_year >= start_year)
);

create index qualifications_account_id_idx on public.qualifications (account_id);
create index career_jobs_account_id_idx on public.career_jobs (account_id);

-- ─── Portfolios ───────────────────────────────────────────────────────────────

create table public.portfolios (
  id bigint primary key generated always as identity,
  account_id uuid not null references public.accounts (id) on delete cascade,
  profile_type_id bigint not null references public.profile_types (id) on delete restrict,
  academic_year_id bigint not null references public.academic_years (id) on delete restrict,
  rank_id bigint references public.ranks (id) on delete set null,

  template_id integer not null default 1,
  image_path text,
  status public.portfolio_status not null default 'draft',

  -- Optional password gate on the exported file. Only ever a digest.
  file_password_hash text,

  published_at timestamptz,
  created_at timestamptz not null default now(),
  modified_at timestamptz not null default now(),

  -- The backend rejected a second file for the same year with "ملف لهذه السنة", a message
  -- the teacher app still special-cases. Here it is an index, so it cannot be raced.
  constraint portfolios_one_per_year unique (account_id, academic_year_id)
);

comment on column public.portfolios.file_password_hash is
  'Digest of the optional export password. Never the password itself.';

create index portfolios_account_id_idx on public.portfolios (account_id);
create index portfolios_academic_year_idx on public.portfolios (academic_year_id);
create index portfolios_status_idx on public.portfolios (status)
  where status = 'published';

-- Evidence images, one row per uploaded file, hung off the subsection it evidences.
create table public.portfolio_images (
  id bigint primary key generated always as identity,
  portfolio_id bigint not null references public.portfolios (id) on delete cascade,
  subsection_id bigint not null references public.subsections (id) on delete cascade,
  storage_path text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index portfolio_images_portfolio_idx
  on public.portfolio_images (portfolio_id, subsection_id, display_order);

-- ─── Share links ──────────────────────────────────────────────────────────────
--
-- The capability token behind /p/<token>. The token is the whole credential: anyone
-- holding it may read the published portfolio, and nobody without it can. Reads go
-- through a SECURITY DEFINER function (see 0005_access.sql) so `anon` never needs — and
-- never gets — a SELECT grant on this table or on portfolios.

create table public.share_links (
  id bigint primary key generated always as identity,
  portfolio_id bigint not null references public.portfolios (id) on delete cascade,
  token text not null unique,
  access_count integer not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),

  -- Long enough that guessing is not a strategy. Generated client-side from a CSPRNG.
  constraint share_links_token_length check (char_length(token) >= 32)
);

create index share_links_portfolio_idx on public.share_links (portfolio_id);

-- ─── Subscriptions ────────────────────────────────────────────────────────────

create table public.subscription_discounts (
  id bigint primary key generated always as identity,
  title text not null,
  discount_percentage double precision not null,
  end_date timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  constraint subscription_discounts_percentage
    check (discount_percentage between 0 and 100)
);

create table public.subscriptions (
  id bigint primary key generated always as identity,
  account_id uuid not null references public.accounts (id) on delete cascade,
  applied_discount_id bigint
    references public.subscription_discounts (id) on delete set null,

  subscribed_at timestamptz not null default now(),
  expires_at timestamptz not null,

  base_amount numeric(10, 2) not null,
  discount_percentage double precision not null default 0,
  discount_amount numeric(10, 2) not null default 0,
  final_amount numeric(10, 2) not null,

  payment_status public.payment_status not null default 'pending',
  payment_method text,
  payment_transaction_id text,
  payment_gateway_id text,
  payment_fee integer,
  payment_completed_at timestamptz,

  created_at timestamptz not null default now(),

  constraint subscriptions_period check (expires_at > subscribed_at),
  constraint subscriptions_amounts check (
    base_amount >= 0 and discount_amount >= 0 and final_amount >= 0
  )
);

create index subscriptions_account_idx on public.subscriptions (account_id, expires_at desc);
create index subscriptions_status_idx on public.subscriptions (payment_status);

-- ─── Public-facing content ────────────────────────────────────────────────────

create table public.reviews (
  id bigint primary key generated always as identity,
  content text not null,
  rating integer not null,
  reviewer_name text not null,
  reviewer_job_title text,
  reviewer_photo_path text,
  display_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),

  constraint reviews_rating_range check (rating between 1 and 5)
);

create index reviews_active_idx on public.reviews (is_active, display_order)
  where is_active;

create table public.system_parameters (
  id bigint primary key generated always as identity,
  key text not null unique,
  value text,
  data_type text not null default 'string',
  description text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  modified_at timestamptz not null default now()
);

create index system_parameters_category_idx on public.system_parameters (category)
  where is_active;

-- ─── modified_at maintenance ──────────────────────────────────────────────────

create or replace function public.touch_modified_at()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  new.modified_at = now();
  return new;
end;
$fn$;

create trigger accounts_touch_modified_at
  before update on public.accounts
  for each row execute function public.touch_modified_at();

create trigger profile_types_touch_modified_at
  before update on public.profile_types
  for each row execute function public.touch_modified_at();

create trigger portfolios_touch_modified_at
  before update on public.portfolios
  for each row execute function public.touch_modified_at();

create trigger system_parameters_touch_modified_at
  before update on public.system_parameters
  for each row execute function public.touch_modified_at();
