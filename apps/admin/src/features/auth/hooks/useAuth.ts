"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/query-keys";
import type { AdminUser } from "../types/auth.types";

export function useAuth() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const { data } = await clientApi.get<{ user: AdminUser | null }>(
        "/auth/me",
      );
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const user = data ?? null;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}
