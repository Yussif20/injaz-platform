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
  useCareerJobs,
  useAddCareerJob,
  useUpdateCareerJob,
  useDeleteCareerJob,
} from "../hooks";
import type { CareerJob, CreateCareerJobRequest } from "../types/me.types";

// Validation schema for single job form
const jobSchema = z.object({
  school: z.string().min(1, "اسم المدرسة مطلوب"),
  title: z.string().min(1, "المسمى الوظيفي مطلوب"),
  rank: z.string().min(1, "الدرجة الوظيفية مطلوبة"),
  educationalStage: z.string().min(1, "المرحلة التعليمية مطلوبة"),
  startYear: z.string().min(1, "سنة البداية مطلوبة"),
  endYear: z.string().optional(),
  isCurrent: z.boolean(),
});

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

export const JobDataTab: React.FC<JobDataTabProps> = ({ onSave }) => {
  const { profileData } = dashboardContent;
  const { onboarding } = authContent;
  const [editingJob, setEditingJob] = useState<CareerJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { careerJobs, isLoading } = useCareerJobs();
  const { addCareerJobAsync, isLoading: isAdding } = useAddCareerJob();
  const { updateCareerJobAsync, isLoading: isUpdating } = useUpdateCareerJob();
  const { deleteCareerJobAsync, isLoading: isDeleting } = useDeleteCareerJob();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: "onChange",
    defaultValues: {
      school: "",
      title: "",
      rank: "",
      educationalStage: "",
      startYear: "",
      endYear: "",
      isCurrent: false,
    },
  });

  const isCurrent = watch("isCurrent");
  const isSaving = isAdding || isUpdating;

  // Reset form when editing job changes
  useEffect(() => {
    if (editingJob) {
      reset({
        school: editingJob.school || "",
        title: editingJob.title || "",
        rank: editingJob.rank || "",
        educationalStage: editingJob.educationalStage || "",
        startYear: editingJob.startYear?.toString() || "",
        endYear: editingJob.endYear?.toString() || "",
        isCurrent: editingJob.endYear === null,
      });
    } else {
      reset({
        school: "",
        title: "",
        rank: "",
        educationalStage: "",
        startYear: "",
        endYear: "",
        isCurrent: false,
      });
    }
  }, [editingJob, reset]);

  const handleSaveJob = async (data: JobFormData) => {
    setError(null);
    try {
      const requestData: CreateCareerJobRequest = {
        school: data.school,
        title: data.title,
        rank: data.rank,
        educationalStage: data.educationalStage,
        startYear: parseInt(data.startYear),
        endYear: data.isCurrent
          ? null
          : data.endYear
            ? parseInt(data.endYear)
            : null,
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

  const handleDeleteJob = async (id: number) => {
    setError(null);
    try {
      const response = await deleteCareerJobAsync(id);
      if (!response.status) {
        setError(response.message || "فشل في حذف الوظيفة");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      setError("حدث خطأ غير متوقع");
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    reset({
      school: "",
      title: "",
      rank: "",
      educationalStage: "",
      startYear: "",
      endYear: "",
      isCurrent: false,
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
      {error && (
        <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg text-right">
          {error}
        </div>
      )}

      {/* Career Job Cards */}
      <div className="space-y-4">
        {careerJobs.map((job) => (
          <div
            key={job.id}
            className="bg-shade-100 rounded-xl p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1 text-right border-r-2 border-[#008387] pr-3">
              <p className="font-normal text-[#333] text-sm md:text-lg">
                {job.title || "وظيفة"} - {job.rank || ""}
              </p>
              <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
                {job.school || "-"} - {job.educationalStage || ""}
              </p>
              <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
                {job.endYear || "حتى الآن"} - {job.startYear}
              </p>
            </div>
            <div className="relative group">
              <button
                type="button"
                className="p-1"
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
              <div className="absolute hidden group-hover:block left-0 top-full mt-1 bg-white border border-grey-200 rounded-lg shadow-lg z-10 min-w-25">
                <button
                  type="button"
                  onClick={() => openEditModal(job)}
                  className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors text-sm text-grey-700"
                >
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="w-full text-right px-4 py-2 hover:bg-grey-50 transition-colors text-sm text-warning-500"
                >
                  حذف
                </button>
              </div>
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
            {careerJobs.length === 0
              ? onboarding.careerJobs.firstAddButton
              : onboarding.careerJobs.addButton}
          </span>
        </button>
      </div>

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
          label={onboarding.careerJobs.schoolLabel}
          placeholder="اسم المدرسة"
          error={errors.school?.message}
          {...register("school")}
        />
        <Input
          label={onboarding.careerJobs.positionLabel}
          placeholder="المسمى الوظيفي"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label={onboarding.careerJobs.rankLabel}
          placeholder="الدرجة الوظيفية"
          error={errors.rank?.message}
          {...register("rank")}
        />
        <Select
          label={onboarding.careerJobs.stageLabel}
          placeholder="اختر المرحلة التعليمية"
          options={EDUCATIONAL_STAGES}
          error={errors.educationalStage?.message}
          {...register("educationalStage")}
        />
        <Select
          label={onboarding.careerJobs.startYearLabel}
          placeholder="سنة البداية"
          options={YEARS}
          error={errors.startYear?.message}
          {...register("startYear")}
        />
        {!isCurrent && (
          <Select
            label={onboarding.careerJobs.endYearLabel}
            placeholder="سنة النهاية"
            options={YEARS}
            error={errors.endYear?.message}
            {...register("endYear")}
          />
        )}
        <div className="flex items-center gap-2 justify-end">
          <label htmlFor="is-current-modal" className="text-sm text-grey-600">
            {onboarding.careerJobs.currentJobLabel}
          </label>
          <input
            type="checkbox"
            id="is-current-modal"
            {...register("isCurrent")}
            className="w-4 h-4 text-primary-500 rounded border-grey-300 focus:ring-primary-500"
          />
        </div>
      </OnboardingDataModal>
    </div>
  );
};
