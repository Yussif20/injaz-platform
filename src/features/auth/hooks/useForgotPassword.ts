/**
 * useForgotPassword hook - Password reset mutations
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sendPasswordResetOtp, resetPassword } from "../services/auth.service";
import { ROUTES } from "@/config";
import type { ResetPasswordRequest } from "../types/auth.types";
import { getBackendErrorMessage } from "../utils/getRegisterErrorMessage";

interface UseForgotPasswordOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useForgotPassword(options: UseForgotPasswordOptions = {}) {
  const router = useRouter();
  const { redirectTo = ROUTES.SIGN_IN } = options;

  // Step 1: Send OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      try {
        const response = await sendPasswordResetOtp(phone);
        if (!response.status) {
          throw new Error(response.message || "فشل إرسال رمز التحقق");
        }
        return response;
      } catch (err) {
        throw new Error(getBackendErrorMessage(err, "فشل إرسال رمز التحقق"));
      }
    },
  });

  // Step 2: Reset password
  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      try {
        const response = await resetPassword(data);
        if (!response.status) {
          throw new Error(response.message || "فشل تغيير كلمة المرور");
        }
        return response;
      } catch (err) {
        throw new Error(getBackendErrorMessage(err, "فشل تغيير كلمة المرور"));
      }
    },
    onSuccess: () => {
      options.onSuccess?.();
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

    // Step 2: Reset password
    resetPassword: resetMutation.mutate,
    resetPasswordAsync: resetMutation.mutateAsync,
    isResetting: resetMutation.isPending,
    resetError: resetMutation.error,

    // Reset all mutations
    reset: () => {
      sendOtpMutation.reset();
      resetMutation.reset();
    },
  };
}
