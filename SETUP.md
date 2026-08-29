# Setup

What a human has to do, in the order it becomes necessary. Everything not listed here is
automated or already committed.

Each step says what it unblocks, so you can stop at the point where you have what you need.
**Nothing below is required to run the project locally** — that works today, from a clean
clone, with no accounts and no keys.

---

## 0. Prerequisites

| Tool | Why | Check |
|---|---|---|
| Node 20+ | the apps and the workspace | `node -v` |
| Docker Desktop, running | the local Supabase stack | `docker info` |
| Git | — | `git --version` |

The Supabase CLI is a devDependency, so it arrives with `npm install`. There is nothing to
install globally and no `supabase login` needed for local work.

---

## 1. Run it locally — no accounts needed

```bash
npm install
npm run db:start      # first run pulls ~1 GB of images; later runs take seconds
npm run db:reset      # applies the five migrations, then seeds
```

`db:start` prints the local URLs and keys. **This project does not use Supabase's default
ports**, because `talent-bridge-platform` occupies them and both stacks are expected to run
at once:

| | injaz-platform | talent-bridge |
|---|---|---|
| API | `http://127.0.0.1:54421` | 54321 |
| Postgres | `54422` | 54322 |
| Studio | `http://127.0.0.1:54423` | 54323 |
| Mail catcher | `http://127.0.0.1:54424` | 54324 |

The mapping lives in `supabase/config.toml`. If you ever stop caring about running both,
the numbers can go back to the defaults.

### Demo accounts

Seeded by `supabase/seed.sql`, and verified to sign in:

| Email | Role | Password |
|---|---|---|
| `admin@example.com` | admin | `demo-password-1234` |
| `teacher@example.com` | teacher | `demo-password-1234` |

Nineteen further teachers exist as `teacher3@example.com` … `teacher21@example.com`, same
password, so the admin dashboard has something to show.

Everything in the seed is synthetic. It must never be run against a database holding real
accounts.

### Checks you can run now

```bash
npm run db:test       # 30 security assertions, every role
npm run db:verify     # 27 checks against the captured API contract
npm run lint          # 0 errors in both apps
npm run typecheck
```

---

## 2. Create the cloud Supabase project — **needs your account**

Do this when you want the apps reachable from anywhere. Not before.

1. **Create the project** at [supabase.com/dashboard](https://supabase.com/dashboard).
   - Region: `eu-central-1` (Frankfurt) or `eu-west-2` (London) — closest free regions to
     Saudi users. There is no Middle East free tier.
   - Save the database password somewhere durable. It cannot be recovered, only reset.

2. **Link and push the schema:**

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   `link` will ask for the database password from step 1.

3. **Seed it**, if you want the demo data in the cloud too:

   ```bash
   npx supabase db push --include-seed
   ```

   Skip this for anything that will hold real accounts.

### Two things to expect, both documented traps

- **`db.<ref>.supabase.co` no longer resolves for new projects.** If you need a direct
  connection string, use the Session pooler on port **5432** — not 6543, which is
  transaction mode and cannot run DDL. The username becomes `postgres.<project-ref>`.
- **New projects issue `sb_publishable_…` / `sb_secret_…` keys**, not the older JWT
  `eyJ…` pair. They work as drop-in replacements, but any snippet that decodes the key as
  a JWT will not.

### What to keep, and where it must not go

| Value | Goes | Never |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | — |
| Publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — |
| Secret key | server-side env only | any `NEXT_PUBLIC_*` name, any client bundle |

The secret key bypasses every RLS policy in `supabase/migrations/0003_rls.sql`. Everything
those 30 tests assert stops being true for anyone holding it.

Env files live **per app** — `apps/teacher/.env.local`, `apps/admin/.env.local` — which is
what Vercel expects, since each project there has its own variables. A root `.env` is for
scripts only.

---

## 3. Deploy — **needs your account** (Phase 5, not yet)

Listed now so there are no surprises. Nothing here is actionable until the apps are rewired.

1. **Two Vercel projects**, one per app, with `Root Directory` set to `apps/teacher` and
   `apps/admin`. Leave the install command alone; npm workspaces are detected.
2. **Set the env vars before the first build.** `NEXT_PUBLIC_*` are inlined into the client
   bundle at build time by text substitution — adding them afterwards changes nothing until
   a fresh build runs, and a redeploy that reuses the build cache can skip the step that
   inlines them. Untick "Use existing Build Cache".
3. **DNS on `yousefayman.com`** (already yours, Cloudflare): add the subdomains as
   **grey-cloud / DNS-only**. Proxied, TLS terminates twice and Vercel cannot complete its
   certificate challenge.
4. **The keep-alive workflow matters.** Supabase free projects pause after 7 days idle, and
   a paused project means the portfolio piece is broken the week someone finally looks at
   it. Add the weekly GitHub Action and **run it manually once** — a keep-alive that fails
   silently is worse than none, because it looks like coverage.

---

## 4. Decisions only you can make

**Attribution.** Both repositories sit under `the client`. Before anything goes public,
either get their explicit sign-off on being named, or describe it anonymised — "a Saudi
edtech company" keeps the credibility without the exposure. This gates the portfolio entry,
not the code.

**One piece of Arabic copy.** `ar.auth.login.phonePlaceholder` in the admin app is
`"مثال: mohammed@gmail.com"` — an email address offered as the example for a phone number
field. The English says `05xxxxxxxx`. It is left as-is because it is a content decision:
tell me the format you want and it is a one-line change.

---

## Troubleshooting, from things that actually happened here

**`supabase start` fails with "port is already allocated".** Another Supabase project is
running. `docker ps` shows which. This project's ports were already moved once for exactly
this reason; move them again in `supabase/config.toml` if you add a third.

**Login returns 500 "Database error querying schema".** Seeded `auth.users` rows are
missing `confirmation_token` and friends as empty strings, or their `auth.identities` row.
Both are handled in `seed.sql` — if you write your own seed, they will bite again, and the
error message will not tell you why.

**`rpc()` arguments suddenly type as `undefined`.** `@supabase/ssr` has drifted out of step
with `@supabase/supabase-js` and dropped the `Database` generic. There is no error and no
warning; argument checking simply stops.
`packages/db/src/supabase-version-guard.ts` fails the typecheck when this happens, which is
the only reason it is noticeable.

**Windows path casing.** The real directory is `E:\Yusif\projects` with a capital Y, though
`E:\yusif` also resolves. Mixed casing makes webpack load modules twice and `tsc` fail with
*"differs from already included file name only in casing"*, and npm bakes whichever casing
it saw into the workspace symlinks. If it goes wrong: use the real casing, delete
`apps/*/.next`, and reinstall.
