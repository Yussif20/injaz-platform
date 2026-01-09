# Feature-Based Folder Structure

## Current Structure (Traditional)
```
app/
├── page.tsx
├── layout.tsx
├── globals.css
├── sign/in/page.tsx
├── sign/up/page.tsx
├── download/page.tsx
├── how-to-use/page.tsx
└── profiles/new/page.tsx

components/
├── ui/
│   ├── Button.tsx
│   └── index.ts
├── sections/
│   ├── BannerSection.tsx
│   ├── ComingSoon.tsx
│   ├── DesignChoiceSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── HowToSection.tsx
│   ├── MobileAppSection.tsx
│   ├── Navbar.tsx
│   └── WhySection.tsx
└── forms/

lib/
└── content.ts

hooks/
types/
```

## Proposed Feature-Based Structure
```
src/
├── app/                              # Next.js App Router (pages only)
│   ├── (public)/                     # Public routes group
│   │   ├── page.tsx                  # Landing page
│   │   ├── p/[slug]/page.tsx         # Public profile view
│   │   ├── terms/page.tsx
│   │   └── privacy/page.tsx
│   │
│   ├── (auth)/                       # Auth routes group
│   │   ├── layout.tsx                # Auth layout (no navbar)
│   │   ├── sign/
│   │   │   ├── in/page.tsx
│   │   │   └── up/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (dashboard)/                  # Protected routes group
│   │   ├── layout.tsx                # Dashboard layout (sidebar, auth guard)
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── profiles/
│   │   │   ├── page.tsx              # Profile list
│   │   │   ├── new/page.tsx          # Create profile
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Profile editor
│   │   │       └── preview/page.tsx  # Profile preview
│   │   └── settings/
│   │       ├── page.tsx              # Settings main
│   │       ├── profile/page.tsx      # Edit teacher info
│   │       ├── password/page.tsx     # Change password
│   │       └── support/page.tsx      # Contact support
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css
│   └── not-found.tsx
│
├── features/                         # Feature modules
│   │
│   ├── auth/                         # Authentication feature
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogout.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── validations/
│   │   │   └── auth.schema.ts
│   │   └── index.ts                  # Barrel export
│   │
│   ├── profiles/                     # Profiles feature
│   │   ├── components/
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ProfileList.tsx
│   │   │   ├── ProfileEditor/
│   │   │   │   ├── ProfileEditor.tsx
│   │   │   │   ├── GeneralInfoSection.tsx
│   │   │   │   ├── DynamicSection.tsx
│   │   │   │   ├── SubsectionItem.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ProfilePreview.tsx
│   │   │   ├── ProfileActions.tsx
│   │   │   ├── CreateProfileWizard/
│   │   │   │   ├── CreateProfileWizard.tsx
│   │   │   │   ├── YearSelector.tsx
│   │   │   │   ├── TypeSelector.tsx
│   │   │   │   └── index.ts
│   │   │   └── PublicProfile.tsx
│   │   ├── hooks/
│   │   │   ├── useProfiles.ts
│   │   │   ├── useProfile.ts
│   │   │   ├── useCreateProfile.ts
│   │   │   ├── useUpdateProfile.ts
│   │   │   └── usePublishProfile.ts
│   │   ├── services/
│   │   │   └── profiles.service.ts
│   │   ├── types/
│   │   │   └── profile.types.ts
│   │   ├── validations/
│   │   │   └── profile.schema.ts
│   │   ├── utils/
│   │   │   └── profile.utils.ts
│   │   └── index.ts
│   │
│   ├── settings/                     # Settings feature
│   │   ├── components/
│   │   │   ├── SettingsLayout.tsx
│   │   │   ├── SettingsNav.tsx
│   │   │   ├── TeacherInfoForm.tsx
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   ├── DeleteAccountModal.tsx
│   │   │   └── ContactSupportForm.tsx
│   │   ├── hooks/
│   │   │   ├── useSettings.ts
│   │   │   └── useChangePassword.ts
│   │   ├── services/
│   │   │   └── settings.service.ts
│   │   ├── types/
│   │   │   └── settings.types.ts
│   │   └── index.ts
│   │
│   ├── pdf-export/                   # PDF Export feature
│   │   ├── components/
│   │   │   ├── PDFDocument.tsx
│   │   │   ├── PDFTemplate1.tsx
│   │   │   ├── PDFTemplate2.tsx
│   │   │   ├── PDFTemplate3.tsx
│   │   │   └── PDFTemplate4.tsx
│   │   ├── hooks/
│   │   │   └── usePDFExport.ts
│   │   ├── services/
│   │   │   └── pdf.service.ts
│   │   └── index.ts
│   │
│   └── landing/                      # Landing page feature
│       ├── components/
│       │   ├── HeroSection.tsx
│       │   ├── WhySection.tsx
│       │   ├── BannerSection.tsx
│       │   ├── HowToSection.tsx
│       │   ├── DesignChoiceSection.tsx
│       │   └── MobileAppSection.tsx
│       └── index.ts
│
├── shared/                           # Shared/common code
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── feedback/                 # Feedback components
│   │       ├── ComingSoon.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   │
│   ├── lib/                          # Utilities & configs
│   │   ├── api.ts                    # Axios instance
│   │   ├── queryClient.ts            # React Query config
│   │   ├── constants.ts              # App constants
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── types/                        # Shared types
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   │
│   └── validations/                  # Shared validation schemas
│       └── common.schema.ts
│
├── content/                          # Content management
│   ├── ar/                           # Arabic content
│   │   ├── common.ts                 # Common text (nav, footer)
│   │   ├── landing.ts                # Landing page text
│   │   ├── auth.ts                   # Auth pages text
│   │   ├── profiles.ts               # Profiles text
│   │   ├── settings.ts               # Settings text
│   │   └── index.ts
│   └── index.ts                      # Content exports
│
├── config/                           # App configuration
│   ├── routes.ts                     # Route constants
│   ├── api.config.ts                 # API configuration
│   └── app.config.ts                 # App settings
│
└── styles/                           # Global styles (if needed)
    └── fonts.ts                      # Font configuration

public/
├── images/
│   ├── landing/                      # Landing page images
│   ├── auth/                         # Auth pages images
│   └── profiles/                     # Profile-related images
├── icons/
├── logo/
└── socials/
```

