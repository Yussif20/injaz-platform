/**
 * useLogin hook - Login mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../services/auth.service";
import { AUTH_QUERY_KEY } from "./useAuth";
import { ROUTES } from "@/config";
import type { LoginCredentials } from "../types/auth.types";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useLogin(options: UseLoginOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { redirectTo = ROUTES.DASHBOARD } = options;

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await login(credentials);
        if (!response.status) {
          throw new Error(response.message || "فشل تسجيل الدخول");
        }
        return response.data;
      } catch (error: unknown) {
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          throw new Error(
            axiosError.response?.data?.message || "فشل تسجيل الدخول",
          );
        }
        throw error;
      }
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
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
