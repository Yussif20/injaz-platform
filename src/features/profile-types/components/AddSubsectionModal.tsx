"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useCreateSubsection, useUpdateSubsection } from "../hooks";
import type { SubsectionDto } from "../types/profile-types.types";

interface AddSubsectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sectionId: number;
  initialData?: SubsectionDto | null;
  existingSubsections?: SubsectionDto[];
}

// Local schema for subsection form
const subsectionFormSchema = z.object({
  title: z.string().min(1, "عنوان القسم الفرعي مطلوب"),
  maxImageCount: z
    .number()
    .nullable()
    .transform((val) => (val === 0 ? null : val)),
  maxImageSizeMB: z
    .number()
    .nullable()
    .transform((val) => (val === 0 ? null : val)),
});

type SubsectionFormValues = z.infer<typeof subsectionFormSchema>;

export function AddSubsectionModal({
  isOpen,
  onClose,
  onSuccess,
  sectionId,
  initialData,
  existingSubsections = [],
}: AddSubsectionModalProps) {
  const { t } = useTranslation();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;

  const modalT = {
    addTitle: "إضافة قسم فرعي",
    editTitle: "تعديل القسم الفرعي",
    title: "عنوان القسم الفرعي",
    titlePlaceholder: "مثال: صورة شخصية",
    maxImageCount: "الحد الأقصى للصور",
    maxImageCountPlaceholder: "اتركه فارغاً لعدد غير محدود",
    maxImageSize: "الحجم الأقصى للصورة (م.ب)",
    maxImageSizePlaceholder: "افتراضي: 5 م.ب",
    add: "إضافة",
  };

  const isEditMode = !!initialData;

  const createSubsection = useCreateSubsection();
  const updateSubsection = useUpdateSubsection();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubsectionFormValues>({
    resolver: zodResolver(subsectionFormSchema),
    defaultValues: {
      title: "",
      maxImageCount: null,
      maxImageSizeMB: null,
    },
  });

  // Calculate next display order
  const nextDisplayOrder =
    existingSubsections.length > 0
      ? Math.max(...existingSubsections.map((s) => s.displayOrder)) + 1
      : 0;

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        title: initialData.title,
        maxImageCount: initialData.maxImageCount,
        maxImageSizeMB: initialData.maxImageSize
          ? initialData.maxImageSize / (1024 * 1024)
          : null,
      });
    } else if (isOpen && !initialData) {
      reset({
        title: "",
        maxImageCount: null,
        maxImageSizeMB: null,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: SubsectionFormValues) => {
    // Convert MB to bytes
    const maxImageSize = data.maxImageSizeMB
      ? data.maxImageSizeMB * 1024 * 1024
      : null;

    if (isEditMode && initialData) {
      updateSubsection.mutate(
        {
          id: initialData.id,
          sectionId,
          data: {
            title: data.title,
            displayOrder: initialData.displayOrder,
            maxImageCount: data.maxImageCount ?? null,
            maxImageSize,
          },
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    } else {
      createSubsection.mutate(
        {
          sectionId,
          title: data.title,
          displayOrder: nextDisplayOrder,
          maxImageCount: data.maxImageCount ?? null,
          maxImageSize,
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    }
  };

  const isPending = createSubsection.isPending || updateSubsection.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? modalT.editTitle : modalT.addTitle}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={modalT.title}
          placeholder={modalT.titlePlaceholder}
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          type="number"
          label={modalT.maxImageCount}
          placeholder={modalT.maxImageCountPlaceholder}
          error={errors.maxImageCount?.message}
          {...register("maxImageCount", {
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
        />

        <Input
          type="number"
          step="0.5"
          label={modalT.maxImageSize}
          placeholder={modalT.maxImageSizePlaceholder}
          error={errors.maxImageSizeMB?.message}
          {...register("maxImageSizeMB", {
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
        />

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
