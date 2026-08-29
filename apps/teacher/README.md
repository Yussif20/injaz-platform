# Injaz Al-Moalem (إنجاز المعلم)

**Teacher's Achievement Portfolio Platform**

An Arabic educational platform empowering teachers to create, manage, and share professional achievement portfolios.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://enjazfile.com/) · [Documentation](./docs/PROJECT.md) · [Report Bug](#)

---

## Overview

**Injaz Al-Moalem** (إنجاز المعلم) is a comprehensive web application designed for Saudi Arabian teachers to build and showcase their professional achievement portfolios. The platform features a fully right-to-left (RTL) Arabic interface with gender-adaptive content.

### Key Features

- **User Authentication** - Secure login with OTP verification via WhatsApp
- **Profile Management** - Complete teacher profile with personal info, qualifications, and career history
- **Portfolio Creation** - Create achievement files with customizable sections and templates
- **Image Management** - Upload, organize, and manage portfolio images
- **Share Links** - Generate shareable links for portfolio publishing
- **Public Profiles** - Password-protected public profile viewing
- **Subscription System** - Tiered access for premium features

---

## Tech Stack

| Category             | Technology                                                                |
| -------------------- | ------------------------------------------------------------------------- |
| **Framework**        | [Next.js 16](https://nextjs.org/) (App Router)                            |
| **Language**         | [TypeScript](https://www.typescriptlang.org/) (Strict Mode)               |
| **Styling**          | [Tailwind CSS 4](https://tailwindcss.com/)                                |
| **State Management** | [TanStack Query](https://tanstack.com/query) (React Query)                |
| **Forms**            | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **HTTP Client**      | [Axios](https://axios-http.com/)                                          |
| **Testing**          | [Playwright](https://playwright.dev/) (E2E)                               |
| **Font**             | Alexandria (Arabic)                                                       |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)

### Installation

1. **Clone the repository**

   ```bash
   git clone <this-repository>
   cd injaz-almoalem
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the required environment variables (see [Environment Variables](#environment-variables)).

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command                   | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Start development server           |
| `npm run build`           | Build for production               |
| `npm start`               | Start production server            |
| `npm run lint`            | Run ESLint                         |
| `npm run test:e2e`        | Run E2E tests (headless)           |
| `npm run test:e2e:ui`     | Run E2E tests with Playwright UI   |
| `npm run test:e2e:headed` | Run E2E tests with visible browser |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # Backend proxy routes
│   ├── dashboard/          # Protected dashboard pages
│   ├── sign/               # Authentication pages
│   └── ...
│
├── features/               # Feature-based modules
│   ├── auth/               # Authentication (login, register, OTP)
│   ├── dashboard/          # Dashboard components & logic
│   ├── landing/            # Landing page sections
│   └── profiles/           # Portfolio management
│
├── shared/                 # Shared utilities
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API client, utilities
│   └── types/              # Shared TypeScript types
│
├── content/                # Internationalization
│   └── ar/                 # Arabic content files
│
└── config/                 # App configuration
    └── routes.ts           # Route constants
```

### Path Aliases

```typescript
"@/*"           → "./src/*"
"@/features/*"  → "./src/features/*"
"@/shared/*"    → "./src/shared/*"
"@/content/*"   → "./src/content/*"
"@/config/*"    → "./src/config/*"
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://staging.enjazfile.com

# Authentication
JWT_SECRET=your-jwt-secret

# Optional: Analytics, etc.
```

---

## Documentation

For detailed documentation including API endpoints, TypeScript types, and implementation details:

- **[Full Documentation](./docs/PROJECT.md)** - Complete project documentation
- **[Quick Reference](./CLAUDE.md)** - Development quick reference guide

---

## Development

### Feature Module Pattern

Each feature follows a consistent structure:

```
feature-name/
├── components/       # UI components
├── hooks/            # React Query hooks
├── services/         # API service functions
├── types/            # TypeScript types
├── validations/      # Zod schemas
└── index.ts          # Barrel exports
```

### Content Management

All Arabic text is managed in `src/content/ar/`. Never hardcode Arabic text in components:

```typescript
import { landingContent } from "@/content";

// Usage
<h1>{landingContent.hero.title}</h1>
```

### RTL Styling

The application uses RTL layout throughout:

```tsx
<div className="text-right flex-row-reverse">{/* Content */}</div>
```

---

## License

This project is proprietary software. All rights reserved.

---

**Built with by [the client](#)**
