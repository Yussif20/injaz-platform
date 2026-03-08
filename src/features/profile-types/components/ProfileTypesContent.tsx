"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Power,
  PowerOff,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Pagination, ConfirmDialog } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { GenderAvailability } from "@/shared/types";
import {
  useProfileTypes,
  useDeleteProfileType,
  useActivateProfileType,
  useDeactivateProfileType,
  useDuplicateProfileType,
} from "../hooks";
import type { ProfileTypeDto } from "../types/profile-types.types";
import { AddProfileTypeModal } from "./AddProfileTypeModal";
import { ProfileTypeDetail } from "./ProfileTypeDetail";

const PAGE_SIZE = 10;

const GENDER_AVAILABILITY_LABELS: Record<GenderAvailability, string> = {
  [GenderAvailability.Male]: "ذكور فقط",
  [GenderAvailability.Female]: "إناث فقط",
  [GenderAvailability.Both]: "الجميع",
};

export function ProfileTypesContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  // Profile Types translations (inline fallback)
  const ptT = {
    title: "أنواع الملفات",
    addProfileType: "إضافة نوع ملف",
    searchPlaceholder: "البحث في أنواع الملفات...",
    noResults: "لا توجد أنواع ملفات",
    table: {
      nameMale: "الاسم (ذكر)",
      nameFemale: "الاسم (أنثى)",
      availability: "التوفر",
      status: "الحالة",
      sections: "الأقسام",
      action: "الإجراء",
    },
    status: {
      active: "مفعل",
      inactive: "غير مفعل",
    },
    actions: {
      activate: "تفعيل",
      deactivate: "إلغاء التفعيل",
      duplicate: "نسخ",
    },
    duplicated: "تم نسخ النوع بنجاح",
  };

  // Data fetching
  const {
    data: profileTypes = [],
    isLoading,
    isError,
    refetch,
  } = useProfileTypes();

  // Mutations
  const deleteProfileType = useDeleteProfileType();
  const activateProfileType = useActivateProfileType();
  const deactivateProfileType = useDeactivateProfileType();
  const duplicateProfileType = useDuplicateProfileType();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProfileTypeDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProfileTypeDto | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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
  const filtered = profileTypes.filter((pt) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      pt.typeNameMale.toLowerCase().includes(search) ||
      pt.typeNameFemale.toLowerCase().includes(search) ||
      pt.description?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Handlers
  const handleEdit = (pt: ProfileTypeDto) => {
    setEditingType(pt);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (pt: ProfileTypeDto) => {
    setDeleteTarget(pt);
    setOpenMenuId(null);
  };

  const handleActivate = (pt: ProfileTypeDto) => {
    activateProfileType.mutate(pt.id, {
      onSuccess: () => {
        toast({ type: "success", message: toastT.saved });
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
    setOpenMenuId(null);
  };

  const handleDeactivate = (pt: ProfileTypeDto) => {
    deactivateProfileType.mutate(pt.id, {
      onSuccess: () => {
        toast({ type: "success", message: toastT.saved });
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
    setOpenMenuId(null);
  };

  const handleDuplicate = (pt: ProfileTypeDto) => {
    duplicateProfileType.mutate(pt.id, {
      onSuccess: () => {
        toast({ type: "success", message: ptT.duplicated });
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProfileType.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted });
        setDeleteTarget(null);
        // Collapse if we deleted the expanded item
        if (expandedId === deleteTarget.id) {
          setExpandedId(null);
        }
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    toast({ type: "success", message: toastT.saved });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
      {/* Add Profile Type Button */}
      <div className="mb-6 flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full!">
          <Plus className="h-5 w-5" />
          {ptT.addProfileType}
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">{ptT.title}</h3>
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
              placeholder={ptT.searchPlaceholder}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="w-10 px-3 py-4"></th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.nameMale}
                </th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.nameFemale}
                </th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.availability}
                </th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.status}
                </th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.sections}
                </th>
                <th className="px-4 py-4 text-right font-medium">
                  {ptT.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-grey-400"
                  >
                    {ptT.noResults}
                  </td>
                </tr>
              )}
              {paginated.map((pt) => (
                <React.Fragment key={pt.id}>
                  <tr
                    className={`border-b border-grey-100 last:border-b-0 ${
                      expandedId === pt.id ? "bg-grey-50" : ""
                    }`}
                  >
                    {/* Expand toggle */}
                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleExpand(pt.id)}
                        className="rounded-lg p-1 text-grey-400 hover:bg-grey-100"
                      >
                        {expandedId === pt.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-dark">
                      {pt.typeNameMale}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-dark">
                      {pt.typeNameFemale}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-dark">
                      {GENDER_AVAILABILITY_LABELS[pt.availableFor]}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          pt.isActive
                            ? "bg-success-100 text-success-700"
                            : "bg-grey-100 text-grey-600"
                        }`}
                      >
                        {pt.isActive ? ptT.status.active : ptT.status.inactive}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-dark">
                      {pt.sections?.length ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const menuWidth = 192;
                          const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
                          setMenuPos({ top: rect.bottom + 4, left });
                          setOpenMenuId(openMenuId === pt.id ? null : pt.id);
                        }}
                        className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {openMenuId === pt.id && menuPos && (
                        <div
                          ref={menuRef}
                          style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                          className="z-[9999] w-48 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                        >
                          <button
                            onClick={() => handleEdit(pt)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                          >
                            <Pencil className="h-4 w-4" />
                            {actionsT.edit}
                          </button>
                          {pt.isActive ? (
                            <button
                              onClick={() => handleDeactivate(pt)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                            >
                              <PowerOff className="h-4 w-4" />
                              {ptT.actions.deactivate}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(pt)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                            >
                              <Power className="h-4 w-4" />
                              {ptT.actions.activate}
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(pt)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                          >
                            <Copy className="h-4 w-4" />
                            {ptT.actions.duplicate}
                          </button>
                          <button
                            onClick={() => handleDelete(pt)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warning-500 hover:bg-grey-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            {actionsT.delete}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {/* Expanded Detail Row */}
                  {expandedId === pt.id && (
                    <tr key={`${pt.id}-detail`}>
                      <td colSpan={7} className="bg-grey-50 px-6 py-4">
                        <ProfileTypeDetail profileTypeId={pt.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

      {/* Add/Edit Profile Type Modal */}
      <AddProfileTypeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        initialData={editingType}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteProfileType.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
