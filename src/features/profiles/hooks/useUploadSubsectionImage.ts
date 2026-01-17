/**
 * useUploadSubsectionImage hook - Upload image to a subsection
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../services/images.service";
import { PROFILE_IMAGES_QUERY_KEY } from "./useProfileImages";
import { SUBSECTION_IMAGES_QUERY_KEY } from "./useSubsectionImages";

interface UploadImageParams {
  profileId: number;
  subsectionId: number;
  file: File;
  description?: string;
  displayOrder?: number;
}

export function useUploadSubsectionImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: UploadImageParams) =>
      uploadImage(
        params.profileId,
        params.subsectionId,
        params.file,
        params.description,
        params.displayOrder
      ),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        // Invalidate both profile and subsection images cache
        queryClient.invalidateQueries({
          queryKey: [PROFILE_IMAGES_QUERY_KEY, variables.profileId],
        });
        queryClient.invalidateQueries({
          queryKey: [SUBSECTION_IMAGES_QUERY_KEY, variables.subsectionId],
        });
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
