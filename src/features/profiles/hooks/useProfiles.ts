"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type { ProfileFilterParams } from "../types/profiles.types";
import { deleteProfile, getFilteredProfiles } from "../services/profiles.service";

export function useFilteredProfiles(params?: ProfileFilterParams) {
  return useQuery({
    queryKey: queryKeys.profiles.filtered(params),
    queryFn: () => getFilteredProfiles(params),
    placeholderData: keepPreviousData,
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProfile(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.filtered() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(id) });
    },
  });
}
