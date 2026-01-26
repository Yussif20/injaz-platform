"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import type {
  Qualification,
  CreateQualificationRequest,
} from "../types/me.types";

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
  const [editingQualification, setEditingQualification] =
    useState<Qualification | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { qualifications, isLoading, refetch } = useQualifications();
  const { addQualificationAsync, isLoading: isAdding } = useAddQualification();
  const { updateQualificationAsync, isLoading: isUpdating } =
    useUpdateQualification();
  const { deleteQualificationAsync, isLoading: isDeleting } =
    useDeleteQualification();

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
  if (isAddingNew || editingQualification) {
    return (
      <form
        onSubmit={handleSubmit(handleSaveQualification)}
        className="space-y-6"
      >
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
  if (false) {
    return null;
  }

  // View Mode with 3-dots menus and add button
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
              className="bg-shade-100 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="font-medium text-secondary-800 mb-1">
                  {getDegreeLabel(qualification.degreeType)}
                </p>
                <p className="text-grey-600 text-sm mb-1">
                  <strong>التخصص:</strong> {qualification.title || "-"}
                </p>
                <p className="text-grey-600 text-sm mb-1">
                  <strong>التقدير:</strong> {qualification.grade || "-"}
                </p>
                <p className="text-grey-600 text-sm">
                  <strong>تاريخ التخرج:</strong>{" "}
                  {formatDate(qualification.graduationDate)}
                </p>
              </div>
              {/* 3-dots menu */}
              <div className="relative group">
                <button
                  type="button"
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  aria-label="خيارات"
                >
                  <svg
                    className="w-5 h-5 text-grey-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
                {/* Dropdown menu */}
                <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-white border border-grey-200 rounded-lg shadow-lg z-10 min-w-40">
                  <button
                    type="button"
                    onClick={() => setEditingQualification(qualification)}
                    className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors flex items-center gap-2 text-primary-500"
                  >
                    <Image
                      src="/icons/ui/edit.svg"
                      alt="edit"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm">تعديل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQualification(qualification.id)}
                    disabled={isDeleting}
                    className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors flex items-center gap-2 text-warning-500 disabled:opacity-50"
                  >
                    <Image
                      src="/icons/ui/delete.svg"
                      alt="delete"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm">حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new button */}
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-shade-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 5v14m7-7H5"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            {profileData.addCertification || "إضافة درجة علمية آخرى"}
          </button>
        </div>
      </div>
    </div>
  );
};
