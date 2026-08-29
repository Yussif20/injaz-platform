"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X } from "lucide-react";
import { Button, DatePicker } from "@/shared/components/ui";
import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from "../hooks";
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

const STATUS_OPTIONS = [
  {
    value: "Active" as const,
    label: "مفعلة",
    selectedClass: "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]",
  },
  {
    value: "Inactive" as const,
    label: "غير مفعلة",
    selectedClass: "bg-grey-100 text-grey-600 border-grey-200",
  },
  {
    value: "Closed" as const,
    label: "منتهية",
    selectedClass: "bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]",
  },
];

function parseYearName(yearName: string) {
  const parts = yearName.split(" / ");
  const gregorianYear = parts[0]?.replace(" م", "").trim() ?? yearName;
  const hijriYear = parts[1]?.replace(" هـ", "").trim() ?? "";
  return { gregorianYear, hijriYear };
}

// Year range helpers
function getGregorianYears() {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (let y = current + 5; y >= 2000; y--) years.push(String(y));
  return years;
}

function getHijriYears() {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { year: "numeric" });
  const parts = formatter.formatToParts(new Date());
  const currentHijri = parseInt(
    parts.find((p) => p.type === "year")!.value.replace(/[^\d]/g, ""),
    10,
  );
  const years: string[] = [];
  for (let y = currentHijri + 5; y >= 1420; y--) years.push(String(y));
  return years;
}

export function AddYearModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddYearModalProps) {
  const isEditMode = !!initialData;

  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();

  const gregorianYears = useMemo(getGregorianYears, []);
  const hijriYears = useMemo(getHijriYears, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      hijriYear: "",
      gregorianYear: "",
      status: "Active",
      hijriStartDate: "",
      hijriEndDate: "",
      startDate: "",
      endDate: "",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (isOpen && initialData) {
      const { gregorianYear, hijriYear } = parseYearName(initialData.yearName);
      reset({
        gregorianYear,
        hijriYear,
        status: initialData.status,
        hijriStartDate: "",
        hijriEndDate: "",
        startDate: initialData.startDate.split("T")[0],
        endDate: initialData.endDate.split("T")[0],
      });
    } else if (isOpen && !initialData) {
      reset({
        hijriYear: "",
        gregorianYear: "",
        status: "Active",
        hijriStartDate: "",
        hijriEndDate: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: AcademicYearFormData) => {
    const yearName = `${data.gregorianYear} م / ${data.hijriYear} هـ`;
    const payload = {
      yearName,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      status: data.status,
    };

    if (isEditMode && initialData) {
      updateYear.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createYear.mutate(payload, {
        onSuccess: () => onSuccess?.(),
      });
    }
  };

  const isPending = createYear.isPending || updateYear.isPending;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-grey-900">
            {isEditMode ? "تعديل السنة الدراسية" : "إضافة سنة دراسية جديدة"}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 cursor-pointer rounded-lg p-1 text-grey-400 transition-colors hover:bg-grey-100 hover:text-grey-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Hijri Year Select */}
          <div>
            <label className="mb-2 block text-sm font-medium text-grey-700">
              اختر العام الدراسي هجريا
            </label>
            <select
              {...register("hijriYear")}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm font-light text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            >
              <option value="">اختر العام الهجري</option>
              {hijriYears.map((y) => (
                <option key={y} value={y}>
                  {y} هـ
                </option>
              ))}
            </select>
            {errors.hijriYear && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.hijriYear.message}
              </p>
            )}
          </div>

          {/* Gregorian Year Select */}
          <div>
            <label className="mb-2 block text-sm font-medium text-grey-700">
              اختر العام الدراسي ميلاديا
            </label>
            <select
              {...register("gregorianYear")}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm font-light text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            >
              <option value="">اختر العام الميلادي</option>
              {gregorianYears.map((y) => (
                <option key={y} value={y}>
                  {y} م
                </option>
              ))}
            </select>
            {errors.gregorianYear && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.gregorianYear.message}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <label className="mb-3 block text-sm font-medium text-grey-700">
              حالة العام الدراسي
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("status", option.value)}
                  className={`rounded-full border py-2.5 text-sm font-medium transition-colors ${
                    selectedStatus === option.value
                      ? option.selectedClass
                      : "border-grey-200 bg-white text-grey-400 hover:bg-grey-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hijri Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="hijriStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="تاريخ البداية هجريا"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="اختر تاريخ البداية"
                  defaultMode="hijri"
                  showModeToggle={false}
                />
              )}
            />
            <Controller
              name="hijriEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="تاريخ الإنتهاء هجريا"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="اختر تاريخ الإنتهاء"
                  defaultMode="hijri"
                  showModeToggle={false}
                />
              )}
            />
          </div>

          {/* Gregorian Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="تاريخ البداية ميلاديا"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="اختر تاريخ البداية"
                  defaultMode="gregorian"
                  showModeToggle={false}
                  error={errors.startDate?.message}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="تاريخ الإنتهاء ميلاديا"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="اختر تاريخ الإنتهاء"
                  defaultMode="gregorian"
                  showModeToggle={false}
                  error={errors.endDate?.message}
                />
              )}
            />
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
                حفظ التعديلات
              </>
            ) : (
              <>
                إضافة
                <Plus className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
