"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button } from "@/shared/components/ui";

const { changePassword: content, errors: errorMessages, success } = dashboardContent;

// Form validation schema
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, errorMessages.oldPasswordRequired),
    newPassword: z.string().min(6, errorMessages.passwordTooShort),
    confirmPassword: z.string().min(1, errorMessages.confirmPasswordRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: errorMessages.passwordMismatch,
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm: React.FC = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to change password
      console.log("Changing password:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(success.passwordChanged);
      router.push(ROUTES.DASHBOARD_ACCOUNT_INFO);
    } catch (error) {
      console.error("Failed to change password:", error);
      alert(errorMessages.updateFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const PasswordInput = ({
    label,
    placeholder,
    error,
    showPassword,
    onTogglePassword,
    ...props
  }: {
    label: string;
    placeholder: string;
    error?: string;
    showPassword: boolean;
    onTogglePassword: () => void;
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="flex flex-col gap-2 sm:gap-3">
      <label className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`
            w-full bg-[#EBEBEB] text-text-dark placeholder:text-[#B3B3B3]
            text-xs sm:text-sm lg:text-[14px] text-right
            px-10 sm:px-12 py-2 sm:py-3
            border-2 rounded-xl sm:rounded-2xl
            transition-colors duration-200
            ${error ? "border-warning-500" : "border-transparent focus:border-primary-500"}
            focus:outline-none
          `}
          {...props}
        />
        {/* Lock icon on the right */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-grey-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        {/* Toggle visibility button on the left */}
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-warning-500 text-xs">{error}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Old Password */}
        <PasswordInput
          label={content.oldPasswordLabel}
          placeholder={content.oldPasswordPlaceholder}
          error={errors.oldPassword?.message}
          showPassword={showOldPassword}
          onTogglePassword={() => setShowOldPassword(!showOldPassword)}
          {...register("oldPassword")}
        />

        {/* New Password */}
        <PasswordInput
          label={content.newPasswordLabel}
          placeholder={content.newPasswordPlaceholder}
          error={errors.newPassword?.message}
          showPassword={showNewPassword}
          onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          {...register("newPassword")}
        />

        {/* Confirm New Password */}
        <PasswordInput
          label={content.confirmPasswordLabel}
          placeholder={content.confirmPasswordPlaceholder}
          error={errors.confirmPassword?.message}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          {...register("confirmPassword")}
        />

        {/* Save Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={!isDirty || !isValid || isSaving}
            isLoading={isSaving}
            className="w-full !rounded-xl h-12"
          >
            {content.saveChanges}
          </Button>
        </div>
      </form>
    </div>
  );
};
