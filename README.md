# Injaz Platform

Rebuild of **Injaz Al-Moalem** (إنجاز المعلم), an Arabic platform where Saudi teachers
build achievement portfolios and share them as a public link or a generated PDF.

This repository merges two client applications that previously lived apart, and replaces a
.NET backend that no longer exists.

> **Status: in progress.** The audit, the monorepo and the replacement backend are done and
> verified; the apps are not yet rewired onto it and nothing is deployed. This README is a
> placeholder and will be rewritten once there is something live to describe.
>
> **[docs/progress.md](docs/progress.md) is the current state** — what is finished, what is
> next, and how to get back in. Start there.

## What this repository is

Two applications, one client, one backend:

| Path | Was | Purpose |
|---|---|---|
| `apps/teacher` | teacher-facing app | Teachers build and share portfolios |
| `apps/admin`   | staff-facing app | Staff review profiles and subscriptions |

Both histories were imported with `git subtree`, so all 197 original commits are preserved
and the original repositories are left online untouched as archives.

The backend they both called — `staging.enjazfile.com` — has been deleted. Its OpenAPI
contract was captured while it still answered, and is kept at
`supabase/tests/fixtures/legacy-openapi.json` (109 paths, 150 operations, 132 schemas).
That fixture is the specification the replacement is verified against.

## Layout

```
apps/teacher/          teacher-facing Next app
apps/admin/            staff-facing Next app
packages/config/       shared tsconfig (noUncheckedIndexedAccess: true)
supabase/              migrations, functions, tests, fixtures
docs/audit.md          what was wrong with the original, with evidence
docs/legacy/           the original project's own documentation, kept
scripts/               seed and verification
```

## The audit

`docs/audit.md` records the state of the code before the rebuild — eight findings, each
tied to the command that produced it. It is the source for the "what the rebuild fixed"
section this README will eventually carry.

## Development

```bash
npm install     # workspaces are detected automatically
npm run dev
```
