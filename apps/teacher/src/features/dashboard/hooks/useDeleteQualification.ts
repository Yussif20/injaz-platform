"use client";

/**
 * useDeleteQualification hook - Delete qualification mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQualification } from "../services/qualifications.service";
import { QUALIFICATIONS_QUERY_KEY } from "./useQualifications";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

export function useDeleteQualification() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteQualification(id),
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
    deleteQualification: mutation.mutate,
    deleteQualificationAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
