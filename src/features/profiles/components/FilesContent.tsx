"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  FileText,
  ExternalLink,
  Users,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Button, ConfirmDialog, Pagination } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useTranslation } from "@/i18n/TranslationContext";
import { useFilteredProfiles, useDeleteProfile } from "../hooks/useProfiles";
import { ProfileStatus } from "../types/profiles.types";
import type { AdminProfileDto, ProfileFilterParams } from "../types/profiles.types";

const PAGE_SIZE = 10;

function getStatusLabel(status: ProfileStatus): string {
  if (status === ProfileStatus.Published) return "ملف منشور";
  return "ملف غير منشور";
}

function getStatusColor(status: ProfileStatus): string {
  if (status === ProfileStatus.Published) return "text-primary-600";
  return "text-grey-400";
}

export function FilesContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const toastT = commonT.toast as Record<string, string>;
  const actionsT = commonT.actions as Record<string, string>;
  const confirmT = (commonT.confirm ?? {}) as Record<string, string>;

  const [filters, setFilters] = useState<ProfileFilterParams>({
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Action menu state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<AdminProfileDto | null>(null);

  const deleteProfile = useDeleteProfile();

  const {
    data: paginatedData,
    isLoading,
    isError,
    refetch,
  } = useFilteredProfiles({
    ...filters,
    SearchTerm: searchQuery || undefined,
    FromDate: fromDate || undefined,
    ToDate: toDate || undefined,
  });

  const profiles = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;
  const totalCount = paginatedData?.totalCount ?? 0;

  const publishedCount = profiles.filter(
    (p) => p.status === ProfileStatus.Published,
  ).length;
  const unpublishedCount = profiles.filter(
    (p) => p.status !== ProfileStatus.Published,
  ).length;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters((prev) => ({ ...prev, PageNumber: 1 }));
  };

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    profileId: number,
  ) => {
    e.stopPropagation();
    if (openMenuId === profileId) {
      setOpenMenuId(null);
      setMenuPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 160;
    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - menuWidth - 8),
    );
    setMenuPos({ top: rect.bottom + 4, left });
    setOpenMenuId(profileId);
  };

  const handleDeleteClick = (profile: AdminProfileDto) => {
    setDeleteTarget(profile);
    setOpenMenuId(null);
    setMenuPos(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProfile.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted ?? "تم الحذف بنجاح" });
        setDeleteTarget(null);
      },
      onError: () => {
        toast({ type: "error", message: toastT.error ?? "حدث خطأ" });
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-5">
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {totalCount}
            </p>
            <p className="mt-1 text-sm text-grey-500">ملف</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-5">
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {publishedCount}
            </p>
            <p className="mt-1 text-sm text-grey-500">ملف منشور</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-5">
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {unpublishedCount}
            </p>
            <p className="mt-1 text-sm text-grey-500">ملف غير منشور</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-text-dark">
          ملفات السنة الدراسية
        </h3>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-72">
            <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ابحث هنا باسم الملف"
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            />
          </div>
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-3 py-2">
            <Calendar className="h-4 w-4 text-grey-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setFilters((prev) => ({ ...prev, PageNumber: 1 }));
              }}
              className="border-none bg-transparent text-sm text-grey-700 focus:outline-none"
            />
            <span className="text-grey-400">/</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setFilters((prev) => ({ ...prev, PageNumber: 1 }));
              }}
              className="border-none bg-transparent text-sm text-grey-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Profile Cards List */}
      <div className="space-y-3">
        {profiles.length === 0 && (
          <div className="rounded-2xl border border-grey-200 bg-white px-6 py-12 text-center text-grey-400">
            لا توجد ملفات
          </div>
        )}
        {profiles.map((profile) => {
          const isPublished = profile.status === ProfileStatus.Published;
          return (
            <div
              key={profile.id}
              className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white px-6 py-4"
            >
              {/* Right: icon + info */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-grey-100 text-grey-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-text-dark">
                    {profile.userName}
                  </p>
                  <p className="text-sm font-medium text-text-dark">
                    ملف انجاز {profile.academicYearName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-grey-500">
                    <span>{profile.profileTypeName}</span>
                    <span>العام الدراسي: {profile.academicYearName}</span>
                    <span>
                      تاريخ الإنشاء:{" "}
                      {new Date(profile.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Left: status + view + menu */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${isPublished ? "bg-primary-500" : "bg-grey-400"}`}
                  />
                  <span
                    className={`text-sm font-medium ${getStatusColor(profile.status)}`}
                  >
                    {getStatusLabel(profile.status)}
                  </span>
                </div>
                {isPublished && profile.shareUrl ? (
                  <a
                    href={profile.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-1.5 text-xs text-white hover:bg-primary-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    عرض الملف
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 rounded-full border border-grey-200 bg-grey-100 px-4 py-1.5 text-xs text-grey-400 cursor-not-allowed"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    عرض الملف
                  </button>
                )}

                {/* Three-dot menu trigger */}
                <button
                  onClick={(e) => handleMenuOpen(e, profile.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-grey-600"
                  aria-label="خيارات"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Action menu (fixed position) */}
      {openMenuId !== null && menuPos && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPos(null);
            }}
          />
          <div
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="z-[9999] w-40 overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg"
          >
            <button
              onClick={() => {
                const profile = profiles.find((p) => p.id === openMenuId);
                if (profile) handleDeleteClick(profile);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              {actionsT.delete ?? "حذف"}
            </button>
          </div>
        </>
      )}

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={confirmT.title ?? "حذف الملف"}
        message={
          deleteTarget
            ? `هل أنت متأكد من حذف ملف "${deleteTarget.userName}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : ""
        }
        isLoading={deleteProfile.isPending}
        confirmLabel={actionsT.delete ?? "حذف"}
        cancelLabel={actionsT.cancel ?? "إلغاء"}
      />
    </div>
  );
}
