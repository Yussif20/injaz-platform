"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button, ConfirmDialog, Pagination } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useTranslation } from "@/i18n/TranslationContext";
import { useFilteredProfiles, useDeleteProfile } from "../hooks/useProfiles";
import { ProfileStatus } from "../types/profiles.types";
import type { ProfileFilterParams } from "../types/profiles.types";
import { useAcademicYears } from "@/features/academic-years/hooks/useAcademicYears";
import { useUsers } from "@/features/users/hooks/useUsers";

const PAGE_SIZE = 10;

function getStatusLabel(status: ProfileStatus): string {
  if (status === ProfileStatus.Published) return "ملف منشور";
  return "ملف غير منشور";
}

export function FilesContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const toastT = commonT.toast as Record<string, string>;

  // Users lookup for profile owner names
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

  // Academic year selector
  const { data: academicYears } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(
    undefined,
  );
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  // Set default to active year (only on first load)
  const [initialYearSet, setInitialYearSet] = useState(false);
  useEffect(() => {
    if (academicYears && academicYears.length > 0 && !initialYearSet) {
      const active = academicYears.find((y) => y.status === "Active");
      setSelectedYearId(active?.id ?? academicYears[0].id);
      setInitialYearSet(true);
    }
  }, [academicYears, initialYearSet]);

  const selectedYear = useMemo(
    () => academicYears?.find((y) => y.id === selectedYearId),
    [academicYears, selectedYearId],
  );

  const [filters, setFilters] = useState<ProfileFilterParams>({
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
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
  } = useFilteredProfiles({
    ...filters,
    SearchTerm: debouncedSearch || undefined,
    AcademicYearId: selectedYearId,
  });

  const profiles = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  // Format date range for display
  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return "";
    const s = new Date(start);
    const e = new Date(end);
    const fmt = (d: Date) =>
      d.toLocaleDateString("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    return `${fmt(s)} / ${fmt(e)}`;
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
      {/* Header: Title + Search + Date Range */}
      <div className="grid grid-cols-3 items-center gap-4">
        {/* Right: Title */}
        <h3 className="whitespace-nowrap text-base font-medium text-text-dark">
          ملفات السنة الدراسية{" "}
          {selectedYear ? `(${selectedYear.yearName})` : ""}
        </h3>

          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث هنا باسم الملف"
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
            />
          </div>

          {/* Academic Year Selector */}
          <div className="relative">
            <button
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-4 py-2.5 text-sm text-grey-700 transition-colors hover:bg-grey-50"
            >
              <span className="whitespace-nowrap">
                {selectedYear
                  ? formatDateRange(
                      selectedYear.startDate,
                      selectedYear.endDate,
                    )
                  : "جميع السنوات"}
              </span>
              <ChevronDown className="h-4 w-4 text-grey-400" />
            </button>
            {yearDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setYearDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full z-[9999] mt-1 w-max min-w-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setSelectedYearId(undefined);
                      setYearDropdownOpen(false);
                      setFilters((prev) => ({ ...prev, PageNumber: 1 }));
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-grey-50 ${
                      !selectedYearId
                        ? "bg-[#E3EFEF] font-medium text-primary-500"
                        : "text-grey-700"
                    }`}
                  >
                    جميع السنوات
                  </button>
                  {academicYears?.map((year) => (
                    <button
                      key={year.id}
                      onClick={() => {
                        setSelectedYearId(year.id);
                        setYearDropdownOpen(false);
                        setFilters((prev) => ({ ...prev, PageNumber: 1 }));
                      }}
                      className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-grey-50 ${
                        year.id === selectedYearId
                          ? "bg-[#E3EFEF] font-medium text-primary-500"
                          : "text-grey-700"
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {year.yearName} —{" "}
                        {formatDateRange(year.startDate, year.endDate)}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
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
              className="rounded-2xl border border-grey-200 bg-white px-8 py-5"
            >
              {/* Two rows inside the card */}
              <div className="flex items-start gap-5">
                {/* File Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full bg-[#E3EFEF]">
                  <img
                    src="/icons/file-primary.svg"
                    alt=""
                    className="h-6 w-6"
                  />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  {/* Row 1: Title + View Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-normal text-text-dark">
                      ملف انجاز {profile.academicYearName}
                    </p>
                    {isPublished && profile.shareUrl ? (
                      <a
                        href={profile.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-5 py-1.5 text-sm text-white transition-colors hover:bg-primary-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        عرض الملف
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-grey-200 bg-grey-100 px-5 py-1.5 text-sm text-grey-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                        عرض الملف
                      </button>
                    )}
                  </div>

                  {/* Row 2: Details + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-lg font-light text-text-dark">
                      {(userNameMap.get(profile.userId) || profile.userName) && (
                        <span>{userNameMap.get(profile.userId) || profile.userName}</span>
                      )}
                      <span>{profile.profileTypeName}</span>
                      <span>العام الدراسي: {profile.academicYearName}</span>
                      <span>
                        تاريخ الإنشاء:{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "ar-SA",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-light ${
                          isPublished
                            ? "text-primary-500"
                            : "text-grey-500"
                        }`}
                      >
                        {getStatusLabel(profile.status)}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isPublished ? "bg-primary-500" : "bg-grey-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
