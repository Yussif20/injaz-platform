/**
 * useSubsectionImages hook - Fetch images for a specific subsection
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubsectionImages } from "../services/images.service";

export const SUBSECTION_IMAGES_QUERY_KEY = "subsectionImages";

export function useSubsectionImages(subsectionId: number | null) {
  const query = useQuery({
    queryKey: [SUBSECTION_IMAGES_QUERY_KEY, subsectionId],
    queryFn: async () => {
      if (!subsectionId) return [];
      const response = await getSubsectionImages(subsectionId);
      if (response.status !== "Success") {
        console.warn("Subsection images fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    enabled: !!subsectionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  return {
    images: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
