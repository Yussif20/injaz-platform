"use client";

import { useState } from "react";
import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, StatusBadge, DatePicker } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import {
  useSubscriptionSettings,
  useUpdateSubscriptionSettings,
  useToggleSubscriptions,
  useSetActiveDiscount,
  useDiscounts,
} from "../hooks";

export function SettingsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const toastT = commonT.toast as Record<string, string>;
  const actionsT = commonT.actions as Record<string, string>;

  // Settings-specific translations
  const settingsT = {
    title: "إعدادات الاشتراك",
    subscriptionEnabled: "الاشتراكات مفعلة",
    enabled: "مفعل",
    disabled: "معطل",
    toggleSubscriptions: "تبديل حالة الاشتراكات",
    subscriptionFee: "رسوم الاشتراك",
    feePlaceholder: "أدخل رسوم الاشتراك",
    subscriptionEndDate: "تاريخ انتهاء الاشتراك",
    activeDiscount: "الخصم النشط",
    selectDiscount: "اختر خصم",
    noDiscount: "بدون خصم",
    save: "حفظ الإعدادات",
    sar: "ر.س",
    lastUpdated: "آخر تحديث",
  };

  // Data fetching
  const {
    data: settings,
    isLoading,
    isError,
    refetch,
  } = useSubscriptionSettings();
  const { data: discounts } = useDiscounts();
  const updateSettings = useUpdateSubscriptionSettings();
  const toggleSubscriptions = useToggleSubscriptions();
  const setActiveDiscount = useSetActiveDiscount();

  // Use settings directly for display - track local edits only when user changes values
  const fee = settings?.subscriptionFee ?? 0;
  const endDate = settings?.subscriptionEndDate?.split("T")[0] ?? "";
  const selectedDiscountId = settings?.activeDiscountId ?? null;

  // Local form state for edits
  const [localFee, setLocalFee] = useState<number | null>(null);
  const [localEndDate, setLocalEndDate] = useState<string | null>(null);

  // Handlers
  const handleToggle = () => {
    toggleSubscriptions.mutate(undefined, {
      onSuccess: () => {
        toast({ type: "success", message: toastT.saved });
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handleSave = () => {
    const feeToSave = localFee ?? fee;
    const dateToSave = localEndDate ?? endDate;
    updateSettings.mutate(
      {
        subscriptionFee: feeToSave,
        subscriptionEndDate: dateToSave
          ? new Date(dateToSave).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          toast({ type: "success", message: toastT.saved });
          setLocalFee(null);
          setLocalEndDate(null);
        },
        onError: () => {
          toast({ type: "error", message: toastT.error });
        },
      },
    );
  };

  const handleActiveDiscountChange = (discountId: number | null) => {
    if (discountId !== null) {
      setActiveDiscount.mutate(discountId, {
        onSuccess: () => {
          toast({ type: "success", message: toastT.saved });
        },
        onError: () => {
          toast({ type: "error", message: toastT.error });
        },
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-4">
        <p className="text-grey-500">{toastT.error}</p>
        <Button variant="outline" onClick={() => refetch()}>
          {actionsT.retry ?? "إعادة المحاولة"}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-6">
      <h3 className="mb-6 text-lg font-medium text-text-dark">
        {settingsT.title}
      </h3>

      <div className="space-y-6">
        {/* Toggle Subscriptions */}
        <div className="flex items-center justify-between rounded-lg border border-grey-200 bg-grey-50 p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-dark">
              {settingsT.subscriptionEnabled}
            </span>
            <StatusBadge
              label={
                settings?.isSubscriptionEnabled
                  ? settingsT.enabled
                  : settingsT.disabled
              }
              variant={settings?.isSubscriptionEnabled ? "success" : "neutral"}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            loading={toggleSubscriptions.isPending}
          >
            {settings?.isSubscriptionEnabled ? (
              <ToggleRight className="h-5 w-5" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
            {settingsT.toggleSubscriptions}
          </Button>
        </div>

        {/* Subscription Fee */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            {settingsT.subscriptionFee}
          </label>
          <div className="relative">
            <input
              type="number"
              value={localFee ?? fee}
              onChange={(e) => setLocalFee(Number(e.target.value))}
              placeholder={settingsT.feePlaceholder}
              min={0}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 pe-16 text-sm text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
            <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-grey-500">
              {settingsT.sar}
            </span>
          </div>
        </div>

        {/* Subscription End Date */}
        <DatePicker
          label={settingsT.subscriptionEndDate}
          value={localEndDate ?? endDate}
          onChange={(v) => setLocalEndDate(v)}
          placeholder="اختر التاريخ"
          defaultMode="gregorian"
          showModeToggle={true}
        />

        {/* Active Discount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            {settingsT.activeDiscount}
          </label>
          <select
            value={selectedDiscountId ?? ""}
            onChange={(e) =>
              handleActiveDiscountChange(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
          >
            <option value="">{settingsT.noDiscount}</option>
            {(discounts ?? [])
              .filter((d) => d.isActive)
              .map((discount) => (
                <option key={discount.id} value={discount.id}>
                  {discount.title} ({discount.discountPercentage}%)
                </option>
              ))}
          </select>
        </div>

        {/* Last Updated */}
        {settings?.updatedAt && (
          <p className="text-xs text-grey-500">
            {settingsT.lastUpdated}:{" "}
            {new Date(settings.updatedAt).toLocaleString("ar-SA")}
          </p>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full rounded-[20px]! font-light!"
          size="lg"
          loading={updateSettings.isPending}
        >
          <Save className="h-5 w-5" />
          {settingsT.save}
        </Button>
      </div>
    </div>
  );
}
