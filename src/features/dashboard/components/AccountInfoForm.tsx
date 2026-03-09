"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button, ConfirmModal, Input, ProfileImage, Select } from "@/shared/components/ui";
import { useAuth } from "@/features/auth";
import {
  useMyProfile,
  useUpdateBasicInfo,
  useUpdatePersonalInfo,
  useUploadProfileImage,
  useDeleteAccount,
} from "../hooks";

// Form validation schema (gender is read-only, not submitted)
const accountInfoSchema = z.object({
  email: z
    .string()
    .email(dashboardContent.errors.invalidEmail)
    .or(z.literal("")),
});

type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

export const AccountInfoForm: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { profile, isLoading: isLoadingProfile } = useMyProfile();
  const { updateBasicInfo, isLoading: isUpdatingBasicInfo } =
    useUpdateBasicInfo();
  const { updatePersonalInfo, isLoading: isUpdatingPersonalInfo } =
    useUpdatePersonalInfo();
  const { uploadImage, isLoading: isUploadingImage } = useUploadProfileImage();
  const { deleteAccount, isLoading: isDeletingAccount } = useDeleteAccount();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | React.ReactNode | null>(null);

  const {
    accountInfo,
    modals,
    errors: errorMessages,
    success,
  } = dashboardContent;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  // Update form when profile or user data changes
  useEffect(() => {
    const email = profile?.personalInfo?.email || user?.email || "";
    reset({
      email: email,
    });
  }, [profile, user, reset]);

  // Combined loading state
  const isSaving =
    isUpdatingBasicInfo || isUpdatingPersonalInfo || isUploadingImage;

  // Check if form has any changes (including image)
  const hasChanges = isDirty || imageChanged;

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AccountInfoFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Upload image if changed
      if (imageChanged && selectedImageFile) {
        await new Promise<void>((resolve, reject) => {
          uploadImage(selectedImageFile, {
            onSuccess: (response) => {
              if (response.status) {
                resolve();
              } else {
                reject(new Error(response.message));
              }
            },
            onError: (error) => reject(error),
          });
        });
      }

      // Gender is read-only and not updated here

      // Update personal info (email) if changed
      // Send current personal info along with new email so backend receives required fields (birthDate, address, etc.)
      if (data.email !== displayData.email) {
        const personalInfo = profile?.personalInfo;

        // Guard: backend requires nationalId, birthDate, address — if missing, guide user
        if (!personalInfo?.nationalId || !personalInfo?.birthDate || !personalInfo?.address) {
          setErrorMessage(
            <>
              يرجى إكمال البيانات الشخصية أولاً (رقم الهوية، تاريخ الميلاد، العنوان) من{" "}
              <Link href={ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL} className="underline font-medium">
                صفحة بيانات الملف الشخصي
              </Link>
            </>
          );
          return;
        }

        const personalInfoPayload = {
          ...(personalInfo && {
            nationalId: personalInfo.nationalId ?? undefined,
            address: personalInfo.address ?? undefined,
            birthDate: personalInfo.birthDate
              ? personalInfo.birthDate.split("T")[0]
              : undefined,
            rankId: personalInfo.rankId ?? undefined,
          }),
          email: data.email || undefined,
        };
        const updateResult = await new Promise<{ ok: boolean; message?: string }>(
          (resolve, reject) => {
            updatePersonalInfo(personalInfoPayload, {
              onSuccess: (response) => {
                if (response.status) {
                  resolve({ ok: true });
                } else {
                  resolve({ ok: false, message: response.message });
                }
              },
              onError: (error) => reject(error),
            });
          }
        );
        if (!updateResult.ok) {
          setErrorMessage(updateResult.message || errorMessages.updateFailed);
          return;
        }
      }

      // Reset image change state
      setImageChanged(false);
      setSelectedImageFile(null);
      setSuccessMessage(success.profileUpdated);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setErrorMessage(
        error instanceof Error ? error.message : errorMessages.updateFailed,
      );
    }
  };

  const handleDeleteAccount = async () => {
    deleteAccount(undefined, {
      onSuccess: (response) => {
        if (!response.status) {
          setErrorMessage(
            response.message || errorMessages.deleteAccountFailed,
          );
        }
        setShowDeleteModal(false);
      },
      onError: (error) => {
        console.error("Failed to delete account:", error);
        setErrorMessage(errorMessages.deleteAccountFailed);
        setShowDeleteModal(false);
      },
    });
  };

  // Show loading skeleton until profile data has loaded (avoid showing empty form)
  if (isLoadingProfile && !profile) {
    return (
      <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-6 lg:p-8 animate-pulse">
        <div className="flex justify-start sm:justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-grey-200" />
            <div className="h-6 w-32 bg-grey-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-grey-200 rounded" />
              <div className="h-10 bg-grey-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use profile data if available, otherwise fall back to auth user data
  // Note: Backend uses nested structure with personalInfo for email
  // and imageUrl for profile image
  const displayData = {
    fullName: profile?.fullName || user?.fullName || "",
    phone: profile?.phone || user?.phone || "",
    gender: profile?.gender ?? user?.gender,
    email: profile?.personalInfo?.email || user?.email || "",
    profileImage: profile?.imageUrl || user?.profileImage || null,
  };

  // Backend: Male = 1, Female = 2 — gender is read-only
  const genderDisplayLabel =
    displayData.gender === 1
      ? accountInfo.genderMale
      : displayData.gender === 2
        ? accountInfo.genderFemale
        : "";

  return (
    <>
      <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-6 lg:p-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-3 bg-success-100 border border-success-500 text-success-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-warning-100 border border-warning-500 text-warning-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image: on mobile smaller, right-aligned, edit next to avatar */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 mb-8">
            <div className="w-full flex justify-start sm:justify-center sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-grey-200">
                    <ProfileImage
                      src={profileImage ?? displayData.profileImage}
                      alt={accountInfo.profileImageAlt}
                      width={70}
                      height={70}
                      className="w-full h-full object-cover"
                      fallbackSrc="/logo/logo-cyan.svg"
                    />
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
                  <Image
                    src="/icons/ui/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                  <span className="text-primary-500 font-light text-lg">
                    {accountInfo.editImage}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            {/* Name (readonly) */}
            <Input
              label={accountInfo.nameLabel}
              value={displayData.fullName}
              disabled
              readOnly
              className="text-text-dark"
            />

            {/* Gender (read-only) */}
            <Input
              label={accountInfo.genderLabel}
              value={genderDisplayLabel}
              disabled
              readOnly
              className="text-text-dark"
            />

            {/* Email (editable) */}
            <Input
              label={accountInfo.emailLabel}
              type="email"
              placeholder={accountInfo.emailPlaceholder}
              error={errors.email?.message}
              className="text-text-dark"
              {...register("email")}
            />

            {/* Phone (readonly) */}
            <Input
              label={accountInfo.phoneLabel}
              value={displayData.phone}
              disabled
              readOnly
              dir="ltr"
              className="text-text-dark text-left"
            />
          </div>
          {/* Change Password Link */}
          <div className="pt-2">
            <Link
              href={ROUTES.DASHBOARD_ACCOUNT_CHANGE_PASSWORD}
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-700 transition-colors"
            >
              <Image
                src="/icons/ui/lock-primary-color.svg"
                alt="change password"
                width={24}
                height={24}
              />
              <span className="font-light text-lg">
                {accountInfo.changePassword}
              </span>
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
            <Image
              src="/icons/ui/delete.svg"
              alt="delete account"
              width={24}
              height={24}
            />
            <span className="font-light text-lg">
              {accountInfo.deleteAccount}
            </span>
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
        isLoading={isDeletingAccount}
      />
    </>
  );
};
