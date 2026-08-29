"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { login } from "../services/auth.service";
import { ROUTES } from "@/config";
import type { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      router.push(ROUTES.DASHBOARD);
    },
  });
}
