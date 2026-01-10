/**
 * useLogout hook - Logout mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../services/auth.service";
import { AUTH_QUERY_KEY } from "./useAuth";
import { ROUTES } from "@/config";

// TODO: Set to false when backend is ready
const DEV_SKIP_AUTH = true;

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { redirectTo = ROUTES.HOME } = options;

  const mutation = useMutation({
    mutationFn: async () => {
      // Skip actual logout in development mode
      if (DEV_SKIP_AUTH) {
        return { status: true, message: "تم تسجيل الخروج" };
      }
      const response = await logout();
      if (!response.status) {
        throw new Error(response.message || "فشل تسجيل الخروج");
      }
      return response;
    },
    onSuccess: () => {
      // Clear auth query cache
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });

      // Call custom success handler
      options.onSuccess?.();

      // Redirect to home
      router.push(redirectTo);
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
