"use client";

import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "@/features/auth/context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
