"use client";

/**
 * useAddQualification hook - Add qualification mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQualification } from "../services/qualifications.service";
import type { CreateQualificationRequest } from "../types/me.types";
import { QUALIFICATIONS_QUERY_KEY } from "./useQualifications";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

export function useAddQualification() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateQualificationRequest) => addQualification(data),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate qualifications query to refetch updated data
        queryClient.invalidateQueries({ queryKey: QUALIFICATIONS_QUERY_KEY });
        // Also invalidate profile query since it includes qualifications
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }
    },
  });

  return {
    addQualification: mutation.mutate,
    addQualificationAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
