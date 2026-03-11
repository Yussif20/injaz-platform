"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Modal, Input, Select } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { GenderAvailability } from "@/shared/types";
import { useCreateProfileType, useUpdateProfileType } from "../hooks";
import type { ProfileTypeDto } from "../types/profile-types.types";
import {
  profileTypeSchema,
  type ProfileTypeFormData,
} from "../validations/profile-types.schemas";

interface AddProfileTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: ProfileTypeDto | null;
}

const AVAILABILITY_OPTIONS = [
  { value: GenderAvailability.Male, label: "ذكور فقط" },
  { value: GenderAvailability.Female, label: "إناث فقط" },
  { value: GenderAvailability.Both, label: "الجميع" },
];

export function AddProfileTypeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddProfileTypeModalProps) {
  const { t } = useTranslation();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;

  const modalT = {
    addTitle: "إضافة نوع ملف",
    editTitle: "تعديل نوع الملف",
    nameMale: "الاسم (ذكر)",
    nameFemale: "الاسم (أنثى)",
    description: "الوصف",
    availability: "التوفر",
    placeholderMale: "مثال: سيرة ذاتية",
    placeholderFemale: "مثال: سيرة ذاتية",
    placeholderDesc: "وصف اختياري للنوع",
    add: "إضافة",
  };

  const { toast } = useToast();
  const isEditMode = !!initialData;

  const createProfileType = useCreateProfileType();
  const updateProfileType = useUpdateProfileType();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileTypeFormData>({
    resolver: zodResolver(profileTypeSchema),
    defaultValues: {
      typeNameMale: "",
      typeNameFemale: "",
      description: "",
      availableFor: GenderAvailability.Both,
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        typeNameMale: initialData.typeNameMale,
        typeNameFemale: initialData.typeNameFemale,
        description: initialData.description ?? "",
        availableFor: initialData.availableFor,
      });
    } else if (isOpen && !initialData) {
      reset({
        typeNameMale: "",
        typeNameFemale: "",
        description: "",
        availableFor: GenderAvailability.Both,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: ProfileTypeFormData) => {
    if (isEditMode && initialData) {
      updateProfileType.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => onSuccess?.(),
          onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
        },
      );
    } else {
      createProfileType.mutate(data, {
        onSuccess: () => onSuccess?.(),
        onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
      });
    }
  };

  const isPending = createProfileType.isPending || updateProfileType.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? modalT.editTitle : modalT.addTitle}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={modalT.nameMale}
          placeholder={modalT.placeholderMale}
          error={errors.typeNameMale?.message}
          {...register("typeNameMale")}
        />

        <Input
          label={modalT.nameFemale}
          placeholder={modalT.placeholderFemale}
          error={errors.typeNameFemale?.message}
          {...register("typeNameFemale")}
        />

        <Input
          label={modalT.description}
          placeholder={modalT.placeholderDesc}
          error={errors.description?.message}
          {...register("description")}
        />

        <Controller
          name="availableFor"
          control={control}
          render={({ field }) => (
            <Select
              label={modalT.availability}
              value={field.value}
              onChange={(val) => field.onChange(Number(val))}
              options={AVAILABILITY_OPTIONS}
              error={errors.availableFor?.message}
            />
          )}
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
