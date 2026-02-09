import { clientApi } from "@/shared/lib/api";
import type { AdminUser, LoginCredentials } from "../types/auth.types";

export async function login(credentials: LoginCredentials) {
  const { data } = await clientApi.post<{ user: AdminUser }>(
    "/auth/login",
    credentials,
  );
  return data;
}

export async function logout() {
  const { data } = await clientApi.post("/auth/logout");
  return data;
}
