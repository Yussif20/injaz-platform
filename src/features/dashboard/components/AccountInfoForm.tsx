"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button, ConfirmModal, Input, Select } from "@/shared/components/ui";
import { useAuth, Gender } from "@/features/auth";

// Form validation schema
const accountInfoSchema = z.object({
  gender: z.enum(["male", "female"]),
  email: z
    .string()
    .email(dashboardContent.errors.invalidEmail)
    .or(z.literal("")),
});

type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

export const AccountInfoForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const {
    accountInfo,
    modals,
    errors: errorMessages,
    success,
  } = dashboardContent;

  // Map user gender to form value
  const getInitialGender = (): "male" | "female" => {
    if (user?.gender === Gender.Male) return "male";
    return "female";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      gender: getInitialGender(),
      email: user?.email || "",
    },
  });

  // Check if form has any changes (including image)
  const hasChanges = isDirty || imageChanged;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AccountInfoFormData) => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to update profile
      console.log("Saving profile:", { ...data, profileImage });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(success.profileUpdated);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(errorMessages.updateFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement API call to delete account
      console.log("Deleting account...");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(success.accountDeleted);
      router.push(ROUTES.SIGN_IN);
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert(errorMessages.deleteAccountFailed);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const genderOptions = [
    { value: "male", label: accountInfo.genderMale },
    { value: "female", label: accountInfo.genderFemale },
  ];

  return (
    <>
      <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-grey-200">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={accountInfo.profileImageAlt}
                    width={70}
                    height={70}
                    className="w-full h-full object-cover"
                  />
                ) : user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={accountInfo.profileImageAlt}
                    width={70}
                    height={70}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/pages/dashboard/avatar.svg"
                    alt={accountInfo.profileImageAlt}
                    width={70}
                    height={70}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleImageClick}
              className="flex items-center gap-2 transition-colors hover:opacity-80"
            >
              <Image src="/icons/edit.svg" alt="edit" width={24} height={24} />
              <span className="text-primary-500 font-light text-lg">
                {accountInfo.editImage}
              </span>
            </button>
          </div>
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            {/* Name (readonly) */}
            <Input
              label={accountInfo.nameLabel}
              value={user?.fullName || ""}
              disabled
              readOnly
            />

            {/* Gender (editable) */}
            <Select
              label={accountInfo.genderLabel}
              options={genderOptions}
              error={errors.gender?.message}
              {...register("gender")}
            />

            {/* Email (editable) */}
            <Input
              label={accountInfo.emailLabel}
              type="email"
              placeholder={accountInfo.emailPlaceholder}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Phone (readonly) */}
            <Input
              label={accountInfo.phoneLabel}
              value={user?.phone || ""}
              disabled
              readOnly
              dir="ltr"
              className="text-left"
            />
          </div>
          {/* Change Password Link */}
          <div className="pt-2">
            <Link
              href={ROUTES.DASHBOARD_ACCOUNT_CHANGE_PASSWORD}
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-700 transition-colors"
            >
              <Image
                src="/icons/lock-primary-color.svg"
                alt="change password"
                width={24}
                height={24}
              />
              <span className="font-normal">{accountInfo.changePassword}</span>
            </Link>
          </div>
          {/* Save Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!hasChanges || isSaving}
              isLoading={isSaving}
              className="w-full rounded-xl h-12"
            >
              {accountInfo.saveChanges}
            </Button>
          </div>
        </form>

        {/* Delete Account */}
        <div className="mt-8 pt-6 border-grey-200 flex justify-end">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 text-warning-500 hover:text-warning-700 transition-colors"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-normal">{accountInfo.deleteAccount}</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title={modals.deleteAccount.title}
        message={modals.deleteAccount.message}
        confirmText={modals.deleteAccount.confirm}
        cancelText={modals.deleteAccount.cancel}
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
