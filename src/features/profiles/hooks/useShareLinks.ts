/**
 * useShareLinks hook - Fetch share links for a profile
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileShareLinks } from "../services/share-links.service";

export const SHARE_LINKS_QUERY_KEY = "shareLinks";

export function useShareLinks(profileId: number | null) {
  const query = useQuery({
    queryKey: [SHARE_LINKS_QUERY_KEY, profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const response = await getProfileShareLinks(profileId);
      if (response.status !== "Success") {
        console.warn("Share links fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  return {
    shareLinks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
