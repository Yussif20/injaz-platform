/**
 * useCreateShareLink hook - Create a new share link
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShareLink } from "../services/share-links.service";
import { SHARE_LINKS_QUERY_KEY } from "./useShareLinks";
import type { CreateShareLinkRequest } from "../types/share-link.types";

export function useCreateShareLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateShareLinkRequest) => createShareLink(data),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        // Invalidate share links cache for this profile
        queryClient.invalidateQueries({
          queryKey: [SHARE_LINKS_QUERY_KEY, variables.profileId],
        });
      }
    },
  });

  return {
    createShareLink: mutation.mutate,
    createShareLinkAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
