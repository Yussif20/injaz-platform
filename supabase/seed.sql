-- Demo data.
--
-- Entirely synthetic. No row here came from the client's database, and none should: the
-- production system held teachers' national ids, phone numbers and addresses, and a
-- portfolio demo is not a reason to move any of that anywhere.
--
-- The previous revival calibrated its synthetic data against the real aggregates, read
-- from the live API before it was replaced. That is not possible here — the .NET backend
-- was already deleted when this project started, and no captured response body survives
-- anywhere in either repository. What follows is therefore shaped by the contract's
-- schemas and by what the two apps assume, not by measured production behaviour. The
-- distribution is plausible; it is not evidence, and the README should not imply it is.
--
-- What it is calibrated to:
--   * The academic-year structure the Saudi school calendar actually uses.
--   * A subscription price of 99 SAR, the figure the payment integration doc quotes.
--   * Enough months of history that the dashboard's trailing-12-month charts have shape
--     rather than a single bar, which is what makes the year-bucketing fix visible.

-- ─── Reference data ───────────────────────────────────────────────────────────

insert into public.academic_years (year_name, start_date, end_date, status) values
  ('1444', '2022-08-28', '2023-06-22', 'archived'),
  ('1445', '2023-08-20', '2024-06-13', 'archived'),
  ('1446', '2024-08-18', '2025-06-05', 'inactive'),
  ('1447', '2025-08-24', '2026-06-18', 'active');

insert into public.ranks (title_male, title_female, display_order) values
  ('معلم ممارس',  'معلمة ممارسة',  1),
  ('معلم متقدم',  'معلمة متقدمة',  2),
  ('معلم خبير',   'معلمة خبيرة',   3),
  ('وكيل مدرسة',  'وكيلة مدرسة',   4),
  ('قائد مدرسة',  'قائدة مدرسة',   5);

insert into public.profile_types
  (type_name_male, type_name_female, description, available_for, is_active)
values
  ('معلم', 'معلمة', 'ملف إنجاز المعلم للمرحلة العامة', 'both', true),
  ('مرشد طلابي', 'مرشدة طلابية', 'ملف إنجاز الإرشاد الطلابي', 'both', true),
  ('قائد مدرسة', 'قائدة مدرسة', 'ملف إنجاز القيادة المدرسية', 'both', true);

-- Sections and subsections for each profile type. The weights are what the portfolio
-- scoring uses, and they sum to 100 per type — a constraint the original enforced nowhere.
do $sections$
declare
  t record;
  section_id bigint;
begin
  for t in select id, type_name_male from public.profile_types loop
    insert into public.sections (profile_type_id, title, weight_percent, display_order)
    values (t.id, 'التطوير المهني', 30, 1)
    returning id into section_id;
    insert into public.subsections (section_id, title, weight_percent, display_order, max_image_count)
    values
      (section_id, 'الدورات التدريبية', 15, 1, 12),
      (section_id, 'الشهادات المهنية', 15, 2, 8);

    insert into public.sections (profile_type_id, title, weight_percent, display_order)
    values (t.id, 'الأداء والإنجاز', 40, 2)
    returning id into section_id;
    insert into public.subsections (section_id, title, weight_percent, display_order, max_image_count)
    values
      (section_id, 'المبادرات', 20, 1, 10),
      (section_id, 'شواهد الأداء', 20, 2, 20);

    insert into public.sections (profile_type_id, title, weight_percent, display_order)
    values (t.id, 'المشاركة المجتمعية', 30, 3)
    returning id into section_id;
    insert into public.subsections (section_id, title, weight_percent, display_order, max_image_count)
    values
      (section_id, 'الأنشطة الطلابية', 15, 1, 10),
      (section_id, 'الشراكات', 15, 2, 6);
  end loop;
end;
$sections$;

insert into public.system_parameters (key, value, data_type, category, is_active) values
  ('terms_and_conditions',
   '<h2>الشروط والأحكام</h2><p>نص تجريبي للعرض فقط.</p>',
   'html', 'legal', true),
  ('privacy_policy',
   '<h2>سياسة الخصوصية</h2><p>نص تجريبي للعرض فقط.</p>',
   'html', 'legal', true),
  ('support_whatsapp', '+966500000000', 'string', 'socials', true),
  ('support_email',    'demo@example.com', 'string', 'socials', true),
  ('subscription_price', '99', 'number', 'billing', true);

insert into public.reviews
  (content, rating, reviewer_name, reviewer_job_title, display_order, is_active)
