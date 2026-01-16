/**
 * useRanks hook - Fetch all ranks
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getRanks } from "../services/reference.service";

export const RANKS_QUERY_KEY = ["ranks"];

export function useRanks() {
  const query = useQuery({
    queryKey: RANKS_QUERY_KEY,
    queryFn: async () => {
      const response = await getRanks();
      if (!response.status) {
        console.warn("Ranks fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    ranks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
