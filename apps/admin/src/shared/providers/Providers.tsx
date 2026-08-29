"use client";

import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "@/features/auth/context";
import { ToastProvider } from "./ToastProvider";
import { ApiInterceptorSetup } from "./ApiInterceptorSetup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <ApiInterceptorSetup />
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
