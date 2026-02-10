"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const ayT = t("academicYears") as any;
  const paginationT = ayT.pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      {/* First (RTL: appears on right) */}
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
      {pages.map((page) => (
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
      ))}

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
