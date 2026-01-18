"use client";

/**
 * useUpdateQualification hook - Update qualification mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQualification } from "../services/qualifications.service";
import type { UpdateQualificationRequest } from "../types/me.types";
import { QUALIFICATIONS_QUERY_KEY } from "./useQualifications";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

interface UpdateQualificationParams {
  id: number;
  data: UpdateQualificationRequest;
}

export function useUpdateQualification() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: UpdateQualificationParams) => updateQualification(id, data),
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
    updateQualification: mutation.mutate,
    updateQualificationAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
