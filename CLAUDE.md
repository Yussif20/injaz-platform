# CLAUDE.md - Project Guide

## Project Overview
**Injaz Al-Moalem** (Teacher's Achievement) - An Arabic educational platform built with Next.js. The site is fully RTL (right-to-left) and targets Arabic-speaking users.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **State/Forms**: React Query, React Hook Form, Axios
- **Font**: Alexandria (Arabic)

## Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Project Structure (Feature-Based)
```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + Tailwind theme
│   ├── sign/
│   │   ├── layout.tsx            # Auth layout
│   │   ├── in/page.tsx           # Sign in page
│   │   └── up/page.tsx           # Sign up page
│   ├── download/page.tsx         # Download app (Coming Soon)
│   ├── how-to-use/page.tsx       # How to use (Coming Soon)
│   └── profiles/new/page.tsx     # Create profile (Coming Soon)
│
├── features/                     # Feature modules
│   ├── landing/                  # Landing page feature
│   │   ├── components/           # HeroSection, WhySection, etc.
│   │   └── index.ts              # Barrel export
│   ├── auth/                     # Authentication feature (WIP)
│   │   ├── components/           # LoginForm, RegisterForm, etc.
│   │   ├── hooks/                # useAuth, useLogout
│   │   ├── services/             # auth.service.ts
│   │   └── types/                # auth.types.ts
│   ├── profiles/                 # Profiles feature (WIP)
│   │   ├── components/           # ProfileEditor, ProfileList, etc.
│   │   ├── hooks/                # useProfiles, useProfile
│   │   └── types/                # profile.types.ts
│   ├── settings/                 # Settings feature (WIP)
│   └── pdf-export/               # PDF Export feature (WIP)
│
├── shared/                       # Shared code
│   ├── components/
│   │   ├── ui/                   # Button, Input, Modal, etc.
│   │   ├── layout/               # Navbar, Footer, Sidebar
│   │   └── feedback/             # ComingSoon, LoadingScreen
│   ├── hooks/                    # Shared hooks
│   ├── lib/                      # Utils, API config
│   └── types/                    # Shared types
│
├── content/                      # Content management
│   └── ar/                       # Arabic content
│       ├── common.ts             # Nav, footer, shared text
│       ├── landing.ts            # Landing page text
│       ├── auth.ts               # Auth pages text
│       └── index.ts              # Barrel export
│
└── config/                       # App configuration
    ├── routes.ts                 # Route constants
    └── index.ts                  # Barrel export

public/
├── logo/                         # Logo files
├── icons/                        # Icon SVGs
├── pages/                        # Page-specific images
├── sections/                     # Section images
└── socials/                      # Social media icons

docs/
├── FRD-Teacher-Portal.md         # Functional Requirements Document
└── FOLDER-RESTRUCTURE.md         # Migration guide
```

## Coding Conventions

### Components
- **Server Components** (default): No `"use client"` directive
- **Client Components**: Add `"use client"` when using hooks/interactivity
- **Named exports** for components: `export const ComponentName = () => {}`
- **Default exports** for pages: `export default function PageName() {}`
- Use barrel exports in `index.ts` files

### Feature Module Structure
Each feature should follow this pattern:
```
feature-name/
├── components/           # Feature-specific components
├── hooks/                # Feature-specific hooks
├── services/             # API service functions
├── types/                # TypeScript types
├── validations/          # Zod schemas
├── utils/                # Helper functions
└── index.ts              # Barrel export
```

### Styling
- Utility-first Tailwind classes inline
- Custom color tokens: `primary-*`, `secondary-*`, `success-*`, `warning-*`, `grey-*`, `shade-*`
- Special colors: `card-bg`, `text-dark`
- RTL: `text-right`, `flex-row-reverse` for proper Arabic layout
- Responsive: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

### Content Management
- All Arabic text lives in `src/content/ar/`
- Split by feature: `common.ts`, `landing.ts`, `auth.ts`
- Import and destructure: `import { landingContent } from "@/content";`
- Never hardcode text in components

### Path Aliases
```typescript
"@/*"           -> "./src/*"
"@/features/*"  -> "./src/features/*"
"@/shared/*"    -> "./src/shared/*"
"@/content/*"   -> "./src/content/*"
"@/config/*"    -> "./src/config/*"
```

### Import Examples
```tsx
// UI Components
import { Button } from "@/shared/components/ui";
import { Navbar, Footer } from "@/shared/components/layout";
import { ComingSoon } from "@/shared/components/feedback";

// Feature Components
import { HeroSection, WhySection } from "@/features/landing";

// Content
import { landingContent, authContent, commonContent } from "@/content";

// Config
import { ROUTES } from "@/config";
```

## Design System Colors
| Token | Usage |
|-------|-------|
| `primary-*` | Teal - main brand color |
| `secondary-*` | Dark blue - headings, accents |
| `success-*` | Green - success states |
| `warning-*` | Red - errors, warnings |
| `grey-*` | Grayscale - text, borders |
| `shade-*` | Teal shades - backgrounds |

## Important Patterns

### Responsive Images
```tsx
// Mobile/desktop variants
<Image className="block md:hidden" ... />
<Image className="hidden md:block" ... />
```

### Button Component
```tsx
<Button variant="primary|secondary|success|warning|outline" size="sm|md|lg" isLoading={boolean}>
  Text
</Button>
```

### Form Inputs
- Background: `#EBEBEB`
- Text alignment: `text-right`
- Use inline SVG backgrounds for icons

## Routes
| Path | Status | Description |
|------|--------|-------------|
| `/` | Done | Home/landing page |
| `/sign/in` | Done | Sign in page |
| `/sign/up` | Done | Sign up page |
| `/profiles/new` | Coming Soon | Create profile |
| `/download` | Coming Soon | Download app |
| `/how-to-use` | Coming Soon | How to use guide |
| `/dashboard` | TODO | Teacher dashboard |
| `/profiles` | TODO | Profile list |
| `/profiles/[id]` | TODO | Profile editor |
| `/settings` | TODO | User settings |

## Notes
- Project is in early development (v0.1.0)
- Feature-based folder structure implemented
- No tests configured yet
- No backend/API integration yet
- See `docs/FRD-Teacher-Portal.md` for full requirements
