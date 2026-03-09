/**
 * Login Form Component
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../validations/auth.schemas";
import { CountryCodePicker } from "./CountryCodePicker";

interface LoginFormProps {
  onForgotPassword?: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { signIn } = authContent;
  const { login, isLoading, error, reset } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+966");

  const phoneMaxLength = countryCode === "+20" ? 10 : 9;

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
    const normalizedPhone = `${countryCode}${data.phone.replace(/^\+/, "")}`;
    login({
      ...data,
      phone: normalizedPhone,
    });
  };

  // Handle phone input - only allow digits, enforce max length
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, phoneMaxLength);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex flex-col gap-5 sm:gap-6 lg:gap-8 text-right"
    >
      {/* API Error */}
      {error && (
        <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
          {error.message}
        </div>
      )}

      {/* Phone Input */}
        <div className="flex flex-col gap-2">
        <label
          className="text-sm sm:text-base font-medium text-text-dark"
          htmlFor="phone"
        >
          {signIn.phoneLabel}
        </label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            autoComplete="off"
            maxLength={phoneMaxLength}
            placeholder={signIn.phonePlaceholder}
            {...register("phone", {
              onChange: handlePhoneInput,
            })}
            className={`
              w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
              pr-24 pl-4 py-3 sm:py-3.5 rounded-xl outline-none text-right
              border-2 transition-colors duration-200
              ${
                errors.phone
                  ? "border-warning-500"
                  : "border-transparent focus:border-primary-500"
              }
            `}
          />
          <CountryCodePicker
            value={countryCode}
            onChange={setCountryCode}
            className="absolute right-2 -top-11 z-10"
          />
        </div>
        {errors.phone && (
          <p className="text-warning-500 text-xs mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm sm:text-base font-medium text-text-dark"
          htmlFor="password"
        >
          {signIn.passwordLabel}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={signIn.passwordPlaceholder}
            {...register("password")}
            className={`
              w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
              pr-4 pl-10 sm:pl-12 py-3 sm:py-3.5 rounded-xl outline-none
              border-2 transition-colors duration-200
              ${
                errors.password
                  ? "border-warning-500"
                  : "border-transparent focus:border-primary-500"
              }
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            tabIndex={-1}
          >
            <Image
              src={
                showPassword ? "/icons/ui/lock-open.svg" : "/icons/ui/lock.svg"
              }
              alt="toggle password visibility"
              width={18}
              height={18}
            />
          </button>
        </div>
        {errors.password && (
          <p className="text-warning-500 text-xs mt-1">
            {errors.password.message}
          </p>
        )}

        {/* Forgot Password Link */}
        <div className="text-right mt-1">
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm sm:text-base font-light text-primary-500 hover:text-primary-800 hover:underline transition-colors"
            >
              {signIn.forgotPassword}
            </button>
          ) : (
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm sm:text-base font-light text-primary-500 hover:text-primary-800 hover:underline transition-colors"
            >
              {signIn.forgotPassword}
            </Link>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full mt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full bg-primary-500 hover:bg-primary-800 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-xl transition-colors"
        >
          {signIn.submitButton}
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center lg:text-right text-primary-500 text-sm sm:text-base font-light">
        <Link
          href={ROUTES.SIGN_UP}
          className="hover:underline transition-colors"
        >
          {signIn.signUpLink}
        </Link>
      </div>
    </form>
  );
}
