"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationLabels {
  first: string;
  last: string;
  previous: string;
  next: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels?: PaginationLabels;
}

const defaultLabels: PaginationLabels = {
  first: "الأولى",
  last: "الأخيرة",
  previous: "السابق",
  next: "التالي",
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  labels = defaultLabels,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 6, 7, "ellipsis"];
    }
    if (currentPage >= totalPages - 3) {
      return [
        "ellipsis",
        ...Array.from({ length: 7 }, (_, i) => totalPages - 6 + i),
      ];
    }
    return [
      "ellipsis",
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "ellipsis",
    ];
  };

  const visiblePages = getVisiblePages();

  const navBtnClass =
    "flex cursor-pointer items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm text-grey-500 transition-colors hover:text-text-dark disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="bg-[#F6F6F6] px-6 py-4">
      <div className="flex items-center justify-center gap-1">
        {/* First (RTL: appears on right) */}
        <button
          className={navBtnClass}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsRight className="h-4 w-4" />
          {labels.first}
        </button>

        {/* Previous */}
        <button
          className={navBtnClass}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronRight className="h-4 w-4" />
          {labels.previous}
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, idx) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-sm text-grey-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors ${
                page === currentPage
                  ? "bg-primary-500 text-white"
                  : "bg-white text-grey-500 hover:bg-grey-100"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          className={navBtnClass}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {labels.next}
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Last (RTL: appears on left) */}
        <button
          className={navBtnClass}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {labels.last}
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
