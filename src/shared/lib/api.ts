import axios from "axios";
import { BACKEND_API_URL } from "@/config";

export const serverApi = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const clientApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/** Client-side proxy — requests go to /api/proxy/* which forwards to backend */
export const proxyApi = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_ENDPOINTS = {
  // ── Auth (server-side, called from /api/auth/* routes) ──
  AUTH: {
    LOGIN: "/api/Auth/login",
    ME: "/api/Me",
    REFRESH: "/api/Auth/refresh-token",
    CHANGE_PASSWORD: "/api/Auth/change-password",
  },

  // ── Controllers (used via proxyApi → /api/proxy/{path}) ──
  USERS: {
    BASE: "Users",
    BY_ID: (id: number) => `Users/${id}`,
    BY_PHONE: "Users/by-phone",
    BY_ROLE: (role: string) => `Users/by-role/${role}`,
    FILTERED: "Users/filtered",
  },
  ACADEMIC_YEARS: {
    BASE: "AcademicYears",
    BY_ID: (id: number) => `AcademicYears/${id}`,
    ACTIVE: "AcademicYears/active",
    ACTIVATE: (id: number) => `AcademicYears/${id}/activate`,
    DEACTIVATE: (id: number) => `AcademicYears/${id}/deactivate`,
    CLOSE: (id: number) => `AcademicYears/${id}/close`,
  },
  RANKS: {
    BASE: "Ranks",
    BY_ID: (id: number) => `Ranks/${id}`,
    FILTERED: "Ranks/filtered",
  },
  PROFILES: {
    BASE: "Profiles",
    BY_ID: (id: number) => `Profiles/${id}`,
    DETAILS: (id: number) => `Profiles/${id}/details`,
    FILTERED: "Profiles/filtered",
  },
  PROFILE_TYPES: {
    BASE: "ProfileTypes",
    BY_ID: (id: number) => `ProfileTypes/${id}`,
    ACTIVE: "ProfileTypes/active",
    AVAILABLE: "ProfileTypes/available",
    WITH_SECTIONS: (id: number) => `ProfileTypes/${id}/with-sections`,
    ACTIVATE: (id: number) => `ProfileTypes/${id}/activate`,
    DEACTIVATE: (id: number) => `ProfileTypes/${id}/deactivate`,
    DUPLICATE: (id: number) => `ProfileTypes/${id}/duplicate`,
    FILTERED: "ProfileTypes/filtered",
  },
  SECTIONS: {
    BASE: "Sections",
    BY_ID: (id: number) => `Sections/${id}`,
    BY_PROFILE_TYPE: (id: number) => `Sections/by-profile-type/${id}`,
    WITH_SUBSECTIONS: (id: number) => `Sections/${id}/with-subsections`,
    REORDER: (profileTypeId: number) => `Sections/reorder/${profileTypeId}`,
  },
  SUBSECTIONS: {
    BASE: "Subsections",
    BY_ID: (id: number) => `Subsections/${id}`,
    BY_SECTION: (id: number) => `Subsections/by-section/${id}`,
    REORDER: (sectionId: number) => `Subsections/reorder/${sectionId}`,
  },
  IMAGES: {
    UPLOAD: "Images/upload",
    BY_PROFILE: (profileId: number) => `Images/profile/${profileId}`,
    BY_SUBSECTION: (subsectionId: number) =>
      `Images/subsection/${subsectionId}`,
    BY_ID: (id: number) => `Images/${id}`,
    REORDER: (subsectionId: number) => `Images/reorder/${subsectionId}`,
  },
  SUBSCRIPTIONS: {
    BASE: "Subscriptions",
    BY_ID: (id: number) => `Subscriptions/${id}`,
    FILTERED: "Subscriptions/filtered",
    INFO: "Subscriptions/info",
    MY_SUBSCRIPTION: "Subscriptions/my-subscription",
    MY_HISTORY: "Subscriptions/my-history",
    SUBSCRIBE: "Subscriptions/subscribe",
  },
  SUBSCRIPTION_DISCOUNTS: {
    BASE: "subscription-discounts",
    BY_ID: (id: number) => `subscription-discounts/${id}`,
    ACTIVE: "subscription-discounts/active",
    TOGGLE: (id: number) => `subscription-discounts/${id}/toggle`,
  },
  SUBSCRIPTION_SETTINGS: {
    BASE: "subscription-settings",
    TOGGLE: "subscription-settings/toggle",
    ACTIVE_DISCOUNT: (id: number) =>
      `subscription-settings/active-discount/${id}`,
  },
  SYSTEM_PARAMETERS: {
    BASE: "SystemParameters",
    BY_ID: (id: number) => `SystemParameters/${id}`,
    ACTIVE: "SystemParameters/active",
    BY_KEY: (key: string) => `SystemParameters/key/${key}`,
    BY_CATEGORY: (category: string) => `SystemParameters/category/${category}`,
    FILTERED: "SystemParameters/filtered",
    TERMS_AND_CONDITIONS: "SystemParameters/terms-and-conditions",
  },
  SHARE_LINKS: {
    BASE: "ShareLinks",
    BY_PROFILE: (profileId: number) => `ShareLinks/profile/${profileId}`,
    BY_ID: (id: number) => `ShareLinks/${id}`,
  },
  REVIEWS: {
    BASE: "Reviews",
    BY_ID: (id: number) => `Reviews/${id}`,
    ACTIVE: "Reviews/active",
    PHOTO: (id: number) => `Reviews/${id}/photo`,
    PERMANENT_DELETE: (id: number) => `Reviews/${id}/permanent`,
  },
} as const;
