/**
 * useDeleteProfile hook - Delete a profile
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfile } from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId: number) => deleteProfile(profileId),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate profiles list to refresh the UI
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    deleteProfile: mutation.mutate,
    deleteProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
