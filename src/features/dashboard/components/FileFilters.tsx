"use client";

import React from "react";
import { dashboardContent } from "@/content";
import { Button } from "@/shared/components/ui";
import { FileStatus } from "./FileCard";

interface FileFiltersProps {
  /** Year options to show (e.g. from API). When provided, only these years are shown. */
  years?: string[];
  selectedYear: string | null;
  selectedStatus: FileStatus | null;
  onYearChange: (year: string | null) => void;
  onStatusChange: (status: FileStatus | null) => void;
  onApplyFilters: () => void;
}

export const FileFilters: React.FC<FileFiltersProps> = ({
  years: yearsProp,
  selectedYear,
  selectedStatus,
  onYearChange,
  onStatusChange,
  onApplyFilters,
}) => {
  const { filters, fileStatus } = dashboardContent;
  const years = yearsProp ?? filters.years;

  const statusOptions: { value: FileStatus; label: string; color: string }[] = [
    { value: "incomplete", label: fileStatus.incomplete, color: "bg-warning-500" },
    { value: "unpublished", label: fileStatus.unpublished, color: "bg-grey-400" },
    { value: "published", label: fileStatus.published, color: "bg-success-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-grey-200 p-5">
      {/* Year filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-grey-700 mb-3 text-center">
          {filters.filterByYear}
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="radio"
              name="year"
              checked={selectedYear === null}
              onChange={() => onYearChange(null)}
              className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
            />
            <span className="text-sm text-grey-600">{filters.allYears}</span>
          </label>
          {years.length === 0 ? (
            <p className="text-sm text-grey-500 text-center py-2">—</p>
          ) : (
            years.map((year) => (
              <label
                key={year}
                className="flex items-center gap-3 cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="year"
                  checked={selectedYear === year}
                  onChange={() => onYearChange(year)}
                  className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                />
                <span className="text-sm text-grey-600">{year}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-grey-700 mb-3 text-center">
          {filters.filterByStatus}
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === null}
              onChange={() => onStatusChange(null)}
              className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
            />
            <span className="text-sm text-grey-600">{filters.allStatuses}</span>
          </label>
          {statusOptions.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-3 cursor-pointer py-1"
            >
              <input
                type="radio"
                name="status"
                checked={selectedStatus === status.value}
                onChange={() => onStatusChange(status.value)}
                className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
              />
              <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
              <span
                className={`text-sm ${
                  status.value === "incomplete"
                    ? "text-warning-500"
                    : status.value === "published"
                    ? "text-success-500"
                    : "text-grey-500"
                }`}
              >
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply filters button */}
      <Button
        variant="primary"
        size="md"
        onClick={onApplyFilters}
        className="w-full"
      >
        {filters.filterButton}
      </Button>
    </div>
  );
};
