/**
 * Mock Data for Development Bypass
 * TODO: BYPASS - Remove before production
 *
 * This file contains all mock data for the bypass user.
 * Delete this entire file before production deployment.
 */

import type { User, Gender } from "@/features/auth/types/auth.types";
import type { UserProfile, PersonalInfo, Qualification, CareerJob, ProfileCompleteness } from "@/features/dashboard/types/me.types";
import type { AcademicYear, ProfileType, Rank, Section, Subsection } from "@/features/profiles/types/reference.types";
import type { Profile, ProfileDetails, ProfileSection, ProfileSubsection } from "@/features/profiles/types/profile.types";

// ============================================
// Bypass User Data
// ============================================

export const BYPASS_PHONE = "00001234567";
export const BYPASS_PASSWORD = "123456";

export const BYPASS_USER: User = {
  userId: "bypass-user-001",
  phone: BYPASS_PHONE,
  fullName: "فاطمة أحمد",
  userName: "فاطمة أحمد",
  role: "Teacher",
  gender: 2 as Gender, // Female
  email: "fatima.test@example.com",
};

// ============================================
// Mock Personal Info
// ============================================

export const MOCK_PERSONAL_INFO: PersonalInfo = {
  rankId: 2,
  rankTitleMale: "معلم",
  rankTitleFemale: "معلمة",
  rankTitle: "معلمة",
  nationalId: "1234567890123",
  birthDate: "1990-05-15",
  address: "الرياض، المملكة العربية السعودية",
  phoneNumber: BYPASS_PHONE,
  email: "fatima.test@example.com",
};

// ============================================
// Mock Qualifications
// ============================================

export const MOCK_QUALIFICATIONS: Qualification[] = [
  {
    id: 1,
    degreeType: "بكالوريوس",
    title: "تربية - تخصص لغة عربية",
    grade: "ممتاز",
    graduationDate: "2012-06-15",
  },
  {
    id: 2,
    degreeType: "ماجستير",
    title: "مناهج وطرق تدريس",
    grade: "جيد جداً",
    graduationDate: "2018-01-20",
  },
];

// ============================================
// Mock Career Jobs
// ============================================

export const MOCK_CAREER_JOBS: CareerJob[] = [
  {
    id: 1,
    title: "معلمة لغة عربية",
    rank: "معلمة",
    school: "مدرسة الأمل الابتدائية",
    educationalStage: "المرحلة الابتدائية",
    startYear: 2012,
    endYear: 2018,
  },
  {
    id: 2,
    title: "معلمة لغة عربية",
    rank: "معلمة أولى",
    school: "مدرسة النور المتوسطة",
    educationalStage: "المرحلة المتوسطة",
    startYear: 2018,
    endYear: null, // Current job
  },
];

// ============================================
// Mock User Profile (Full)
// ============================================

export const MOCK_USER_PROFILE: UserProfile = {
  id: 1,
  phone: BYPASS_PHONE,
  fullName: "فاطمة أحمد",
  gender: 2, // Female
  role: "Teacher",
  imageUrl: null,
  personalInfo: MOCK_PERSONAL_INFO,
  qualifications: MOCK_QUALIFICATIONS,
  careerJobs: MOCK_CAREER_JOBS,
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: new Date().toISOString(),
  isActive: true,
  isSubscribed: true,
  currentSubscription: {
    id: 1,
    userId: 1,
    subscribedAt: "2024-01-01T00:00:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
    baseAmount: 200,
    discountPercentage: 0,
    discountAmount: 0,
    finalAmount: 200,
    paymentStatus: 1, // Completed
    paymentMethod: "Credit Card",
    paymentTransactionId: "TEST-TXN-001",
    isActive: true,
    daysRemaining: 365,
    appliedDiscount: null,
  },
};

// ============================================
// Mock Profile Completeness
// ============================================

export const MOCK_PROFILE_COMPLETENESS: ProfileCompleteness = {
  isComplete: false,
  isPersonalDataComplete: true,
  hasCareerJobs: true,
  hasQualifications: true,
  missingFields: ["profileImage"],
  message: "يرجى إضافة صورة الملف الشخصي لإكمال البيانات",
};

// ============================================
// Mock Academic Years
// ============================================

export const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: "ay-001",
    name: "1446-1447 هـ | 2024-2025 م",
    startDate: "2024-09-01",
    endDate: "2025-06-30",
    isActive: true,
    isClosed: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "ay-002",
    name: "1445-1446 هـ | 2023-2024 م",
    startDate: "2023-09-01",
    endDate: "2024-06-30",
    isActive: true,
    isClosed: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "ay-003",
    name: "1444-1445 هـ | 2022-2023 م",
    startDate: "2022-09-01",
    endDate: "2023-06-30",
    isActive: false,
    isClosed: true,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2023-07-01T00:00:00Z",
  },
  {
    id: "ay-004",
    name: "1443-1444 هـ | 2021-2022 م",
    startDate: "2021-09-01",
    endDate: "2022-06-30",
    isActive: false,
    isClosed: true,
    createdAt: "2021-01-01T00:00:00Z",
    updatedAt: "2022-07-01T00:00:00Z",
  },
  {
    id: "ay-005",
    name: "1442-1443 هـ | 2020-2021 م",
    startDate: "2020-09-01",
    endDate: "2021-06-30",
    isActive: false,
    isClosed: true,
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2021-07-01T00:00:00Z",
  },
];

