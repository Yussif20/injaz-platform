/**
 * useUpdateImage hook - Update image metadata or replace image file
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateImage } from "../services/images.service";
import { PROFILE_IMAGES_QUERY_KEY } from "./useProfileImages";
import { SUBSECTION_IMAGES_QUERY_KEY } from "./useSubsectionImages";
import { PROFILE_DETAILS_QUERY_KEY } from "./useProfileDetails";

interface UpdateImageParams {
  imageId: number;
  profileId?: number;
  subsectionId?: number;
  data?: { description?: string; displayOrder?: number };
  file?: File;
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: UpdateImageParams) =>
      updateImage(params.imageId, params.data, params.file),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        // Invalidate relevant caches if provided
        if (variables.profileId) {
          queryClient.invalidateQueries({
            queryKey: [...PROFILE_DETAILS_QUERY_KEY, variables.profileId],
          });
          queryClient.invalidateQueries({
            queryKey: [PROFILE_IMAGES_QUERY_KEY, variables.profileId],
          });
        }
        if (variables.subsectionId) {
          queryClient.invalidateQueries({
            queryKey: [SUBSECTION_IMAGES_QUERY_KEY, variables.subsectionId],
          });
        }
      }
    },
  });

  return {
    updateImage: mutation.mutate,
    updateImageAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
