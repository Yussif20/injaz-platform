# CLAUDE.md - Project Quick Reference

> **Full Documentation:** See `docs/PROJECT.md` for complete API docs, types, and implementation details.

## Project Overview

**Injaz Al-Moalem** (إنجاز المعلم) - Arabic educational platform for teachers to create achievement portfolios.
- **RTL Layout** - Full right-to-left Arabic interface
- **Backend API:** `https://staging.enjazfile.com`

## Tech Stack

| Tech | Version |
|------|---------|
| Next.js | 16 (App Router) |
| TypeScript | Strict mode |
| Tailwind CSS | 4 |
| React Query | State management |
| React Hook Form + Zod | Forms & validation |
| Axios | HTTP client |

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run test:e2e     # E2E tests (Playwright)
```

## Project Structure

```
src/
├── app/              # Next.js pages & API routes
├── features/         # Feature modules (auth, dashboard, profiles, landing)
├── shared/           # Shared components, hooks, lib
├── content/ar/       # Arabic text content
└── config/           # Route constants
```

## Path Aliases

```typescript
"@/*"           → "./src/*"
"@/features/*"  → "./src/features/*"
"@/shared/*"    → "./src/shared/*"
"@/content/*"   → "./src/content/*"
"@/config/*"    → "./src/config/*"
```

## Key Conventions

### Components
- Server Components by default (no directive)
- Client Components: add `"use client"`
- Named exports: `export const Component = () => {}`
- Default exports for pages

### Feature Module Pattern
```
feature-name/
├── components/       # UI components
├── hooks/            # React Query hooks
├── services/         # API calls (use clientApi)
├── types/            # TypeScript types
├── validations/      # Zod schemas
└── index.ts          # Barrel export
```

### Content Management
- All Arabic text in `src/content/ar/`
- Never hardcode Arabic text in components
- Import: `import { dashboardContent } from "@/content";`

### Styling
- RTL: `text-right`, `flex-row-reverse`
- Colors: `primary-*`, `secondary-*`, `success-*`, `warning-*`, `grey-*`, `shade-*`
- Responsive: Mobile-first (`md:`, `lg:` breakpoints)

## Implementation Status

| Feature | Status |
|---------|--------|
| Auth (login, register, OTP) | ✅ Done |
| User Profile (Me) | ✅ Done |
| Career Jobs CRUD | ✅ Done |
| Qualifications CRUD | ✅ Done |
| Image Management | ✅ Done |
| Share Links | ✅ Done |
| Profile Management | ✅ Done |
| Public Profile Viewer | ✅ Done |
| Subscriptions | 🔶 In Progress (waiting for backend) |

## Current Tasks

| Task | Details |
|------|---------|
| Saudi phone format (+966) | Make numbers follow Saudi pattern |
| Custom birthday calendar | Add custom calendar picker |
| Zig-zag pattern fix | Increase slope & darken color in profile default template |
| Achievement section responsive | Fix squished images on medium/small screens |
| Profile data tabs responsive | Fix /dashboard/account/profile-data on mobile |
| Profile sections image upload | Fix images not being added |
| Career add error | Fix error when adding new career in profile data |
| Test real endpoints | Test all features against real backend endpoints |

> **Note:** Admin features handled in separate website.

## API Response Format

```typescript
interface ApiResponse<T> {
  status: "Success" | "Failure";  // String, NOT boolean
  message: string;
  data: T;
  errors: string[] | null;
}
```

## Key Enums

```typescript
enum Gender { Female = 0, Male = 1 }
enum ProfileStatus { Draft = 0, Unpublished = 1, Published = 2 }
```

## Development Bypass

Test credentials for frontend development (remove before production):
- Phone: `00001234567`
- Password: `123456`
- OTP: `123456`

Find bypass code: `grep -rn "TODO: BYPASS" src/`

## Quick Links

- Full documentation: `docs/PROJECT.md`
- API endpoints: `src/shared/lib/api.ts`
- Routes config: `src/config/routes.ts`
- Arabic content: `src/content/ar/`
