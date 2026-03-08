"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  const modalT = {
    addTitle: "إضافة بند",
    editTitle: "تعديل البند",
    title: "اسم البند الرئيسي",
    titlePlaceholder: "ادخل اسم البند الرئيسي",
    weight: "الوزن النسبي",
    weightPlaceholder: "ادخل الوزن النسبي",
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
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-6">
          <Input
            label={modalT.title}
            placeholder={modalT.titlePlaceholder}
            error={errors.title?.message}
            {...register("title")}
          />
          <Input
            type="number"
            step="0.1"
            label={modalT.weight}
            placeholder={modalT.weightPlaceholder}
            error={errors.weightPercent?.message}
            {...register("weightPercent", { valueAsNumber: true })}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-[20px]! font-light!"
          size="lg"
          loading={isPending}
        >
          حفظ
        </Button>
      </form>
    </Modal>
  );
}
