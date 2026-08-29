/**
 * useAuth hook - Get current user and auth state
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";
import { type User } from "../types/auth.types";

export const AUTH_QUERY_KEY = ["auth", "user"];

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await getCurrentUser();
      if (!response.status) {
        throw new Error(response.message);
      }
      return response.data as User;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const setUser = (user: User | null) => {
    queryClient.setQueryData(AUTH_QUERY_KEY, user);
  };

  const clearUser = () => {
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return {
    user: data ?? null,
    isAuthenticated: !!data,
    isLoading,
    isError,
    error,
    refetch,
    setUser,
    clearUser,
  };
}
