"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/i18n/TranslationContext";
import { loginSchema, type LoginFormData } from "../validations/auth.schemas";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/shared/components/ui";
import { Input } from "@/shared/components/ui";

export function LoginForm() {
  const { t } = useTranslation();
  const loginT = t("auth").login;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="phoneNumber"
        label={loginT.phone}
        placeholder={loginT.phonePlaceholder}
        type="tel"
        dir="ltr"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <Input
        id="password"
        label={loginT.password}
        placeholder={loginT.passwordPlaceholder}
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      {loginMutation.isError && (
        <p className="text-sm text-error-500">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : loginT.errorGeneric}
        </p>
      )}

      <Button
        type="submit"
        loading={loginMutation.isPending}
        className="mt-2 w-full"
        size="lg"
      >
        {loginT.submit}
      </Button>
    </form>
  );
}
