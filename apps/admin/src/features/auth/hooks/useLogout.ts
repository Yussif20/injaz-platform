"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { logout } from "../services/auth.service";
import { ROUTES } from "@/config";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
  });
}