---

## Migration Steps

### Step 1: Create Base Structure
```bash
# Create src directory and move app
mkdir -p src
mv app src/app

# Create feature directories
mkdir -p src/features/{auth,profiles,settings,pdf-export,landing}/components
mkdir -p src/features/{auth,profiles,settings}/hooks
mkdir -p src/features/{auth,profiles,settings}/services
mkdir -p src/features/{auth,profiles,settings}/types

# Create shared directories
mkdir -p src/shared/components/{ui,layout,feedback}
mkdir -p src/shared/{hooks,lib,types,validations}

# Create content directories
mkdir -p src/content/ar

# Create config directory
mkdir -p src/config
```

### Step 2: Update tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/content/*": ["./src/content/*"],
      "@/config/*": ["./src/config/*"]
    }
  }
}
```

### Step 3: Update next.config.ts
```typescript
const nextConfig = {
  // Update if needed for src directory
};
```

### Step 4: Migrate Components

#### Move Landing Components
```bash
# Move from components/sections/ to features/landing/components/
mv components/sections/HeroSection.tsx src/features/landing/components/
mv components/sections/WhySection.tsx src/features/landing/components/
mv components/sections/BannerSection.tsx src/features/landing/components/
mv components/sections/HowToSection.tsx src/features/landing/components/
mv components/sections/DesignChoiceSection.tsx src/features/landing/components/
mv components/sections/MobileAppSection.tsx src/features/landing/components/
```

#### Move Shared Components
```bash
# Move UI components
mv components/ui/Button.tsx src/shared/components/ui/

# Move layout components
mv components/sections/Navbar.tsx src/shared/components/layout/
mv components/sections/Footer.tsx src/shared/components/layout/

# Move feedback components
mv components/sections/ComingSoon.tsx src/shared/components/feedback/
```

### Step 5: Split Content File
Split `lib/content.ts` into feature-specific files:

```typescript
// src/content/ar/common.ts
export const commonContent = {
  nav: { ... },
  footer: { ... },
  comingSoon: { ... },
};

// src/content/ar/landing.ts
export const landingContent = {
  hero: { ... },
  whySection: { ... },
  bannerSection: { ... },
  howToSection: { ... },
  designChoiceSection: { ... },
  mobileAppSection: { ... },
};

// src/content/ar/auth.ts
export const authContent = {
  signIn: { ... },
  signUp: { ... },
};
```

### Step 6: Update Imports
Update all imports in pages and components to use new paths.

---

## Benefits of Feature-Based Structure

### 1. Scalability
- Each feature is self-contained
- Easy to add new features without affecting others
- Clear boundaries between modules

### 2. Maintainability
- Related code lives together
- Easy to find and modify feature-specific code
- Reduced cognitive load

### 3. Team Collaboration
- Different developers can work on different features
- Clear ownership of code
- Reduced merge conflicts

### 4. Code Reusability
- Shared components are clearly separated
- Features can export reusable hooks/utils
- Easy to identify what's shared vs feature-specific

### 5. Testing
- Feature-based tests are organized
- Easy to test features in isolation
- Clear test file locations

---

## Import Examples

```typescript
// In a page file
import { LoginForm } from '@/features/auth';
import { ProfileList } from '@/features/profiles';
import { Button, Input } from '@/shared/components/ui';
import { Navbar, Footer } from '@/shared/components/layout';
import { authContent } from '@/content/ar';
import { ROUTES } from '@/config/routes';

// In a feature component
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../types/auth.types';
```

---

## Barrel Export Pattern

Each feature should have an `index.ts` for clean exports:

```typescript
// src/features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { AuthGuard } from './components/AuthGuard';
export { useAuth } from './hooks/useAuth';
export { useLogout } from './hooks/useLogout';
export type { User, LoginCredentials, RegisterData } from './types/auth.types';
```

```typescript
// src/shared/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Modal } from './Modal';
export { Card } from './Card';
export { Badge } from './Badge';
export { Spinner } from './Spinner';
```
