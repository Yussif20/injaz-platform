"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/i18n/TranslationContext";
import { loginSchema, type LoginFormData } from "../validations/auth.schemas";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/shared/components/ui";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 sm:gap-6 text-right"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phoneNumber"
          className="text-right text-base font-normal text-text-dark"
        >
          {loginT.email}
          <span className="text-warning-500">*</span>
        </label>
        <input
          id="phoneNumber"
          dir="rtl"
          type="tel"
          placeholder={loginT.phonePlaceholder}
          className="text-right w-full rounded-2xl border border-grey-300 bg-white px-3 py-2 text-sm text-text-dark placeholder:text-grey-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber?.message && (
          <p className="text-start text-xs text-error-500">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-right text-base font-normal text-text-dark"
        >
          {loginT.password}
          <span className="text-warning-500">*</span>
        </label>
        <input
          id="password"
          type="password"
          placeholder={loginT.passwordPlaceholder}
          className="w-full rounded-2xl border border-grey-300 bg-white px-3 py-2 text-sm text-text-dark placeholder:text-grey-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-start text-xs text-error-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {loginMutation.isError && (
        <p className="text-sm text-error-500">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : loginT.errorGeneric}
        </p>
      )}

      <button
        type="button"
        className="text-sm text-primary-500 hover:text-primary-700 ml-auto"
      >
        {loginT.forgotPassword}
      </button>

      <Button
        type="submit"
        loading={loginMutation.isPending}
        className="mt-2 w-full py-3.5 text-base rounded-3xl! font-light! "
        size="lg"
      >
        {loginT.submit}
      </Button>
    </form>
  );
}
