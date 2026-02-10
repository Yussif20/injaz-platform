/**
 * Auth service - Client-side API calls to Next.js API routes
 */

import { clientApi } from "@/shared/lib/api";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  VerifyOtpRequest,
  ResetPasswordRequest,
  VerificationPurpose,
} from "../types/auth.types";

// Response types
interface AuthResponse {
  status: boolean;
  message: string;
  data?: User;
  errors?: string[] | null;
}

interface SimpleResponse {
  status: boolean;
  message: string;
  errors?: string[] | null;
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await clientApi.post<AuthResponse>("/api/auth/login", credentials);
  return response.data;
}

/**
 * Send registration OTP
 */
export async function sendRegistrationOtp(phone: string): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>("/api/auth/send-otp", { phone });
  return response.data;
}

/**
 * Verify OTP
 */
export async function verifyOtp(
  phone: string,
  code: string,
  purpose: VerificationPurpose
): Promise<SimpleResponse> {
  const data: VerifyOtpRequest = { phone, code, purpose };
  const response = await clientApi.post<SimpleResponse>("/api/auth/verify-otp", data);
  return response.data;
}

/**
 * Register user (after OTP verification)
 */
export async function register(data: RegisterCredentials): Promise<AuthResponse> {
  const response = await clientApi.post<AuthResponse>("/api/auth/register", data);
  return response.data;
}

/**
 * Send password reset OTP
 */
export async function sendPasswordResetOtp(phone: string): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>("/api/auth/forgot-password", { phone });
  return response.data;
}

/**
 * Reset password with OTP
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>("/api/auth/reset-password", data);
  return response.data;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await clientApi.get<AuthResponse>("/api/auth/me");
  return response.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<SimpleResponse> {
  const response = await clientApi.post<SimpleResponse>("/api/auth/logout");
  return response.data;
}

/**
 * Refresh token
 */
export async function refreshToken(): Promise<AuthResponse> {
  const response = await clientApi.post<AuthResponse>("/api/auth/refresh");
  return response.data;
}
