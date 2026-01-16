/**
 * useProfileTypes hook - Fetch available profile types
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableProfileTypes } from "../services/reference.service";

export const PROFILE_TYPES_QUERY_KEY = ["profileTypes"];

export function useProfileTypes() {
  const query = useQuery({
    queryKey: PROFILE_TYPES_QUERY_KEY,
    queryFn: async () => {
      const response = await getAvailableProfileTypes();
      if (!response.status) {
        console.warn("Profile types fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    profileTypes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
