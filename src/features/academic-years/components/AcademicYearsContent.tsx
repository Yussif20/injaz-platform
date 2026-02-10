"use client";

import { useState } from "react";
import { Plus, Search, ExternalLink, MoreHorizontal } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import { mockAcademicYears, type YearStatus } from "../data/academic-years.mock";
import { AddYearModal } from "./AddYearModal";
import { Pagination } from "./Pagination";

const statusStyles: Record<YearStatus, string> = {
  active: "bg-success-50 text-success-600",
  inactive: "bg-grey-100 text-grey-500",
  expired: "bg-warning-50 text-warning-500",
};

export function AcademicYearsContent() {
  const { t } = useTranslation();
  const ayT = t("academicYears") as any;
  const tableT = ayT.table;
  const statusT = ayT.status;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredYears = mockAcademicYears.filter((year) => {
    if (!searchQuery) return true;
    const yearLabel = `${year.gregorianYear} م / ${year.hijriYear} هـ`;
    return yearLabel.includes(searchQuery);
  });

  const totalPages = Math.max(1, Math.ceil(filteredYears.length / 5));

  return (
    <>
      {/* Add Year Button */}
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full!"
        >
          <Plus className="h-5 w-5" />
          {ayT.addYear}
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">
            {ayT.createdYears}
          </h3>
          <div className="relative w-72">
            <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ayT.searchPlaceholder}
              className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="px-6 py-4 text-right font-medium">{tableT.year}</th>
                <th className="px-6 py-4 text-right font-medium">{tableT.status}</th>
                <th className="px-6 py-4 text-right font-medium">{tableT.subscription}</th>
                <th className="px-6 py-4 text-right font-medium">{tableT.activeOffers}</th>
                <th className="px-6 py-4 text-right font-medium">{tableT.files}</th>
                <th className="px-6 py-4 text-right font-medium">{tableT.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredYears.map((year) => (
                <tr key={year.id} className="border-b border-grey-100 last:border-b-0">
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.gregorianYear} م / {year.hijriYear} هـ
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[year.status]}`}
                    >
                      {statusT[year.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.subscription} {ayT.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {year.activeOffer ?? ayT.noOffers}
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-1.5 text-xs text-white hover:bg-primary-700">
                      {ayT.viewFiles}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-grey-200 px-6 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add Year Modal */}
      <AddYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
