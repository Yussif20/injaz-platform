"use client";

import { useState } from "react";
import { Pencil, PlusCircle, ChevronLeft } from "lucide-react";
import { Button, DatePicker } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import {
  useSubscriptionSettings,
  useUpdateSubscriptionSettings,
  useDiscounts,
  useCreateDiscount,
} from "../hooks";
import { AddDiscountModal } from "./AddDiscountModal";
import type { SubscriptionDiscountDto } from "../types/subscriptions.types";

export function CurrentYearTab({ onViewAllDiscounts }: { onViewAllDiscounts?: () => void }) {
  const { toast } = useToast();

  const { data: settings, isLoading } = useSubscriptionSettings();
  const { data: discounts } = useDiscounts();
  const updateSettings = useUpdateSubscriptionSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fee, setFee] = useState("");
  const [acceptNew, setAcceptNew] = useState(true);
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] =
    useState<SubscriptionDiscountDto | null>(null);

  // Sync form with fetched data
  const currentEndDate = settings?.subscriptionEndDate?.split("T")[0] ?? "";
  const currentFee = settings?.subscriptionFee ?? 0;
  const currentAcceptNew = settings?.isSubscriptionEnabled ?? true;

  const handleEdit = () => {
    setStartDate("");
    setEndDate(currentEndDate);
    setFee(String(currentFee));
    setAcceptNew(currentAcceptNew);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateSettings.mutate(
      {
        subscriptionFee: Number(fee) || currentFee,
        subscriptionEndDate: endDate
          ? new Date(endDate).toISOString()
          : undefined,
        isSubscriptionEnabled: acceptNew,
      },
      {
        onSuccess: () => {
          toast({ type: "success", message: "تم الحفظ بنجاح" });
          setIsEditing(false);
        },
        onError: () => {
          toast({ type: "error", message: "حدث خطأ" });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Settings Card */}
      <div className="rounded-2xl border border-grey-200 bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-medium text-text-dark">
            إشتراك السنة الدراسية الحالي
          </h3>
          <button
            onClick={handleEdit}
            className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100 hover:text-grey-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Start Date */}
          <DatePicker
            label="تاريخ البداية"
            value={isEditing ? startDate : ""}
            onChange={setStartDate}
            placeholder="ادخل تاريخ بداية السنة الدراسية"
            defaultMode="gregorian"
            showModeToggle={true}
            disabled={!isEditing}
            inputBg={isEditing ? "bg-white" : undefined}
          />

          {/* End Date */}
          <DatePicker
            label="تاريخ الإنتهاء"
            value={isEditing ? endDate : currentEndDate}
            onChange={setEndDate}
            placeholder="ادخل تاريخ انتهاء السنة الدراسية"
            defaultMode="gregorian"
            showModeToggle={true}
            disabled={!isEditing}
            inputBg={isEditing ? "bg-white" : undefined}
          />

          {/* Subscription Fee */}
          <div>
            <label className="mb-2 block text-sm font-medium text-grey-700">
              تكلفة الاشتراك
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
                <span className="text-xs text-grey-400">ر.س</span>
              </div>
              <input
                type="number"
                value={isEditing ? fee : currentFee}
                onChange={(e) => setFee(e.target.value)}
                disabled={!isEditing}
                placeholder="ادخل تكلفة الإشتراك"
                min={0}
                className={`w-full rounded-lg border border-grey-200 py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${isEditing ? "bg-white" : "bg-[#f6f6f6]"}`}
              />
            </div>
          </div>

          {/* Accept New Subscribers */}
          <div>
            <label className="mb-4 block text-sm font-medium text-text-dark">
              استقبال مشتركين جدد
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="acceptNew"
                  checked={isEditing ? acceptNew : currentAcceptNew}
                  onChange={() => setAcceptNew(true)}
                  disabled={!isEditing}
                  className="h-4 w-4 accent-primary-500"
                />
                <span className="text-sm text-text-dark">تفعيل</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="acceptNew"
                  checked={isEditing ? !acceptNew : !currentAcceptNew}
                  onChange={() => setAcceptNew(false)}
                  disabled={!isEditing}
                  className="h-4 w-4 accent-primary-500"
                />
                <span className="text-sm text-text-dark">إيقاف</span>
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
          <Button
            onClick={handleSave}
            className="mt-5 w-full rounded-[20px]! font-light!"
            size="lg"
            loading={updateSettings.isPending}
          >
            حفظ
          </Button>
        )}
      </div>

      {/* Current Discounts */}
      <div className="rounded-2xl border border-grey-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-medium text-text-dark">
            العروض الحالية
          </h3>
          <button
            onClick={onViewAllDiscounts}
            className="flex cursor-pointer items-center gap-1 text-lg font-light text-primary-500 transition-colors hover:text-primary-800"
          >
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {(!discounts || discounts.filter((d) => d.isActive).length === 0) ? (
          <p className="py-6 text-center text-sm text-grey-400">
            لا يوجد عروض حالية
          </p>
        ) : (
          <div className="mb-6 space-y-4">
            {discounts
              .filter((d) => d.isActive)
              .map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border-2 border-grey-200 bg-white px-8 py-6"
                >
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                    <div className="flex items-center gap-3 text-lg">
                      <span className="font-normal text-text-dark">اسم العرض:</span>
                      <span className="font-light text-text-dark">{d.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <span className="font-normal text-text-dark">تاريخ البداية:</span>
                      <span className="font-light text-text-dark">
                        {new Date(d.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <span className="font-normal text-text-dark">نسبة الخصم:</span>
                      <span className="font-light text-text-dark">{d.discountPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <span className="font-normal text-text-dark">تاريخ الإنتهاء:</span>
                      <span className="font-light text-text-dark">
                        {new Date(d.endDate).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <Button
          onClick={() => {
            setEditingDiscount(null);
            setIsAddDiscountOpen(true);
          }}
          className="w-full rounded-[20px]! font-light!"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          إنشاء عرض
        </Button>
      </div>

      <AddDiscountModal
        isOpen={isAddDiscountOpen}
        onClose={() => {
          setIsAddDiscountOpen(false);
          setEditingDiscount(null);
        }}
        onSuccess={() => {
          setIsAddDiscountOpen(false);
          setEditingDiscount(null);
          toast({ type: "success", message: "تم إنشاء العرض بنجاح" });
        }}
        discount={editingDiscount}
      />
    </div>
  );
}
