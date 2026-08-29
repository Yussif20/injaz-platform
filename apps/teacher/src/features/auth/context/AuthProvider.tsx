/**
 * Auth Provider - Wraps app with auth context
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";
import type { User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { logout, isLoading: isLoggingOut } = useLogout();

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
