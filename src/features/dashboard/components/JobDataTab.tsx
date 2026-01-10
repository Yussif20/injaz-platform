"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { dashboardContent } from "@/content";
import { Button, Input } from "@/shared/components/ui";
import { DataCard } from "./DataCard";
import type { JobData, Position } from "../types";

// Validation schema
const jobSchema = z.object({
  positions: z.array(
    z.object({
      id: z.string(),
      schoolName: z.string().min(1, "اسم المدرسة مطلوب"),
      jobTitle: z.string().min(1, "المسمى الوظيفي مطلوب"),
      department: z.string().min(1, "القسم مطلوب"),
      startDate: z.string().min(1, "تاريخ البداية مطلوب"),
      endDate: z.string().optional(),
      isCurrent: z.boolean(),
    })
  ),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobDataTabProps {
  isEditing: boolean;
  onSave?: (data: JobFormData) => void;
}

// Dummy data
const dummyData: JobData = {
  positions: [
    {
      id: "1",
      schoolName: "مدرسة الملك فهد الثانوية",
      jobTitle: "معلم رياضيات",
      department: "قسم الرياضيات",
      startDate: "2015/09/01",
      endDate: undefined,
      isCurrent: true,
    },
    {
      id: "2",
      schoolName: "مدرسة النور المتوسطة",
      jobTitle: "معلم رياضيات",
      department: "قسم الرياضيات",
      startDate: "2010/09/01",
      endDate: "2015/08/30",
      isCurrent: false,
    },
  ],
};

export const JobDataTab: React.FC<JobDataTabProps> = ({
  isEditing,
  onSave,
}) => {
  const { profileData } = dashboardContent;
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: dummyData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });

  const handleSave = async (data: JobFormData) => {
    setIsSaving(true);
    try {
      console.log("Saving job data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave?.(data);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addPosition = () => {
    append({
      id: Date.now().toString(),
      schoolName: "",
      jobTitle: "",
      department: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
  };

  const handleCurrentJobChange = (index: number, checked: boolean) => {
    setValue(`positions.${index}.isCurrent`, checked, { shouldDirty: true });
    if (checked) {
      setValue(`positions.${index}.endDate`, "", { shouldDirty: true });
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <div>
          <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
            {profileData.jobTitle}
          </h3>
          <div className="space-y-4">
            {fields.map((field, index) => {
              const isCurrent = watch(`positions.${index}.isCurrent`);
              return (
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
                      {profileData.removePosition}
                    </button>
                    <span className="text-grey-500 text-sm">
                      وظيفة {index + 1}
                    </span>
                  </div>
                  <Input
                    label={`${profileData.jobFields.schoolName}*`}
                    error={errors.positions?.[index]?.schoolName?.message}
                    {...register(`positions.${index}.schoolName`)}
                  />
                  <Input
                    label={`${profileData.jobFields.position}*`}
                    error={errors.positions?.[index]?.jobTitle?.message}
                    {...register(`positions.${index}.jobTitle`)}
                  />
                  <Input
                    label={`${profileData.jobFields.department}*`}
                    error={errors.positions?.[index]?.department?.message}
                    {...register(`positions.${index}.department`)}
                  />
                  <Input
                    label={`${profileData.jobFields.startDate}*`}
                    type="date"
                    dir="ltr"
                    className="text-left"
                    error={errors.positions?.[index]?.startDate?.message}
                    {...register(`positions.${index}.startDate`)}
                  />
                  {!isCurrent && (
                    <Input
                      label={profileData.jobFields.endDate}
                      type="date"
                      dir="ltr"
                      className="text-left"
                      {...register(`positions.${index}.endDate`)}
                    />
                  )}
                  <div className="flex items-center gap-2 justify-end">
                    <label
                      htmlFor={`current-${index}`}
                      className="text-sm text-grey-600"
                    >
                      {profileData.jobFields.currentJob}
                    </label>
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      checked={isCurrent}
                      onChange={(e) =>
                        handleCurrentJobChange(index, e.target.checked)
                      }
                      className="w-4 h-4 text-primary-500 rounded border-grey-300 focus:ring-primary-500"
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addPosition}
              className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-shade-100 transition-colors"
            >
              + {profileData.addPosition}
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
      <div>
        <h3 className="text-primary-500 text-lg font-medium mb-4 text-right">
          {profileData.jobTitle}
        </h3>
        {dummyData.positions.map((position) => (
          <div
            key={position.id}
            className="bg-shade-100 rounded-xl p-4 sm:p-6 space-y-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.jobFields.schoolName}
                value={position.schoolName}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.jobFields.position}
                value={position.jobTitle}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={profileData.jobFields.department}
                value={position.department}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-primary-500 rounded-full"></div>
              <DataCard
                label={`${profileData.jobFields.startDate} - ${profileData.jobFields.endDate}`}
                value={
                  position.isCurrent
                    ? `${position.startDate} - حتى الآن`
                    : `${position.startDate} - ${position.endDate}`
                }
              />
            </div>
            {position.isCurrent && (
              <div className="text-right">
                <span className="inline-block bg-success-500 text-white text-xs px-3 py-1 rounded-full">
                  {profileData.jobFields.currentJob}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button (disabled in view mode) */}
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full rounded-xl h-12"
      >
        {profileData.saveChanges}
      </Button>
    </div>
  );
};
