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
    LOGIN: "/api/admin/login",
    ME: "/api/Me",
    REFRESH: "/api/admin/refresh",
  },

  // ── Controllers (used via proxyApi → /api/proxy/{path}) ──
  USERS: {
    BASE: "Users",
    BY_ID: (id: number) => `Users/${id}`,
  },
  ACADEMIC_YEARS: {
    BASE: "AcademicYears",
    BY_ID: (id: number) => `AcademicYears/${id}`,
  },
  RANKS: {
    BASE: "Ranks",
    BY_ID: (id: number) => `Ranks/${id}`,
  },
  PROFILE_TYPES: {
    BASE: "ProfileTypes",
    BY_ID: (id: number) => `ProfileTypes/${id}`,
  },
  SECTIONS: {
    BASE: "Sections",
    BY_ID: (id: number) => `Sections/${id}`,
  },
  SUBSECTIONS: {
    BASE: "Subsections",
    BY_ID: (id: number) => `Subsections/${id}`,
  },
  SUBSCRIPTIONS: {
    BASE: "Subscriptions",
    BY_ID: (id: number) => `Subscriptions/${id}`,
  },
  SUBSCRIPTION_DISCOUNTS: {
    BASE: "SubscriptionDiscounts",
    BY_ID: (id: number) => `SubscriptionDiscounts/${id}`,
  },
  SUBSCRIPTION_SETTINGS: {
    BASE: "SubscriptionSettings",
    BY_ID: (id: number) => `SubscriptionSettings/${id}`,
  },
  SYSTEM_PARAMETERS: {
    BASE: "SystemParameters",
    BY_ID: (id: number) => `SystemParameters/${id}`,
  },
} as const;
