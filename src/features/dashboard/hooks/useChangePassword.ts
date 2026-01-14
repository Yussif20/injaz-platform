/**
 * useChangePassword hook - Change password mutation
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/me.service";
import type { ChangePasswordRequest } from "../types/me.types";

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });

  return {
    changePassword: mutation.mutate,
    changePasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
