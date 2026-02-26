# CLAUDE.md - Injaz Dashboard Quick Reference

> **Admin website** for the Injaz Al-Moalem platform. Manages users, academic years, profiles, subscriptions, ranks, assessments, terms, and social links.
> **User website** is the separate `injaz-almoalem` project.

## Project Overview

**Injaz Dashboard** (لوحة تحكم إنجاز) - Admin panel for managing the Injaz Al-Moalem educational platform.
- **RTL Layout** - Full right-to-left Arabic interface
- **Backend API:** `https://staging.enjazfile.com`
- **API Reference:** See `injaz-almoalem/docs/API-ENDPOINTS.md`

## Tech Stack

| Tech | Details |
|------|---------|
| Next.js 15 (App Router) | `"use client"` for interactive pages |
| TypeScript | Strict mode |
| Tailwind CSS 4 | RTL utilities, custom color tokens |
| TanStack React Query | Server state, caching, mutations |
| React Hook Form + Zod | Forms and validation |
| Axios (`proxyApi`) | All client-side API calls via `/api/proxy/*` |
| next-intl | i18n (AR/EN), `useTranslation()` hook |

## Commands

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── reports/          # إحصائيات وتقارير
│   │   ├── users/            # إدارة العملاء
│   │   ├── files/            # إدارة الملفات
│   │   ├── subscriptions/    # إدارة الإشتراكات
│   │   ├── ranks/            # إدارة الرتب والبنود
│   │   ├── academic-years/   # إدارة السنوات الدراسية
│   │   ├── assessments/      # إدارة التقييمات
│   │   ├── terms/            # الشروط والأحكام
│   │   └── socials/          # إدارة وسائل التواصل
│   └── login/
├── features/
│   ├── academic-years/       # AddYearModal, AcademicYearsContent
│   ├── auth/                 # LoginForm, AuthProvider
│   ├── profile-types/        # ProfileTypesContent (نوع الملف management)
│   ├── profiles/             # FilesContent (actual teacher profiles list)
│   ├── ranks/                # RanksContent, AddRankModal
│   ├── reports/              # ReportsContent, charts
│   ├── reviews/              # ReviewsContent (assessments)
│   ├── socials/              # SocialsForm
│   ├── subscriptions/        # SubscriptionsContent, CurrentYearTab, DiscountsTab, SubscriptionsTab
│   ├── terms/                # TermsContent
│   └── users/                # UsersContent, AddUserModal, UserDetailModal
├── shared/
│   ├── components/ui/        # Button, DatePicker, Input, Modal, Pagination,
│   │                         # StatusBadge, ConfirmDialog, SearchInput, Select
│   ├── lib/                  # api.ts, query-keys.ts, api-helpers.ts
│   ├── providers/            # ToastProvider, QueryProvider
│   └── types/                # api.types.ts (ApiResponse, PaginatedData, Gender…)
├── i18n/                     # TranslationContext, navigation
└── lib/                      # content.ts (all AR/EN translation strings)
```

## Path Aliases

```typescript
"@/*"         → "./src/*"
"@/features/*" → "./src/features/*"
"@/shared/*"  → "./src/shared/*"
"@/i18n/*"    → "./src/i18n/*"
```

## Feature Status

| Feature | Route | Status | Notes |
|---------|-------|--------|-------|
| Auth (login) | `/login` | ✅ Done | JWT, refresh token |
| Reports / Stats | `/dashboard/reports` | ✅ Done | Charts, latest subs/files |
| Users (العملاء) | `/dashboard/users` | ✅ Done | Stats cards, table, filter dropdown |
| Files (الملفات) | `/dashboard/files` | ✅ Done | Admin profiles list, card layout, stats |
| Subscriptions | `/dashboard/subscriptions` | ✅ Done | Sidebar nav: CurrentYear / Discounts / Invoices |
| Ranks (الرتب) | `/dashboard/ranks` | ✅ Done | CRUD |
| Academic Years | `/dashboard/academic-years` | ✅ Done | Year selects, DatePicker, status toggle |
| Assessments (التقييمات) | `/dashboard/assessments` | 🔶 Mock data | Needs real API connection |
| Terms & Conditions | `/dashboard/terms` | 🔶 Mock data | Rich text editor works (execCommand); needs real API |
| Social Links | `/dashboard/socials` | 🔶 Mock data | Needs real API or clarification |
| Profile Types (نوع الملف) | via `/dashboard/files` (old) | ✅ Done | CRUD, sections, subsections |

## Shared UI Components (`src/shared/components/ui/`)

| Component | Description |
|-----------|-------------|
| `Button` | Primary button, variants: default/outline/ghost, sizes, `loading` prop |
| `DatePicker` | Custom dual-mode calendar (Hijri + Gregorian). Uses `position: fixed` + `getBoundingClientRect()` — never clipped by overflow containers. Props: `value`, `onChange`, `defaultMode`, `showModeToggle`, `disabled`, `label`, `placeholder`, `error` |
| `Input` | Styled text input |
| `Modal` | Generic modal wrapper |
| `Pagination` | Page navigation, `currentPage`, `totalPages`, `onPageChange` |
| `StatusBadge` | Colored pill: variants `success`, `warning`, `error`, `neutral`, `info` |
| `ConfirmDialog` | Delete/action confirmation modal |
| `SearchInput` | Input with search icon |
| `Select` | Styled select dropdown |

## DatePicker Usage

```tsx
import { DatePicker } from "@/shared/components/ui";

