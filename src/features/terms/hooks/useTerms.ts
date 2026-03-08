"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTermsContent, saveTermsContent } from "../services/terms.service";

const TERMS_QUERY_KEY = ["systemParameters", "terms-and-conditions"] as const;

export function useTermsContent() {
  return useQuery({
    queryKey: TERMS_QUERY_KEY,
    queryFn: getTermsContent,
  });
}

export function useSaveTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (html: string) => saveTermsContent(html),
    onSuccess: (savedData) => {
      // Update cache directly instead of refetching — prevents editor overwrite
      queryClient.setQueryData(TERMS_QUERY_KEY, savedData);
    },
  });
}
