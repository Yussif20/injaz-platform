"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, Input, Select } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import {
  useQualifications,
  useAddQualification,
  useUpdateQualification,
  useDeleteQualification,
} from "../hooks";
import type { Qualification, CreateQualificationRequest } from "../types/me.types";

// Validation schema for qualification form
const qualificationSchema = z.object({
  degreeType: z.string().min(1, "نوع الشهادة مطلوب"),
  title: z.string().min(1, "التخصص مطلوب"),
  grade: z.string().optional(),
  graduationDate: z.string().min(1, "تاريخ التخرج مطلوب"),
});

type QualificationFormData = z.infer<typeof qualificationSchema>;

interface EducationDataTabProps {
  isEditing: boolean;
  onSave?: () => void;
}

// Degree types in Arabic
const DEGREE_TYPES = [
  { value: "diploma", label: "دبلوم" },
  { value: "bachelor", label: "بكالوريوس" },
  { value: "master", label: "ماجستير" },
  { value: "doctorate", label: "دكتوراه" },
  { value: "higher_diploma", label: "دبلوم عالي" },
  { value: "professional", label: "شهادة مهنية" },
];

export const EducationDataTab: React.FC<EducationDataTabProps> = ({
  isEditing,
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { qualifications, isLoading, refetch } = useQualifications();
  const { addQualificationAsync, isLoading: isAdding } = useAddQualification();
  const { updateQualificationAsync, isLoading: isUpdating } = useUpdateQualification();
  const { deleteQualificationAsync, isLoading: isDeleting } = useDeleteQualification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      degreeType: "",
      title: "",
      grade: "",
      graduationDate: "",
    },
  });

  const isSaving = isAdding || isUpdating;

  // Reset form when editing qualification changes
  useEffect(() => {
    if (editingQualification) {
      reset({
        degreeType: editingQualification.degreeType || "",
        title: editingQualification.title || "",
        grade: editingQualification.grade || "",
        graduationDate: editingQualification.graduationDate
          ? editingQualification.graduationDate.split("T")[0]
          : "",
      });
    } else if (isAddingNew) {
      reset({
        degreeType: "",
        title: "",
        grade: "",
        graduationDate: "",
      });
    }
  }, [editingQualification, isAddingNew, reset]);

  const handleSaveQualification = async (data: QualificationFormData) => {
    setError(null);
    try {
      const requestData: CreateQualificationRequest = {
        degreeType: data.degreeType,
        title: data.title,
        grade: data.grade || undefined,
        graduationDate: data.graduationDate,
      };

      if (editingQualification) {
        // Update existing qualification
        const response = await updateQualificationAsync({
          id: editingQualification.id,
          data: requestData,
        });
        if (response.status) {
          setEditingQualification(null);
          onSave?.();
        } else {
          setError(response.message || "فشل في تحديث المؤهل");
        }
      } else {
        // Add new qualification
        const response = await addQualificationAsync(requestData);
        if (response.status) {
          setIsAddingNew(false);
          reset();
          onSave?.();
        } else {
          setError(response.message || "فشل في إضافة المؤهل");
        }
      }
    } catch (err) {
      console.error("Save qualification error:", err);
      setError("حدث خطأ غير متوقع");
    }
  };

  const handleDeleteQualification = async (id: number) => {
    setError(null);
    try {
      const response = await deleteQualificationAsync(id);
      if (!response.status) {
        setError(response.message || "فشل في حذف المؤهل");
      }
    } catch (err) {
      console.error("Delete qualification error:", err);
      setError("حدث خطأ غير متوقع");
    }
  };

  const handleCancelEdit = () => {
    setEditingQualification(null);
    setIsAddingNew(false);
    setError(null);
    reset();
  };

  const getDegreeLabel = (value: string | null) => {
    if (!value) return "-";
    const degree = DEGREE_TYPES.find((d) => d.value === value);
    return degree?.label || value;
  };

  const formatDate = (dateString: string | null) => {
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

  // Form for adding/editing
  if (isEditing && (isAddingNew || editingQualification)) {
    return (
      <form onSubmit={handleSubmit(handleSaveQualification)} className="space-y-6">
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {editingQualification ? "تعديل المؤهل" : "إضافة مؤهل جديد"}
          </h3>

          {error && (
            <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg mb-4 text-right">
              {error}
            </div>
          )}

          <div className="bg-shade-100 rounded-xl p-4 space-y-3">
            <Select
              label={`${profileData.educationFields.degree}*`}
              options={DEGREE_TYPES}
              error={errors.degreeType?.message}
              {...register("degreeType")}
            />
            <Input
              label={`${profileData.educationFields.specialization}*`}
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="التقدير"
              error={errors.grade?.message}
              {...register("grade")}
            />
            <Input
              label={`${profileData.educationFields.graduationYear}*`}
              type="date"
              dir="ltr"
              className="text-left"
              error={errors.graduationDate?.message}
              {...register("graduationDate")}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelEdit}
            className="flex-1 rounded-xl h-12"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            isLoading={isSaving}
            className="flex-1 rounded-xl h-12"
          >
            {editingQualification ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </form>
    );
  }

  // Edit mode list view
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.educationTitle}
          </h3>

          {error && (
            <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg mb-4 text-right">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {qualifications.map((qualification) => (
              <div
                key={qualification.id}
                className="bg-shade-100 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteQualification(qualification.id)}
                      disabled={isDeleting}
                      className="text-warning-500 hover:text-warning-700 text-sm disabled:opacity-50"
                    >
                      {profileData.removeCertification}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingQualification(qualification)}
                      className="text-primary-500 hover:text-primary-700 text-sm"
                    >
                      تعديل
                    </button>
                  </div>
                  <span className="text-grey-500 text-sm">
                    {getDegreeLabel(qualification.degreeType)}
                  </span>
                </div>
                <div className="text-right text-grey-700">
                  <p>
                    <strong>التخصص:</strong> {qualification.title || "-"}
                  </p>
                  <p>
                    <strong>التقدير:</strong> {qualification.grade || "-"}
                  </p>
                  <p>
                    <strong>تاريخ التخرج:</strong> {formatDate(qualification.graduationDate)}
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-shade-100 transition-colors"
            >
              + {profileData.addCertification}
            </button>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => onSave?.()}
          className="w-full rounded-xl h-12"
        >
          {profileData.saveChanges}
        </Button>
      </div>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.educationTitle}
        </h3>

        {qualifications.length === 0 ? (
          <div className="bg-shade-100 rounded-xl py-8 px-6 text-center text-grey-500">
            لا توجد مؤهلات مسجلة
          </div>
        ) : (
          qualifications.map((qualification) => (
            <div
              key={qualification.id}
              className="bg-shade-100 rounded-xl py-5 px-6 space-y-6 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={profileData.educationFields.degree}
                  value={getDegreeLabel(qualification.degreeType)}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={profileData.educationFields.specialization}
                  value={qualification.title || "-"}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label="التقدير"
                  value={qualification.grade || "-"}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={profileData.educationFields.graduationYear}
                  value={formatDate(qualification.graduationDate)}
                />
              </div>
            </div>
          ))
        )}
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