// Gregorian only (no mode toggle)
<DatePicker
  label="تاريخ البداية"
  value={dateISO}           // "YYYY-MM-DD" or ""
  onChange={(v) => ...}     // receives "YYYY-MM-DD"
  defaultMode="gregorian"
  showModeToggle={false}
  placeholder="اختر التاريخ"
  error={errors.date?.message}
/>

// Hijri only (no mode toggle)
<DatePicker defaultMode="hijri" showModeToggle={false} ... />

// With mode switcher (user can toggle between Hijri/Gregorian)
<DatePicker defaultMode="gregorian" showModeToggle={true} ... />
```

## API Layer

All client-side API calls go through `proxyApi` (Axios instance with `baseURL: "/api/proxy"`), which forwards to the backend.

```typescript
import { proxyApi, API_ENDPOINTS } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";

const data = await proxyApi.get(API_ENDPOINTS.USERS.BASE);
```

**Key endpoint groups in `API_ENDPOINTS`:**
`USERS`, `ACADEMIC_YEARS`, `RANKS`, `PROFILES`, `PROFILE_TYPES`, `SECTIONS`, `SUBSECTIONS`, `SUBSCRIPTIONS`, `SUBSCRIPTION_DISCOUNTS`, `SUBSCRIPTION_SETTINGS`, `SYSTEM_PARAMETERS`, `SHARE_LINKS`

## Query Keys

```typescript
import { queryKeys } from "@/shared/lib/query-keys";
// queryKeys.users / academicYears / ranks / profiles / profileTypes
// subscriptions / subscriptionDiscounts / subscriptionSettings
// systemParameters / reports
```

## Key Conventions

### Components
- `"use client"` on all interactive components
- Named exports for components: `export function MyComponent() {}`
- Default exports for Next.js pages only

### Feature Module Pattern
```
feature-name/
├── components/    # UI components
├── hooks/         # React Query hooks (useQuery / useMutation)
├── services/      # API calls via proxyApi
├── types/         # TypeScript interfaces/enums
├── validations/   # Zod schemas
└── index.ts       # Barrel export
```

### Translations
- All strings in `src/lib/content.ts` (AR + EN)
- Access via `const { t } = useTranslation()`
- Many feature components use inline Arabic fallback strings

### Styling
- RTL: use `ps-*`/`pe-*` (logical), `start-*`/`end-*`, `text-right`
- Colors: `primary-*`, `grey-*`, `warning-*`, `success-*`, `text-dark`, `text-muted`
- No arbitrary font weights — use `font-light`, `font-medium`, `font-semibold`
- Rounded modals/cards: `rounded-2xl`

### Floating Elements (Dropdowns & Popups)
All dropdowns and calendar popups use **`position: fixed`** with coordinates from `getBoundingClientRect()` — never `position: absolute` inside a scrollable/overflow container.

**Action menu pattern** (all table pages):
```tsx
const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

// On trigger button click:
onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const menuWidth = 176; // w-44 (use actual menu width)
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
  setMenuPos({ top: rect.bottom + 4, left });
  setOpenMenuId(id);
}}

// Dropdown div:
style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
className="z-[9999] w-44 ..."
```
The `left` clamp ensures the menu never overflows either screen edge.

### Page Header Convention
- **Reports page** (`/dashboard/reports`): no back button — shows today's date in Gregorian + Hijri using `Intl.DateTimeFormat`
- **All other pages**: "العودة للسابق" button calls `router.push("/dashboard/reports")` (never `router.back()`)

### Terms Rich Text Editor
`TermsContent` uses a `contentEditable` div (not `<textarea>`). The `EditorToolbar` calls `document.execCommand()` for formatting. **Critical:** toolbar buttons must use `onMouseDown` + `e.preventDefault()` — using `onClick` loses the text selection before the command fires.

## Academic Years — AcademicYearDto

```typescript
interface AcademicYearDto {
  id: number;
  yearName: string;          // "2025 م / 1446 هـ"
  startDate: string;         // ISO date-time
  endDate: string;           // ISO date-time
  status: "Active" | "Inactive" | "Closed";
  subscriptionFee?: number | null;
  activeDeal?: string | null;
}
```
Status is changed via separate endpoints: `activate`, `deactivate`, `close` (not part of create/update payload).

## Subscriptions Layout

`SubscriptionsContent` uses a vertical sidebar nav with 3 sections:
- **إشتراك السنة الحالية** → `CurrentYearTab` (settings form + current discounts)
- **تاريخ عروض السنة** → `DiscountsTab` (discount CRUD)
- **فواتير الإشتراكات** → `SubscriptionsTab` (paginated subscriptions list)

## API Reference

> Full endpoint docs, DTOs, enums, and payment flow:
> 👉 [../../API-REFERENCE.md](../../API-REFERENCE.md)
