"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Calendar } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useCreateAcademicYear, useUpdateAcademicYear } from "../hooks";
import type { AcademicYearDto } from "../types/academic-years.types";
import {
  academicYearSchema,
  type AcademicYearFormData,
} from "../validations/academic-years.schemas";

interface AddYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AcademicYearDto | null;
}

export function AddYearModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddYearModalProps) {
  const { t } = useTranslation();
  const ayT = t("academicYears") as Record<string, unknown>;
  const modalT = ayT.modal as Record<string, string>;
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;

  const isEditMode = !!initialData;

  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      yearName: "",
      startDate: "",
      endDate: "",
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        yearName: initialData.yearName,
        startDate: initialData.startDate.split("T")[0], // Extract date part
        endDate: initialData.endDate.split("T")[0],
      });
    } else if (isOpen && !initialData) {
      reset({
        yearName: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: AcademicYearFormData) => {
    // Convert dates to ISO format for backend
    const payload = {
      yearName: data.yearName,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    if (isEditMode && initialData) {
      updateYear.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    } else {
      createYear.mutate(payload, {
        onSuccess: () => onSuccess?.(),
        onError: () => {},
      });
    }
  };

  const isPending = createYear.isPending || updateYear.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? (modalT.editTitle ?? "تعديل السنة") : modalT.title}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Year Name */}
        <Input
          label={modalT.yearName ?? "اسم السنة"}
          placeholder={modalT.enterYear}
          error={errors.yearName?.message}
          {...register("yearName")}
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.startDate ?? "تاريخ البداية"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
                <Calendar className="h-4 w-4 text-grey-400" />
              </div>
              <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.endDate ?? "تاريخ النهاية"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
                <Calendar className="h-4 w-4 text-grey-400" />
              </div>
              <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full rounded-[20px]! font-light!"
          size="lg"
          loading={isPending}
        >
          {isEditMode ? (
            <>
              <Save className="h-5 w-5" />
              {actionsT.save}
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              {modalT.add}
            </>
          )}
        </Button>
      </form>
    </Modal>
  );
}
