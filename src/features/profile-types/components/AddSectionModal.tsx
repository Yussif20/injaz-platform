"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useCreateSection, useUpdateSection } from "../hooks";
import type { SectionDto } from "../types/profile-types.types";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  profileTypeId: number;
  initialData?: SectionDto | null;
  existingSections?: SectionDto[];
}

// Local schema for section form
const sectionFormSchema = z.object({
  title: z.string().min(1, "عنوان القسم مطلوب"),
  weightPercent: z
    .number({ error: "النسبة المئوية مطلوبة" })
    .min(0, "النسبة المئوية يجب أن تكون 0 أو أكثر")
    .max(100, "النسبة المئوية لا يمكن أن تتجاوز 100"),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

export function AddSectionModal({
  isOpen,
  onClose,
  onSuccess,
  profileTypeId,
  initialData,
  existingSections = [],
}: AddSectionModalProps) {
  const { t } = useTranslation();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;

  const modalT = {
    addTitle: "إضافة قسم",
    editTitle: "تعديل القسم",
    title: "عنوان القسم",
    titlePlaceholder: "مثال: البيانات الشخصية",
    weight: "النسبة المئوية",
    weightPlaceholder: "مثال: 25",
    weightHint: "يجب أن يكون مجموع النسب 100%",
    add: "إضافة",
  };

  const isEditMode = !!initialData;

  const createSection = useCreateSection();
  const updateSection = useUpdateSection();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: "",
      weightPercent: 0,
    },
  });

  // Calculate next display order
  const nextDisplayOrder =
    existingSections.length > 0
      ? Math.max(...existingSections.map((s) => s.displayOrder)) + 1
      : 0;

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        title: initialData.title,
        weightPercent: initialData.weightPercent,
      });
    } else if (isOpen && !initialData) {
      reset({
        title: "",
        weightPercent: 0,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: SectionFormValues) => {
    if (isEditMode && initialData) {
      updateSection.mutate(
        {
          id: initialData.id,
          profileTypeId,
          data: {
            title: data.title,
            weightPercent: data.weightPercent,
            displayOrder: initialData.displayOrder,
          },
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    } else {
      createSection.mutate(
        {
          profileTypeId,
          title: data.title,
          weightPercent: data.weightPercent,
          displayOrder: nextDisplayOrder,
        },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    }
  };

  const isPending = createSection.isPending || updateSection.isPending;

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

        <div>
          <Input
            type="number"
            step="0.1"
            label={modalT.weight}
            placeholder={modalT.weightPlaceholder}
            error={errors.weightPercent?.message}
            {...register("weightPercent", { valueAsNumber: true })}
          />
          <p className="mt-1 text-xs text-grey-500">{modalT.weightHint}</p>
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
