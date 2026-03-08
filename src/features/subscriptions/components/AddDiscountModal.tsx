"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useCreateDiscount, useUpdateDiscount } from "../hooks";
import {
  createDiscountSchema,
  type CreateDiscountFormData,
} from "../validations/subscriptions.schemas";
import type { SubscriptionDiscountDto } from "../types/subscriptions.types";

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  discount?: SubscriptionDiscountDto | null;
}

export function AddDiscountModal({
  isOpen,
  onClose,
  onSuccess,
  discount,
}: AddDiscountModalProps) {
  // Translations (fallback inline)
  const modalT = {
    titleAdd: "إضافة خصم",
    titleEdit: "تعديل الخصم",
    title: "العنوان",
    titlePlaceholder: "أدخل عنوان الخصم",
    percentage: "نسبة الخصم",
    percentagePlaceholder: "أدخل نسبة الخصم",
    endDate: "تاريخ الانتهاء",
    add: "إضافة",
    save: "حفظ",
  };

  const isEdit = !!discount;

  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDiscountFormData>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      title: "",
      discountPercentage: 0,
      endDate: "",
    },
  });

  // Reset form when modal opens or discount changes
  useEffect(() => {
    if (isOpen) {
      if (discount) {
        reset({
          title: discount.title,
          discountPercentage: discount.discountPercentage,
          endDate: discount.endDate.split("T")[0], // Convert ISO to date input format
        });
      } else {
        reset({
          title: "",
          discountPercentage: 0,
          endDate: "",
        });
      }
    }
  }, [isOpen, discount, reset]);

  const onSubmit = (data: CreateDiscountFormData) => {
    const payload = {
      ...data,
      endDate: new Date(data.endDate).toISOString(),
    };

    if (isEdit && discount) {
      updateDiscount.mutate(
        { id: discount.id, data: payload },
        {
          onSuccess: () => onSuccess?.(),
          onError: () => {},
        },
      );
    } else {
      createDiscount.mutate(payload, {
        onSuccess: () => onSuccess?.(),
        onError: () => {},
      });
    }
  };

  const isPending = createDiscount.isPending || updateDiscount.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? modalT.titleEdit : modalT.titleAdd}
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
          label={modalT.percentage}
          placeholder={modalT.percentagePlaceholder}
          type="number"
          min={0}
          max={100}
          error={errors.discountPercentage?.message}
          {...register("discountPercentage", { valueAsNumber: true })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            {modalT.endDate}
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-warning-500">
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full rounded-[20px]! font-light!"
          size="lg"
          loading={isPending}
        >
          {isEdit ? (
            <>
              <Save className="h-5 w-5" />
              {modalT.save}
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
