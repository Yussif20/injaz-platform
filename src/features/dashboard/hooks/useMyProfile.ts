"use client";

/**
 * useMyProfile hook - Fetch user profile data
 */

import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../services/me.service";

export const PROFILE_QUERY_KEY = ["myProfile"];

export function useMyProfile() {
  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await getMyProfile();
        if (!response.status) {
          console.warn("Profile fetch returned error:", response.message);
          return null;
        }
        return response.data;
      } catch (error) {
        console.warn("Profile fetch failed:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
