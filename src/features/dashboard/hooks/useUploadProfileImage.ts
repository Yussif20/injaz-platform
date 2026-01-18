"use client";

/**
 * useUploadProfileImage hook - Upload profile image mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../services/me.service";
import { PROFILE_QUERY_KEY } from "./useMyProfile";

// Auth query key from auth feature
const AUTH_QUERY_KEY = ["currentUser"];

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: (response) => {
      if (response.status) {
        // Invalidate both profile and auth queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      }
    },
  });

  return {
    uploadImage: mutation.mutate,
    uploadImageAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}
