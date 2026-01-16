/**
 * useAddCareerJob hook - Add career job mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCareerJob } from "../services/career.service";
import type { CreateCareerJobRequest } from "../types/me.types";
import { CAREER_JOBS_QUERY_KEY } from "./useCareerJobs";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

export function useAddCareerJob() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCareerJobRequest) => addCareerJob(data),
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
    addCareerJob: mutation.mutate,
    addCareerJobAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
