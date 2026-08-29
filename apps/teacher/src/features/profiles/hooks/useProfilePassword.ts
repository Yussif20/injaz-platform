/**
 * useProfilePassword hook - Set/remove profile password
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setProfilePassword,
  removeProfilePassword,
  verifyProfilePassword,
} from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";
import type { SetPasswordRequest } from "../types/profile.types";

interface SetPasswordParams {
  profileId: number;
  data: SetPasswordRequest;
}

interface VerifyPasswordParams {
  profileId: number;
  password: string;
}

export function useSetProfilePassword() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ profileId, data }: SetPasswordParams) => setProfilePassword(profileId, data),
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    setPassword: mutation.mutate,
    setPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export function useRemoveProfilePassword() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId: number) => removeProfilePassword(profileId),
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    removePassword: mutation.mutate,
    removePasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export function useVerifyProfilePassword() {
  const mutation = useMutation({
    mutationFn: ({ profileId, password }: VerifyPasswordParams) =>
      verifyProfilePassword(profileId, password),
  });

  return {
    verifyPassword: mutation.mutate,
    verifyPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
