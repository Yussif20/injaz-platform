/**
 * useUploadProfileImage hook - Upload profile image
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";
import { PROFILE_DETAILS_QUERY_KEY } from "./useProfileDetails";

interface UploadParams {
  profileId: number;
  file: File;
}

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ profileId, file }: UploadParams) => uploadProfileImage(profileId, file),
    onSuccess: (response, { profileId }) => {
      if (response.status) {
        // Invalidate related caches
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PROFILE_DETAILS_QUERY_KEY, profileId] });
      }
    },
  });

  return {
    uploadImage: mutation.mutate,
    uploadImageAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
