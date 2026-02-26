"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfileAcademicYear,
  updateProfileType,
} from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";

export function useUpdateProfileAcademicYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      profileId,
      academicYearId,
    }: {
      profileId: number;
      academicYearId: number;
    }) => updateProfileAcademicYear(profileId, { academicYearId }),
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    updateAcademicYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateProfileType() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      profileId,
      profileTypeId,
    }: {
      profileId: number;
      profileTypeId: number;
    }) => updateProfileType(profileId, { profileTypeId }),
    onSuccess: (response) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      }
    },
  });

  return {
    updateProfileTypeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
