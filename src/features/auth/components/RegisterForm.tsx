/**
 * Register Form Component - Multi-step with OTP
 */

"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useRegister } from "../hooks/useRegister";
import {
  registerDetailsSchema,
  type RegisterDetailsFormValues,
} from "../validations/auth.schemas";
import { Gender, type RegistrationStep } from "../types/auth.types";
import { OtpInput } from "./OtpInput";

// Steps indicator removed per request

export function RegisterForm() {
  const { signUp, otp, buttons } = authContent;
  const [step, setStep] = useState<RegistrationStep>("details");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingDetails, setPendingDetails] =
    useState<RegisterDetailsFormValues | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    sendOtp,
    sendOtpAsync,
    isSendingOtp,
    sendOtpError,
    verifyOtpAsync,
    isVerifyingOtp,
    verifyOtpError,
    register: registerUser,
    registerError,
    reset: resetMutations,
  } = useRegister();

  // Step 1: Details + Phone form
  const detailsForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      gender: undefined,
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Watch acceptTerms value to control submit button state without using watch() inline
  const isTermsAccepted = useWatch({
    control: detailsForm.control,
    name: "acceptTerms",
  });

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step indicator removed, helper not needed

  // Step 1: Submit details and send OTP
  const handleDetailsSubmit = async (data: RegisterDetailsFormValues) => {
    try {
      const sanitizedPhone = data.phone;
      await sendOtpAsync(sanitizedPhone);
      setPendingDetails(data);
      setPhone(sanitizedPhone);
      setStep("otp");
      setResendTimer(60);
    } catch {
      // Error is handled by mutation
    }
  };

  // Step 2: Handle OTP verification then complete registration
  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      setOtpError(otp.errorLength6);
      return;
    }

    setOtpError("");
    try {
      await verifyOtpAsync({ phone, code: otpCode });
      if (pendingDetails) {
        registerUser({
          fullName: pendingDetails.fullName,
          phone,
          password: pendingDetails.password,
          confirmPassword: pendingDetails.confirmPassword,
          gender: pendingDetails.gender as Gender,
          email: pendingDetails.email || "",
          verificationCode: otpCode,
        });
      }
    } catch {
      setOtpError(verifyOtpError?.message || otp.errorInvalid);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    sendOtp(phone);
    setResendTimer(60);
    setOtpCode("");
    setOtpError("");
  };

  // Registration now happens after OTP verification

  // Go back to previous step
  const handleBack = () => {
    resetMutations();
    if (step === "otp") {
      setStep("details");
      setOtpCode("");
      setOtpError("");
    } else if (step === "details") {
      // stay in details
    }
  };

  // Handle phone input - only allow numbers and +
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^\d+]/g, "");
    e.target.value = sanitized;
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <div className="flex flex-col gap-5 sm:gap-6 text-right max-w-md mx-auto lg:mx-0 lg:max-w-none">
          {verifyOtpError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {verifyOtpError.message}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-text-dark mb-3">
              {otp.titleConfirm}
            </h2>
            <p className="text-sm sm:text-base text-grey-500 mb-6">
              {otp.subtitleRegister} <span dir="ltr">{phone}</span>
            </p>
          </div>

          <OtpInput
            length={6}
            value={otpCode}
            onChange={setOtpCode}
            error={otpError}
            disabled={isVerifyingOtp}
          />

          <div className="flex justify-center gap-2 text-sm sm:text-base mt-2">
            <span className="text-grey-500">{otp.resendText}</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`text-primary-500 font-medium ${
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

          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 py-3 sm:py-3.5 rounded-xl"
            >
              {buttons.back}
            </Button>
            <Button
              type="button"
              onClick={handleOtpVerify}
              isLoading={isVerifyingOtp}
              disabled={isVerifyingOtp || otpCode.length !== 6}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 sm:py-3.5 rounded-xl transition-colors"
            >
              {otp.verifyButton}
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Registration Details + Phone */}
      {step === "details" && (
        <form
          onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)}
          className="flex flex-col gap-5 sm:gap-6 text-right"
        >
          {sendOtpError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {sendOtpError.message}
            </div>
          )}
          {registerError && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {registerError.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="fullName"
              >
                {signUp.fullNameLabel}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.fullNameNote}
                </span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder={signUp.fullNamePlaceholder}
                {...detailsForm.register("fullName")}
                className={`
                  bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                  px-4 py-2.5 sm:py-3 rounded-xl outline-none text-right
                  border-2 transition-colors duration-200 ${
                    detailsForm.formState.errors.fullName
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
              />
              {detailsForm.formState.errors.fullName && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="phone"
              >
                {signUp.phoneLabel}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.phoneNote}
                </span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder={signUp.phonePlaceholder}
                {...detailsForm.register("phone", {
                  onChange: handlePhoneInput,
                })}
                className={`
                  bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                  px-4 py-2.5 sm:py-3 rounded-xl outline-none text-right
                  border-2 transition-colors duration-200
                  ${
                    detailsForm.formState.errors.phone
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
              />
              {detailsForm.formState.errors.phone && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="gender"
              >
                {signUp.genderLabel}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.genderRequired}
                </span>
              </label>
              <select
                id="gender"
                {...detailsForm.register("gender", { valueAsNumber: true })}
                className={`
                  bg-grey-100 text-text-dark text-sm sm:text-base
                  pr-4 pl-10 py-2.5 sm:py-3 rounded-xl outline-none text-right appearance-none cursor-pointer
                  border-2 transition-colors duration-200 ${
                    detailsForm.formState.errors.gender
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
                style={{
                  backgroundImage: "url('/pages/sign/arrow-down.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left 0.75rem center",
                  backgroundSize: "16px 16px",
                }}
              >
                <option value="">{signUp.genderPlaceholder}</option>
                <option value={Gender.Male}>{signUp.genderMale}</option>
                <option value={Gender.Female}>{signUp.genderFemale}</option>
              </select>
              {detailsForm.formState.errors.gender && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.gender.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="email"
              >
                {signUp.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={signUp.emailPlaceholder}
                {...detailsForm.register("email")}
                className={`
                  bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                  px-4 py-2.5 sm:py-3 rounded-xl outline-none text-right
                  border-2 transition-colors duration-200 ${
                    detailsForm.formState.errors.email
                      ? "border-warning-500"
                      : "border-transparent focus:border-primary-500"
                  }
                `}
              />
              {detailsForm.formState.errors.email && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="password"
              >
                {signUp.passwordLabel}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.passwordRequired}
                </span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={signUp.passwordPlaceholder}
                  {...detailsForm.register("password")}
                  className={`
                    w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                    pr-4 pl-10 py-2.5 sm:py-3 rounded-xl outline-none
                    border-2 transition-colors duration-200 ${
                      detailsForm.formState.errors.password
                        ? "border-warning-500"
                        : "border-transparent focus:border-primary-500"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  tabIndex={-1}
                >
                  <Image
                    src={
                      showPassword ? "/icons/lock-open.svg" : "/icons/lock.svg"
                    }
                    alt="toggle password visibility"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {detailsForm.formState.errors.password && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="confirmPassword"
              >
                {signUp.confirmPasswordLabel}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.confirmPasswordRequired}
                </span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={signUp.confirmPasswordPlaceholder}
                  {...detailsForm.register("confirmPassword")}
                  className={`
                    w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                    pr-4 pl-10 py-2.5 sm:py-3 rounded-xl outline-none
                    border-2 transition-colors duration-200 ${
                      detailsForm.formState.errors.confirmPassword
                        ? "border-warning-500"
                        : "border-transparent focus:border-primary-500"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  tabIndex={-1}
                >
                  <Image
                    src={
                      showConfirmPassword
                        ? "/icons/lock-open.svg"
                        : "/icons/lock.svg"
                    }
                    alt="toggle password visibility"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {detailsForm.formState.errors.confirmPassword && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex flex-row-reverse items-center justify-end gap-3 lg:col-span-2 mt-2">
              <label
                htmlFor="acceptTerms"
                className="text-sm sm:text-base text-primary-500 cursor-pointer hover:underline"
              >
                {signUp.termsLabel}
              </label>
              <input
                id="acceptTerms"
                type="checkbox"
                {...detailsForm.register("acceptTerms")}
                className="cursor-pointer h-5 w-5 rounded border-2 border-primary-500 accent-primary-500"
              />
            </div>
            {detailsForm.formState.errors.acceptTerms && (
              <p className="text-warning-500 text-xs lg:col-span-2">
                {detailsForm.formState.errors.acceptTerms.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              isLoading={isSendingOtp}
              disabled={isSendingOtp || !isTermsAccepted}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-xl transition-colors"
            >
              {signUp.submitButton}
            </Button>
          </div>

          <div className="text-center lg:text-right text-primary-500 text-sm sm:text-base font-light mt-2">
            <Link
              href={ROUTES.SIGN_IN}
              className="hover:underline transition-colors"
            >
              {signUp.signInLink}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
