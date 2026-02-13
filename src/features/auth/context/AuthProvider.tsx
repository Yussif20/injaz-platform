"use client";

import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import type { AdminUser } from "../types/auth.types";

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, refetch } = useAuth();

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
