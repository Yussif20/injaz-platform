/**
 * useLogout hook - Logout mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/auth.service";
import { ROUTES } from "@/config";

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const queryClient = useQueryClient();
  const { redirectTo = ROUTES.HOME } = options;

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await logout();
      if (!response.status) {
        throw new Error(response.message || "فشل تسجيل الخروج");
      }
      return response;
    },
    onSuccess: () => {
      // Clear ALL query cache to prevent stale data leaking into next session
      queryClient.clear();

      // Call custom success handler
      options.onSuccess?.();

      // Hard navigation to destroy all in-memory state (React Query, context, etc.)
      window.location.href = redirectTo;
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
