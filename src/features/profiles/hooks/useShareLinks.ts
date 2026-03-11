"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileShareLinks } from "../services/share-links.service";

export function useProfileShareLinks(profileId: number | null) {
  return useQuery({
    queryKey: ["shareLinks", "byProfile", profileId],
    queryFn: () => getProfileShareLinks(profileId!),
    enabled: profileId !== null,
  });
}
