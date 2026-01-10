/**
 * Login Form Component
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../validations/auth.schemas";

interface LoginFormProps {
  onForgotPassword?: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { signIn } = authContent;
  const { login, isLoading, error, reset } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    reset();
    login(data);
  };

  // Handle phone input - only allow numbers and +
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^\d+]/g, "");
    e.target.value = sanitized;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5 lg:gap-10 text-right">
      {/* API Error */}
      {error && (
        <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
          {error.message}
        </div>
      )}

      {/* Phone Input */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <label
          className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
          htmlFor="phone"
        >
          {signIn.phoneLabel}
        </label>
        <input
          id="phone"
          type="tel"
          placeholder={signIn.phonePlaceholder}
          {...register("phone", {
            onChange: handlePhoneInput,
          })}
          className={`
            bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px]
            px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right
            border-2 transition-colors duration-200
            ${errors.phone ? "border-warning-500" : "border-transparent focus:border-primary-500"}
          `}
        />
        {errors.phone && (
          <p className="text-warning-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <label
          className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
          htmlFor="password"
        >
          {signIn.passwordLabel}
        </label>
        <input
          id="password"
          type="password"
          placeholder={signIn.passwordPlaceholder}
          {...register("password")}
          className={`
            bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px]
            pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none
            border-2 transition-colors duration-200
            ${errors.password ? "border-warning-500" : "border-transparent focus:border-primary-500"}
          `}
          style={{
            backgroundImage: "url('/pages/sign/lock.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left 0.5rem center",
            backgroundSize: "16px 16px",
          }}
        />
        {errors.password && (
          <p className="text-warning-500 text-xs">{errors.password.message}</p>
        )}

        {/* Forgot Password Link */}
        <div className="text-right">
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs sm:text-base lg:text-[18px] font-light text-primary-500 hover:underline"
            >
              {signIn.forgotPassword}
            </button>
          ) : (
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs sm:text-base lg:text-[18px] font-light text-primary-500 hover:underline"
            >
              {signIn.forgotPassword}
            </Link>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center mt-1 sm:mt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full bg-primary-500 text-white text-xs sm:text-base lg:text-[18px] font-light py-2 sm:py-3 rounded-xl sm:rounded-2xl"
        >
          {signIn.submitButton}
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-right text-primary-500 text-xs sm:text-base lg:text-[18px] font-light">
        <Link href={ROUTES.SIGN_UP}>{signIn.signUpLink}</Link>
      </div>
    </form>
  );
}
