"use client";

import React from "react";

interface EndYearLabelRowProps {
  label: string;
  isPresent: boolean;
  onTogglePresent: (next: boolean) => void;
}

/** Label row for career end-year field with a "حتى الآن" pill toggle */
export const EndYearLabelRow: React.FC<EndYearLabelRowProps> = ({
  label,
  isPresent,
  onTogglePresent,
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm md:text-base font-normal text-[#333]">
        {label.includes("*")
          ? label
              .split("*")
              .flatMap((part, i) =>
                i === 0
                  ? [part]
                  : [
                      <span key={i} className="text-warning-500">
                        *
                      </span>,
                      part,
                    ],
              )
          : label}
      </label>
      <button
        type="button"
        onClick={() => onTogglePresent(!isPresent)}
        aria-pressed={isPresent}
        className={`group flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
          isPresent
            ? "border-primary-500 bg-primary-500 text-white shadow-sm"
            : "border-grey-200 bg-white text-grey-600 hover:border-primary-500 hover:text-primary-500"
        }`}
      >
        <span
          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isPresent
              ? "border-white bg-white text-primary-500"
              : "border-grey-300 bg-white text-transparent group-hover:border-primary-500"
          }`}
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-2.5 w-2.5"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span>حتى الآن</span>
      </button>
    </div>
  );
};
