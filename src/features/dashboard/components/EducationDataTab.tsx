"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent, authContent } from "@/content";
import { Input, Select } from "@/shared/components/ui";
import { OnboardingDataModal } from "@/features/auth/components/OnboardingDataModal";
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

// Generate years for dropdown
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

const YEARS = generateYears();

export const EducationDataTab: React.FC<EducationDataTabProps> = ({
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const { onboarding } = authContent;
  const [editingQualification, setEditingQualification] =
    useState<Qualification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
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
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    mode: "onChange",
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
          ? new Date(editingQualification.graduationDate)
              .getFullYear()
              .toString()
          : "",
      });
    } else {
      reset({
        degreeType: "",
        title: "",
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
        title: data.title,
        grade: data.grade || undefined,
        graduationDate: `${data.graduationDate}-01-01`,
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
    setActiveMenuId(null);
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

  const formatYear = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString;
    }
  };

  const getDegreeLabel = (value: string | null) => {
    if (!value) return "-";
    const degree = DEGREE_TYPES.find((d) => d.value === value);
    return degree?.label || value;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-qualification-menu]")) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (qualificationId: number) => {
    setActiveMenuId((current) =>
      current === qualificationId ? null : qualificationId,
    );
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
          <div
            key={qualification.id}
            className="bg-shade-100 rounded-xl p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1 text-right border-r-2 border-primary-500 pr-3">
              <p className="font-normal text-[#333] text-sm md:text-lg">
                {getDegreeLabel(qualification.degreeType)}{" "}
                {qualification.title || ""}
              </p>
              <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
                {qualification.grade || "-"}
              </p>
              <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
                {formatYear(qualification.graduationDate)}
              </p>
            </div>
            <div className="relative" data-qualification-menu>
              <button
                type="button"
                className="p-1"
                aria-label="خيارات"
                onClick={() => toggleMenu(qualification.id)}
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
              {activeMenuId === qualification.id ? (
                <div className="absolute left-0 top-full mt-1 bg-white border border-grey-200 rounded-lg shadow-lg z-10 min-w-25">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(qualification);
                      setActiveMenuId(null);
                    }}
                    className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors text-sm text-grey-700 flex items-center justify-start gap-1"
                  >
                    <Image
                      src="/icons/ui/edit-black.svg"
                      alt="تعديل"
                      width={16}
                      height={16}
                    />
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteQualification(qualification.id);
                      setActiveMenuId(null);
                    }}
                    className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors text-sm text-warning-500 flex items-center justify-start gap-1"
                  >
                    <Image
                      src="/icons/ui/delete.svg"
                      alt="حذف"
                      width={16}
                      height={16}
                    />
                    <span>حذف</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
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
          error={errors.grade?.message}
          {...register("grade")}
        />
        <Input
          label={onboarding.qualifications.titleLabel}
          placeholder="مثال: تربية لغة عربية"
          error={errors.title?.message}
          {...register("title")}
        />
        <Select
          label={onboarding.qualifications.graduationDateLabel}
          placeholder="اختر السنة"
          options={YEARS}
          error={errors.graduationDate?.message}
          {...register("graduationDate")}
        />
      </OnboardingDataModal>
    </div>
  );
};
