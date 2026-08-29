"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribe } from "../services/subscription.service";
import { MY_SUBSCRIPTION_QUERY_KEY } from "./useMySubscription";
import type { Subscription } from "../types/me.types";

interface SubscribeArgs {
  token: string;
  paymentMethod: string;
  idempotencyKey: string;
}

interface SubscribeResult {
  status: boolean;
  message: string;
  data?: Subscription | null;
  errors?: string[] | null;
}

export function useSubscribe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<SubscribeResult, Error, SubscribeArgs>({
    mutationFn: ({ token, paymentMethod, idempotencyKey }) =>
      subscribe(token, paymentMethod, idempotencyKey),
    onSuccess: (result) => {
      if (result.data?.isActive) {
        queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
      }
    },
  });

  return {
    subscribe: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
