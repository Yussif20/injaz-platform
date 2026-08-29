/**
 * Forgot Password Form Component - Multi-step with OTP
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from "../validations/auth.schemas";
import { OtpInput } from "./OtpInput";
import { StepIndicator } from "./StepIndicator";

type ForgotPasswordStep = "phone" | "reset";

const STEP_LABELS = [authContent.steps.phone, authContent.steps.newPassword];

export function ForgotPasswordForm() {
  const { forgotPassword, otp, buttons } = authContent;
  const [step, setStep] = useState<ForgotPasswordStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const {
    sendOtp,
    sendOtpAsync,
    isSendingOtp,
    sendOtpError,
    resetPassword,
    isResetting,
    resetError,
    reset: resetMutations,
  } = useForgotPassword();

  // Step 1: Phone form
  const phoneForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: "" },
  });

  // Step 2: Reset form
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      phone: "",
      code: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Get current step number
  const getCurrentStepNumber = () => {
    return step === "phone" ? 1 : 2;
  };

  // Step 1: Handle phone submission
  const handlePhoneSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendOtpAsync(data.phone);
      setPhone(data.phone);
      setStep("reset");
      setResendTimer(60);
    } catch {
      // Error is handled by mutation
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    sendOtp(phone);
    setResendTimer(60);
    setOtpCode("");
  };

  // Step 2: Handle reset password
  const handleResetSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      phone,
      code: otpCode,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  // Go back to previous step
  const handleBack = () => {
    resetMutations();
    setStep("phone");
    setOtpCode("");
  };

  // Handle phone input - only allow numbers and +
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^\d+]/g, "");
    e.target.value = sanitized;
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={getCurrentStepNumber()}
        totalSteps={2}
        labels={STEP_LABELS}
      />

      {/* Step 1: Phone Input */}
      {step === "phone" && (
        <form
          onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
          className="flex flex-col gap-4 sm:gap-5 text-right"
        >
          {sendOtpError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {sendOtpError.message}
            </div>
          )}

          <div className="text-center lg:text-right mb-2">
            <h2 className="text-lg sm:text-xl font-normal text-text-dark">
              {forgotPassword.title}
            </h2>
            <p className="text-sm text-grey-500 mt-1">
              {forgotPassword.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="phone"
            >
              {forgotPassword.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              placeholder={forgotPassword.phonePlaceholder}
              {...phoneForm.register("phone", { onChange: handlePhoneInput })}
              className={`
                bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px]
                px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none text-right
                border-2 transition-colors duration-200
                ${
                  phoneForm.formState.errors.phone
                    ? "border-warning-500"
                    : "border-transparent focus:border-primary-500"
                }
              `}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-warning-500 text-xs">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSendingOtp}
            disabled={isSendingOtp}
            className="w-full bg-primary-500 text-white text-xs sm:text-base lg:text-[18px] font-light py-2 sm:py-3 rounded-xl sm:rounded-2xl"
          >
            {forgotPassword.submitButton}
          </Button>

          <div className="text-right text-primary-500 text-xs sm:text-base lg:text-[18px] font-light">
            <Link href={ROUTES.SIGN_IN}>{forgotPassword.backToLogin}</Link>
          </div>
        </form>
      )}

      {/* Step 2: OTP + New Password */}
      {step === "reset" && (
        <form
          onSubmit={resetForm.handleSubmit(handleResetSubmit)}
          className="flex flex-col gap-4 sm:gap-5 text-right"
        >
          {resetError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {resetError.message}
            </div>
          )}

          <div className="text-center mb-2">
            <p className="text-sm sm:text-base text-grey-600">
              {forgotPassword.otpSentTo} <span dir="ltr">{phone}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark text-center">
              {forgotPassword.otpLabel}
            </label>
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              disabled={isResetting}
            />
          </div>

          <div className="flex justify-center gap-2 text-sm">
            <span className="text-grey-500">{otp.resendText}</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`text-primary-500 ${
                resendTimer > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
            >
              {resendTimer > 0
                ? `${otp.resendButton} (${resendTimer})`
                : otp.resendButton}
            </button>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="newPassword"
            >
              {forgotPassword.newPasswordLabel}
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder={forgotPassword.newPasswordPlaceholder}
              {...resetForm.register("newPassword")}
              className={`
                bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px]
                pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none
                border-2 ${
                  resetForm.formState.errors.newPassword
                    ? "border-warning-500"
                    : "border-transparent focus:border-primary-500"
                }
              `}
              style={{
                backgroundImage: "url('/pages/sign/lock.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "16px 16px",
              }}
            />
            {resetForm.formState.errors.newPassword && (
              <p className="text-warning-500 text-xs">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <label
              className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark"
              htmlFor="confirmNewPassword"
            >
              {forgotPassword.confirmNewPasswordLabel}
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              placeholder={forgotPassword.confirmNewPasswordPlaceholder}
              {...resetForm.register("confirmNewPassword")}
              className={`
                bg-[#EBEBEB] text-text-dark placeholder-[#B3B3B3] text-xs sm:text-sm lg:text-[14px]
                pr-2 sm:pr-3 pl-7 sm:pl-10 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl outline-none
                border-2 ${
                  resetForm.formState.errors.confirmNewPassword
                    ? "border-warning-500"
                    : "border-transparent focus:border-primary-500"
                }
              `}
              style={{
                backgroundImage: "url('/pages/sign/lock.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 0.5rem center",
                backgroundSize: "16px 16px",
              }}
            />
            {resetForm.formState.errors.confirmNewPassword && (
              <p className="text-warning-500 text-xs">
                {resetForm.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 py-2 sm:py-3 rounded-xl sm:rounded-2xl"
            >
              {buttons.back}
            </Button>
            <Button
              type="submit"
              isLoading={isResetting}
              disabled={isResetting || otpCode.length !== 6}
              className="flex-1 bg-primary-500 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl"
            >
              {forgotPassword.resetButton}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
