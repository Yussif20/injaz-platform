/**
 * Root Providers - Combines all providers
 */

"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "@/features/auth";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
