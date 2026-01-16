/**
 * useDeleteAccount hook - Delete account mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../services/me.service";
import { ROUTES } from "@/config";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (response) => {
      if (response.status) {
        // Clear all cached queries
        queryClient.clear();
        // Redirect to sign in page
        router.push(ROUTES.SIGN_IN);
      }
    },
  });

  return {
    deleteAccount: mutation.mutate,
    deleteAccountAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
