"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button } from "@/shared/components/ui";

const {
  changePassword: content,
  errors: errorMessages,
  success,
} = dashboardContent;

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

// Password input component defined outside to prevent re-renders
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    placeholder: string;
    error?: string;
    showPassword: boolean;
    onTogglePassword: () => void;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    { label, placeholder, error, showPassword, onTogglePassword, ...props },
    ref
  ) => (
    <div className="flex flex-col gap-2">
      <label className="text-base font-normal text-[#333]">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`
          w-full bg-white text-[#333] placeholder:text-[#B3B3B3]
          text-sm text-right
          px-3 py-2 pl-10
          border rounded-2xl
          transition-colors duration-200
          ${
            error
              ? "border-warning-500"
              : "border-[#EBEBEB] focus:border-primary-500"
          }
          focus:outline-none
        `}
          {...props}
        />
        {/* Toggle visibility button on the left */}
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
          tabIndex={-1}
        >
          <Image
            src={showPassword ? "/icons/unlock.svg" : "/icons/lock.svg"}
            alt={showPassword ? "hide password" : "show password"}
            width={20}
            height={20}
          />
        </button>
      </div>
      {error && <p className="text-warning-500 text-xs">{error}</p>}
    </div>
  )
);

PasswordInput.displayName = "PasswordInput";

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
            className="w-full rounded-xl h-12"
          >
            {content.saveChanges}
          </Button>
        </div>
      </form>
    </div>
  );
};
