"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import {
  Button,
  Pagination,
  ConfirmDialog,
  StatusBadge,
} from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import {
  useAcademicYears,
  useDeleteAcademicYear,
  useActivateAcademicYear,
  useDeactivateAcademicYear,
  useCloseAcademicYear,
} from "../hooks";
import type { AcademicYearDto } from "../types/academic-years.types";
import { AddYearModal } from "./AddYearModal";

type StatusVariant = "success" | "warning" | "error" | "neutral" | "info";

function getStatusVariant(status: string): StatusVariant {
  const normalized = status.toLowerCase();
  if (normalized === "active") return "success";
  if (normalized === "inactive") return "neutral";
  if (normalized === "closed") return "warning";
  return "neutral";
}

function getStatusLabel(status: string, statusT: Record<string, string>) {
  const normalized = status.toLowerCase();
  return statusT[normalized] ?? status;
}

const PAGE_SIZE = 5;

export function AcademicYearsContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const ayT = t("academicYears") as Record<string, unknown>;
  const tableT = ayT.table as Record<string, string>;
  const statusT = ayT.status as Record<string, string>;
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  // Data fetching
  const { data: years = [], isLoading, isError, refetch } = useAcademicYears();

  // Mutations
  const deleteYear = useDeleteAcademicYear();
  const activateYear = useActivateAcademicYear();
  const deactivateYear = useDeactivateAcademicYear();
  const closeYear = useCloseAcademicYear();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYearDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicYearDto | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setShowStatusSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter + paginate
  const filtered = years.filter((year) => {
    if (!searchQuery) return true;
    return year.yearName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Handlers
  const handleEdit = (year: AcademicYearDto) => {
    setEditingYear(year);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (year: AcademicYearDto) => {
    setDeleteTarget(year);
    setOpenMenuId(null);
    setShowStatusSubmenu(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteYear.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted });
        setDeleteTarget(null);
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    const action =
      status === "active"
        ? activateYear
        : status === "inactive"
          ? deactivateYear
          : closeYear;
    action.mutate(id, {
      onSuccess: () => toast({ type: "success", message: toastT.saved }),
      onError: () => toast({ type: "error", message: toastT.error }),
    });
    setOpenMenuId(null);
    setShowStatusSubmenu(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingYear(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    toast({ type: "success", message: toastT.saved });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <p className="text-grey-500">{toastT.error}</p>
        <Button variant="outline" onClick={() => refetch()}>
          {actionsT.retry ?? "إعادة المحاولة"}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Add Year Button */}
      <div className="mb-6 flex items-center justify-start">
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full!">
          <Plus className="h-5 w-5" />
          {ayT.addYear as string}
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">
            {ayT.createdYears as string}
          </h3>
          <div className="relative w-72">
            <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={ayT.searchPlaceholder as string}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.year}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.status}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.subscription ?? "الإشتراك الخاص بالسنة"}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.activeOffers ?? "العروض المفعلة"}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.files}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {tableT.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-grey-400"
                  >
                    {(ayT.noYears as string) ?? "لا توجد سنوات دراسية"}
                  </td>
                </tr>
              )}
              {paginated.map((year) => (
                <tr
                  key={year.id}
                  className="border-b border-grey-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.yearName}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={getStatusLabel(year.status, statusT)}
                      variant={getStatusVariant(year.status)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.subscriptionFee != null
                      ? `${year.subscriptionFee} ${ayT.currency as string}`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.activeDeal ?? (ayT.noOffers as string)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-1.5 text-xs text-white hover:bg-primary-700">
                      {ayT.viewFiles as string}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 208;
                        const left = Math.max(
                          8,
                          Math.min(
                            rect.left,
                            window.innerWidth - menuWidth - 8,
                          ),
                        );
                        setMenuPos({ top: rect.bottom + 4, left });
                        if (openMenuId === year.id) {
                          setOpenMenuId(null);
                          setShowStatusSubmenu(false);
                        } else {
                          setOpenMenuId(year.id);
                          setShowStatusSubmenu(false);
                        }
                      }}
                      className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {openMenuId === year.id && menuPos && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "fixed",
                          top: menuPos.top,
                          left: menuPos.left,
                        }}
                        className="z-[9999] w-52 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                      >
                        {/* Status Change */}
                        <button
                          onClick={() =>
                            setShowStatusSubmenu(!showStatusSubmenu)
                          }
                          className="flex w-full items-center justify-between px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <span>تعديل حالة السنة</span>
                          <ChevronLeft
                            className={`h-4 w-4 transition-transform ${showStatusSubmenu ? "-rotate-90" : ""}`}
                          />
                        </button>
                        {showStatusSubmenu && (
                          <div className="border-t border-grey-100 bg-grey-50 py-1">
                            {[
                              { key: "active", label: "مفعلة" },
                              { key: "inactive", label: "غير مفعلة" },
                              { key: "closed", label: "منتهية" },
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() =>
                                  handleStatusChange(year.id, opt.key)
                                }
                                className="flex w-full items-center gap-2 px-6 py-2 text-sm text-grey-700 hover:bg-grey-100"
                              >
                                <CheckCircle
                                  className={`h-4 w-4 ${
                                    year.status.toLowerCase() === opt.key
                                      ? "text-success-500"
                                      : "text-grey-300"
                                  }`}
                                />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-grey-100" />

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(year)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warning-500 hover:bg-grey-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف السنة
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add/Edit Year Modal */}
      <AddYearModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        initialData={editingYear}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        message="هل انت متأكد من حذف السنة الدراسية؟"
        isLoading={deleteYear.isPending}
        confirmLabel="حذف السنة"
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
