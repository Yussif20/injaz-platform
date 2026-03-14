/**
 * Register Form Component - 2-step OTP-verified registration flow
 * Step 1: Collect all details (name, phone, gender, password, terms)
 * Step 2: Verify OTP (4 digits) then register with verification code
 */

"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Button, Select } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import { useRegister } from "../hooks/useRegister";
import {
  registerDetailsSchema,
  type RegisterDetailsFormValues,
} from "../validations/auth.schemas";
import { Gender } from "../types/auth.types";
import { OtpInput } from "./OtpInput";
import { StepIndicator } from "./StepIndicator";

type RegisterStep = "details" | "otp";

const STEP_LABELS = [
  authContent.steps.details,
  authContent.steps.verify,
];

export function RegisterForm() {
  const { signUp, otp, buttons } = authContent;
  const [step, setStep] = useState<RegisterStep>("details");
  const [countryCode, setCountryCode] = useState("+966");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const phoneMaxLength = countryCode === "+20" ? 10 : 9;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    sendOtpAsync,
    isSendingOtp,
    sendOtpError,
    sendOtp,
    register: registerUser,
    isRegistering,
    registerError,
    reset: resetMutations,
  } = useRegister();

  // Details form (step 1)
  const detailsForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const isTermsAccepted = useWatch({
    control: detailsForm.control,
    name: "acceptTerms",
  });

  // Store form data for step 2 submission
  const [formData, setFormData] = useState<RegisterDetailsFormValues | null>(null);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Submit details → send OTP
  const handleDetailsSubmit = async (data: RegisterDetailsFormValues) => {
    const phone = `${countryCode}${data.phone.replace(/^\+/, "")}`;
    setNormalizedPhone(phone);
    setFormData(data);

    try {
      await sendOtpAsync(phone);
      setStep("otp");
      setResendTimer(60);
    } catch {
      // Error handled by mutation
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    sendOtp(normalizedPhone);
    setResendTimer(60);
    setOtpCode("");
  };

  // Step 2: Submit OTP → register-with-otp (backend verifies OTP internally)
  const handleOtpVerify = () => {
    if (otpCode.length !== 4 || !formData) return;

    setOtpError(null);
    registerUser(
      {
        fullName: formData.fullName,
        phone: normalizedPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: Number(formData.gender) as Gender,
        email: "",
        verificationCode: otpCode,
      },
    );
  };

  // Go back to details
  const handleBack = () => {
    resetMutations();
    setOtpError(null);
    setOtpCode("");
    setStep("details");
  };

  // Handle phone input - only allow digits, enforce max length
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, phoneMaxLength);
  };

  // Render label with required (*) in warning color
  const requiredLabel = (text: string) =>
    text.includes("*") ? (
      <>
        {text.split("*").flatMap((part, i) =>
          i === 0 ? [part] : [<span key={i} className="text-warning-500">*</span>, part],
        )}
      </>
    ) : (
      text
    );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={step === "details" ? 1 : 2}
        totalSteps={2}
        labels={STEP_LABELS}
      />

      {/* Step 1: Details Form */}
      {step === "details" && (
        <form
          onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)}
          className="flex flex-col gap-5 sm:gap-6 text-right"
        >
          {(registerError || sendOtpError) && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {registerError?.message || sendOtpError?.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="fullName"
              >
                {requiredLabel(signUp.fullNameLabel)}
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
                {requiredLabel(signUp.phoneLabel)}
                <span className="text-warning-500 text-xs sm:text-sm font-normal">
                  {" "}
                  {signUp.phoneNote}
                </span>
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  maxLength={phoneMaxLength}
                  placeholder={signUp.phonePlaceholder}
                  {...detailsForm.register("phone", {
                    onChange: handlePhoneInput,
                  })}
                  className={`
                    w-full bg-grey-100 text-text-dark placeholder-grey-400 text-sm sm:text-base
                    pr-24 pl-4 py-2.5 sm:py-3 rounded-xl outline-none text-right
                    border-2 transition-colors duration-200
                    ${
                      detailsForm.formState.errors.phone
                        ? "border-warning-500"
                        : "border-transparent focus:border-primary-500"
                    }
                  `}
                />
                <select
                  aria-label="country-code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    bg-white/80 text-text-dark text-xs sm:text-sm
                    px-2.5 sm:px-3 pr-6 py-1.5 sm:py-2
                    rounded-full border border-grey-300 shadow-sm
                    outline-none cursor-pointer
                    focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                    appearance-none
                  "
                  style={{
                    backgroundImage: "url('/icons/ui/arrow-down.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 0.5rem center",
                    backgroundSize: "14px 14px",
                  }}
                >
                  <option value="+20">+20</option>
                  <option value="+966">+966</option>
                </select>
              </div>
              {detailsForm.formState.errors.phone && (
                <p className="text-warning-500 text-xs mt-1">
                  {detailsForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Gender (alone on its row) */}
            <Select
              label={`${signUp.genderLabel}*`}
              placeholder={signUp.genderPlaceholder}
              options={[
                { value: String(Gender.Male), label: signUp.genderMale },
                { value: String(Gender.Female), label: signUp.genderFemale },
              ]}
              error={detailsForm.formState.errors.gender?.message}
              {...detailsForm.register("gender")}
            />
            <div className="hidden lg:block" />

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm sm:text-base font-medium text-text-dark"
                htmlFor="password"
              >
                {requiredLabel(signUp.passwordLabel)}
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
                  {...detailsForm.register("password", {
                    onChange: () => detailsForm.trigger("password"),
                  })}
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
                      showPassword
                        ? "/icons/ui/lock-open.svg"
                        : "/icons/ui/lock.svg"
                    }
                    alt="toggle password visibility"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {detailsForm.formState.errors.password && (
                <p className="text-xs text-red-600 mt-1">
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
                {requiredLabel(signUp.confirmPasswordLabel)}
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
                        ? "/icons/ui/lock-open.svg"
                        : "/icons/ui/lock.svg"
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
                {requiredLabel(signUp.termsLabel)}
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
              className="w-full bg-primary-500 hover:bg-primary-800 text-white text-base sm:text-lg font-medium py-3 sm:py-3.5 rounded-xl transition-colors"
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

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <div className="flex flex-col gap-5 sm:gap-6 text-right">
          {(sendOtpError || otpError || registerError) && (
            <div className="bg-warning-50 border border-warning-500 text-warning-700 px-4 py-3 rounded-xl text-sm text-right">
              {otpError || registerError?.message || sendOtpError?.message}
            </div>
          )}

          <div className="text-center mb-2">
            <p className="text-sm sm:text-base text-grey-600">
              {otp.sentTo} <span dir="ltr">{normalizedPhone}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base font-medium text-text-dark text-center">
              {otp.inputLabel}
            </label>
            <OtpInput
              value={otpCode}
              onChange={(value) => {
                setOtpCode(value);
                setOtpError(null);
              }}
              length={4}
              disabled={isRegistering}
              error={otpError ? " " : undefined}
            />
          </div>

          <div className="flex justify-center gap-2 text-sm">
            <span className="text-grey-500">{otp.resendText}</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isRegistering}
              className={`text-primary-500 ${
                resendTimer > 0 || isRegistering
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
              disabled={isRegistering}
              className="flex-1 py-3 sm:py-3.5 rounded-xl"
            >
              {buttons.back}
            </Button>
            <Button
              type="button"
              onClick={handleOtpVerify}
              isLoading={isRegistering}
              disabled={otpCode.length !== 4 || isRegistering}
              className="flex-1 bg-primary-500 hover:bg-primary-800 text-white py-3 sm:py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otp.verifyButton}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
