/**
 * useDeleteImage hook - Delete an image
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../services/images.service";
import { PROFILE_IMAGES_QUERY_KEY } from "./useProfileImages";
import { SUBSECTION_IMAGES_QUERY_KEY } from "./useSubsectionImages";

interface DeleteImageParams {
  imageId: number;
  profileId?: number;
  subsectionId?: number;
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: DeleteImageParams) => deleteImage(params.imageId),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        // Invalidate relevant caches if provided
        if (variables.profileId) {
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
    deleteImage: mutation.mutate,
    deleteImageAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
