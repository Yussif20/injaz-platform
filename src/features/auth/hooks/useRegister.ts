/**
 * useRegister hook - Multi-step registration mutations
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  sendRegistrationOtp,
  verifyOtp,
  register,
} from "../services/auth.service";
import { AUTH_QUERY_KEY } from "./useAuth";
import { ROUTES } from "@/config";
import { VerificationPurpose, type RegisterCredentials } from "../types/auth.types";

interface UseRegisterOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useRegister(options: UseRegisterOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // After registration, redirect to onboarding to fill basic info
  const { redirectTo = ROUTES.ONBOARDING } = options;

  // Step 1: Send OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await sendRegistrationOtp(phone);
      if (!response.status) {
        throw new Error(response.message || "فشل إرسال رمز التحقق");
      }
      return response;
    },
  });

  // Step 2: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const response = await verifyOtp(phone, code, VerificationPurpose.Registration);
      if (!response.status) {
        throw new Error(response.message || "رمز التحقق غير صحيح");
      }
      return response;
    },
  });

  // Step 3: Complete registration
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      const response = await register(data);
      if (!response.status) {
        throw new Error(response.message || "فشل إنشاء الحساب");
      }
      return response.data;
    },
    onSuccess: (user) => {
      // Update auth query cache
      queryClient.setQueryData(AUTH_QUERY_KEY, user);

      // Call custom success handler
      options.onSuccess?.();

      // Redirect to dashboard
      router.push(redirectTo);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });

  return {
    // Step 1: Send OTP
    sendOtp: sendOtpMutation.mutate,
    sendOtpAsync: sendOtpMutation.mutateAsync,
    isSendingOtp: sendOtpMutation.isPending,
    sendOtpError: sendOtpMutation.error,

    // Step 2: Verify OTP
    verifyOtp: verifyOtpMutation.mutate,
    verifyOtpAsync: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,
    verifyOtpError: verifyOtpMutation.error,

    // Step 3: Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Reset all mutations
    reset: () => {
      sendOtpMutation.reset();
      verifyOtpMutation.reset();
      registerMutation.reset();
    },
  };
}
