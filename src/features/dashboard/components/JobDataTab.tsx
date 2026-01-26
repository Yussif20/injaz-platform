"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, Input } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import {
  useCareerJobs,
  useAddCareerJob,
  useUpdateCareerJob,
  useDeleteCareerJob,
} from "../hooks";
import type { CareerJob, CreateCareerJobRequest } from "../types/me.types";

// Validation schema for single job form
const jobSchema = z.object({
  title: z.string().min(1, "المسمى الوظيفي مطلوب").max(200),
  rank: z.string().min(1, "الدرجة الوظيفية مطلوبة").max(100),
  school: z.string().min(1, "اسم المدرسة مطلوب").max(200),
  educationalStage: z.string().min(1, "المرحلة التعليمية مطلوبة").max(100),
  startYear: z.number().min(1900, "السنة غير صحيحة").max(2100),
  endYear: z.number().min(1900).max(2100).optional().nullable(),
  isCurrent: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobDataTabProps {
  isEditing: boolean;
  onSave?: () => void;
}

// Educational stages in Arabic
const EDUCATIONAL_STAGES = [
  "رياض الأطفال",
  "المرحلة الابتدائية",
  "المرحلة المتوسطة",
  "المرحلة الثانوية",
  "التعليم العالي",
];

export const JobDataTab: React.FC<JobDataTabProps> = ({
  isEditing,
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const [editingJob, setEditingJob] = useState<CareerJob | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { careerJobs, isLoading, refetch } = useCareerJobs();
  const { addCareerJobAsync, isLoading: isAdding } = useAddCareerJob();
  const { updateCareerJobAsync, isLoading: isUpdating } = useUpdateCareerJob();
  const { deleteCareerJobAsync, isLoading: isDeleting } = useDeleteCareerJob();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      rank: "",
      school: "",
      educationalStage: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      isCurrent: false,
    },
  });

  const isCurrent = watch("isCurrent");
  const isSaving = isAdding || isUpdating;

  // Reset form when editing job changes
  useEffect(() => {
    if (editingJob) {
      reset({
        title: editingJob.title || "",
        rank: editingJob.rank || "",
        school: editingJob.school || "",
        educationalStage: editingJob.educationalStage || "",
        startYear: editingJob.startYear,
        endYear: editingJob.endYear,
        isCurrent: editingJob.endYear === null,
      });
    } else if (isAddingNew) {
      reset({
        title: "",
        rank: "",
        school: "",
        educationalStage: "",
        startYear: new Date().getFullYear(),
        endYear: null,
        isCurrent: false,
      });
    }
  }, [editingJob, isAddingNew, reset]);

  const handleCurrentJobChange = (checked: boolean) => {
    setValue("isCurrent", checked, { shouldDirty: true });
    if (checked) {
      setValue("endYear", null, { shouldDirty: true });
    }
  };

  const handleSaveJob = async (data: JobFormData) => {
    setError(null);
    try {
      const requestData: CreateCareerJobRequest = {
        title: data.title,
        rank: data.rank,
        school: data.school,
        educationalStage: data.educationalStage,
        startYear: data.startYear,
        endYear: data.isCurrent ? null : data.endYear,
      };

      if (editingJob) {
        // Update existing job
        const response = await updateCareerJobAsync({
          id: editingJob.id,
          data: requestData,
        });
        if (response.status) {
          setEditingJob(null);
          onSave?.();
        } else {
          setError(response.message || "فشل في تحديث الوظيفة");
        }
      } else {
        // Add new job
        const response = await addCareerJobAsync(requestData);
        if (response.status) {
          setIsAddingNew(false);
          reset();
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

  const handleCancelEdit = () => {
    setEditingJob(null);
    setIsAddingNew(false);
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

  // Form for adding/editing
  if (isAddingNew || editingJob) {
    return (
      <form onSubmit={handleSubmit(handleSaveJob)} className="space-y-6">
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {editingJob ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
          </h3>

          {error && (
            <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg mb-4 text-right">
              {error}
            </div>
          )}

          <div className="bg-shade-100 rounded-xl p-4 space-y-3">
            <Input
              label={`${profileData.jobFields.schoolName}*`}
              error={errors.school?.message}
              {...register("school")}
            />
            <Input
              label={`${profileData.jobFields.position}*`}
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="الدرجة الوظيفية*"
              error={errors.rank?.message}
              {...register("rank")}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-grey-700 text-right">
                المرحلة التعليمية*
              </label>
              <select
                className="w-full px-4 py-2 border border-grey-300 rounded-lg bg-[#EBEBEB] text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register("educationalStage")}
              >
                <option value="">اختر المرحلة التعليمية</option>
                {EDUCATIONAL_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              {errors.educationalStage?.message && (
                <p className="text-warning-500 text-sm text-right">
                  {errors.educationalStage.message}
                </p>
              )}
            </div>
            <Input
              label={`${profileData.jobFields.startDate}* (السنة)`}
              type="number"
              min={1900}
              max={2100}
              error={errors.startYear?.message}
              {...register("startYear", { valueAsNumber: true })}
            />
            {!isCurrent && (
              <Input
                label={`${profileData.jobFields.endDate} (السنة)`}
                type="number"
                min={1900}
                max={2100}
                error={errors.endYear?.message}
                {...register("endYear", { valueAsNumber: true })}
              />
            )}
            <div className="flex items-center gap-2 justify-end">
              <label htmlFor="current-job" className="text-sm text-grey-600">
                {profileData.jobFields.currentJob}
              </label>
              <input
                type="checkbox"
                id="current-job"
                checked={isCurrent}
                onChange={(e) => handleCurrentJobChange(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded border-grey-300 focus:ring-primary-500"
              />
            </div>
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
            {editingJob ? "تحديث" : "إضافة"}
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
          {profileData.jobTitle}
        </h3>

        {error && (
          <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg mb-4 text-right">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {careerJobs.map((job) => (
            <div
              key={job.id}
              className="bg-shade-100 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="font-medium text-secondary-800 mb-1">
                  {job.title || "وظيفة"}
                </p>
                <p className="text-grey-600 text-sm mb-1">
                  <strong>المدرسة:</strong> {job.school || "-"}
                </p>
                <p className="text-grey-600 text-sm mb-1">
                  <strong>الدرجة:</strong> {job.rank || "-"}
                </p>
                <p className="text-grey-600 text-sm mb-1">
                  <strong>المرحلة:</strong> {job.educationalStage || "-"}
                </p>
                <p className="text-grey-600 text-sm">
                  <strong>الفترة:</strong> {job.startYear} -{" "}
                  {job.endYear || "حتى الآن"}
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
                    onClick={() => setEditingJob(job)}
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
                    onClick={() => handleDeleteJob(job.id)}
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
            {profileData.addPosition || "إضافة بيانات وظيفية آخرى"}
          </button>
        </div>
      </div>
    </div>
  );
};
