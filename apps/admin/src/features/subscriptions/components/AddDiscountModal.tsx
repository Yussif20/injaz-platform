"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, DatePicker } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { useCreateDiscount, useUpdateDiscount, useSubscriptionSettings } from "../hooks";
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
  const { toast } = useToast();
  const isEdit = !!discount;

  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const { data: settings } = useSubscriptionSettings();

  const currentFee = settings?.subscriptionFee ?? 0;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDiscountFormData>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      title: "",
      discountPercentage: 0,
      endDate: "",
    },
  });

  const [startDate, setStartDate] = useState("");

  const discountPercentage = watch("discountPercentage");
  const discountedPrice = currentFee - (currentFee * (discountPercentage || 0)) / 100;

  // Reset form when modal opens or discount changes
  useEffect(() => {
    if (isOpen) {
      if (discount) {
        reset({
          title: discount.title,
          discountPercentage: discount.discountPercentage,
          endDate: discount.endDate.split("T")[0],
        });
        setStartDate(discount.createdAt?.split("T")[0] ?? "");
      } else {
        reset({
          title: "",
          discountPercentage: 0,
          endDate: "",
        });
        setStartDate("");
      }
    }
  }, [isOpen, discount, reset]);

  const onSubmit = (data: CreateDiscountFormData) => {
    const payload = {
      title: data.title,
      discountPercentage: data.discountPercentage,
      endDate: new Date(data.endDate).toISOString(),
    };

    if (isEdit && discount) {
      updateDiscount.mutate(
        { id: discount.id, data: payload },
        {
          onSuccess: () => onSuccess?.(),
          onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
        },
      );
    } else {
      createDiscount.mutate(payload, {
        onSuccess: () => onSuccess?.(),
        onError: (error) => toast({ type: "error", message: getErrorMessage(error) }),
      });
    }
  };

  const isPending = createDiscount.isPending || updateDiscount.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إنشاء عرض"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4">
        {/* Row 1: Name + Percentage */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              ادخل اسم العرض
            </label>
            <input
              {...register("title")}
              placeholder="ادخل اسم العرض"
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              ادخل نسبة الخصم
            </label>
            <input
              type="number"
              {...register("discountPercentage", { valueAsNumber: true })}
              placeholder="ادخل نسبة الخصم"
              min={0}
              max={100}
              onInput={(e) => {
                const input = e.currentTarget;
                if (Number(input.value) > 100) input.value = "100";
                if (Number(input.value) < 0) input.value = "0";
              }}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
            {errors.discountPercentage && (
              <p className="mt-1 text-xs text-warning-500">
                {errors.discountPercentage.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Start Date + End Date */}
        <div className="grid grid-cols-2 gap-6">
          <DatePicker
            label="حدد تاريخ البداية"
            value={startDate}
            onChange={setStartDate}
            placeholder="تاريخ بداية العرض"
            defaultMode="gregorian"
            showModeToggle={true}
          />
          <DatePicker
            label="حدد تاريخ الإنتهاء"
            value={watch("endDate")}
            onChange={(v) => setValue("endDate", v)}
            placeholder="تاريخ إنتهاء العرض"
            defaultMode="gregorian"
            showModeToggle={true}
            error={errors.endDate?.message}
          />
        </div>

        {/* Discounted Price + Submit */}
        <div className="pt-4">
          <p className="mb-2 text-sm font-medium text-warning-500">
            سعر الإشتراك بعد الخصم
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5">
              <span className="text-sm font-medium text-text-dark">
                {Math.round(discountedPrice)} ريال
              </span>
            </div>
            <Button
              type="submit"
              className="rounded-3xl! font-light!"
              size="lg"
              loading={isPending}
            >
              تفعيل العرض
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
