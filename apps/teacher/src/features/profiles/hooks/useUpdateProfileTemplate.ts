/**
 * useUpdateProfileTemplate hook - Update a profile's template
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileTemplate } from "../services/templates.service";

// Query keys for invalidation
const MY_PROFILES_QUERY_KEY = ["myProfiles"];
const PROFILE_DETAILS_QUERY_KEY = "profileDetails";

interface UpdateTemplateParams {
  profileId: number;
  templateId: number;
}

/**
 * Mutation hook to update a profile's template
 */
export function useUpdateProfileTemplate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ profileId, templateId }: UpdateTemplateParams) => {
      const response = await updateProfileTemplate(profileId, templateId);
      if (!response.status) {
        throw new Error(response.message || "Failed to update template");
      }
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate profile queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [PROFILE_DETAILS_QUERY_KEY, variables.profileId],
      });
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
    },
  });

  return {
    updateTemplate: mutation.mutate,
    updateTemplateAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
