/**
 * useDeleteCareerJob hook - Delete career job mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCareerJob } from "../services/career.service";
import { CAREER_JOBS_QUERY_KEY } from "./useCareerJobs";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

export function useDeleteCareerJob() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteCareerJob(id),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate career jobs query to refetch updated data
        queryClient.invalidateQueries({ queryKey: CAREER_JOBS_QUERY_KEY });
        // Also invalidate profile query since it includes career jobs
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }
    },
  });

  return {
    deleteCareerJob: mutation.mutate,
    deleteCareerJobAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
