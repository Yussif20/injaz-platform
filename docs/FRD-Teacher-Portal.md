# Functional Requirements Document (FRD)
# إنجاز معلم - Teacher Portal

## 1. Project Overview

**Project Name:** Injaz Al-Moalem (إنجاز معلم) - Teacher Achievement Platform
**Target Users:** Teachers (المعلمين)
**Platforms:** Web (Next.js) + Mobile App
**Language:** Arabic (RTL)

### 1.1 Purpose
A digital platform enabling teachers to build, manage, and publish professional achievement profiles for specific academic years and teacher types. Teachers can create structured profiles with dynamic sections, upload information, generate PDFs, and share public profile links.

---

## 2. Feature Modules

### 2.1 Authentication (المصادقة)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| AUTH-01 | Login | Login using phone number + password (no SMS verification) | High |
| AUTH-02 | Register | Create new account with required fields | High |
| AUTH-03 | Password Recovery | Request password reset link from admin | Medium |
| AUTH-04 | Logout | End user session securely | High |

#### 2.1.1 Login Screen
**Fields:**
- Phone Number (required) - Format: Saudi number
- Password (required)

**Actions:**
- Submit login
- Navigate to register
- Request password recovery

#### 2.1.2 Registration Screen
**Fields:**
- Full Name (ثلاثي) - Required, cannot be changed later
- Gender (النوع) - Required (Male/Female)
- Phone Number - Required, cannot be changed later
- Password - Required
- Confirm Password - Required
- Email - Optional
- Terms & Conditions checkbox - Required

---

### 2.2 Profiles (الملفات)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| PROF-01 | Profile List | View all profiles grouped by academic year | High |
| PROF-02 | Create Profile | Create new draft profile with year & type | High |
| PROF-03 | Profile Details | View/edit profile with dynamic sections | High |
| PROF-04 | Save Changes | Save profile as draft | High |
| PROF-05 | Preview Profile | Preview profile (non-shareable) | High |
| PROF-06 | Publish Profile | Make profile public | High |
| PROF-07 | Unpublish Profile | Revert to draft status | Medium |
| PROF-08 | Export PDF | Download profile as PDF (published only) | High |
| PROF-09 | Public Profile View | Shareable link with optional password | High |

#### 2.2.1 Profile List Page
**Display:**
- Profiles grouped by year (e.g., 2024-2025, 2023-2024)
- Each profile shows:
  - Profile type/title
  - Status badge (Draft/Published)
  - Last modified date
  - Quick actions (View, Edit, Delete)

**Actions:**
- Create new profile button
- Filter by year
- Filter by status

#### 2.2.2 Create New Profile Flow
**Step 1:** Select Academic Year (السنة الدراسية)
- Dropdown with available years

**Step 2:** Select Teacher Type (الرتبة الوظيفية)
- Options based on admin configuration:
  - مدرس (Teacher)
  - مدرس أول (Senior Teacher)
  - وكيل (Vice Principal)
  - ناظر مدرسة (School Principal)
  - etc.

**Result:** Creates new profile in DRAFT status

#### 2.2.3 Profile Editor
**Structure:**
```
├── General Info & Timeline (البيانات العامة)
│   ├── Personal Information
│   ├── Academic Year
│   └── Teacher Type
│
├── Dynamic Sections (الأقسام الديناميكية)
│   ├── Section 1: [Title based on type]
│   │   ├── Evaluation Weight (%)
│   │   └── Subsections (items with images & descriptions)
│   ├── Section 2: [Title based on type]
│   └── ... (varies by teacher type)
│
└── Actions Bar
    ├── Save Draft
    ├── Preview
    ├── Publish
    └── Export PDF
```

---

### 2.3 Profile Content Sections (محتوى الملف)

| ID | Section | Description | Required |
|----|---------|-------------|----------|
| SEC-01 | السيرة الذاتية | Personal biography/CV | Yes |
| SEC-02 | البيانات العلمية | Academic credentials & qualifications | Yes |
| SEC-03 | البيانات الوظيفية | Professional/employment data | Yes |
| SEC-04 | جهات التواصل | Contact information | No |

#### 2.3.1 السيرة الذاتية (Biography)
- Text area for personal bio
- Rich text support

#### 2.3.2 البيانات العلمية (Academic Data)
- Educational qualifications
- Certificates
- Training courses
- Attachments/evidence

#### 2.3.3 البيانات الوظيفية (Professional Data)
- Current position
- Work history
- Achievements
- Responsibilities
- Evidence/attachments

#### 2.3.4 جهات التواصل (Contacts - Optional)
- Email
- Phone
- Social media links

---

### 2.4 Public Profile (الملف العام)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| PUB-01 | Shareable Link | Generate unique public URL | High |
| PUB-02 | Password Protection | Optional password to view profile | Medium |
| PUB-03 | Public Preview | Read-only view for visitors | High |
| PUB-04 | Private PDF Export | Visitors can export PDF | Medium |

**Public Profile URL Format:** `/{locale}/profile/{profileId}` or `/{locale}/p/{shortCode}`

---

### 2.5 Settings (الإعدادات)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| SET-01 | Teacher Info | View/edit profile information | High |
| SET-02 | Change Password | Update password (requires old password) | High |
| SET-03 | Terms & Conditions | View terms and conditions | Low |
| SET-04 | Contact Support | Send message to support team | Medium |
| SET-05 | Delete Account | Permanently delete account | Medium |

#### 2.5.1 Teacher Info
**Editable Fields:**
- Email
- Profile picture

**Read-only Fields:**
- Full Name
- Phone Number
- Gender

#### 2.5.2 Change Password
**Fields:**
- Current Password (required)
- New Password (required)
- Confirm New Password (required)

