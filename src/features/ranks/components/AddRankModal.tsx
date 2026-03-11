"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { useCreateRank, useUpdateRank } from "../hooks";
import type { RankDto } from "../types/ranks.types";
import { rankSchema, type RankFormData } from "../validations/ranks.schemas";

interface AddRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: RankDto | null;
}

export function AddRankModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddRankModalProps) {
  const { t } = useTranslation();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;

  // Ranks-specific translations (fallback inline)
  const modalT = {
    addTitle: "إضافة رتبة",
    editTitle: "تعديل الرتبة",
    titleMale: "المسمى (ذكر)",
    titleFemale: "المسمى (أنثى)",
    placeholderMale: "مثال: معلم",
    placeholderFemale: "مثال: معلمة",
    add: "إضافة",
  };

  const { toast } = useToast();
  const isEditMode = !!initialData;

  const createRank = useCreateRank();
  const updateRank = useUpdateRank();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RankFormData>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      titleMale: "",
      titleFemale: "",
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        titleMale: initialData.titleMale,
        titleFemale: initialData.titleFemale,
      });
    } else if (isOpen && !initialData) {
      reset({
        titleMale: "",
        titleFemale: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: RankFormData) => {
    if (isEditMode && initialData) {
      updateRank.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => onSuccess?.(),
          onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
        },
      );
    } else {
      createRank.mutate(data, {
        onSuccess: () => onSuccess?.(),
        onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
      });
    }
  };

  const isPending = createRank.isPending || updateRank.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? modalT.editTitle : modalT.addTitle}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={modalT.titleMale}
          placeholder={modalT.placeholderMale}
          error={errors.titleMale?.message}
          {...register("titleMale")}
        />

        <Input
          label={modalT.titleFemale}
          placeholder={modalT.placeholderFemale}
          error={errors.titleFemale?.message}
          {...register("titleFemale")}
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
