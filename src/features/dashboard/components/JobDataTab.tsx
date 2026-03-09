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
import Link from "next/link";
import { ROUTES } from "@/config";
import {
  useMyProfile,
  useCareerJobs,
  useAddCareerJob,
  useUpdateCareerJob,
  useDeleteCareerJob,
} from "../hooks";
import type { CareerJob, CreateCareerJobRequest } from "../types/me.types";

// Validation schema for single job form (سنوات العمل من - الي)
const jobSchema = z
  .object({
    school: z.string().min(1, "اسم المدرسة مطلوب"),
    jobTitle: z.string().min(1, "المسمى الوظيفي مطلوب"),
    educationalStage: z.string().min(1, "المرحلة التعليمية مطلوبة"),
    startYear: z.string().min(1, "سنة البداية مطلوبة"),
    endYear: z.string().min(1, "سنة النهاية مطلوبة"),
  })
  .refine(
    (data) => {
      const start = parseInt(data.startYear, 10);
      const end = parseInt(data.endYear, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) return true;
      return end > start;
    },
    {
      message: "سنة النهاية يجب أن تكون بعد سنة البداية",
      path: ["endYear"],
    },
  );

type JobFormData = z.infer<typeof jobSchema>;

interface JobDataTabProps {
  isEditing: boolean;
  onSave?: () => void;
}

// Educational stages
const EDUCATIONAL_STAGES = [
  { value: "رياض الأطفال", label: "رياض الأطفال" },
  { value: "المرحلة الابتدائية", label: "المرحلة الابتدائية" },
  { value: "المرحلة المتوسطة", label: "المرحلة المتوسطة" },
  { value: "المرحلة الثانوية", label: "المرحلة الثانوية" },
  { value: "التعليم العالي", label: "التعليم العالي" },
];

/** Format job year range for display: "2020 / 1442 ھ - 2024 / 1446 ھ" (Aug 1 for correct Gregorian↔Hijri alignment) */
function formatJobYearRangeDisplay(startYear: number, endYear: number): string {
  const fmt = (y: number) => {
    const dateInSecondHalf = new Date(y, 7, 1); // August 1
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      year: "numeric",
    });
    const parts = formatter.formatToParts(dateInSecondHalf);
    const yearPart = parts.find((p) => p.type === "year");
    const hijri = yearPart
      ? parseInt(yearPart.value.replace(/\D/g, ""), 10)
      : y - 622;
    return `${y} / ${hijri} ھ`;
  };
  return `${fmt(startYear)} - ${fmt(endYear)}`;
}

