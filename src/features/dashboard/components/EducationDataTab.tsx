"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, Input, Select } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import type { EducationData, Certification } from "../types";

// Validation schema
const educationSchema = z.object({
  academicDegree: z.string().min(1, "الدرجة العلمية مطلوبة"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  university: z.string().min(1, "الجامعة مطلوبة"),
  graduationYear: z.string().min(1, "سنة التخرج مطلوبة"),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "اسم الشهادة مطلوب"),
      issuer: z.string().min(1, "الجهة المانحة مطلوبة"),
      year: z.string().min(1, "السنة مطلوبة"),
    })
  ),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationDataTabProps {
  isEditing: boolean;
  onSave?: (data: EducationFormData) => void;
}

// Dummy data
const dummyData: EducationData = {
  academicDegree: "bachelor",
  specialization: "تقنية المعلومات",
  university: "جامعة الملك سعود",
  graduationYear: "2010",
  certifications: [
    {
      id: "1",
      name: "شهادة ICDL",
      issuer: "المعهد البريطاني",
      year: "2015",
    },
    {
      id: "2",
      name: "دورة تطوير المناهج",
      issuer: "وزارة التعليم",
      year: "2018",
    },
  ],
};

export const EducationDataTab: React.FC<EducationDataTabProps> = ({
  isEditing,
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: dummyData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const handleSave = async (data: EducationFormData) => {
    setIsSaving(true);
    try {
      console.log("Saving education data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave?.(data);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addCertification = () => {
    append({
      id: Date.now().toString(),
      name: "",
      issuer: "",
      year: "",
    });
  };

  const getDegreeLabel = (value: string) => {
    const degree = profileData.academicDegrees.find((d) => d.value === value);
    return degree?.label || value;
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Academic Qualifications */}
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.educationTitle}
          </h3>
          <div className="space-y-4">
            <Select
              label={`${profileData.educationFields.degree}*`}
              options={profileData.academicDegrees}
              error={errors.academicDegree?.message}
              {...register("academicDegree")}
            />
            <Input
              label={`${profileData.educationFields.specialization}*`}
              error={errors.specialization?.message}
              {...register("specialization")}
            />
            <Input
              label={`${profileData.educationFields.university}*`}
              error={errors.university?.message}
              {...register("university")}
            />
            <Input
              label={`${profileData.educationFields.graduationYear}*`}
              error={errors.graduationYear?.message}
              {...register("graduationYear")}
            />
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.certificationsTitle}
          </h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-shade-100 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-warning-500 hover:text-warning-700 text-sm"
                  >
                    {profileData.removeCertification}
                  </button>
                  <span className="text-grey-500 text-sm">
                    شهادة {index + 1}
                  </span>
                </div>
                <Input
                  label={profileData.educationFields.certName}
                  error={errors.certifications?.[index]?.name?.message}
                  {...register(`certifications.${index}.name`)}
                />
                <Input
                  label={profileData.educationFields.certIssuer}
                  error={errors.certifications?.[index]?.issuer?.message}
                  {...register(`certifications.${index}.issuer`)}
                />
                <Input
                  label={profileData.educationFields.certYear}
                  error={errors.certifications?.[index]?.year?.message}
                  {...register(`certifications.${index}.year`)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-shade-100 transition-colors"
            >
              + {profileData.addCertification}
            </button>
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
      {/* Academic Qualifications */}
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.educationTitle}
        </h3>
        <div className="bg-shade-100 rounded-xl py-5 px-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.educationFields.degree}
              value={getDegreeLabel(dummyData.academicDegree)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.educationFields.specialization}
              value={dummyData.specialization}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.educationFields.university}
              value={dummyData.university}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
            <DataCard
              label={profileData.educationFields.graduationYear}
              value={dummyData.graduationYear}
            />
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.certificationsTitle}
        </h3>
        {dummyData.certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="bg-shade-100 rounded-xl py-5 px-6 space-y-6 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.educationFields.certName}
                value={cert.name}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.educationFields.certIssuer}
                value={cert.issuer}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.educationFields.certYear}
                value={cert.year}
              />
            </div>
          </div>
        ))}
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
