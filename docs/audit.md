# Injaz Al-Moalem — legacy audit

Phase 0 of the revival playbook (`../CLAUDE.md`), run **2026-08-29** against the two client
repositories as they were last committed. This records the state of the code *before* any
rebuild, so the claims in the eventual README are traceable to evidence rather than memory.

Every finding below was produced by a command, and the command is included. Nothing here is
inferred from reading the source alone.

---

## The subject

**Injaz Al-Moalem** (إنجاز المعلم) — an Arabic platform where Saudi teachers build
achievement portfolios (career history, qualifications, evidence images) and share them as
a public link or a generated PDF. Subscriptions billed through Moyasar.

Two apps, one client, one backend, both under `the client` on GitHub:

| App | Repo | Lines | Files | Last commit |
|---|---|---|---|---|
| `injaz-almoalem` (teacher-facing) | `the teacher app` | 33,987 | 306 | 2026-04-13 |
| `injaz-dashboard` (admin) | `the admin app` | 16,272 | 189 | 2026-04-07 |

**50,259 lines total.** Both Next 16.1.6 / React 19.2.3 / Tailwind 4 / TanStack Query /
React Hook Form + Zod, deployed on Railway via Docker.

---

## 1. The backend is dead. The contract survived.

The playbook insists on probing *every* branch, because in the previous revival the
non-default branch was the live one. Checked:

```
main            2026-04-13  078c72d   = origin/main, 84 commits AHEAD of develop
origin/develop  2026-02-23  8fedf78   stale; contains nothing main is missing
```

No hidden-ahead branch this time — `main` is the truth. The check still earned its keep by
ruling out an import from a four-month-stale `develop`.

Every host is gone:

```bash
curl -sS -i https://staging.enjazfile.com
# HTTP/1.1 404 Not Found
# Server: railway-hikari
# x-railway-fallback: true
# {"status":"error","code":404,"message":"Application not found"}
```

`x-railway-fallback: true` is Railway's edge reporting that no application is deployed at
that domain. DNS and TLS still resolve; the service itself has been deleted.
`/api/Auth/login`, `/api/Me`, `/api/Profiles` and `/swagger` all return the same fallback.
`enjazfile.com` behaves identically; `www.enjazfile.com` and `api.enjazfile.com` do not
resolve at all.

**The contract was captured before it died.** `swagger.json` in this directory, 314 KB,
dated 2026-04-03:

```
openapi 3.0.4 · "Enjaz Mo3alem API - All Endpoints" v1
109 paths · 150 operations · 132 schemas
```

Endpoint groups, by path count:

```
14  my-profiles        7  SystemParameters    5  Sections       3  Ranks
 9  Auth               7  Users               4  subscription-discounts
 9  ProfileTypes       6  AcademicYears       4  Subsections    3  subscription-settings
 7  Subscriptions      6  Me                  3  Profiles       2  MoyasarWebhooks
                       6  Reviews             5  Images         2  my-career-jobs
                                                                2  my-qualifications
                                                                2  Receipts
                                                                2  ShareLinks
                                                                1  Health
```

This is the single highest-value artifact in the job, and it is intact. It is what makes
replacing the backend a verifiable claim rather than an assertion.

**What is permanently lost.** Response *shapes* are recoverable from the 132 schemas.
Real *value distributions* are not — no captured response body exists anywhere in either
repository. Seed data for the rebuild must therefore be derived from the schemas and from
the UI's own constraints, not calibrated against real aggregates. That is weaker than the
previous revival and the README should say so plainly rather than imply otherwise.

**Storage state is unknown, not dead.** Uploaded images live on Backblaze B2 at
`enjazmo3alem-staging.s3.us-east-005.backblazeb2.com`. The bucket root returns:

```xml
<Error><Code>AccessDenied</Code>
<Message>Unauthenticated requests are not allowed for this api</Message></Error>
```

That is the correct response for a private bucket and proves nothing either way. No object
key is available to test with. Recorded as unknown — the playbook's own warning is that a
negative result only means something if the thing checked would have contained a positive.

---

## 2. Two apps, two opposite answers to the same problem

