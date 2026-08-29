"use client";

import { useState } from "react";
import { useDiscounts, useToggleDiscount, useSubscriptionSettings } from "../hooks";
import { useToast } from "@/shared/providers/ToastProvider";

export function DiscountsTab() {
  const { toast } = useToast();
  const { data: discounts, isLoading } = useDiscounts();
  const { data: settings } = useSubscriptionSettings();
  const toggleDiscount = useToggleDiscount();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const currentFee = settings?.subscriptionFee ?? 0;

  const handleToggle = (id: number) => {
    if (togglingId !== null) return;
    setTogglingId(id);
    toggleDiscount.mutate(id, {
      onSuccess: () => {
        toast({ type: "success", message: "تم التحديث بنجاح" });
        setTogglingId(null);
      },
      onError: () => {
        toast({ type: "error", message: "حدث خطأ" });
        setTogglingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-grey-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-grey-500">
              <th className="px-6 py-5 text-right font-medium">عنوان العرض</th>
              <th className="px-6 py-5 text-right font-medium">تاريخ البداية</th>
              <th className="px-6 py-5 text-right font-medium">تاريخ الإنتهاء</th>
              <th className="px-6 py-5 text-right font-medium">النسبة</th>
              <th className="px-6 py-5 text-right font-medium">الحالة</th>
              <th className="w-16 px-6 py-5" />
            </tr>
          </thead>
          <tbody>
            {(!discounts || discounts.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-grey-400"
                >
                  لا يوجد عروض
                </td>
              </tr>
            )}
            {(discounts ?? []).map((discount) => (
              <tr key={discount.id} className="border-t border-grey-100">
                <td className="px-6 py-5 text-base font-light text-text-dark">
                  {discount.title}
                </td>
                <td className="px-6 py-5 text-base font-light text-text-dark">
                  {new Date(discount.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-5 text-base font-light text-text-dark">
                  {new Date(discount.endDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-5 text-base font-light text-text-dark">
                  {discount.discountPercentage}%
                </td>
                <td className="px-6 py-5">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-base font-light"
                    style={
                      discount.isActive
                        ? { color: "#03960D", backgroundColor: "#E6FFE8" }
                        : { color: "#B1363E", backgroundColor: "#F3D8DA" }
                    }
                  >
                    {discount.isActive ? "مفعل" : "منتهي"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button
                    type="button"
                    disabled={togglingId !== null}
                    onClick={() => handleToggle(discount.id)}
                    className="flex items-center"
                  >
                    {discount.isActive ? (
                      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" className="pointer-events-none">
                        <rect x="0" y="0" width="44" height="24" rx="12" fill="#0DB2AC" />
                        <circle cx="32" cy="12" r="9" fill="white" />
                      </svg>
                    ) : (
                      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" className="pointer-events-none">
                        <rect x="0" y="0" width="44" height="24" rx="12" fill="#D1D5DB" />
                        <circle cx="12" cy="12" r="9" fill="white" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