// ============================================
// Mock Profile Types
// ============================================

export const MOCK_PROFILE_TYPES: ProfileType[] = [
  {
    id: "pt-001",
    nameMale: "ملف إنجاز المعلم",
    nameFemale: "ملف إنجاز المعلمة",
    description: "ملف شامل لتوثيق إنجازات المعلم/ة خلال العام الدراسي",
    iconUrl: null,
    isActive: true,
    forMale: true,
    forFemale: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "pt-002",
    nameMale: "ملف النمو المهني",
    nameFemale: "ملف النمو المهني",
    description: "ملف خاص بتوثيق التطور المهني والدورات التدريبية",
    iconUrl: null,
    isActive: true,
    forMale: true,
    forFemale: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "pt-003",
    nameMale: "ملف الأداء الوظيفي",
    nameFemale: "ملف الأداء الوظيفي",
    description: "ملف لتوثيق الأداء الوظيفي والتقييمات",
    iconUrl: null,
    isActive: true,
    forMale: true,
    forFemale: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ============================================
// Mock Sections for Profile Type
// ============================================

export const MOCK_SECTIONS: Section[] = [
  {
    id: "sec-001",
    profileTypeId: "pt-001",
    name: "البيانات الشخصية والوظيفية",
    description: "معلومات عن المعلم/ة والمؤهلات والخبرات",
    order: 1,
    weight: 15,
    isRequired: true,
    subsections: [
      {
        id: "sub-001",
        sectionId: "sec-001",
        name: "السيرة الذاتية",
        description: "نسخة من السيرة الذاتية المحدثة",
        order: 1,
        minImages: 1,
        maxImages: 3,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-002",
        sectionId: "sec-001",
        name: "الشهادات العلمية",
        description: "صور من الشهادات والمؤهلات العلمية",
        order: 2,
        minImages: 1,
        maxImages: 5,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sec-002",
    profileTypeId: "pt-001",
    name: "التخطيط للتدريس",
    description: "خطط الدروس والتحضير اليومي والأسبوعي",
    order: 2,
    weight: 20,
    isRequired: true,
    subsections: [
      {
        id: "sub-003",
        sectionId: "sec-002",
        name: "الخطة السنوية",
        description: "الخطة السنوية للمادة",
        order: 1,
        minImages: 1,
        maxImages: 5,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-004",
        sectionId: "sec-002",
        name: "تحضير الدروس",
        description: "نماذج من تحضير الدروس اليومية",
        order: 2,
        minImages: 3,
        maxImages: 10,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-005",
        sectionId: "sec-002",
        name: "الوسائل التعليمية",
        description: "صور الوسائل التعليمية المستخدمة",
        order: 3,
        minImages: 2,
        maxImages: 8,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sec-003",
    profileTypeId: "pt-001",
    name: "تنفيذ التدريس",
    description: "أدلة على تطبيق استراتيجيات التدريس",
    order: 3,
    weight: 25,
    isRequired: true,
    subsections: [
      {
        id: "sub-006",
        sectionId: "sec-003",
        name: "أنشطة الصف",
        description: "صور من الأنشطة الصفية",
        order: 1,
        minImages: 3,
        maxImages: 15,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-007",
        sectionId: "sec-003",
        name: "أعمال الطالبات",
        description: "نماذج من أعمال الطالبات",
        order: 2,
        minImages: 3,
        maxImages: 10,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sec-004",
    profileTypeId: "pt-001",
    name: "التقويم والتقييم",
    description: "أدوات التقويم والاختبارات",
    order: 4,
    weight: 20,
    isRequired: true,
    subsections: [
      {
        id: "sub-008",
        sectionId: "sec-004",
        name: "الاختبارات",
        description: "نماذج من الاختبارات الشهرية والفصلية",
        order: 1,
        minImages: 2,
        maxImages: 8,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-009",
        sectionId: "sec-004",
        name: "التقويم المستمر",
        description: "أدوات التقويم المستمر والملاحظات",
        order: 2,
        minImages: 2,
        maxImages: 6,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sec-005",
    profileTypeId: "pt-001",
    name: "النمو المهني",
    description: "الدورات التدريبية والشهادات",
    order: 5,
    weight: 20,
    isRequired: false,
    subsections: [
      {
        id: "sub-010",
        sectionId: "sec-005",
        name: "الدورات التدريبية",
        description: "شهادات الدورات التدريبية",
        order: 1,
        minImages: 0,
        maxImages: 10,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-011",
        sectionId: "sec-005",
        name: "الورش والمؤتمرات",
        description: "شهادات حضور الورش والمؤتمرات",
        order: 2,
        minImages: 0,
        maxImages: 8,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "sub-012",
        sectionId: "sec-005",
        name: "شهادات الشكر والتقدير",
        description: "شهادات الشكر والتقدير المستلمة",
        order: 3,
        minImages: 0,
        maxImages: 10,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ============================================
// Mock Ranks
// ============================================

export const MOCK_RANKS: Rank[] = [
  {
    id: "rank-001",
    nameMale: "معلم ممارس",
    nameFemale: "معلمة ممارسة",
    order: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rank-002",
    nameMale: "معلم متقدم",
    nameFemale: "معلمة متقدمة",
    order: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rank-003",
    nameMale: "معلم خبير",
    nameFemale: "معلمة خبيرة",
    order: 3,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rank-004",
    nameMale: "معلم أول",
    nameFemale: "معلمة أولى",
    order: 4,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rank-005",
    nameMale: "مشرف تربوي",
    nameFemale: "مشرفة تربوية",
    order: 5,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rank-006",
    nameMale: "قائد مدرسة",
    nameFemale: "قائدة مدرسة",
    order: 6,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ============================================
// Mock Sample Profile
// ============================================

export const MOCK_SAMPLE_PROFILE: Profile = {
  id: 1,
  userId: 1,
  userFullName: "فاطمة أحمد",
  profileTypeId: 1,
  profileTypeName: "ملف إنجاز المعلمة",
  academicYearId: 1,
  academicYearName: "1446-1447 هـ | 2024-2025 م",
  templateId: 1,
  imageUrl: null,
  useDefaultImage: true,
  personalInfo: MOCK_PERSONAL_INFO,
  qualifications: MOCK_QUALIFICATIONS,
  careerJobs: MOCK_CAREER_JOBS,
  status: "Draft",
  isPasswordProtected: false,
  publishedAt: null,
  createdAt: "2024-09-01T00:00:00Z",
  modifiedAt: new Date().toISOString(),
};

// ============================================
// Mock Profile Sections (for ProfileDetails)
// ============================================

export const MOCK_PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: 1,
    title: "البيانات الشخصية والوظيفية",
    weightPercent: 15,
    displayOrder: 1,
    subsections: [
      {
        id: 1,
        title: "السيرة الذاتية",
        weightPercent: 50,
        displayOrder: 1,
        images: [],
      },
      {
        id: 2,
        title: "الشهادات العلمية",
        weightPercent: 50,
        displayOrder: 2,
        images: [],
      },
    ],
  },
  {
    id: 2,
    title: "التخطيط للتدريس",
    weightPercent: 20,
    displayOrder: 2,
    subsections: [
      {
        id: 3,
        title: "الخطة السنوية",
        weightPercent: 30,
        displayOrder: 1,
        images: [],
      },
      {
        id: 4,
        title: "تحضير الدروس",
        weightPercent: 40,
        displayOrder: 2,
        images: [],
      },
      {
        id: 5,
        title: "الوسائل التعليمية",
        weightPercent: 30,
        displayOrder: 3,
        images: [],
      },
    ],
  },
  {
    id: 3,
    title: "تنفيذ التدريس",
    weightPercent: 25,
    displayOrder: 3,
    subsections: [
      {
        id: 6,
        title: "أنشطة الصف",
        weightPercent: 50,
        displayOrder: 1,
        images: [],
      },
      {
        id: 7,
        title: "أعمال الطالبات",
        weightPercent: 50,
        displayOrder: 2,
        images: [],
      },
    ],
  },
  {
    id: 4,
    title: "التقويم والتقييم",
    weightPercent: 20,
    displayOrder: 4,
    subsections: [
      {
        id: 8,
        title: "الاختبارات",
        weightPercent: 50,
        displayOrder: 1,
        images: [],
      },
      {
        id: 9,
        title: "التقويم المستمر",
        weightPercent: 50,
        displayOrder: 2,
        images: [],
      },
    ],
  },
  {
    id: 5,
    title: "النمو المهني",
    weightPercent: 20,
    displayOrder: 5,
    subsections: [
      {
        id: 10,
        title: "الدورات التدريبية",
        weightPercent: 34,
        displayOrder: 1,
        images: [],
      },
      {
        id: 11,
        title: "الورش والمؤتمرات",
        weightPercent: 33,
        displayOrder: 2,
        images: [],
      },
      {
        id: 12,
        title: "شهادات الشكر والتقدير",
        weightPercent: 33,
        displayOrder: 3,
        images: [],
      },
    ],
  },
];

// ============================================
// Mock Profile Details
// ============================================

export const MOCK_PROFILE_DETAILS: ProfileDetails = {
  id: 1,
  userName: "فاطمة أحمد",
  profileTypeName: "ملف إنجاز المعلمة",
  academicYearName: "1446-1447 هـ | 2024-2025 م",
  templateId: 1,
  personalInfo: MOCK_PERSONAL_INFO,
  qualifications: MOCK_QUALIFICATIONS,
  careerJobs: MOCK_CAREER_JOBS,
  sections: MOCK_PROFILE_SECTIONS,
  status: "Draft",
  publishedAt: null,
};

// ============================================
// Helper function to generate unique IDs
// ============================================

let idCounter = 1000;
export function generateMockId(): number {
  return ++idCounter;
}

export function generateMockStringId(): string {
  return `mock-${++idCounter}-${Date.now()}`;
}
