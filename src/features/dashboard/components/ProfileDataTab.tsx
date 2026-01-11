"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, Input } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import type { MyProfileData } from "../types";

// Validation schema
const myDataSchema = z.object({
  nationalId: z.string().min(1, "رقم الهوية مطلوب"),
  origin: z.string().min(1, "المنشأ مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  workEmail: z.string().email("البريد الإلكتروني غير صالح").or(z.literal("")),
  whatsappNumber: z.string().optional(),
});

type MyDataFormData = z.infer<typeof myDataSchema>;

interface ProfileDataTabProps {
  isEditing: boolean;
  onSave?: (data: MyDataFormData) => void;
}

// Dummy data for display
const dummyData: MyProfileData = {
  nationalId: "2583691472",
  origin: "الرياض",
  birthDate: "2 / 10 / 1988",
  workEmail: "mohamed@gmail.com",
  whatsappNumber: "0512345678",
};

export const ProfileDataTab: React.FC<ProfileDataTabProps> = ({
  isEditing,
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<MyDataFormData>({
    resolver: zodResolver(myDataSchema),
    defaultValues: dummyData,
  });

  const handleSave = async (data: MyDataFormData) => {
    setIsSaving(true);
    try {
      // TODO: Implement API call
      console.log("Saving data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave?.(data);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* General Data Section */}
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.generalData}
          </h3>
          <div className="space-y-4">
            <Input
              label={`${profileData.fields.nationalId}*`}
              placeholder={dummyData.nationalId}
              error={errors.nationalId?.message}
              {...register("nationalId")}
            />
            <Input
              label={`${profileData.fields.origin}*`}
              placeholder={dummyData.origin}
              error={errors.origin?.message}
              {...register("origin")}
            />
            <Input
              label={`${profileData.fields.birthDate}*`}
              type="text"
              placeholder={dummyData.birthDate}
              error={errors.birthDate?.message}
              {...register("birthDate")}
            />
            <Input
              label={`${profileData.fields.workEmail}*`}
              type="email"
              placeholder={dummyData.workEmail}
              error={errors.workEmail?.message}
              {...register("workEmail")}
            />
          </div>
        </div>

        {/* Contact Data Section */}
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.contactData}
          </h3>
          <div className="space-y-4">
            <Input
              label={profileData.fields.whatsappNumber}
              placeholder={dummyData.whatsappNumber}
              dir="ltr"
              className="text-left"
              {...register("whatsappNumber")}
            />
          </div>
        </div>

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
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.generalData}
        </h3>
        <div className="bg-shade-100 rounded-xl py-5 px-6 space-y-6">
          <DataCard
            label={profileData.fields.nationalId}
            value={dummyData.nationalId}
          />
          <DataCard
            label={profileData.fields.origin}
            value={dummyData.origin}
          />
          <DataCard
            label={profileData.fields.birthDate}
            value={dummyData.birthDate}
          />
          <DataCard
            label={profileData.fields.workEmail}
            value={dummyData.workEmail}
          />
        </div>
      </div>

      {/* Contact Data Section */}
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.contactData}
        </h3>
        <div className="bg-shade-100 rounded-xl py-5 px-6 space-y-6">
          <DataCard
            label={profileData.fields.whatsappNumber}
            value={dummyData.whatsappNumber}
          />
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