export const JobDataTab: React.FC<JobDataTabProps> = ({ onSave }) => {
  const { profileData } = dashboardContent;
  const { onboarding } = authContent;
  const [editingJob, setEditingJob] = useState<CareerJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  // Hooks
  const { profile } = useMyProfile();
  const personalInfoIncomplete = !profile?.personalInfo?.nationalId || !profile?.personalInfo?.birthDate || !profile?.personalInfo?.address;
  const { careerJobs, isLoading } = useCareerJobs();
  const { addCareerJobAsync, isLoading: isAdding } = useAddCareerJob();
  const { updateCareerJobAsync, isLoading: isUpdating } = useUpdateCareerJob();
  const { deleteCareerJobAsync, isLoading: isDeleting } = useDeleteCareerJob();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: "onChange", // so endYear >= startYear error shows when picking years
    defaultValues: {
      school: "",
      jobTitle: "",
      educationalStage: "",
      startYear: "",
      endYear: "",
    },
  });

  const isSaving = isAdding || isUpdating;

  // Reset form when editing job changes
  useEffect(() => {
    const jobTitle =
      editingJob?.jobTitle ??
      editingJob?.title ??
      editingJob?.rank ??
      "";
    if (editingJob) {
      reset({
        school: editingJob.school || "",
        jobTitle,
        educationalStage: editingJob.educationalStage || "",
        startYear: editingJob.startYear?.toString() || "",
        endYear:
          editingJob.endYear != null
            ? editingJob.endYear.toString()
            : new Date().getFullYear().toString(),
      });
    } else {
      reset({
        school: "",
        jobTitle: "",
        educationalStage: "",
        startYear: "",
        endYear: "",
      });
    }
  }, [editingJob, reset]);

  const handleSaveJob = async (data: JobFormData) => {
    setError(null);
    try {
      const requestData: CreateCareerJobRequest = {
        jobTitle: data.jobTitle,
        school: data.school,
        educationalStage: data.educationalStage,
        startYear: parseInt(data.startYear),
        endYear: data.endYear ? parseInt(data.endYear) : null,
      };

      if (editingJob) {
        const response = await updateCareerJobAsync({
          id: editingJob.id,
          data: requestData,
        });
        if (response.status) {
          closeModal();
          onSave?.();
        } else {
          setError(response.message || "فشل في تحديث الوظيفة");
        }
      } else {
        const response = await addCareerJobAsync(requestData);
        if (response.status) {
          closeModal();
          onSave?.();
        } else {
          setError(response.message || "فشل في إضافة الوظيفة");
        }
      }
    } catch (err) {
      console.error("Save job error:", err);
      setError("حدث خطأ غير متوقع");
    }
  };

  const handleDeleteJob = (id: number) => {
    setJobToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete === null) return;
    setError(null);
    try {
      const response = await deleteCareerJobAsync(jobToDelete);
      if (!response.status) {
        setError(response.message || "فشل في حذف الوظيفة");
      } else {
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 3000);
      }
    } catch (err) {
      console.error("Delete job error:", err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    reset({
      school: "",
      jobTitle: "",
      educationalStage: "",
      startYear: "",
      endYear: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job: CareerJob) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setError(null);
    reset();
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
      {personalInfoIncomplete && (
        <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-right">
          يرجى إكمال البيانات الشخصية أولاً (رقم الهوية، تاريخ الميلاد، العنوان) من{" "}
          <Link href={ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL} className="underline font-medium">
            صفحة بيانات الملف الشخصي
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-right">
          {error}
        </div>
      )}

      {/* Career Job Cards */}
      <div className="space-y-4">
        {careerJobs.map((job) => (
          <QualificationCard
            key={job.id}
            degree={(job.jobTitle ?? job.title ?? job.rank) || "وظيفة"}
            institution={job.school || "-"}
            year={formatJobYearRangeDisplay(
              job.startYear,
              job.endYear ?? job.startYear,
            )}
            onEdit={() => openEditModal(job)}
            onDelete={() => handleDeleteJob(job.id)}
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
            {careerJobs.length === 0
              ? onboarding.careerJobs.firstAddButton
              : onboarding.careerJobs.addButton}
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
                    setJobToDelete(null);
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
                    setJobToDelete(null);
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

      {/* Career Job Modal */}
      <OnboardingDataModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingJob
            ? onboarding.careerJobs.modalEditTitle
            : onboarding.careerJobs.modalTitle
        }
        submitLabel={
          editingJob
            ? onboarding.careerJobs.editButton
            : onboarding.careerJobs.saveButton
        }
        onSubmit={handleSubmit(handleSaveJob)}
        isLoading={isSaving}
        isEditing={!!editingJob}
        isFormValid={isValid}
      >
        <Input
          label={onboarding.careerJobs.positionLabel}
          placeholder="مثال: معلم لغة عربية"
          error={errors.jobTitle?.message}
          className="text-right"
          {...register("jobTitle")}
        />
        <Input
          label={onboarding.careerJobs.schoolLabel}
          placeholder="اسم المدرسة"
          error={errors.school?.message}
          className="text-right"
          {...register("school")}
        />
        <Select
          label={onboarding.careerJobs.stageLabel}
          placeholder="اختر المرحلة الدراسية"
          options={EDUCATIONAL_STAGES}
          error={errors.educationalStage?.message}
          {...register("educationalStage")}
        />
        <div className="grid w-full grid-cols-2 gap-4">
          <Controller
            name="startYear"
            control={control}
            render={({ field }) => (
              <div className="min-w-0 w-full">
                <GraduationYearPicker
                  label={onboarding.careerJobs.startYearLabel}
                  placeholder="من"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startYear?.message}
                />
              </div>
            )}
          />
          <Controller
            name="endYear"
            control={control}
            render={({ field }) => (
              <div className="min-w-0 w-full">
                <GraduationYearPicker
                  label={onboarding.careerJobs.endYearLabel}
                  placeholder="إلى"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.endYear?.message}
                />
              </div>
            )}
          />
        </div>
      </OnboardingDataModal>
    </div>
  );
};
