"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionInfo } from "../services/subscription.service";
import type { SubscriptionInfo } from "../types/me.types";

export const SUBSCRIPTION_INFO_QUERY_KEY = ["subscriptionInfo"];

export function useSubscriptionInfo() {
  const query = useQuery({
    queryKey: SUBSCRIPTION_INFO_QUERY_KEY,
    queryFn: async (): Promise<SubscriptionInfo | null> => {
      const response = await getSubscriptionInfo();
      if (!response.status) return null;
      return response.data ?? null;
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });

  return {
    info: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