values
  ('منصة سهلت علي ترتيب ملف الإنجاز بشكل احترافي.', 5, 'سارة الحربي', 'معلمة لغة عربية', 1, true),
  ('وفرت علي وقت طويل كنت أقضيه في التنسيق.',        5, 'عبدالله القحطاني', 'معلم رياضيات', 2, true),
  ('التصدير بصيغة PDF ممتاز ويظهر بشكل مرتب.',       4, 'نورة العتيبي', 'مرشدة طلابية', 3, true),
  ('في انتظار مراجعة هذا التقييم.',                   3, 'مراجعة غير منشورة', 'معلم', 4, false);

-- ─── People ───────────────────────────────────────────────────────────────────
--
-- Passwords are all `demo-password-1234`, which is fine because this seed only ever runs
-- against a local stack or a throwaway demo project. It must never be run against a
-- database holding real accounts.

do $people$
declare
  admin_id uuid := '00000000-0000-4000-8000-000000000001';
  demo_teacher uuid := '00000000-0000-4000-8000-000000000002';
  male_names text[] := array[
    'أحمد الشهري','خالد الدوسري','فهد المطيري','سلطان الغامدي','ماجد الزهراني',
    'بندر العنزي','تركي السبيعي','ناصر الحارثي','يوسف البقمي','راشد الشمري'];
  female_names text[] := array[
    'منى العمري','هند الرشيد','ريم الخالدي','لطيفة الجهني','أمل الصاعدي',
    'دلال المالكي','شهد البلوي','جواهر الأحمدي','بشاير السلمي','عهود الثبيتي'];
  new_id uuid;
  is_female boolean;
  display_name text;
  type_ids bigint[];
  year_ids bigint[];
  rank_ids bigint[];
  chosen_type bigint;
  chosen_year bigint;
  portfolio_id bigint;
  subsection record;
  created timestamptz;
  i integer;
  j integer;
