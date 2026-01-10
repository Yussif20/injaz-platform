/**
 * Authentication types
 */

// Gender enum matching backend (male: 1, female: 0)
export enum Gender {
  Male = 1,
  Female = 0,
}

// Verification purpose enum
export enum VerificationPurpose {
  Registration = 0,
  PasswordReset = 1,
}

// User data returned from API
export interface User {
  userId: string;
  phone: string;
  fullName: string;
  userName: string;
  role: string;
  // Optional fields for account settings
  gender?: Gender;
  email?: string;
  profileImage?: string;
}

// API response wrapper (backend returns status as string: "Success" | "Failure")
export interface ApiResponse<T> {
  status: string | boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

// Helper to check if API response is successful
export function isApiSuccess(status: string | boolean): boolean {
  if (typeof status === "boolean") return status;
  return status === "Success" || status === "success";
}

// Auth response with tokens
export interface AuthData {
  userId: string;
  phone: string;
  fullName: string;
  userName: string;
  role: string;
  token: string;
  refreshToken: string;
}

// Login credentials
export interface LoginCredentials {
  phone: string;
  password: string;
}

// Registration data (step 3 - complete form)
export interface RegisterCredentials {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  email: string;
  verificationCode: string;
}

// Send OTP request
export interface SendOtpRequest {
  phone: string;
}

// Verify OTP request
export interface VerifyOtpRequest {
  phone: string;
  code: string;
  purpose: VerificationPurpose;
}

// Reset password request
export interface ResetPasswordRequest {
  phone: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Change password request (authenticated)
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth state for context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Registration step tracking
export type RegistrationStep = "phone" | "otp" | "details";

// Registration form data (client-side)
export interface RegistrationFormData {
  phone: string;
  otpCode: string;
  fullName: string;
  gender: Gender | "";
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
