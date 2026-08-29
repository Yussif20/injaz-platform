"use client";

/**
 * useQualifications hook - Fetch qualifications data
 */

import { useQuery } from "@tanstack/react-query";
import { getQualifications } from "../services/qualifications.service";

export const QUALIFICATIONS_QUERY_KEY = ["qualifications"];

export function useQualifications() {
  const query = useQuery({
    queryKey: QUALIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await getQualifications();
      if (!response.status) {
        console.warn("Qualifications fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    qualifications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
