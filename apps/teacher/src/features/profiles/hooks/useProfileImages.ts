/**
 * useProfileImages hook - Fetch all images for a profile
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileImages } from "../services/images.service";

export const PROFILE_IMAGES_QUERY_KEY = "profileImages";

export function useProfileImages(profileId: number | null) {
  const query = useQuery({
    queryKey: [PROFILE_IMAGES_QUERY_KEY, profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const response = await getProfileImages(profileId);
      if (response.status !== "Success") {
        console.warn("Profile images fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    enabled: !!profileId,
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
