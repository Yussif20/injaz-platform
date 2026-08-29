/**
 * useReorderImages hook - Reorder images within a subsection
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderImages } from "../services/images.service";
import { PROFILE_IMAGES_QUERY_KEY } from "./useProfileImages";
import { SUBSECTION_IMAGES_QUERY_KEY } from "./useSubsectionImages";

interface ReorderImagesParams {
  subsectionId: number;
  imageOrders: Record<number, number>;
  profileId?: number;
}

export function useReorderImages() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: ReorderImagesParams) =>
      reorderImages(params.subsectionId, params.imageOrders),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        // Invalidate subsection images cache
        queryClient.invalidateQueries({
          queryKey: [SUBSECTION_IMAGES_QUERY_KEY, variables.subsectionId],
        });
        // Also invalidate profile images if profileId provided
        if (variables.profileId) {
          queryClient.invalidateQueries({
            queryKey: [PROFILE_IMAGES_QUERY_KEY, variables.profileId],
          });
        }
      }
    },
  });

  return {
    reorderImages: mutation.mutate,
    reorderImagesAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
