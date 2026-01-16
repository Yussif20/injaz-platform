/**
 * useMyProfiles hook - Fetch all user profiles
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfiles } from "../services/profiles.service";

export const MY_PROFILES_QUERY_KEY = ["myProfiles"];

export function useMyProfiles() {
  const query = useQuery({
    queryKey: MY_PROFILES_QUERY_KEY,
    queryFn: async () => {
      const response = await getMyProfiles();
      if (!response.status) {
        console.warn("Profiles fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    profiles: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
