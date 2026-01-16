"use client";

import React, { useState, useEffect } from "react";
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
  if (isEditing && (isAddingNew || editingJob)) {
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
  if (isEditing) {
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
                className="bg-shade-100 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={isDeleting}
                      className="text-warning-500 hover:text-warning-700 text-sm disabled:opacity-50"
                    >
                      {profileData.removePosition}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingJob(job)}
                      className="text-primary-500 hover:text-primary-700 text-sm"
                    >
                      تعديل
                    </button>
                  </div>
                  <span className="text-grey-500 text-sm">
                    {job.title || "وظيفة"}
                  </span>
                </div>
                <div className="text-right text-grey-700">
                  <p>
                    <strong>المدرسة:</strong> {job.school || "-"}
                  </p>
                  <p>
                    <strong>الدرجة:</strong> {job.rank || "-"}
                  </p>
                  <p>
                    <strong>المرحلة:</strong> {job.educationalStage || "-"}
                  </p>
                  <p>
                    <strong>الفترة:</strong> {job.startYear} -{" "}
                    {job.endYear || "حتى الآن"}
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-shade-100 transition-colors"
            >
              + {profileData.addPosition}
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
          {profileData.jobTitle}
        </h3>

        {careerJobs.length === 0 ? (
          <div className="bg-shade-100 rounded-xl py-8 px-6 text-center text-grey-500">
            لا توجد وظائف مسجلة
          </div>
        ) : (
          careerJobs.map((job) => (
            <div
              key={job.id}
              className="bg-shade-100 rounded-xl py-5 px-6 space-y-6 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={profileData.jobFields.schoolName}
                  value={job.school || "-"}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={profileData.jobFields.position}
                  value={job.title || "-"}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard label="الدرجة الوظيفية" value={job.rank || "-"} />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label="المرحلة التعليمية"
                  value={job.educationalStage || "-"}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
                <DataCard
                  label={`${profileData.jobFields.startDate} - ${profileData.jobFields.endDate}`}
                  value={
                    job.endYear === null
                      ? `${job.startYear} - حتى الآن`
                      : `${job.startYear} - ${job.endYear}`
                  }
                />
              </div>
              {job.endYear === null && (
                <div className="text-right">
                  <span className="inline-block bg-success-500 text-white text-xs px-3 py-1 rounded-full">
                    {profileData.jobFields.currentJob}
                  </span>
                </div>
              )}
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
