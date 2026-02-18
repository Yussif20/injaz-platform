"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Pagination, ConfirmDialog } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useRanks, useDeleteRank } from "../hooks";
import type { RankDto } from "../types/ranks.types";
import { AddRankModal } from "./AddRankModal";

const PAGE_SIZE = 10;

export function RanksContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  // Ranks-specific translations (fallback inline since we may not have them yet)
  const ranksT = {
    title: "الرتب والمراتب",
    addRank: "إضافة رتبة",
    searchPlaceholder: "البحث في الرتب...",
    noRanks: "لا توجد رتب",
    table: {
      titleMale: "المسمى (ذكر)",
      titleFemale: "المسمى (أنثى)",
      action: "الإجراء",
    },
  };

  // Data fetching
  const { data: ranks = [], isLoading, isError, refetch } = useRanks();

  // Mutations
  const deleteRank = useDeleteRank();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<RankDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RankDto | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Filter + paginate
  const filtered = ranks.filter((rank) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      rank.titleMale.toLowerCase().includes(search) ||
      rank.titleFemale.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Handlers
  const handleEdit = (rank: RankDto) => {
    setEditingRank(rank);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (rank: RankDto) => {
    setDeleteTarget(rank);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteRank.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted });
        setDeleteTarget(null);
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRank(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    toast({ type: "success", message: toastT.saved });
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
      {/* Add Rank Button */}
      <div className="mb-6 flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full!">
          <Plus className="h-5 w-5" />
          {ranksT.addRank}
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">{ranksT.title}</h3>
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
              placeholder={ranksT.searchPlaceholder}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="px-6 py-4 text-right font-medium">
                  {ranksT.table.titleMale}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {ranksT.table.titleFemale}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {ranksT.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-grey-400"
                  >
                    {ranksT.noRanks}
                  </td>
                </tr>
              )}
              {paginated.map((rank) => (
                <tr
                  key={rank.id}
                  className="border-b border-grey-100 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {rank.titleMale}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {rank.titleFemale}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 176;
                        const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
                        setMenuPos({ top: rect.bottom + 4, left });
                        setOpenMenuId(openMenuId === rank.id ? null : rank.id);
                      }}
                      className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {openMenuId === rank.id && menuPos && (
                      <div
                        ref={menuRef}
                        style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                        className="z-[9999] w-44 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                      >
                        <button
                          onClick={() => handleEdit(rank)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <Pencil className="h-4 w-4" />
                          {actionsT.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(rank)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-grey-200 px-6 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Rank Modal */}
      <AddRankModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        initialData={editingRank}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteRank.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
