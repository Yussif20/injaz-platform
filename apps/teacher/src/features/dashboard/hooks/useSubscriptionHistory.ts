"use client";

import { useQuery } from "@tanstack/react-query";
import { getMySubscriptionHistory } from "../services/subscription.service";
import type { Subscription } from "../types/me.types";

export const SUBSCRIPTION_HISTORY_QUERY_KEY = ["subscriptionHistory"];

export function useSubscriptionHistory() {
  const query = useQuery({
    queryKey: SUBSCRIPTION_HISTORY_QUERY_KEY,
    queryFn: async (): Promise<Subscription[]> => {
      const response = await getMySubscriptionHistory();
      if (!response.status) return [];
      return response.data ?? [];
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
