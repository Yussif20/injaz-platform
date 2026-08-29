# Where this project is

Updated **2026-08-29**. Written so the work can be picked up cold, without the conversation
that produced it.

Repository: <https://github.com/Yussif20/injaz-platform> (public, 210 commits)

---

## Done

### Phase 0 — audit ✅

`docs/audit.md` is the full account: eight findings, each tied to the command that produced
it, plus two addenda covering what turned up later while fixing lint and building the
backend. It is the source for the "what the rebuild fixed" section of the eventual README.

The short version of what was wrong:

| # | Finding |
|---|---|
| 1 | Backend deleted (Railway edge returns "Application not found"); OpenAPI contract captured in time — 109 paths, 150 operations, 132 schemas |
| 2 | 56 hand-written proxy routes, 5,187 lines, 15% of the teacher app — the sibling app does the same job in one 125-line catch-all |
| 3 | PDF export launches headless Chrome against its own `localhost` — rules out every free tier |
| 4 | 321 physical direction utilities vs 10 logical; one locale; the app's own CLAUDE.md taught the anti-pattern |
| 5 | Three documented claims false: no Playwright, `eslint-config-next@0.2.4`, Arabic hardcoded in 133 files |
| 6 | id/token render paths forked — 79% and 74% identical |
| 7 | `isApiSuccess(status: string \| boolean)` — a shim for a backend that returned success three ways |
| 8 | Every remote image bypasses the Next optimizer |

### Phase 1 — repository shape ✅

Both apps subtree-imported with full history. `.mailmap` unifies two git author names into
one contributor. Nested lockfiles deleted and gitignored — the Vercel trap is closed.
`packages/config` holds the shared tsconfig with `noUncheckedIndexedAccess: true`.

### Lint ✅ — 40 errors → 0

`npm run lint` had **never run** in the teacher app: `eslint-config-next@0.2.4` against
Next 16 crashed with `ERR_MODULE_NOT_FOUND` before examining a file. Pinning it to 16.1.6
surfaced 19 errors; the admin app had 21 more.

Fixing them found two defects no build would have failed on: `formatHijriDisplay` pasted
into the *middle* of another function (legal JS, so it compiled for the project's whole
life), and two translation keys present in `ar` but missing from `en`.

93 warnings remain, deliberately untouched.

### Phase 2 — Supabase backend ✅

Five migrations, reproducing the contract for the surface the two apps actually call.

- `0001_init` — six enums from the contract, 15 tables. Resolves the `Profile` naming
  collision: `accounts` (the user) and `portfolios` (the achievement file).
- `0002_accounts` — `handle_new_user`, `is_admin()`, `has_active_subscription()`.
- `0003_rls` — policies **and** grants. `anon` gets a hard refusal, not an empty result.
- `0004_statistics` — one `GROUP BY` per question, replacing a dashboard that made four
  HTTP calls and downloaded the whole subscriptions table to sum one column.
- `0005_access` — the share-token read; the only route by which `anon` reaches a portfolio.

**Verification, all currently green:**

| Check | Command | Result |
|---|---|---|
| Security boundary, every role | `npm run db:test` | 30/30 |
| Contract fidelity | `npm run db:verify` | 27/27 |
| Lint, both apps | `npm run lint` | 0 errors |
| Types, both apps + db package | `npm run typecheck` | clean |

### Publishing hygiene ✅

The client organisation is scrubbed from the working tree **and** all 210 commits — name,
GitHub URLs, LinkedIn link. Four generated portfolio PDFs (~206 MB) containing real names
and national-id-shaped digits were purged from history and force-pushed away.

> **One loose end:** GitHub keeps unreferenced objects reachable by SHA for a while after a
> force-push. The exposure was a few minutes and the SHAs are not published anywhere, so
> the practical risk is low. To make it certain, either ask GitHub Support to GC the repo,
> or delete and recreate it and re-push.

---

## Next — Phase 3, rewiring the apps

Nothing here needs a cloud account. It all runs against the local stack.

1. **Collapse the 56 proxy routes.** Adopt the admin app's catch-all shape — one of the two
   apps already proved it — replacing 5,187 lines with a typed data layer in
   `packages/db`. Consolidate token refresh, which the two apps currently solve at
   different layers (admin server-side, teacher client-side via an axios interceptor).

2. **Delete server-side Chrome.** Replace the four `api/export/*` routes with
   `html2canvas-pro` + `jsPDF` over the already-rendered DOM, JPEG-encoded (~300 KB vs
   ~8 MB as PNG). The print page already exists and already signals `[data-print-ready]`,
   so it is reused rather than rewritten. This removes `puppeteer-core`, the four-stage
   Dockerfile, the `createExportToken` side channel, and the 3-second sleep — and is what
   makes the Vercel free tier possible at all.

3. **Deduplicate the id/token fork** — one print page and one export path taking
   `{ by: 'id' } | { by: 'token' }`.

4. **While in there:** the fabricated `-06-15` graduation date; `ImageGallery`'s raw
   `<img>`; drop the blanket `unoptimized` once images come from Supabase Storage.

5. **The oversized SVGs.** Twelve files are most of the repo's 210 MB —
   `sign-bg.svg` and `register-cover-mobile.svg` are 32 MB *each*, design exports with
   rasters embedded as base64. Converting to WebP is an order-of-magnitude win and belongs
   with finding 8, since it is the same underlying problem.

Then Phase 4 (bilingual — the long pole, 321 utilities and 133 files) and Phase 5 (deploy).

---

## Decisions already made

| Question | Answer |
|---|---|
| Scope | Both apps, as a monorepo |
| Backend contract | Only the ~68 paths the UIs actually call; omissions documented in `verify-contract.mjs` |
| Bilingual | Yes — `ar` + `en`, seeded from the admin app's existing i18n |
| Attribution | Client anonymised everywhere; naming them needs their sign-off |

## Still open, needs Yusif

- **Cloud Supabase project** — blocks Phase 5, nothing before it. See `SETUP.md` §2.
- **Arabic copy call:** `ar.auth.login.phonePlaceholder` is `"مثال: mohammed@gmail.com"` —
  an email offered as the example for a phone field. One-line fix once the format is
  decided.
- **Repo visibility** — currently public. Fine by the playbook's model (talent-bridge is
  public too), but worth a conscious choice before it gets linked anywhere.

## Getting back in

```bash
cd E:\Yusif\projects\injaz-platform    # capital Y — see SETUP.md
npm install
npm run db:start && npm run db:reset
npm run db:test && npm run db:verify   # should be 30/30 and 27/27
```

Local Supabase runs on **544xx**, not the defaults — talent-bridge holds 543xx and both are
expected to run at once. Demo logins are in `SETUP.md`.
