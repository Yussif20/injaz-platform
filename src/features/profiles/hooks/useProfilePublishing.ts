/**
 * useProfilePublishing hooks - Validate, save draft, publish/unpublish profiles
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateProfile,
  saveDraft,
  publishProfile,
  unpublishProfile,
} from "../services/profiles.service";
import { MY_PROFILES_QUERY_KEY } from "./useMyProfiles";
import { PROFILE_DETAILS_QUERY_KEY } from "./useProfileDetails";

export const PROFILE_VALIDATION_QUERY_KEY = ["profileValidation"];

export function useValidateProfile(profileId: number | null) {
  const query = useQuery({
    queryKey: [...PROFILE_VALIDATION_QUERY_KEY, profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const response = await validateProfile(profileId);
      if (!response.status) {
        console.warn("Profile validation returned error:", response.message);
        return null;
      }
      return response.data ?? null;
    },
    enabled: !!profileId,
    staleTime: 1 * 60 * 1000, // 1 minute (validation can change frequently)
    retry: 1,
  });

  return {
    validation: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useSaveDraft() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId: number) => saveDraft(profileId),
    onSuccess: (response, profileId) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PROFILE_DETAILS_QUERY_KEY, profileId] });
        queryClient.invalidateQueries({ queryKey: [...PROFILE_VALIDATION_QUERY_KEY, profileId] });
      }
    },
  });

  return {
    saveDraft: mutation.mutate,
    saveDraftAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export function usePublishProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId: number) => publishProfile(profileId),
    onSuccess: (response, profileId) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PROFILE_DETAILS_QUERY_KEY, profileId] });
      }
    },
  });

  return {
    publish: mutation.mutate,
    publishAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export function useUnpublishProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId: number) => unpublishProfile(profileId),
    onSuccess: (response, profileId) => {
      if (response.status) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PROFILE_DETAILS_QUERY_KEY, profileId] });
      }
    },
  });

  return {
    unpublish: mutation.mutate,
    unpublishAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
