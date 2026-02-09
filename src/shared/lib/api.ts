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

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/admin/login",
    ME: "/api/admin/me",
    REFRESH: "/api/admin/refresh",
  },
} as const;
