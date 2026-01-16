/**
 * useCreateProfile hook - Create a new profile
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfile } from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";
import type { CreateProfileRequest } from "../types/profile.types";

export function useCreateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateProfileRequest) => createProfile(data),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate profiles cache
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    createProfile: mutation.mutate,
    createProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
