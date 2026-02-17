import { clientApi } from "@/shared/lib/api";
import type { AdminUser, LoginCredentials } from "../types/auth.types";

interface LoginResponse {
  user: AdminUser;
}

interface LoginErrorResponse {
  message: string;
  errors?: string[];
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const { data } = await clientApi.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  } catch (error: unknown) {
    // Extract error message from response
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: LoginErrorResponse };
      };
      const errorData = axiosError.response?.data;
      
      // Combine message and errors into a single error message
      let errorMessage = errorData?.message || "Login failed";
      if (errorData?.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors.join(", ");
      }
      
      throw new Error(errorMessage);
    }
    throw new Error("Login failed");
  }
}

export async function logout() {
  const { data } = await clientApi.post("/auth/logout");
  return data;
}
