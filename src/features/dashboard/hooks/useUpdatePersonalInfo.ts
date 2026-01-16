/**
 * useUpdatePersonalInfo hook - Update personal info mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePersonalInfo } from "../services/me.service";
import type { UpdatePersonalInfoRequest } from "../types/me.types";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdatePersonalInfoRequest) => updatePersonalInfo(data),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate profile query to refetch updated data
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }
    },
  });

  return {
    updatePersonalInfo: mutation.mutate,
    updatePersonalInfoAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
