/**
 * useAuth hook - Get current user and auth state
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";
import { Gender, type User } from "../types/auth.types";

export const AUTH_QUERY_KEY = ["auth", "user"];

// TODO: Set to false when backend is ready
const DEV_SKIP_AUTH = true;

// Mock user for development
const MOCK_USER: User = {
  userId: "dev-user-123",
  phone: "+966501234567",
  fullName: "محمد أحمد",
  userName: "mohammed_ahmed",
  role: "teacher",
  gender: Gender.Male,
  email: "mohammed@example.com",
  profileImage: undefined,
};

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
      // Skip auth in development mode
      if (DEV_SKIP_AUTH) {
        return MOCK_USER;
      }
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
