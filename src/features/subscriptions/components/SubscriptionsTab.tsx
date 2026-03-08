"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Button, Pagination } from "@/shared/components/ui";
import { useFilteredSubscriptions } from "../hooks";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { SubscriptionFilterParams } from "../types/subscriptions.types";

const PAGE_SIZE = 10;

enum PaymentStatus {
  Pending = 0,
  Processing = 1,
  Initiated = 2,
  Completed = 3,
  Failed = 4,
  Unknown = 5,
  Cancelled = 6,
}

function paymentStatusLabel(status: number | string): string {
  const n = typeof status === "string" ? status.toLowerCase() : status;
  if (n === PaymentStatus.Completed || n === "completed") return "ناجحة";
  if (n === PaymentStatus.Failed || n === "failed") return "مرفوضة";
  if (n === PaymentStatus.Cancelled || n === "cancelled") return "ملغاة";
  if (n === PaymentStatus.Pending || n === "pending") return "معلقة";
  if (n === PaymentStatus.Processing || n === "processing") return "قيد المعالجة";
  if (n === PaymentStatus.Initiated || n === "initiated") return "بدأت";
  return "غير معروف";
}

function paymentStatusStyle(status: number | string): { color: string; backgroundColor: string } {
  const n = typeof status === "string" ? status.toLowerCase() : status;
  if (n === PaymentStatus.Completed || n === "completed")
    return { color: "#03960D", backgroundColor: "#E6FFE8" };
  if (n === PaymentStatus.Failed || n === "failed" || n === PaymentStatus.Cancelled || n === "cancelled")
    return { color: "#B1363E", backgroundColor: "#F3D8DA" };
  return { color: "#6B7280", backgroundColor: "#F3F4F6" };
}

function paymentMethodIcon(method: string): React.ReactNode {
  const m = method?.toLowerCase() ?? "";
  if (m.includes("visa"))
    return <img src="/visa.svg" alt="VISA" className="h-5" />;
  if (m.includes("mada"))
    return <img src="/mada.svg" alt="mada" className="h-5" />;
  if (m.includes("apple"))
    return <img src="/apple-pay.svg" alt="Apple Pay" className="h-5" />;
  if (m.includes("master"))
    return <span className="rounded bg-grey-100 px-1.5 py-0.5 text-xs font-medium">Mastercard</span>;
  return <span className="rounded bg-grey-100 px-1.5 py-0.5 text-xs font-medium">{method || "—"}</span>;
}

export function SubscriptionsTab() {
  const [filters, setFilters] = useState<SubscriptionFilterParams>({
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Users lookup for names
  const { data: usersData } = useUsers();
  const userNameMap = useMemo(() => {
    const map = new Map<number, string>();
    if (usersData) {
      for (const user of usersData) {
        map.set(user.id, user.fullName);
      }
    }
    return map;
  }, [usersData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setFilters((prev) => ({ ...prev, PageNumber: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: paginatedData,
    isLoading,
    isError,
    refetch,
  } = useFilteredSubscriptions({
    ...filters,
    SearchTerm: debouncedSearch || undefined,
  });

  const subscriptions = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-4">
        <p className="text-grey-500">حدث خطأ</p>
        <Button variant="outline" onClick={() => refetch()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-72">
        <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4 text-grey-400" />
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث في الاشتراكات..."
          className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-grey-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-grey-200 text-sm text-grey-500">
              <th className="px-5 py-4 text-right font-medium">المشترك</th>
              <th className="px-5 py-4 text-right font-medium">مبلغ الإشتراك</th>
              <th className="px-5 py-4 text-right font-medium">وسيلة الدفع</th>
              <th className="px-5 py-4 text-right font-medium">التاريخ</th>
              <th className="px-5 py-4 text-right font-medium">رقم الفاتورة</th>
              <th className="px-5 py-4 text-right font-medium">العملية</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-grey-400"
                >
                  لا يوجد اشتراكات
                </td>
              </tr>
            )}
            {subscriptions.map((sub) => {
              const last4 = sub.paymentTransactionId
                ? sub.paymentTransactionId.slice(-4)
                : "—";
              return (
                <tr
                  key={sub.id}
                  className="border-b border-grey-100 last:border-b-0"
                >
                  {/* Subscriber */}
                  <td className="px-5 py-4 text-sm text-text-dark">
                    {userNameMap.get(sub.userId) || sub.userName || `#${sub.userId}`}
                  </td>
                  {/* Amount */}
                  <td className="px-5 py-4 text-sm text-text-dark">
                    {sub.finalAmount} ريال سعودي
                  </td>
                  {/* Payment method */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-sm text-text-dark">
                      {paymentMethodIcon(sub.paymentMethod)}
                      <span dir="ltr" className="whitespace-nowrap">**** {last4}</span>
                    </div>
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-text-dark" dir="ltr">
                    {new Date(sub.subscribedAt).toLocaleDateString("en-GB")}
                  </td>
                  {/* Transaction ID + download */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-primary-500">
                      <Download className="h-4 w-4" />
                      <span className="underline">
                        تحميل{" "}
                        {sub.paymentGatewayId ||
                          sub.paymentTransactionId ||
                          `#${sub.id}`}
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-base font-light"
                      style={paymentStatusStyle(sub.paymentStatus)}
                    >
                      {paymentStatusLabel(sub.paymentStatus)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
