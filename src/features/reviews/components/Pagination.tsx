"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();
  const paginationT = (t("reviews") as any).pagination;

  // Show a window of pages with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= 7; i++) pages.push(i);
      pages.push("ellipsis");
    } else if (currentPage >= totalPages - 3) {
      pages.push("ellipsis");
      for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push("ellipsis");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      pages.push("ellipsis");
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-grey-500 hover:bg-grey-100 disabled:opacity-40"
      >
        <ChevronsRight className="h-4 w-4" />
        {paginationT.first}
      </button>

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-grey-500 hover:bg-grey-100 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
        {paginationT.previous}
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-sm text-grey-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${
              page === currentPage
                ? "bg-primary-500 text-white"
                : "text-grey-500 hover:bg-grey-100"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-grey-500 hover:bg-grey-100 disabled:opacity-40"
      >
        {paginationT.next}
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-grey-500 hover:bg-grey-100 disabled:opacity-40"
      >
        {paginationT.last}
        <ChevronsLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
