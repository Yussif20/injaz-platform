/**
 * useDeleteShareLink hook - Delete a share link
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShareLink } from "../services/share-links.service";
import { SHARE_LINKS_QUERY_KEY } from "./useShareLinks";

interface DeleteShareLinkParams {
  profileId: number;
}

export function useDeleteShareLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: DeleteShareLinkParams) => deleteShareLink(params.profileId),
    onSuccess: (response, variables) => {
      if (response.status === "Success") {
        queryClient.invalidateQueries({
          queryKey: [SHARE_LINKS_QUERY_KEY, variables.profileId],
        });
      }
    },
  });

  return {
    deleteShareLink: mutation.mutate,
    deleteShareLinkAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
