"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type { SystemParameterDto } from "../types/socials.types";
import type { SocialsFormData } from "../types/socials.types";
import { getSocialsData, saveSocialsData } from "../services/socials.service";

export function useSocialsData() {
  return useQuery({
    queryKey: queryKeys.systemParameters.all(),
    queryFn: getSocialsData,
  });
}

export function useSaveSocials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      existing,
    }: {
      formData: SocialsFormData;
      existing: SystemParameterDto[];
    }) => saveSocialsData(formData, existing),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.systemParameters.all(),
      });
    },
  });
}
