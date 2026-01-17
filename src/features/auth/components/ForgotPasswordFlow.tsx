/**
 * Forgot Password Flow Component - 3-step flow integrated into sign page
 * Step 1: Enter phone number
 * Step 2: Verify OTP (6 digits) with backend
 * Step 3: Enter new password with real-time validation
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { verifyOtp } from "../services/auth.service";
import { VerificationPurpose } from "../types/auth.types";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../validations/auth.schemas";
import { OtpInput } from "./OtpInput";
import { StepIndicator } from "./StepIndicator";

type ForgotPasswordStep = "phone" | "otp" | "newPassword";

// New password schema with real-time validation (including special character)
const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),
    confirmNewPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmNewPassword"],
  });

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

const STEP_LABELS = [
  authContent.steps.phone,
  authContent.steps.verify,
  authContent.steps.newPassword,
];

export function ForgotPasswordFlow() {
  const { forgotPassword, otp, buttons, signIn } = authContent;
  const [step, setStep] = useState<ForgotPasswordStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    sendOtpAsync,
    isSendingOtp,
    sendOtpError,
    sendOtp,
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

  // Step 3: New password form with real-time validation
  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { isDirty, isValid } = passwordForm.formState;

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Get current step number
  const getCurrentStepNumber = () => {
    switch (step) {
      case "phone":
        return 1;
      case "otp":
        return 2;
      case "newPassword":
        return 3;
      default:
        return 1;
    }
  };

  // Step 1: Handle phone submission
  const handlePhoneSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendOtpAsync(data.phone);
      setPhone(data.phone);
      setStep("otp");
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

  // Step 2: Handle OTP verification with backend
  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const response = await verifyOtp(phone, otpCode, VerificationPurpose.PasswordReset);

      if (response.status) {
        setStep("newPassword");
      } else {
        setOtpError(response.message || authContent.errors.invalidOtp);
      }
    } catch (error) {
      setOtpError(authContent.errors.invalidOtp);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Handle password reset
  const handlePasswordSubmit = (data: NewPasswordFormValues) => {
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
    setOtpError(null);
    if (step === "otp") {
      setStep("phone");
      setOtpCode("");
    } else if (step === "newPassword") {
      setStep("otp");
      passwordForm.reset();
    }
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
        totalSteps={3}
        labels={STEP_LABELS}
      />

      {/* Step 1: Phone Input */}
      {step === "phone" && (
        <form
          onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
          className="flex flex-col gap-5 sm:gap-6 lg:gap-8 text-right"
        >
          {sendOtpError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {sendOtpError.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              className="text-sm sm:text-base font-medium text-text-dark"
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
                bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                px-4 py-3 sm:py-3.5 rounded-xl outline-none text-right
                border-2 transition-colors duration-200
                ${
                  phoneForm.formState.errors.phone
                    ? "border-warning-500"
                    : "border-transparent focus:border-primary-500"
                }
              `}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-warning-500 text-xs mt-1">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="w-full mt-2">
            <Button
              type="submit"
              isLoading={isSendingOtp}
              disabled={isSendingOtp}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-xl transition-colors"
            >
              {forgotPassword.submitButton}
            </Button>
          </div>

          <div className="text-center lg:text-right text-primary-500 text-sm sm:text-base font-light">
            <Link
              href={ROUTES.SIGN_IN}
              className="hover:underline transition-colors"
            >
              {forgotPassword.backToLogin}
            </Link>
          </div>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 text-right">
          {(sendOtpError || otpError) && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {otpError || sendOtpError?.message}
            </div>
          )}

          <div className="text-center mb-2">
            <p className="text-sm sm:text-base text-grey-600">
              {forgotPassword.otpSentTo} <span dir="ltr">{phone}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base font-medium text-text-dark text-center">
              {forgotPassword.otpLabel}
            </label>
            <OtpInput
              value={otpCode}
              onChange={(value) => {
                setOtpCode(value);
                setOtpError(null); // Clear error when user types
              }}
              length={6}
              disabled={isVerifyingOtp}
              error={otpError ? " " : undefined}
            />
          </div>

          <div className="flex justify-center gap-2 text-sm">
            <span className="text-grey-500">{otp.resendText}</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isVerifyingOtp}
              className={`text-primary-500 ${
                resendTimer > 0 || isVerifyingOtp
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
            >
              {resendTimer > 0
                ? `${otp.resendButton} (${resendTimer})`
                : otp.resendButton}
            </button>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isVerifyingOtp}
              className="flex-1 py-3 sm:py-3.5 rounded-xl"
            >
              {buttons.back}
            </Button>
            <Button
              type="button"
              onClick={handleOtpVerify}
              isLoading={isVerifyingOtp}
              disabled={otpCode.length !== 6 || isVerifyingOtp}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 sm:py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buttons.next}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: New Password */}
      {step === "newPassword" && (
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="flex flex-col gap-5 sm:gap-6 lg:gap-8 text-right"
        >
          {resetError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {resetError.message}
            </div>
          )}

          {/* New Password Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm sm:text-base font-medium text-text-dark"
              htmlFor="newPassword"
            >
              {forgotPassword.newPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder={forgotPassword.newPasswordPlaceholder}
                {...passwordForm.register("newPassword")}
                className={`
                  w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                  pr-4 pl-10 sm:pl-12 py-3 sm:py-3.5 rounded-xl outline-none
                  border-2 transition-colors duration-200
                  ${
                    passwordForm.formState.errors.newPassword
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                <Image
                  src={
                    showNewPassword
                      ? "/icons/ui/lock-open.svg"
                      : "/icons/ui/lock.svg"
                  }
                  alt="toggle password visibility"
                  width={18}
                  height={18}
                />
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-warning-500 text-xs mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm sm:text-base font-medium text-text-dark"
              htmlFor="confirmNewPassword"
            >
              {forgotPassword.confirmNewPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={forgotPassword.confirmNewPasswordPlaceholder}
                {...passwordForm.register("confirmNewPassword")}
                className={`
                  w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                  pr-4 pl-10 sm:pl-12 py-3 sm:py-3.5 rounded-xl outline-none
                  border-2 transition-colors duration-200
                  ${
                    passwordForm.formState.errors.confirmNewPassword
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                <Image
                  src={
                    showConfirmPassword
                      ? "/icons/ui/lock-open.svg"
                      : "/icons/ui/lock.svg"
                  }
                  alt="toggle password visibility"
                  width={18}
                  height={18}
                />
              </button>
            </div>
            {passwordForm.formState.errors.confirmNewPassword && (
              <p className="text-warning-500 text-xs mt-1">
                {passwordForm.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 py-3 sm:py-3.5 rounded-xl"
            >
              {buttons.back}
            </Button>
            <Button
              type="submit"
              isLoading={isResetting}
              disabled={!isDirty || !isValid || isResetting}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 sm:py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signIn.submitButton}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