begin
  select array_agg(id order by id) into type_ids from public.profile_types;
  select array_agg(id order by id) into year_ids from public.academic_years;
  select array_agg(id order by id) into rank_ids from public.ranks;

  for i in 1..21 loop
    is_female := (i % 2 = 0);
    if i = 1 then
      new_id := admin_id;
      display_name := 'مدير النظام';
    elsif i = 2 then
      new_id := demo_teacher;
      display_name := 'معلم تجريبي';
      is_female := false;
    else
      new_id := gen_random_uuid();
      display_name := case when is_female
        then female_names[((i - 3) / 2 % 10) + 1]
        else male_names[((i - 3) / 2 % 10) + 1] end;
    end if;

    -- Spread registrations across the last 13 months so the charts have a shape, anchored
    -- to month boundaries rather than raw day offsets. A plain "now() minus N days" spread
    -- left the current month empty, which made every trend read -100% — arithmetically
    -- right, and a useless demo. Clamped to yesterday so no row is dated in the future.
    created := least(
      date_trunc('month', now())
        - make_interval(months => ((i - 2) % 13))
        + make_interval(days => (i % 25)),
      now() - interval '1 day'
    );

    -- The token columns are set to '' rather than left null on purpose. GoTrue scans them
    -- into Go strings, and a null produces
    --   "Scan error on column index 3, name \"confirmation_token\":
    --    converting NULL to string is unsupported"
    -- which surfaces at the API as a 500 "Database error querying schema" — a message that
    -- says nothing about the actual cause. Seeding auth.users by hand means supplying
    -- these; the sign-up endpoint would have done it for us.
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change,
      email_change_token_new, email_change_token_current
    ) values (
      new_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      case i when 1 then 'admin@example.com'
             when 2 then 'teacher@example.com'
             else 'teacher' || i || '@example.com' end,
      crypt('demo-password-1234', gen_salt('bf')),
      created, created, created,
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', display_name)::jsonb,
      '', '', '', '', ''
    );

    -- GoTrue resolves an email login through auth.identities, not auth.users alone. Without
    -- a matching row the account exists but cannot sign in.
    -- auth.identities.email is a generated column derived from identity_data, so it is
    -- deliberately not listed here; supplying it is rejected outright.
    insert into auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    )
    select
      gen_random_uuid(), u.id, u.id::text, 'email',
      jsonb_build_object(
        'sub', u.id::text,
        'email', u.email,
        'email_verified', true,
        'phone_verified', false
      ),
      created, created, created
    from auth.users u
    where u.id = new_id;

    -- handle_new_user has now created the accounts row; fill in the rest.
    update public.accounts
       set gender = (case when is_female then 'female' else 'male' end)::public.gender,
           phone = '05' || lpad((10000000 + i * 37)::text, 8, '0'),
           national_id = lpad((1000000000 + i * 7919)::text, 10, '0'),
           address = (array['الرياض','جدة','الدمام','أبها','بريدة'])[(i % 5) + 1],
           created_at = created,
           role = (case when i = 1 then 'admin' else 'teacher' end)::public.user_role
     where id = new_id;

    if i = 1 then
      continue; -- the admin keeps no portfolio of their own
    end if;

    -- Career history and qualifications.
    insert into public.qualifications
      (account_id, degree_type, institution, major, graduation_date)
    values (
      new_id,
      case when i % 3 = 0 then 'ماجستير' else 'بكالوريوس' end,
      (array['جامعة الملك سعود','جامعة أم القرى','جامعة الملك عبدالعزيز'])[(i % 3) + 1],
      (array['اللغة العربية','الرياضيات','العلوم','الدراسات الإسلامية'])[(i % 4) + 1],
      -- A real graduation date rather than the fabricated 15 June the apps invented from a
      -- year-only field. See docs/audit.md.
      make_date(2005 + (i % 15), 5 + (i % 2), 1 + (i % 27))
    );

    insert into public.career_jobs
      (account_id, job_title, school, educational_stage, start_year, end_year)
    values (
      new_id,
      case when is_female then 'معلمة' else 'معلم' end,
      'مدرسة ' || (array['النور','الفاروق','الأندلس','الرواد','اليرموك'])[(i % 5) + 1],
      (array['ابتدائي','متوسط','ثانوي'])[(i % 3) + 1],
      2012 + (i % 8),
      case when i % 4 = 0 then 2020 + (i % 4) else null end
    );

    -- A subscription for roughly three quarters of them, spread over the year.
    if i % 4 <> 3 then
      insert into public.subscriptions (
        account_id, subscribed_at, expires_at,
        base_amount, discount_percentage, discount_amount, final_amount,
        payment_status, payment_method, payment_completed_at
      ) values (
        new_id,
        created + interval '2 days',
        created + interval '2 days' + interval '1 year',
        99,
        case when i % 7 = 0 then 20 else 0 end,
        case when i % 7 = 0 then 19.8 else 0 end,
        case when i % 7 = 0 then 79.2 else 99 end,
        (case when i % 11 = 0 then 'failed' else 'completed' end)::public.payment_status,
        case when i % 3 = 0 then 'applepay' else 'creditcard' end,
        created + interval '2 days'
      );
    end if;

    -- One portfolio, in the current year, for most people.
    chosen_type := type_ids[(i % array_length(type_ids, 1)) + 1];
    chosen_year := year_ids[array_length(year_ids, 1)];

    insert into public.portfolios (
      account_id, profile_type_id, academic_year_id, rank_id,
      template_id, status, created_at, published_at
    ) values (
      new_id, chosen_type, chosen_year,
      rank_ids[(i % array_length(rank_ids, 1)) + 1],
      1 + (i % 3),
      case
        when i % 4 = 3 then 'draft'::public.portfolio_status
        when i % 5 = 0 then 'unpublished'::public.portfolio_status
        else 'published'::public.portfolio_status
      end,
      created + interval '5 days',
      case when i % 4 <> 3 and i % 5 <> 0
           then created + interval '9 days' else null end
    )
    returning id into portfolio_id;

    -- A handful of evidence images per portfolio, against that type's subsections.
    j := 0;
    for subsection in
      select ss.id
      from public.subsections ss
      join public.sections s on s.id = ss.section_id
      where s.profile_type_id = chosen_type
      order by ss.id
    loop
      j := j + 1;
      insert into public.portfolio_images
        (portfolio_id, subsection_id, storage_path, description, display_order)
      select
        portfolio_id, subsection.id,
        'demo/evidence-' || portfolio_id || '-' || subsection.id || '-' || g || '.jpg',
        'شاهد رقم ' || g,
        g
      from generate_series(1, 1 + ((i + j) % 3)) g;
    end loop;

    -- A share link for published portfolios. The token is what /p/<token> redeems; in the
    -- app it is generated client-side from a CSPRNG, and here from pgcrypto.
    if i % 4 <> 3 and i % 5 <> 0 then
      insert into public.share_links (portfolio_id, token, access_count)
      values (
        portfolio_id,
        encode(gen_random_bytes(24), 'hex'),
        (i * 3) % 40
      );
    end if;
  end loop;
end;
$people$;

-- A stable, memorable share link for the demo, so the public view can be linked to
-- directly from the portfolio write-up without hunting for a token.
update public.share_links
   set token = 'demo00000000000000000000000000000000share'
 where portfolio_id = (
   select p.id from public.portfolios p
   join public.accounts a on a.id = p.account_id
   where a.email = 'teacher@example.com' and p.status = 'published'
   limit 1
 );
