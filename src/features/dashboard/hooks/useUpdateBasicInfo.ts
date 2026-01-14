/**
 * useUpdateBasicInfo hook - Update basic info mutation
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBasicInfo } from "../services/me.service";
import type { UpdateBasicInfoRequest } from "../types/me.types";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

// Auth query key from auth feature
const AUTH_QUERY_KEY = ["currentUser"];

export function useUpdateBasicInfo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateBasicInfoRequest) => updateBasicInfo(data),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate both profile and auth queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      }
    },
  });

  return {
    updateBasicInfo: mutation.mutate,
    updateBasicInfoAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
