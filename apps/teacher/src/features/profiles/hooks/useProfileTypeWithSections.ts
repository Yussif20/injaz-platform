/**
 * useProfileTypeWithSections hook - Fetch profile type with sections
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileTypeWithSections } from "../services/reference.service";

export const PROFILE_TYPE_WITH_SECTIONS_QUERY_KEY = ["profileTypeWithSections"];

export function useProfileTypeWithSections(profileTypeId: number | null) {
  const query = useQuery({
    queryKey: [...PROFILE_TYPE_WITH_SECTIONS_QUERY_KEY, profileTypeId],
    queryFn: async () => {
      if (!profileTypeId) return null;
      const response = await getProfileTypeWithSections(profileTypeId);
      if (!response.status) {
        console.warn("Profile type fetch returned error:", response.message);
        return null;
      }
      return response.data ?? null;
    },
    enabled: !!profileTypeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    profileType: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
