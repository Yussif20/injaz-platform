"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type { ProfileFilterParams } from "../types/profiles.types";
import { getFilteredProfiles } from "../services/profiles.service";

export function useFilteredProfiles(params?: ProfileFilterParams) {
  return useQuery({
    queryKey: queryKeys.profiles.filtered(params),
    queryFn: () => getFilteredProfiles(params),
  });
}
