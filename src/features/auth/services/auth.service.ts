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
  // TODO: Remove this bypass before production
  // Test bypass: use phone starting with "0000" to skip real OTP sending
  if (phone.startsWith("0000")) {
    return { status: true, message: "Test bypass - OTP sent (use 123456)" };
  }

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
  // TODO: Remove this bypass before production
  // Test bypass: use code "123456" to skip real OTP verification
  if (code === "123456") {
    return { status: true, message: "Test bypass - OTP verified" };
  }

  const data: VerifyOtpRequest = { phone, code, purpose };
  const response = await clientApi.post<SimpleResponse>("/api/auth/verify-otp", data);
  return response.data;
}

/**
 * Register user (after OTP verification)
 */
export async function register(data: RegisterCredentials): Promise<AuthResponse> {
  // TODO: Remove this bypass before production
  // Test bypass: use phone starting with "0000" to skip real registration
  if (data.phone.startsWith("0000")) {
    return {
      status: true,
      message: "Test bypass - Registration successful",
      data: {
        userId: "test-user-id",
        phone: data.phone,
        fullName: data.fullName,
        userName: data.fullName,
        role: "Teacher",
        gender: data.gender,
        email: data.email,
      },
    };
  }

  const response = await clientApi.post<AuthResponse>("/api/auth/register", data);
  return response.data;
}

/**
 * Send password reset OTP
 */
export async function sendPasswordResetOtp(phone: string): Promise<SimpleResponse> {
  // TODO: Remove this bypass before production
  // Test bypass: use phone starting with "0000" to skip real OTP sending
  if (phone.startsWith("0000")) {
    return { status: true, message: "Test bypass - OTP sent (use 123456)" };
  }

  const response = await clientApi.post<SimpleResponse>("/api/auth/forgot-password", { phone });
  return response.data;
}

/**
 * Reset password with OTP
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<SimpleResponse> {
  // TODO: Remove this bypass before production
  // Test bypass: use phone starting with "0000" to skip real password reset
  if (data.phone.startsWith("0000")) {
    return { status: true, message: "Test bypass - Password reset successful" };
  }

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
