"use client";

import { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

type CalendarMode = "gregorian" | "hijri";

/** Approximate Gregorian year for the start of a Hijri year */
function hijriToGregorianYear(hijriYear: number): number {
  return Math.round(hijriYear + 622 - hijriYear / 33);
}

/** Current Hijri year (approximate from today) */
function getCurrentHijriYear(): number {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
  });
  const parts = formatter.formatToParts(new Date());
  const yearPart = parts.find((p) => p.type === "year");
  return yearPart ? parseInt(yearPart.value.replace(/\D/g, ""), 10) : 1446;
}

/** Gregorian year → Hijri year (use Aug 1 so the "primary" Hijri year for that Gregorian year is correct; July 1 often falls in the previous Hijri year) */
function gregorianYearToHijri(gregorianYear: number): number {
  const dateInSecondHalf = new Date(gregorianYear, 7, 1); // August 1
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
  });
  const parts = formatter.formatToParts(dateInSecondHalf);
  const yearPart = parts.find((p) => p.type === "year");
  return yearPart ? parseInt(yearPart.value.replace(/\D/g, ""), 10) : gregorianYear - 622;
}

interface GraduationYearPickerProps {
  label?: string;
  value: string;
  onChange: (year: string) => void;
  error?: string;
  placeholder?: string;
  /** When true, the trigger is not clickable (use alongside a "حتى الآن" checkbox) */
  disabled?: boolean;
}

/** Sentinel value representing an open-ended "حتى الآن" end date */
export const PRESENT_YEAR_VALUE = "present";

const GREGORIAN_START = 1960;
const HIJRI_END = 1350;

export function GraduationYearPicker({
  label,
  value,
  onChange,
  error,
  placeholder = "اختر السنة",
  disabled = false,
}: GraduationYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [mode, setMode] = useState<CalendarMode>("hijri");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentGregorian = new Date().getFullYear();
  const currentHijri = getCurrentHijriYear();

  const gregorianYears = useMemo(() => {
    const list: number[] = [];
    for (let y = currentGregorian; y >= GREGORIAN_START; y--) list.push(y);
    return list;
  }, [currentGregorian]);

  const hijriYears = useMemo(() => {
    const list: number[] = [];
    // Include Hijri years up to the one that matches the max Gregorian we show, so a selected Gregorian year appears correctly in the Hijri list
    const maxHijriInList = Math.max(
      currentHijri,
      gregorianYearToHijri(currentGregorian),
    );
    for (let y = maxHijriInList; y >= HIJRI_END; y--) list.push(y);
    return list;
  }, [currentHijri, currentGregorian]);

  const isPresent = value === PRESENT_YEAR_VALUE;
  const num = parseInt(value, 10);
  const selectedYear = !isPresent && value !== "" && !isNaN(num) ? num : null;

  const handleSelectYear = (year: number, isHijri: boolean) => {
    if (isHijri) {
      const gYear = hijriToGregorianYear(year);
      onChange(String(gYear));
    } else {
      onChange(String(year));
    }
  };

  const isYearSelected = (year: number, isHijri: boolean) => {
    if (selectedYear == null) return false;
    if (isHijri) return hijriToGregorianYear(year) === selectedYear;
    return year === selectedYear;
  };

  // Position dropdown when open (for fixed portal)
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) {
      setDropdownPosition(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, [isOpen]);

  // Close on outside click (container or portaled dropdown)
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inContainer =
        containerRef.current && containerRef.current.contains(target);
      const inDropdown =
        dropdownRef.current && dropdownRef.current.contains(target);
      if (!inContainer && !inDropdown) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const displayValue = isPresent
    ? "حتى الآن"
    : selectedYear != null
      ? `${selectedYear} / ${gregorianYearToHijri(selectedYear)} ھ`
      : "";

  return (
    <div className="relative flex w-full flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="text-sm md:text-base font-normal text-[#333]">
          {label.includes("*") ? (
            <>
              {label.split("*").flatMap((part, i) =>
                i === 0 ? [part] : [<span key={i} className="text-warning-500">*</span>, part],
              )}
            </>
          ) : (
            label
          )}
        </label>
      )}
      {/* Trigger: whole field opens picker; calendar icon on the right, text next to it (RTL) */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`flex min-h-10 w-full items-center gap-2 rounded-2xl border px-3 py-2 text-right transition-all ${
          isPresent
            ? "cursor-not-allowed border-primary-500 bg-primary-50 ring-2 ring-primary-500/20"
            : disabled
              ? "cursor-not-allowed border-[#EBEBEB] bg-grey-50 opacity-60"
              : "cursor-pointer border-[#EBEBEB] bg-white hover:border-grey-300 hover:bg-grey-50/50"
        }`}
        dir="rtl"
        aria-label="فتح منتقي السنة"
        aria-expanded={isOpen}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            isPresent ? "text-primary-500" : "text-grey-500"
          }`}
        >
          {isPresent ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/icons/ui/calendar.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          )}
        </span>
        <span
          className={`flex-1 text-right text-sm ${
            isPresent
              ? "font-medium text-primary-500"
              : displayValue
                ? "text-[#333]"
                : "text-grey-400"
          }`}
        >
          {displayValue || placeholder}
        </span>
      </button>

      {/* Dropdown: portaled so it overlays modal and uses content width */}
      {isOpen &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            data-onboarding-dropdown
            className="fixed z-100 w-max min-w-72 rounded-2xl border border-[#EBEBEB] bg-white p-4 shadow-xl text-right"
            style={{
              top: dropdownPosition.top,
              right: dropdownPosition.right,
              left: "auto",
            }}
          >
            {/* Date system toggle */}
            <div className="mb-4 flex flex-row-reverse items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-sm text-[#333]">تاريخ ميلادي</span>
                <input
                  type="radio"
                  name="graduation-year-mode"
                  checked={mode === "gregorian"}
                  onChange={() => setMode("gregorian")}
                  className="h-5 w-5 rounded-full border-2 border-grey-300 transition-colors checked:border-primary-500 checked:bg-primary-500"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-sm text-[#333]">تاريخ هجري</span>
                <input
                  type="radio"
                  name="graduation-year-mode"
                  checked={mode === "hijri"}
                  onChange={() => setMode("hijri")}
                  className="h-5 w-5 rounded-full border-2 border-grey-300 transition-colors checked:border-primary-500 checked:bg-primary-500"
                />
              </label>
            </div>

            {/* Year list */}
            <div className="max-h-48 overflow-y-auto rounded-lg border border-grey-100">
              {mode === "hijri" &&
                hijriYears.map((year) => {
                  const selected = isYearSelected(year, true);
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year, true)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-right text-sm transition-colors ${
                        selected ? "bg-grey-100" : "hover:bg-grey-50"
                      }`}
                      dir="rtl"
                    >
                      <span className="text-[#333]">{year}ھ</span>
                      {selected && (
                        <svg
                          className="h-5 w-5 shrink-0 text-success-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              {mode === "gregorian" &&
                gregorianYears.map((year) => {
                  const selected = isYearSelected(year, false);
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year, false)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-right text-sm transition-colors ${
                        selected ? "bg-grey-100" : "hover:bg-grey-50"
                      }`}
                      dir="rtl"
                    >
                      <span className="text-[#333]">{year}</span>
                      {selected && (
                        <svg
                          className="h-5 w-5 shrink-0 text-success-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>,
          document.body,
        )}

      {error && <p className="text-warning-500 text-xs">{error}</p>}
    </div>
  );
}
