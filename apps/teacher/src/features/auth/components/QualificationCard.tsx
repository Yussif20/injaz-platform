"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/** Format stored Gregorian year as "2025 / 1447 ھ" for display (Aug 1 for correct Gregorian↔Hijri alignment). If yearStr is already a range (contains " - "), return as-is. */
function formatGraduationYearDisplay(yearStr: string): string {
  if (yearStr === "") return yearStr;
  if (yearStr.includes(" - ")) return yearStr; // already a formatted range (e.g. job card)
  const y = parseInt(yearStr, 10);
  if (isNaN(y)) return yearStr;
  const dateInSecondHalf = new Date(y, 7, 1); // August 1
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
  });
  const parts = formatter.formatToParts(dateInSecondHalf);
  const yearPart = parts.find((p) => p.type === "year");
  const hijriYear = yearPart
    ? parseInt(yearPart.value.replace(/\D/g, ""), 10)
    : y - 622;
  return `${y} / ${hijriYear} ھ`;
}

interface QualificationCardProps {
  degree: string;
  institution: string;
  year: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function QualificationCard({
  degree,
  institution,
  year,
  onEdit,
  onDelete,
}: QualificationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-shade-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-right border-r-2 border-[#008387] pr-3">
          <p className="font-normal text-[#333] text-sm md:text-lg">{degree}</p>
          <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
            {institution}
          </p>
          <p className="font-normal text-[#4D4D4D] text-xs md:text-lg mt-1">
            {formatGraduationYearDisplay(year)}
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="text-grey-500 p-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM12 10a2 2 0 110-4 2 2 0 010 4zM18 10a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-grey-200 py-1 min-w-25 z-10">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
                className="w-full px-4 py-2 text-right text-sm text-grey-700 hover:bg-grey-100 transition-colors flex items-center justify-start gap-1"
              >
                <Image
                  src="/icons/ui/edit-black.svg"
                  alt="تعديل"
                  width={16}
                  height={16}
                />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full px-4 py-2 text-right text-sm text-warning-500 hover:bg-grey-100 transition-colors flex items-center justify-start gap-1"
              >
                <Image
                  src="/icons/ui/delete.svg"
                  alt="حذف"
                  width={16}
                  height={16}
                />
                <span>حذف</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
