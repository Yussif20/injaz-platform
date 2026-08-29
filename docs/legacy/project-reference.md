# Injaz Al-Moalem - Complete Project Documentation

**Version:** 1.0.0
**Last Updated:** January 2026
**Backend:** https://staging.enjazfile.com

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [API Documentation](#4-api-documentation)
5. [TypeScript Types](#5-typescript-types)
6. [Implementation Status](#6-implementation-status)
7. [Coding Conventions](#7-coding-conventions)
8. [Routes](#8-routes)
9. [Content Management](#9-content-management)
10. [Design System](#10-design-system)
11. [E2E Testing](#11-e2e-testing)
12. [Commands](#12-commands)

---

## 1. Project Overview

**Injaz Al-Moalem** (إنجاز المعلم / Teacher's Achievement) is an Arabic educational platform where teachers create and manage achievement portfolios/files (ملفات الإنجاز).

### Key Features

- User authentication with OTP via WhatsApp
- Teacher profile management (personal info, qualifications, career history)
- Portfolio/file creation with customizable sections
- Image upload and management within portfolio sections
- Share links for portfolio publishing
- Subscription-based access (pending implementation)
- PDF export (planned)

### Important Notes

- **RTL Layout**: Full right-to-left Arabic interface
- **Gender-specific content**: UI text adapts based on user gender (Male=1, Female=2)
- **Profile status flow**: Draft → Unpublished → Published

---

## 2. Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | Next.js 16 (App Router)      |
| Language         | TypeScript (strict mode)     |
| Styling          | Tailwind CSS 4               |
| State Management | React Query (TanStack Query) |
| Forms            | React Hook Form + Zod        |
| HTTP Client      | Axios                        |
| Font             | Alexandria (Arabic)          |
| Testing          | Playwright (E2E)             |

---

## 3. Project Structure

```
src/
├── app/                              # Next.js App Router pages
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles + Tailwind theme
│   ├── api/                          # API routes (proxy to backend)
│   │   ├── auth/                     # Auth endpoints
│   │   ├── me/                       # User profile endpoints
│   │   ├── career-jobs/              # Career endpoints
│   │   ├── qualifications/           # Qualification endpoints
│   │   ├── images/                   # Image management
│   │   └── share-links/              # Share link endpoints
│   ├── sign/
│   │   ├── in/page.tsx               # Login
│   │   └── up/page.tsx               # Registration
│   ├── dashboard/
│   │   ├── page.tsx                  # Main dashboard
│   │   ├── layout.tsx                # Dashboard layout
│   │   └── profile/new/page.tsx      # Create/edit profile
│   └── ...
│
├── features/                         # Feature modules
│   ├── auth/                         # Authentication
│   │   ├── components/               # LoginForm, RegisterForm, OtpInput
│   │   ├── hooks/                    # useAuth, useLogin, useRegister, useLogout
│   │   ├── services/                 # auth.service.ts
│   │   ├── types/                    # auth.types.ts
│   │   └── validations/              # auth.schemas.ts (Zod)
│   │
│   ├── dashboard/                    # Dashboard feature
│   │   ├── components/               # DashboardNavbar, Sidebar, FileCard, etc.
│   │   ├── hooks/                    # useMyProfile, useCareerJobs, etc.
│   │   ├── services/                 # me.service.ts, career.service.ts
│   │   └── types/                    # me.types.ts
│   │
│   ├── profiles/                     # Portfolio management
│   │   ├── components/               # Profile components
│   │   ├── hooks/                    # useMyProfiles, useProfileImages, etc.
│   │   ├── services/                 # profiles.service.ts, images.service.ts
│   │   └── types/                    # profile.types.ts, image.types.ts
│   │
│   ├── landing/                      # Landing page sections
│   └── ...
│
├── shared/                           # Shared code
│   ├── components/
│   │   ├── ui/                       # Button, Input, Modal, etc.
│   │   ├── layout/                   # Navbar, Footer, Sidebar
│   │   └── feedback/                 # ComingSoon, LoadingScreen
│   ├── hooks/                        # Shared hooks
│   ├── lib/                          # api.ts, cookies.ts, utils
│   └── types/                        # Shared types
│
├── content/                          # Arabic content
│   └── ar/
│       ├── common.ts                 # Nav, footer, shared
│       ├── landing.ts                # Landing page
│       ├── auth.ts                   # Auth pages
│       ├── dashboard.ts              # Dashboard
│       └── index.ts                  # Barrel export
│
└── config/                           # Configuration
    ├── routes.ts                     # Route constants
    └── index.ts
```

### Path Aliases (tsconfig.json)

```typescript
"@/*"           → "./src/*"
"@/features/*"  → "./src/features/*"
"@/shared/*"    → "./src/shared/*"
"@/content/*"   → "./src/content/*"
"@/config/*"    → "./src/config/*"
```

---

## 4. API Documentation

> **Moved** — Full API reference (all endpoints, DTOs, enums, payment flow) is in:
> 👉 [../../API-REFERENCE.md](../../API-REFERENCE.md)

---

## 5. TypeScript Types

### Enums

```typescript
enum Gender {
  Female = 0, // أنثى - NOTE: Backend uses 2 for Female in some endpoints
  Male = 1, // ذكر
}

enum GenderAvailability {
  Male = 1,
  Female = 2,
  Both = 3,
}

enum ProfileStatus {
  Draft = 0,
  Unpublished = 1,
  Published = 2,
}

enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

enum VerificationPurpose {
  Registration = 0,
  PasswordReset = 1,
}
```

### Core Types

```typescript
// User & Auth
interface User {
  id: number;
  phone: string | null;
  fullName: string | null;
  gender: Gender;
  role: string | null;
  imageUrl: string | null;
  personalInfo: PersonalInfo | null;
  qualifications: Qualification[] | null;
  careerJobs: CareerJob[] | null;
  createdAt: string;
  isActive: boolean;
  isSubscribed: boolean;
}

interface PersonalInfo {
  rankId: number | null;
  rankTitle: string | null;
  nationalId: string | null;
  birthDate: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
}

interface CareerJob {
  id: number;
  title: string | null;
  rank: string | null;
  school: string | null;
  educationalStage: string | null;
  startYear: number;
  endYear: number | null;
}

interface Qualification {
  id: number;
  degreeType: string | null;
  title: string | null;
  grade: string | null;
  graduationDate: string;
}

// Profiles
interface Profile {
  id: number;
  userId: number;
  userFullName: string | null;
  profileTypeId: number;
  profileTypeName: string | null;
  academicYearId: number;
  academicYearName: string | null;
  templateId: number;
  imageUrl: string | null;
  status: string | null;
  isPasswordProtected: boolean;
  publishedAt: string | null;
  createdAt: string;
  modifiedAt: string;
}

interface ProfileType {
  id: number;
  typeNameMale: string | null;
  typeNameFemale: string | null;
  typeName: string | null;
  description: string | null;
  availableFor: GenderAvailability;
  isActive: boolean;
  sections: SectionSummary[] | null;
}

interface Section {
  id: number;
  profileTypeId: number;
  title: string | null;
  weightPercent: number;
  displayOrder: number;
  subsections: Subsection[] | null;
}

interface Subsection {
  id: number;
  title: string | null;
  displayOrder: number;
  maxImageCount: number | null;
  maxImageSize: number | null;
}

// Images
interface SubsectionImage {
  id: number;
  imagePath: string | null;
  publicUrl: string | null;
  description: string | null;
  displayOrder: number;
}

// Share Links
interface ShareLink {
  id: number;
  token: string | null;
  shareUrl: string | null;
  expiresAt: string | null;
  accessCount: number;
  createdAt: string;
}

// Reference Data
interface AcademicYear {
  id: number;
  yearName: string | null;
  startDate: string;
  endDate: string;
  status: string | null;
}

interface Rank {
  id: number;
  titleMale: string | null;
  titleFemale: string | null;
  title: string | null;
}
```

---

## 6. Implementation Status

### Completed ✅

| Phase | Feature            | Details                                                     |
| ----- | ------------------ | ----------------------------------------------------------- |
| 1     | Authentication     | Login, registration with OTP, password reset, token refresh |
| 1     | User Profile (Me)  | Get/update profile, personal info, basic info, image upload |
| 1     | Change Password    | Authenticated password change                               |
| 2     | Career Jobs        | Full CRUD                                                   |
| 2     | Qualifications     | Full CRUD                                                   |
| 3     | Profile Management | Create profile, password protection, publishing workflow    |
| 3     | Reference Data     | Academic years, profile types, ranks UI integration         |
| 4     | Image Management   | Upload, view, update, delete, reorder                       |
| 5     | Share Links        | Create, list, delete                                        |
| 7     | Public Profile     | Public profile viewer with password protection              |

### Pending 🔲

| Feature                        | Details                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Saudi phone format             | Make phone numbers follow Saudi pattern (+966)                                                    |
| Custom birthday calendar       | Add custom calendar picker for birthday field                                                     |
| Zig-zag pattern fix            | Fix pattern in personal info default template - increase slope and darken color for large screens |
| Subscription integration       | Complete UI and API integration after backend is ready                                            |
| Achievement section responsive | Fix squished images in profile preview on medium/small screens                                    |
| Profile sections image upload  | Fix add sections for profiles - images not being added                                            |
| Career add error               | Fix error when adding new career in profile data                                                  |
| Test real endpoints            | Test all features against real backend endpoints                                                  |

### Dashboard UI Status

- ✅ Account Info Form - Connected to API
- ✅ Change Password Form - Connected to API
- ✅ Education Data Tab - Connected to API
- ✅ Job Data Tab - Connected to API
- ✅ Profile/File Cards - Connected to API
- ✅ Create File Form - Connected to API

> **Note:** Admin features will be handled in a separate website.

---

## 7. Coding Conventions

### Component Patterns

```typescript
// Server Components (default) - no directive needed
export const ServerComponent = () => { ... }

// Client Components - add "use client"
"use client"
export const ClientComponent = () => { ... }

// Named exports for components
export const ComponentName = () => { ... }

// Default exports for pages
export default function PageName() { ... }
```

### Feature Module Pattern

Each feature follows this structure:

```
feature-name/
├── components/           # UI components
├── hooks/                # React Query hooks
├── services/             # API service functions
├── types/                # TypeScript types
├── validations/          # Zod schemas
├── utils/                # Helper functions
└── index.ts              # Barrel export
```

### Service Pattern

```typescript
// services/example.service.ts
import { clientApi } from "@/shared/lib/api";
import type { ApiResponse, Item } from "../types";

export async function getItems(): Promise<ApiResponse<Item[]>> {
  const response = await clientApi.get("/api/items");
  return response.data;
}

export async function createItem(
  data: CreateItemRequest,
): Promise<ApiResponse<Item>> {
  const response = await clientApi.post("/api/items", data);
  return response.data;
}
```

### Hook Pattern (React Query)

```typescript
// Query hook
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../services/items.service";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
}

// Mutation hook
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "../services/items.service";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
```

### Import Examples

```typescript
// UI Components
import { Button, Input } from "@/shared/components/ui";
import { Navbar, Footer } from "@/shared/components/layout";
import { ComingSoon } from "@/shared/components/feedback";

// Feature Components
import { HeroSection, WhySection } from "@/features/landing";
import { LoginForm } from "@/features/auth";

// Content
import { landingContent, authContent, commonContent } from "@/content";

// Config
import { ROUTES } from "@/config";

// Types
import type { User, ApiResponse } from "@/features/auth/types";
```

### Styling Conventions

```tsx
// RTL layout
<div className="text-right flex-row-reverse">

// Custom color tokens
<button className="bg-primary-500 text-white">
<span className="text-secondary-600">
<div className="bg-shade-100">

// Responsive (mobile-first)
<div className="block md:hidden">  // Mobile only
<div className="hidden md:block">  // Desktop only
<div className="px-4 md:px-8 lg:px-12">
```

---

## 8. Routes

### Public Routes

| Path          | Status      | Description         |
| ------------- | ----------- | ------------------- |
| `/`           | ✅ Done     | Landing page        |
| `/sign/in`    | ✅ Done     | Login               |
| `/sign/up`    | ✅ Done     | Registration        |
| `/download`   | Coming Soon | Download mobile app |
| `/how-to-use` | Coming Soon | How to use guide    |

### Protected Routes (require auth)

| Path                     | Status     | Description         |
| ------------------------ | ---------- | ------------------- |
| `/dashboard`             | ✅ Done    | Main dashboard      |
| `/dashboard/profile/new` | 🔶 Partial | Create/edit profile |
| `/dashboard/settings`    | 🔲 TODO    | User settings       |
| `/profiles`              | 🔲 TODO    | Profile list        |
| `/profiles/[id]`         | 🔲 TODO    | Profile editor      |

### Route Constants

```typescript
// src/config/routes.ts
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign/in",
  SIGN_UP: "/sign/up",
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE_NEW: "/dashboard/profile/new",
  // ...
} as const;
```

---

## 9. Content Management

All Arabic text is managed in `src/content/ar/`:

```typescript
// Import content
import { landingContent, authContent, dashboardContent, commonContent } from "@/content";

// Usage
<h1>{landingContent.hero.title}</h1>
<p>{authContent.signIn.subtitle}</p>
```

### Content Files

| File           | Purpose                             |
| -------------- | ----------------------------------- |
| `common.ts`    | Nav, footer, shared text            |
| `landing.ts`   | Landing page sections               |
| `auth.ts`      | Login, registration, password reset |
| `dashboard.ts` | Dashboard, file management, modals  |

**Important:** Never hardcode Arabic text in components. Always use content files.

---

## 10. Design System

### Color Tokens

| Token         | Usage                         |
| ------------- | ----------------------------- |
| `primary-*`   | Teal - main brand color       |
| `secondary-*` | Dark blue - headings, accents |
| `success-*`   | Green - success states        |
| `warning-*`   | Red - errors, warnings        |
| `grey-*`      | Grayscale - text, borders     |
| `shade-*`     | Teal shades - backgrounds     |
| `card-bg`     | Card background               |
| `text-dark`   | Dark text                     |

### Button Component

```tsx
<Button
  variant="primary|secondary|success|warning|outline"
  size="sm|md|lg"
  isLoading={boolean}
>
  Text
</Button>
```

### Form Inputs

- Background: `#EBEBEB`
- Text alignment: `text-right` (RTL)
- Use inline SVG backgrounds for icons

### Responsive Images

```tsx
// Mobile/desktop variants
<Image className="block md:hidden" ... />  // Mobile
<Image className="hidden md:block" ... />  // Desktop
```

---

## 11. E2E Testing

### Setup

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Running Tests

```bash
npm run test:e2e          # Run all tests (headless)
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:headed   # Run with visible browser
```

### Test Structure

```
e2e/
├── fixtures/
│   ├── base.ts           # Helper functions
│   └── test-data.ts      # Test credentials, selectors
├── auth.setup.ts         # Authentication setup
├── auth.unauth.spec.ts   # Login, registration tests
├── dashboard.spec.ts     # Dashboard tests
├── account.spec.ts       # Account management tests
├── profiles.spec.ts      # Profile CRUD tests
├── images.spec.ts        # Image management tests
└── share-links.spec.ts   # Share link tests
```

### Test Summary

| Test File           | Tests   | Requires Auth |
| ------------------- | ------- | ------------- |
| auth.unauth.spec.ts | 11      | No            |
| dashboard.spec.ts   | 9       | Yes           |
| account.spec.ts     | 14      | Yes           |
| profiles.spec.ts    | 20      | Yes           |
| images.spec.ts      | 22      | Yes           |
| share-links.spec.ts | 28      | Yes           |
| **Total**           | **105** |               |

---

## 12. Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm start                # Start production server

# Linting
npm run lint             # Run ESLint

# Testing
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E with UI
npm run test:e2e:headed  # Run E2E with browser visible
```

---

## Quick Reference

### Adding a New Feature

1. Create feature folder: `src/features/{feature-name}/`
2. Add types: `types/{feature}.types.ts`
3. Add service: `services/{feature}.service.ts`
4. Add API route: `src/app/api/{feature}/route.ts`
5. Add hooks: `hooks/use{Feature}.ts`
6. Add components: `components/{Component}.tsx`
7. Export from `index.ts`
8. Add content to `src/content/ar/{feature}.ts`

### Common Query Keys

```typescript
["myProfile"]["careerJobs"]["qualifications"]["myProfiles"][ // User profile // Career jobs list // Qualifications list // User's profiles
  ("profileImages", id)
][("shareLinks", id)]["academicYears"]["profileTypes"]["ranks"]; // Profile images // Share links // Academic years // Profile types // Ranks
```

### API Endpoint Constants

Located in `src/shared/lib/api.ts`:

```typescript
import { API_ENDPOINTS, serverApi, clientApi } from "@/shared/lib/api";

// Use serverApi in API routes (server-side)
const response = await serverApi.get(API_ENDPOINTS.MY_PROFILE);

// Use clientApi in client components
const response = await clientApi.get("/api/me/profile");
```

---

## Notes

1. **Gender Values**: Male=1, Female=0 (or 2 in some endpoints) - check API docs
2. **OTP**: 6 digits, sent via WhatsApp, 5-minute expiry
3. **File Uploads**: Max 5MB, supports JPG, PNG, GIF, WEBP
4. **Profile Limit**: One profile per academic year per user
5. **Status String**: API returns `"Success"` or `"Failure"` as strings, not booleans
