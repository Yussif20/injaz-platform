"use client";

/**
 * useUpdateCareerJob hook - Update career job mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCareerJob } from "../services/career.service";
import type { UpdateCareerJobRequest } from "../types/me.types";
import { CAREER_JOBS_QUERY_KEY } from "./useCareerJobs";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

interface UpdateCareerJobParams {
  id: number;
  data: UpdateCareerJobRequest;
}

export function useUpdateCareerJob() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: UpdateCareerJobParams) => updateCareerJob(id, data),
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
    updateCareerJob: mutation.mutate,
    updateCareerJobAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
