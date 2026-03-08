"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  ToggleLeft,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, ConfirmDialog, StatusBadge } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useDiscounts, useDeleteDiscount, useToggleDiscount } from "../hooks";
import type { SubscriptionDiscountDto } from "../types/subscriptions.types";
import { AddDiscountModal } from "./AddDiscountModal";

export function DiscountsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  // Discounts-specific translations
  const discountsT = {
    title: "إدارة الخصومات",
    addDiscount: "إضافة خصم",
    searchPlaceholder: "البحث في الخصومات...",
    noDiscounts: "لا يوجد خصومات",
    table: {
      title: "العنوان",
      percentage: "نسبة الخصم",
      endDate: "تاريخ الانتهاء",
      status: "الحالة",
      action: "الإجراء",
    },
    active: "نشط",
    inactive: "غير نشط",
    toggleActive: "تبديل الحالة",
  };

  // Data fetching
  const { data: discounts, isLoading, isError, refetch } = useDiscounts();
  const deleteDiscount = useDeleteDiscount();
  const toggleDiscount = useToggleDiscount();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] =
    useState<SubscriptionDiscountDto | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<SubscriptionDiscountDto | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter discounts by search
  const filteredDiscounts = (discounts ?? []).filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Handlers
  const handleEdit = (discount: SubscriptionDiscountDto) => {
    setEditingDiscount(discount);
    setIsAddModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (discount: SubscriptionDiscountDto) => {
    setDeleteTarget(discount);
    setOpenMenuId(null);
  };

  const handleToggle = (discount: SubscriptionDiscountDto) => {
    toggleDiscount.mutate(discount.id, {
      onSuccess: () => {
        toast({ type: "success", message: toastT.saved });
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteDiscount.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted });
        setDeleteTarget(null);
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    setEditingDiscount(null);
    toast({ type: "success", message: toastT.saved });
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingDiscount(null);
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
    <>
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">
            {discountsT.title}
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative w-56">
              <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-grey-400" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={discountsT.searchPlaceholder}
                className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
              />
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-full!"
            >
              <Plus className="h-5 w-5" />
              {discountsT.addDiscount}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="px-6 py-4 text-right font-medium">
                  {discountsT.table.title}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {discountsT.table.percentage}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {discountsT.table.endDate}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {discountsT.table.status}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {discountsT.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-grey-400"
                  >
                    {discountsT.noDiscounts}
                  </td>
                </tr>
              )}
              {filteredDiscounts.map((discount) => (
                <tr
                  key={discount.id}
                  className="border-b border-grey-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {discount.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {discount.discountPercentage}%
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {new Date(discount.endDate).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={
                        discount.isActive
                          ? discountsT.active
                          : discountsT.inactive
                      }
                      variant={discount.isActive ? "success" : "neutral"}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 176;
                        const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
                        setMenuPos({ top: rect.bottom + 4, left });
                        setOpenMenuId(openMenuId === discount.id ? null : discount.id);
                      }}
                      className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {openMenuId === discount.id && menuPos && (
                      <div
                        ref={menuRef}
                        style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                        className="z-[9999] w-44 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                      >
                        <button
                          onClick={() => handleEdit(discount)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <Edit2 className="h-4 w-4" />
                          {actionsT.edit}
                        </button>
                        <button
                          onClick={() => handleToggle(discount)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <ToggleLeft className="h-4 w-4" />
                          {discountsT.toggleActive}
                        </button>
                        <button
                          onClick={() => handleDelete(discount)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warning-500 hover:bg-grey-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {actionsT.delete}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddDiscountModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddSuccess}
        discount={editingDiscount}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteDiscount.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