**Validation:**
- Minimum 8 characters
- Must match confirmation

#### 2.5.3 Delete Account
**Flow:**
1. User clicks "Delete Account"
2. Confirmation modal appears
3. User enters password to confirm
4. Account and all profiles are permanently deleted

---

## 3. User Interface Pages

### 3.1 Public Pages (No Auth Required)
| Route | Page | Status |
|-------|------|--------|
| `/` | Landing Page | ✅ Done |
| `/sign/in` | Login | ✅ Done |
| `/sign/up` | Register | ✅ Done |
| `/p/[id]` | Public Profile View | 🔲 TODO |
| `/terms` | Terms & Conditions | 🔲 TODO |
| `/privacy` | Privacy Policy | 🔲 TODO |

### 3.2 Protected Pages (Auth Required)
| Route | Page | Status |
|-------|------|--------|
| `/dashboard` | Dashboard/Home | 🔲 TODO |
| `/profiles` | Profile List | 🔲 TODO |
| `/profiles/new` | Create Profile | 🔲 TODO |
| `/profiles/[id]` | Profile Details/Editor | 🔲 TODO |
| `/profiles/[id]/preview` | Profile Preview | 🔲 TODO |
| `/settings` | Settings Main | 🔲 TODO |
| `/settings/profile` | Edit Teacher Info | 🔲 TODO |
| `/settings/password` | Change Password | 🔲 TODO |
| `/settings/support` | Contact Support | 🔲 TODO |

---

## 4. Data Models

### 4.1 User (Teacher)
```typescript
interface Teacher {
  id: string;
  fullName: string;          // Cannot change
  phone: string;             // Cannot change
  email?: string;
  gender: 'male' | 'female';
  password: string;          // Hashed
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Profile
```typescript
interface Profile {
  id: string;
  teacherId: string;
  teacherTypeId: string;
  year: string;              // e.g., "2024-2025"
  status: 'draft' | 'published';
  isPasswordProtected: boolean;
  password?: string;
  shareableSlug: string;
  selectedDesign: number;    // 1-4 design templates
  sections: ProfileSection[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### 4.3 Profile Section
```typescript
interface ProfileSection {
  id: string;
  profileId: string;
  sectionDefinitionId: string;
  title: string;
  weight: number;            // Percentage
  order: number;
  subsections: Subsection[];
}

interface Subsection {
  id: string;
  title: string;
  description: string;
  images: string[];
  order: number;
}
```

### 4.4 Teacher Type
```typescript
interface TeacherType {
  id: string;
  nameAr: string;           // e.g., "مدرس أول"
  isActive: boolean;
  sectionDefinitions: SectionDefinition[];
}
```

---

## 5. API Endpoints (Expected)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with phone & password |
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/logout` | End session |
| POST | `/api/auth/forgot-password` | Request reset link |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles` | Get all user profiles |
| POST | `/api/profiles` | Create new profile |
| GET | `/api/profiles/:id` | Get profile details |
| PUT | `/api/profiles/:id` | Update profile |
| DELETE | `/api/profiles/:id` | Delete profile |
| POST | `/api/profiles/:id/publish` | Publish profile |
| POST | `/api/profiles/:id/unpublish` | Unpublish profile |
| GET | `/api/profiles/:id/pdf` | Export as PDF |

### Public Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/profiles/:slug` | Get public profile |
| POST | `/api/public/profiles/:slug/verify` | Verify password |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user |
| PUT | `/api/user/me` | Update user info |
| PUT | `/api/user/password` | Change password |
| DELETE | `/api/user/me` | Delete account |
| POST | `/api/support` | Contact support |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teacher-types` | Get active teacher types |
| GET | `/api/years` | Get available years |

---

## 6. Business Rules

### 6.1 Profile Rules
1. Only DRAFT profiles can be edited
2. Published profiles can only be unpublished, then edited
3. PDF export only available for published profiles
4. Each teacher can have one profile per year per type
5. Dynamic sections are determined by teacher type

### 6.2 Authentication Rules
1. Phone number is unique (one account per phone)
2. Full name cannot be changed after registration
3. Phone number cannot be changed after registration
4. Password must be entered to delete account

### 6.3 Public Profile Rules
1. Public link only works for published profiles
2. Password protection is optional
3. Visitors can view and export PDF only

---

## 7. Design Requirements

### 7.1 Design Templates
Teachers can choose from 4 different PDF/profile design templates:
- Template 1: Classic
- Template 2: Modern
- Template 3: Professional
- Template 4: Elegant

### 7.2 Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- RTL layout throughout

### 7.3 Brand Colors
- Primary: Teal (`primary-*`)
- Secondary: Dark Blue (`secondary-*`)
- Success: Green (`success-*`)
- Warning/Error: Red (`warning-*`)

---

## 8. Implementation Priority

### Phase 1: Core Auth & Profiles (High Priority)
1. ✅ Landing page
2. ✅ Sign in / Sign up
3. 🔲 Dashboard
4. 🔲 Profile list
5. 🔲 Create profile
6. 🔲 Profile editor (basic)

### Phase 2: Profile Features (High Priority)
1. 🔲 Dynamic sections editor
2. 🔲 Profile preview
3. 🔲 Publish/unpublish
4. 🔲 Public profile view

### Phase 3: Export & Sharing (Medium Priority)
1. 🔲 PDF export
2. 🔲 Shareable links
3. 🔲 Password protection

### Phase 4: Settings & Polish (Medium Priority)
1. 🔲 Settings pages
2. 🔲 Change password
3. 🔲 Contact support
4. 🔲 Delete account
5. 🔲 Terms & Privacy pages

---

## 9. Success Metrics

- User registration rate
- Profile completion rate
- Profile publish rate
- PDF export count
- Public profile views
- Support ticket volume
