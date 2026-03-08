"use client";

import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Pagination, StatusBadge } from "@/shared/components/ui";
import { useFilteredSubscriptions } from "../hooks";
import type {
  SubscriptionFilterParams,
  PaymentStatus,
} from "../types/subscriptions.types";

const PAGE_SIZE = 10;

export function SubscriptionsTab() {
  const { t } = useTranslation();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;

  // Subscriptions-specific translations
  const subsT = {
    title: "قائمة الاشتراكات",
    searchPlaceholder: "البحث في الاشتراكات...",
    noSubscriptions: "لا يوجد اشتراكات",
    filterByStatus: "فلترة حسب الحالة",
    allStatuses: "جميع الحالات",
    active: "نشط",
    inactive: "غير نشط",
    expiresAfter: "ينتهي بعد",
    expiresBefore: "ينتهي قبل",
    table: {
      user: "المستخدم",
      subscribedAt: "تاريخ الاشتراك",
      expiresAt: "تاريخ الانتهاء",
      amount: "المبلغ",
      discount: "الخصم",
      finalAmount: "المبلغ النهائي",
      paymentStatus: "حالة الدفع",
      status: "الحالة",
      daysRemaining: "الأيام المتبقية",
    },
    paymentStatus: {
      pending: "قيد الانتظار",
      processing: "جارٍ المعالجة",
      initiated: "بدأ التحقق",
      completed: "مكتمل",
      failed: "فشل",
      unknown: "غير معروف",
      cancelled: "ملغي",
    },
    days: "يوم",
    sar: "ر.س",
  };

  // Filter state
  const [filters, setFilters] = useState<SubscriptionFilterParams>({
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [expiresAfter, setExpiresAfter] = useState("");
  const [expiresBefore, setExpiresBefore] = useState("");

  // Data fetching
  const {
    data: paginatedData,
    isLoading,
    isError,
    refetch,
  } = useFilteredSubscriptions({
    ...filters,
    SearchTerm: searchQuery || undefined,
    IsActive: statusFilter,
    ExpiresAfter: expiresAfter || undefined,
    ExpiresBefore: expiresBefore || undefined,
  });

  const subscriptions = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters((prev) => ({ ...prev, PageNumber: 1 }));
  };

  const getPaymentStatusLabel = (status: PaymentStatus | string): string => {
    // API may return string values ("Completed") or numeric enum (3)
    const normalized =
      typeof status === "string" ? status.toLowerCase() : status;
    const stringMap: Record<string, string> = {
      pending: subsT.paymentStatus.pending,
      processing: subsT.paymentStatus.processing,
      initiated: subsT.paymentStatus.initiated,
      completed: subsT.paymentStatus.completed,
      failed: subsT.paymentStatus.failed,
      unknown: subsT.paymentStatus.unknown,
      cancelled: subsT.paymentStatus.cancelled,
    };
    const numericMap: Record<number, string> = {
      0: subsT.paymentStatus.pending,
      1: subsT.paymentStatus.processing,
      2: subsT.paymentStatus.initiated,
      3: subsT.paymentStatus.completed,
      4: subsT.paymentStatus.failed,
      5: subsT.paymentStatus.unknown,
      6: subsT.paymentStatus.cancelled,
    };
    if (typeof normalized === "string") return stringMap[normalized] ?? normalized;
    return numericMap[normalized] ?? "";
  };

  const getPaymentStatusVariant = (
    status: PaymentStatus | string,
  ): "success" | "warning" | "neutral" | "info" => {
    const normalized =
      typeof status === "string" ? status.toLowerCase() : status;
    const stringMap: Record<string, "success" | "warning" | "neutral" | "info"> = {
      pending: "warning",
      processing: "warning",
      initiated: "warning",
      completed: "success",
      failed: "neutral",
      unknown: "neutral",
      cancelled: "neutral",
    };
    const numericMap: Record<number, "success" | "warning" | "neutral" | "info"> = {
      0: "warning",
      1: "warning",
      2: "warning",
      3: "success",
      4: "neutral",
      5: "neutral",
      6: "neutral",
    };
    if (typeof normalized === "string") return stringMap[normalized] ?? "neutral";
    return numericMap[normalized] ?? "neutral";
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
    <div className="rounded-2xl border border-grey-200 bg-white">
      {/* Card Header with Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grey-200 p-6">
        <h3 className="text-lg font-medium text-text-dark">{subsT.title}</h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date filters */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-grey-400" />
            <input
              type="date"
              value={expiresAfter}
              onChange={(e) => setExpiresAfter(e.target.value)}
              placeholder={subsT.expiresAfter}
              className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-grey-700"
            />
            <span className="text-grey-400">-</span>
            <input
              type="date"
              value={expiresBefore}
              onChange={(e) => setExpiresBefore(e.target.value)}
              placeholder={subsT.expiresBefore}
              className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-grey-700"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-grey-400" />
            <select
              value={statusFilter === undefined ? "" : statusFilter.toString()}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "" ? undefined : e.target.value === "true",
                )
              }
              className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-grey-700"
            >
              <option value="">{subsT.allStatuses}</option>
              <option value="true">{subsT.active}</option>
              <option value="false">{subsT.inactive}</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-56">
            <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={subsT.searchPlaceholder}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-grey-200 text-sm text-grey-500">
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.user}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.subscribedAt}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.expiresAt}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.amount}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.discount}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.finalAmount}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.paymentStatus}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.status}
              </th>
              <th className="px-6 py-4 text-right font-medium">
                {subsT.table.daysRemaining}
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-grey-400"
                >
                  {subsT.noSubscriptions}
                </td>
              </tr>
            )}
            {subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-grey-100 last:border-b-0"
              >
                <td className="px-6 py-4 text-sm text-text-dark">
                  {sub.userName ?? `User #${sub.userId}`}
                </td>
                <td className="px-6 py-4 text-sm text-text-dark">
                  {new Date(sub.subscribedAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-6 py-4 text-sm text-text-dark">
                  {new Date(sub.expiresAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-6 py-4 text-sm text-text-dark">
                  {sub.baseAmount} {subsT.sar}
                </td>
                <td className="px-6 py-4 text-sm text-text-dark">
                  {sub.discountPercentage}%
                </td>
                <td className="px-6 py-4 text-sm font-medium text-text-dark">
                  {sub.finalAmount} {subsT.sar}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    label={getPaymentStatusLabel(sub.paymentStatus)}
                    variant={getPaymentStatusVariant(sub.paymentStatus)}
                  />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    label={sub.isActive ? subsT.active : subsT.inactive}
                    variant={sub.isActive ? "success" : "neutral"}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-text-dark">
                  {sub.daysRemaining} {subsT.days}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-grey-200 px-6 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