`injaz-dashboard` forwards every backend call through **one** catch-all route,
`src/app/api/proxy/[...path]/route.ts` — 125 lines handling path joining, query forwarding,
multipart re-framing (rebuilding `FormData` so Node's `fetch` attaches its own boundary),
and a 401 → refresh → retry-once cycle.

`injaz-almoalem` hand-writes **56 routes totalling 5,187 lines** — 15% of that app's entire
codebase — to do the same job.

```bash
git ls-files 'src/app/api/**/route.ts' | wc -l        # 56
git ls-files 'src/app/api/**/route.ts' | xargs wc -l  # 5187 total
```

`src/app/api/academic-years/route.ts` spends 76 lines forwarding a single GET, of which
**40 are the catch block**. The repetition is measurable:

| Pattern | Files |
|---|---|
| `const accessToken = await getAccessToken()` | 41 / 56 |
| `catch (error` | 55 / 56 |
| `axios.isAxiosError` | **0 / 56** |

Not one route uses `axios.isAxiosError`. Each instead hand-writes the same structural type
guard — `error && typeof error === "object" && "response" in error` — followed by a cast to
an inline `{ response?: { data?: …; status?: number } }`. Fifty-five times.

Arabic error strings (`"غير مصرح"`, `"حدث خطأ غير متوقع"`, `"فشل في جلب…"`) are inlined in
every route, which both breaks the project's own rule (§5c) and makes the API layer
untranslatable.

**Checked rather than assumed:** the obvious hypothesis was that the 56 routes lack token
refresh entirely. They do not. The teacher app handles refresh **client-side**, in
`src/shared/providers/ApiInterceptorSetup.tsx`, via an axios 401 interceptor. Both apps
solve the problem; they solve it at different layers. That is a divergence to consolidate,
not a bug to fix.

---

## 3. The PDF export makes the app unhostable on any free tier

`src/app/api/export/pdf/route.ts` — with `shared-pdf`, `image` and `profile`, 389 lines
across four routes — generates PDFs by launching a headless Chrome that navigates back to
the app's own `localhost` to screenshot its own print page:

```ts
const localBase = `http://localhost:${port}`;
const printUrl = `${localBase}/preview/${profileId}/print?token=${exportToken}&templateId=${templateId}`;
browser = await puppeteer.default.launch({ headless: true, executablePath: getBrowserPath(), args: [...] });
await page.goto(printUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForSelector("[data-print-ready]", { timeout: 15000 });
await new Promise((r) => setTimeout(r, 3000));   // hardcoded settle delay
const pdfBuffer = await page.pdf({ width: "794px", height: `${bodyHeight}px`, printBackground: true });
```

Four consequences, each independently disqualifying for free hosting:

1. **`http://localhost:${PORT}` resolves only inside one long-running container.** This
   cannot run on any serverless platform, Vercel included. The vestigial
   `export const maxDuration = 30` — commented `(for Vercel)` — suggests that was attempted
   and abandoned.
2. **A full Chrome binary must ship in the image.** The `Dockerfile` devotes an entire
   fourth stage to installing `@puppeteer/browsers@2.13.0`, downloading `chrome@stable`,
   and copying it to `/opt/chrome`, plus 15 system libraries (`libgbm1`, `libnss3`,
   `libgtk-3-0`, …) and three Noto font packages.
3. **A `createExportToken` side channel** exists purely to smuggle the user's credentials
   into the headless browser — an auth surface that exists only because of this design.
4. **A hardcoded three-second sleep** on every export, sharing a 30-second budget with a
   20s navigation timeout and a 15s selector timeout.

The replacement is already proven in the previous revival: `html2canvas-pro` + `jsPDF`
over the already-rendered DOM, JPEG-encoded (~300 KB against ~8 MB as PNG). The print page
already exists and already signals `[data-print-ready]`, so it is reused rather than
rewritten, and the export-token side channel disappears with it.

---

## 4. Direction is hardcoded, not derived

The teacher app is Arabic-only, and its right-to-left layout is written by hand rather than
driven by locale:

```bash
grep -rhoE '\btext-(left|right)\b' src | wc -l                  # 198
grep -rhoE '\b(pl|pr)-[0-9a-z\[]' src | wc -l                   #  65
grep -rhoE '\b(left|right)-[0-9a-z\[]' src | wc -l              #  46
grep -rhoE '\b(ml|mr)-[0-9a-z\[]' src | wc -l                   #  12
#                                                        total: 321 physical
grep -rhoE '\b(ms|me|ps|pe|start|end)-[0-9a-z\[]' src | wc -l   #  10 logical
```

**321 physical direction utilities against 10 logical ones**, plus `dir="rtl"` hardcoded on
the dashboard layout element. `src/content/` contains only `ar`. No i18n library is
installed — `next-intl` and `react-i18next` return zero hits.

The project's own `CLAUDE.md` codifies the anti-pattern as house style:

> ### Styling
> - RTL: `text-right`, `flex-row-reverse`

**The sibling app already solved this.** `injaz-dashboard/src/i18n/routing.ts`:

```ts
export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export const DEFAULT_LOCALE = "ar" as const;
```

It ships `routing.ts`, `navigation.ts` and a `TranslationContext.tsx`. Same client, same
stack, same month — one app is bilingual and the other is pinned to one direction by hand.

---

## 5. Trust the code, not the README

The framework badges are honest this time: README claims Next 16, TypeScript 5, Tailwind 4,
and `package.json` agrees. Three other claims do not survive contact.

**a. `npm run test:e2e` runs zero tests.** The script is `playwright test`, and `CLAUDE.md`
advertises "E2E tests (Playwright)". But `playwright` is not in `devDependencies`, there is
no `playwright.config.*`, and:

```bash
git ls-files | grep -iE 'playwright|e2e|\.spec\.|\.test\.'   # (nothing)
```

Neither app contains a test of any kind.

**b. `npm run lint` has never run at all.** `apps/teacher` declared
`eslint-config-next@^0.2.4` — a package roughly eight years older than the framework it is
meant to configure — while `eslint.config.mjs` imports the Next 16 subpaths. The result is
not a weak ruleset but a hard crash, before a single file is examined:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '.../apps/teacher/node_modules/eslint-config-next/core-web-vitals'
  imported from .../apps/teacher/eslint.config.mjs
Did you mean to import "eslint-config-next/dist/core-web-vitals.js"?
```

The sibling app shows the intended value — `injaz-dashboard` pins `eslint-config-next@16.1.6`.

The monorepo made the discrepancy structural: after importing both apps, the *only* package
npm could not hoist was `eslint-config-next`, because 0.2.4 and 16.1.6 conflict.

**Pinning it to 16.1.6 turned a crash into 308 files linted, 19 errors and 46 warnings** —
none of which had ever been visible. The errors are not cosmetic:

| Count | Rule |
|---|---|
| 15 | `react-hooks/set-state-in-effect` — synchronous `setState` in an effect, cascading renders |
| 2 | `@typescript-eslint/no-explicit-any` |
| 1 | `react-hooks/preserve-manual-memoization` — React Compiler skipped optimizing `DatePicker.tsx` |
| 1 | `prefer-const` |

`apps/admin`, whose config was correct all along, reports a further **21 errors and 46
warnings** — so lint was never enforced there either. Neither repository has CI.

Across both apps, `@next/next/no-img-element` fires **23 times**, independently
corroborating §8.

**c. "Never hardcode Arabic text in components"** (`CLAUDE.md`, Content Management) —
violated in **133 `.tsx` files**, while `src/content/ar/` holds only 6 files and 1,085
lines.

---

## 6. Duplication hiding a parameter that should have existed

Every profile renders twice: once authenticated by id, once publicly by share token. The
two paths were forked rather than parameterised.

| Pair | Identical lines |
|---|---|
| `app/preview/[id]/print/page.tsx` vs `app/p/[token]/print/page.tsx` | **227 / 287 (79%)** |
| `api/export/pdf/route.ts` vs `api/export/shared-pdf/route.ts` | **84 / 113 (74%)** |

The missing parameter is the credential: `{ by: 'id' } | { by: 'token' }`.

Across the two apps, 44 files share a path and **none are byte-identical** — every one has
drifted independently.

---

## 7. Union types as a fossil record

```ts
export function isApiSuccess(status: string | boolean): boolean {
  if (typeof status === "boolean") return status;
  return status === "Success" || status === "success";
}
```

A runtime shim that only makes sense if the backend returned success as `true`, as
`"Success"`, *and* as `"success"`. Beside it, `AuthData.userId: string | number`. These are
the "free text that should have been an enum" smell the playbook predicts; on Postgres they
become impossible states rather than defensive code.

---

## 8. Every remote image bypasses the Next optimizer

`ProfileImage.tsx` sets `unoptimized` for any source beginning `http://`, `https://` or
`data:` — which is every backend- and Backblaze-hosted image:

```ts
const isExternal = effectiveSrc.startsWith("http://") || effectiveSrc.startsWith("https://") || effectiveSrc.startsWith("data:");
return <Image src={effectiveSrc} … unoptimized={isExternal} />;
```

`next.config.ts` `remotePatterns` lists only `staging.enjazfile.com` and `enjazfile.com` —
the Backblaze host is absent, so that `unoptimized` flag is the only reason remote images
render at all. `ImageGallery.tsx` compounds it by dropping to a raw `<img>` for gallery
photos while using `next/image` for its icons.

Net effect: in an image-heavy app built around phone-camera uploads, full-resolution
originals are served with no resizing and no WebP. `next.config.ts` raises
`proxyClientMaxBodySize` to 50 MB to accommodate them.

---

## What is already good

Reported because an audit that only finds faults is not an audit.

- **Auth cookie handling is correct.** `httpOnly: true`, `sameSite: "lax"`, `secure` in
  production, `path: "/"`, one-day access and thirty-day refresh tokens. No token is ever
  written to `localStorage` or `document.cookie` — both greps return zero hits.
- **Edge route protection exists and is wired correctly.** This one nearly became a false
  finding. The two apps export their `src/proxy.ts` differently — the teacher app as
  `export function proxy`, the admin app as `export default function middleware` — which
  looks like one of them must be dead. Next's own entry template settles it
  (`node_modules/next/dist/build/templates/middleware.js`):

  ```js
  const isProxy = page === '/proxy' || page === '/src/proxy';
  const handlerUserland = (isProxy ? mod.proxy : mod.middleware) || mod.default;
  ```

  Both shapes are accepted. `proxy.ts` is Next 16's rename of `middleware.ts`, and both
  apps are correct. Recorded as a reminder that the artifact settles what the source only
  suggests.
- **No `toISOString().slice(0, 10)` anywhere.** The UTC-vs-local date bug from the previous
  revival is absent.
- **The documentation is unusually good**: `payment-integration.md` (555 lines, covering
  3D Secure, idempotency and an honest "what is missing" section), `IMAGE-HANDLING.md`
  (235), `injaz-almoalem/docs/PROJECT.md` (21 KB), `chrome-docker-fix.md` (64).
- **A real dual-mode Hijri/Gregorian `DatePicker`** (717 lines), ported to both apps. A
  legitimately hard component and good portfolio material in its own right.

One smell hiding in the good pile: `graduationDate: \`${year}-06-15\`` — a fabricated
15 June graduation date, because the form collects only a year. Duplicated at
`OnboardingFlow.tsx:375` and `EducationDataTab.tsx:131`.

---

## Summary

| # | Finding | Evidence |
|---|---|---|
| 1 | Backend deleted; contract captured in time | `x-railway-fallback: true`; 109 paths / 150 ops / 132 schemas |
| 2 | 56 routes / 5,187 lines vs the sibling's single 125-line proxy | 0 / 56 use `axios.isAxiosError` |
| 3 | Server-side Chrome rules out free hosting | `localhost:${PORT}`, 4-stage Dockerfile, 3s sleep |
| 4 | Direction hardcoded; one locale | 321 physical vs 10 logical utilities |
| 5 | Three documented claims are false | no playwright; `eslint-config-next@0.2.4`; 133 files |
| 6 | id/token paths forked | 79% and 74% identical |
| 7 | `string \| boolean` success shim | `isApiSuccess` |
| 8 | Image optimizer disabled everywhere | `unoptimized={isExternal}` |

Seven of the eight are fixable in ways that can be demonstrated rather than asserted.
Findings 3 and 4 carry the rebuild's story.
