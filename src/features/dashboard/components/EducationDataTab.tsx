"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent, authContent } from "@/content";
import { Input, Select } from "@/shared/components/ui";
import { OnboardingDataModal } from "@/features/auth/components/OnboardingDataModal";
import { GraduationYearPicker } from "@/features/auth/components/GraduationYearPicker";
import { QualificationCard } from "@/features/auth/components/QualificationCard";
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
  institution: z.string().min(1, "المؤسسة/الجامعة مطلوبة"),
  grade: z.string().optional(),
  graduationDate: z.string().min(1, "سنة التخرج مطلوبة"),
});

type QualificationFormData = z.infer<typeof qualificationSchema>;

interface EducationDataTabProps {
  isEditing: boolean;
  onSave?: () => void;
}

// Degree types in Arabic
const DEGREE_TYPES = [
  { value: "دبلوم", label: "دبلوم" },
  { value: "بكالوريوس", label: "بكالوريوس" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
  { value: "دبلوم عالي", label: "دبلوم عالي" },
  { value: "شهادة مهنية", label: "شهادة مهنية" },
];

export const EducationDataTab: React.FC<EducationDataTabProps> = ({
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const { onboarding } = authContent;
  const [editingQualification, setEditingQualification] =
    useState<Qualification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [qualificationToDelete, setQualificationToDelete] = useState<
    number | null
  >(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  // Hooks
  const { qualifications, isLoading } = useQualifications();
  const { addQualificationAsync, isLoading: isAdding } = useAddQualification();
  const { updateQualificationAsync, isLoading: isUpdating } =
    useUpdateQualification();
  const { deleteQualificationAsync, isLoading: isDeleting } =
    useDeleteQualification();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    mode: "onChange",
    defaultValues: {
      degreeType: "",
      title: "",
      institution: "",
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
        title: editingQualification.major ?? editingQualification.title ?? "",
        institution: editingQualification.institution || editingQualification.grade || "",
        grade: editingQualification.grade || "",
        graduationDate: editingQualification.graduationDate
          ? new Date(editingQualification.graduationDate)
              .getFullYear()
              .toString()
          : "",
      });
    } else {
      reset({
        degreeType: "",
        title: "",
        institution: "",
        grade: "",
        graduationDate: "",
      });
    }
  }, [editingQualification, reset]);

  const handleSaveQualification = async (data: QualificationFormData) => {
    setError(null);
    try {
      const requestData: CreateQualificationRequest = {
        degreeType: data.degreeType,
        institution: data.institution || undefined,
        major: data.title,
        grade: data.grade || undefined,
        graduationDate: `${data.graduationDate}-06-15`,
      };

      if (editingQualification) {
        const response = await updateQualificationAsync({
          id: editingQualification.id,
          data: requestData,
        });
        if (response.status) {
          closeModal();
          onSave?.();
        } else {
          setError(response.message || "فشل في تحديث المؤهل");
        }
      } else {
        const response = await addQualificationAsync(requestData);
        if (response.status) {
          closeModal();
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

  const handleDeleteQualification = (id: number) => {
    setQualificationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (qualificationToDelete === null) return;
    setError(null);
    try {
      const response = await deleteQualificationAsync(qualificationToDelete);
      if (!response.status) {
        setError(response.message || "فشل في حذف المؤهل");
      } else {
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 3000);
      }
    } catch (err) {
      console.error("Delete qualification error:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setShowDeleteConfirm(false);
      setQualificationToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingQualification(null);
    reset({
      degreeType: "",
      title: "",
      institution: "",
      grade: "",
      graduationDate: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (qualification: Qualification) => {
    setEditingQualification(qualification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQualification(null);
    setError(null);
    reset();
  };

  const getDegreeLabel = (value: string | null) => {
    if (!value) return "-";
    const degree = DEGREE_TYPES.find((d) => d.value === value);
    return degree?.label || value;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-right">
          {error}
        </div>
      )}

      {/* Qualification Cards */}
      <div className="space-y-4">
        {qualifications.map((qualification) => (
          <QualificationCard
            key={qualification.id}
            degree={`${getDegreeLabel(qualification.degreeType)} ${(qualification.major ?? qualification.title) || ""}`.trim()}
            institution={qualification.institution || qualification.grade || "-"}
            year={
              qualification.graduationDate
                ? new Date(qualification.graduationDate).getFullYear().toString()
                : ""
            }
            onEdit={() => openEditModal(qualification)}
            onDelete={() => handleDeleteQualification(qualification.id)}
          />
        ))}

        {/* Add Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 text-primary-500 justify-start w-full mt-4"
        >
          <Image
            src="/images/auth/plus.svg"
            alt="Add"
            className="h-5 w-5 md:h-6 md:w-6"
            width={20}
            height={20}
          />
          <span className="font-light text-base md:text-lg">
            {qualifications.length === 0
              ? onboarding.qualifications.firstAddButton
              : onboarding.qualifications.addButton}
          </span>
        </button>
      </div>

      {/* Delete Toast */}
      {showDeleteToast && (
        <div
          className="fixed bottom-4 right-4 px-6 py-3 rounded-[20px] shadow-lg z-50 w-full md:w-165 h-13.5 flex items-center gap-3"
          style={{ backgroundColor: "#f3d8da" }}
        >
          <Image
            src="/icons/ui/information-circle.svg"
            alt="info"
            width={20}
            height={20}
          />
          <p className="font-light" style={{ color: "#b1363e" }}>
            تم حذف البيانات
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setQualificationToDelete(null);
                  }}
                  className="p-1 hover:bg-grey-100 rounded-lg transition-colors"
                  aria-label="إغلاق"
                >
                  <svg
                    className="w-5 h-5 text-grey-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <p className="text-grey-600 text-center flex-1">
                  هل انت متأكد من حذف البيانات؟
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-[20px] bg-warning-500 text-white hover:bg-warning-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "جاري الحذف..." : "حذف البيانات"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setQualificationToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-[20px] border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Qualification Modal */}
      <OnboardingDataModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingQualification
            ? onboarding.qualifications.modalEditTitle
            : onboarding.qualifications.modalTitle
        }
        submitLabel={
          editingQualification
            ? onboarding.qualifications.editButton
            : onboarding.qualifications.saveButton
        }
        onSubmit={handleSubmit(handleSaveQualification)}
        isLoading={isSaving}
        isEditing={!!editingQualification}
        isFormValid={isValid}
      >
        <Select
          label={onboarding.qualifications.degreeLabel}
          placeholder="اختر الدرجة العلمية"
          options={DEGREE_TYPES}
          error={errors.degreeType?.message}
          {...register("degreeType")}
        />
        <Input
          label={onboarding.qualifications.institutionLabel}
          placeholder="مثال: جامعة الملك فهد"
          error={errors.institution?.message}
          className="text-right"
          {...register("institution")}
        />
        <Input
          label={onboarding.qualifications.titleLabel}
          placeholder="مثال: تربية لغة عربية"
          error={errors.title?.message}
          className="text-right"
          {...register("title")}
        />
        <Controller
          name="graduationDate"
          control={control}
          render={({ field }) => (
            <GraduationYearPicker
              label={onboarding.qualifications.graduationDateLabel}
              placeholder="اختر السنة"
              value={field.value}
              onChange={field.onChange}
              error={errors.graduationDate?.message}
            />
          )}
        />
      </OnboardingDataModal>
    </div>
  );
};
