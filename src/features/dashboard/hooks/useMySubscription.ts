"use client";

import { useQuery } from "@tanstack/react-query";
import { getMySubscription } from "../services/subscription.service";
import type { Subscription } from "../types/me.types";

export const MY_SUBSCRIPTION_QUERY_KEY = ["mySubscription"];

export function useMySubscription() {
  const query = useQuery({
    queryKey: MY_SUBSCRIPTION_QUERY_KEY,
    queryFn: async (): Promise<Subscription | null> => {
      const response = await getMySubscription();
      if (!response.status) return null;
      return response.data ?? null;
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const subscription = query.data ?? null;

  return {
    subscription,
    isSubscribed: subscription?.isActive === true,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
