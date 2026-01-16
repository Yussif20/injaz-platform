/**
 * useProfileDetails hook - Fetch profile details
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileDetails } from "../services/profiles.service";

export const PROFILE_DETAILS_QUERY_KEY = ["profileDetails"];

export function useProfileDetails(profileId: number | null) {
  const query = useQuery({
    queryKey: [...PROFILE_DETAILS_QUERY_KEY, profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const response = await getProfileDetails(profileId);
      if (!response.status) {
        console.warn("Profile details fetch returned error:", response.message);
        return null;
      }
      return response.data ?? null;
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    profileDetails: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
