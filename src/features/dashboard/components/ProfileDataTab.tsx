"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, DatePicker, Input } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import { useMyProfile, useUpdatePersonalInfo } from "../hooks";
import type { UpdatePersonalInfoRequest } from "../types/me.types";

// Validation schema
const myDataSchema = z.object({
  nationalId: z
    .string()
    .min(1, "رقم الهوية مطلوب")
    .regex(/^\d{14}$/, "رقم الهوية يجب أن يكون 14 أرقام"),
  address: z.string().min(1, "العنوان مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح").or(z.literal("")),
});

type MyDataFormData = z.infer<typeof myDataSchema>;

interface ProfileDataTabProps {
  isEditing: boolean;
  onSave?: () => void;
  mobileEditButton?: React.ReactNode;
}

export const ProfileDataTab: React.FC<ProfileDataTabProps> = ({
  isEditing,
  onSave,
  mobileEditButton,
}) => {
  const { profileData } = dashboardContent;
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { profile, isLoading } = useMyProfile();
  const { updatePersonalInfoAsync, isLoading: isSaving } =
    useUpdatePersonalInfo();

  const personalInfo = profile?.personalInfo;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<MyDataFormData>({
    resolver: zodResolver(myDataSchema),
    defaultValues: {
      nationalId: "",
      address: "",
      birthDate: "",
      email: "",
    },
  });

  // Reset form when personal info loads
  useEffect(() => {
    if (personalInfo) {
      reset({
        nationalId: personalInfo.nationalId || "",
        address: personalInfo.address || "",
        birthDate: personalInfo.birthDate
          ? personalInfo.birthDate.split("T")[0]
          : "",
        email: personalInfo.email || "",
      });
    }
  }, [personalInfo, reset]);

  const handleSave = async (data: MyDataFormData) => {
    setError(null);
    try {
      const requestData: UpdatePersonalInfoRequest = {
        nationalId: data.nationalId,
        address: data.address,
        birthDate: data.birthDate,
        email: data.email || undefined,
      };

      const response = await updatePersonalInfoAsync(requestData);
      if (response.status) {
        onSave?.();
      } else {
        setError(response.message || "فشل في حفظ البيانات");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      setError("حدث خطأ غير متوقع");
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {error && (
          <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-right">
            {error}
          </div>
        )}

        {/* General Data Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-primary-500 text-lg font-medium text-right">
              {profileData.generalData}
            </h3>
            {mobileEditButton}
          </div>
          <div className="space-y-4">
            <Input
              label={`${profileData.fields.nationalId}*`}
              error={errors.nationalId?.message}
              {...register("nationalId")}
            />
            <Input
              label={`${profileData.fields.origin}*`}
              error={errors.address?.message}
              {...register("address")}
            />
            <DatePicker
              label={`${profileData.fields.birthDate}*`}
              value={watch("birthDate")}
              onChange={(val) =>
                setValue("birthDate", val, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              error={errors.birthDate?.message}
            />
            <Input
              label={profileData.fields.workEmail}
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>

        {/* Contact Data Section - Display Only (phone comes from profile) */}
        {profile?.phone && (
          <div>
            <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
              {profileData.contactData}
            </h3>
            <div className="bg-shade-100 rounded-xl py-5 px-6">
              <DataCard
                label={profileData.fields.whatsappNumber}
                value={profile.phone}
                valueDir="ltr"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || isSaving}
          isLoading={isSaving}
          className="w-full rounded-xl h-12"
        >
          {profileData.saveChanges}
        </Button>
      </form>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      {/* General Data Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary-500 text-lg font-medium text-right">
            {profileData.generalData}
          </h3>
          {mobileEditButton}
        </div>
        <div className="bg-shade-100 rounded-xl py-5 px-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.fields.nationalId}
              value={personalInfo?.nationalId || "-"}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.fields.origin}
              value={personalInfo?.address || "-"}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.fields.birthDate}
              value={formatDate(personalInfo?.birthDate)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.fields.workEmail}
              value={personalInfo?.email || "-"}
            />
          </div>
        </div>
      </div>

      {/* Contact Data Section */}
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.contactData}
        </h3>
        <div className="bg-shade-100 rounded-xl py-5 px-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.fields.whatsappNumber}
              value={profile?.phone || "-"}
              valueDir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Save Button (disabled in view mode) */}
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full rounded-xl h-12 !bg-[#EBEBEB] !text-[#666] text-lg font-light !border-none"
      >
        {profileData.saveChanges}
      </Button>
    </div>
  );
};
