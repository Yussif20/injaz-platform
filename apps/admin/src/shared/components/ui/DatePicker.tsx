"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── Hijri Conversion Helpers ─────────────────────────────────────────────────

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

function gregorianToHijri(date: Date): HijriDate {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10);
  const yearStr = parts.find((p) => p.type === "year")!.value;
  const year = parseInt(yearStr.replace(/[^\d]/g, ""), 10);
  return { year, month, day };
}

function findGregorianForHijriDay1(
  targetYear: number,
  targetMonth: number,
): Date {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayH = gregorianToHijri(today);

  const targetTotal = targetYear * 12 + targetMonth;
  const todayTotal = todayH.year * 12 + todayH.month;
  const monthDiff = targetTotal - todayTotal;
  const dayOffset = Math.round(monthDiff * 29.5306) - todayH.day + 1;

  let current = new Date(today.getTime() + dayOffset * 86400000);
  current.setHours(12, 0, 0, 0);
  let h = gregorianToHijri(current);

  let safety = 30;
  while ((h.year !== targetYear || h.month !== targetMonth) && safety > 0) {
    const curTotal = h.year * 12 + h.month;
    const diff = targetTotal - curTotal;
    if (diff === 0) break;
    const jump = diff > 0 ? Math.max(diff * 28, 1) : Math.min(diff * 28, -1);
    current = new Date(current.getTime() + jump * 86400000);
    current.setHours(12, 0, 0, 0);
    h = gregorianToHijri(current);
    safety--;
  }

  safety = 35;
  while ((h.year !== targetYear || h.month !== targetMonth) && safety > 0) {
    const curTotal = h.year * 12 + h.month;
    const direction = targetTotal > curTotal ? 1 : -1;
    current = new Date(current.getTime() + direction * 86400000);
    h = gregorianToHijri(current);
    safety--;
  }

  while (h.day > 1 && h.year === targetYear && h.month === targetMonth) {
    current = new Date(current.getTime() - 86400000);
    h = gregorianToHijri(current);
  }

  if (h.year !== targetYear || h.month !== targetMonth) {
    current = new Date(current.getTime() + 86400000);
  }

  return current;
}

function getHijriMonthDays(hijriYear: number, hijriMonth: number): number {
  const start = findGregorianForHijriDay1(hijriYear, hijriMonth);
  const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1;
  const nextYear = hijriMonth === 12 ? hijriYear + 1 : hijriYear;
  const end = findGregorianForHijriDay1(nextYear, nextMonth);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GREGORIAN_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const HIJRI_MONTHS = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخرة",
  "جمادي الأولى", "جمادي الآخرة", "رجب", "شعبان",
  "رمضان", "شوال", "ذو القعدة", "ذو الحجة",
];

// RTL grid: index 0 = rightmost column = Friday
const DAY_NAMES = ["جمعة", "سبت", "أحد", "اثنين", "ثلاثاء", "اربعاء", "خميس"];

function jsDayToGridIndex(jsDay: number): number {
  const map = [2, 3, 4, 5, 6, 0, 1]; // Sun=2, Mon=3, Tue=4, Wed=5, Thu=6, Fri=0, Sat=1
  return map[jsDay]!;
}

// ─── DatePicker Component ─────────────────────────────────────────────────────

/** The month the calendar should open on: the stored date, or today when there is none. */
function calendarStart(value: string | undefined): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

type CalendarMode = "gregorian" | "hijri";

interface DatePickerProps {
  label?: string;
  value?: string; // ISO YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  defaultMode?: CalendarMode;
  disabled?: boolean;
  showModeToggle?: boolean;
  inputBg?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "اختر التاريخ",
  defaultMode = "gregorian",
  disabled = false,
  showModeToggle = true,
  inputBg,
}) => {
  // The calendar opens on the stored date when there is one, and on today otherwise. Both
  // are known at first render, so they seed the state directly instead of being written by
  // an effect afterwards — which used to open every populated picker on the current month
  // for one frame before jumping to the saved date.
  const initialDate = calendarStart(value);
  const initialHijri = gregorianToHijri(initialDate);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CalendarMode>(defaultMode);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [hijriViewYear, setHijriViewYear] = useState(initialHijri.year);
  const [hijriViewMonth, setHijriViewMonth] = useState(initialHijri.month);

  const [popupPos, setPopupPos] = useState<{ top: number; right: number; minWidth: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const calculatePopupPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopupPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
      minWidth: Math.max(rect.width, 320),
    });
  }, []);

  // Re-derive the position when the value changes underneath us (a form reset, or a parent
  // loading its data late). Done during render rather than in an effect so the calendar is
  // never briefly showing the previous date.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    const d = value ? new Date(value) : null;
    if (d && !isNaN(d.getTime())) {
      const h = gregorianToHijri(d);
      setSelectedDate(d);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setHijriViewYear(h.year);
      setHijriViewMonth(h.month);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setTempSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const update = () => calculatePopupPos();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, calculatePopupPos]);

  const openCalendar = () => {
    if (disabled) return;
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
      const h = gregorianToHijri(selectedDate);
      setHijriViewYear(h.year);
      setHijriViewMonth(h.month);
      setTempSelectedDate(selectedDate);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
      const h = gregorianToHijri(now);
      setHijriViewYear(h.year);
      setHijriViewMonth(h.month);
      setTempSelectedDate(null);
    }
    setMode(defaultMode);
    calculatePopupPos();
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      setSelectedDate(tempSelectedDate);
      const y = tempSelectedDate.getFullYear();
      const m = String(tempSelectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(tempSelectedDate.getDate()).padStart(2, "0");
      onChange(`${y}-${m}-${d}`);
    }
    setIsOpen(false);
  };

  const handleModeChange = (newMode: CalendarMode) => {
    setMode(newMode);
    if (newMode === "hijri") {
      const refDate = tempSelectedDate || new Date(viewYear, viewMonth, 1);
      const h = gregorianToHijri(refDate);
      setHijriViewYear(h.year);
      setHijriViewMonth(h.month);
    } else {
      const refDate =
        tempSelectedDate ||
        findGregorianForHijriDay1(hijriViewYear, hijriViewMonth);
      setViewYear(refDate.getFullYear());
      setViewMonth(refDate.getMonth());
    }
  };

  const displayValue = useMemo(() => {
    if (!selectedDate) return "";
    if (mode === "hijri" || defaultMode === "hijri") {
      const h = gregorianToHijri(selectedDate);
      return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year}هـ`;
    }
    return selectedDate.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate, mode, defaultMode]);

  // Gregorian grid
  const gregorianGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startGridIndex = jsDayToGridIndex(firstDay.getDay());
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const cells: { day: number; date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startGridIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cells.push({ day: d, date: new Date(viewYear, viewMonth - 1, d), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, date: new Date(viewYear, viewMonth, d), isCurrentMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, date: new Date(viewYear, viewMonth + 1, d), isCurrentMonth: false });
    }
    return cells;
  }, [viewYear, viewMonth]);

  // Hijri grid
  const hijriGrid = useMemo(() => {
    const daysInMonth = getHijriMonthDays(hijriViewYear, hijriViewMonth);
    const firstDayGregorian = findGregorianForHijriDay1(hijriViewYear, hijriViewMonth);
    const startGridIndex = jsDayToGridIndex(firstDayGregorian.getDay());
    const prevHijriMonth = hijriViewMonth === 1 ? 12 : hijriViewMonth - 1;
    const prevHijriYear = hijriViewMonth === 1 ? hijriViewYear - 1 : hijriViewYear;
    const prevMonthDays = getHijriMonthDays(prevHijriYear, prevHijriMonth);
    const cells: { day: number; gregorianDate: Date; isCurrentMonth: boolean }[] = [];
    const gridStartGregorian = new Date(firstDayGregorian.getTime() - startGridIndex * 86400000);

    for (let i = 0; i < startGridIndex; i++) {
      cells.push({
        day: prevMonthDays - startGridIndex + 1 + i,
        gregorianDate: new Date(gridStartGregorian.getTime() + i * 86400000),
        isCurrentMonth: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        gregorianDate: new Date(firstDayGregorian.getTime() + (d - 1) * 86400000),
        isCurrentMonth: true,
      });
    }
    const remaining = 42 - cells.length;
    const afterLastDay = new Date(firstDayGregorian.getTime() + daysInMonth * 86400000);
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        gregorianDate: new Date(afterLastDay.getTime() + (d - 1) * 86400000),
        isCurrentMonth: false,
      });
    }
    return cells;
  }, [hijriViewYear, hijriViewMonth]);

  // Year options
  const gregorianYears = useMemo(() => {
    const years = [];
    for (let y = new Date().getFullYear() + 10; y >= 2000; y--) years.push(y);
    return years;
  }, []);

  const hijriYears = useMemo(() => {
    const currentHijri = gregorianToHijri(new Date());
    const years = [];
    for (let y = currentHijri.year + 10; y >= 1420; y--) years.push(y);
    return years;
  }, []);

  const isSameDay = useCallback((d1: Date, d2: Date | null): boolean => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }, []);

  const todayDate = useMemo(() => new Date(), []);

  const renderDayCell = (
    day: number,
    gregorianDate: Date,
    isCurrentMonth: boolean,
    index: number,
  ) => {
    const selected = isSameDay(gregorianDate, tempSelectedDate);
    const today = isSameDay(gregorianDate, todayDate);
    return (
      <button
        key={index}
        type="button"
        onClick={() => setTempSelectedDate(gregorianDate)}
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors duration-150 ${
          selected
            ? "bg-primary-500 font-medium text-white"
            : isCurrentMonth
              ? today
                ? "bg-[#E3EFEF] font-medium text-primary-500"
                : "bg-[#E8F4F4] text-[#333] hover:bg-[#E3EFEF]"
              : "text-grey-300"
        }`}
      >
        {day}
      </button>
    );
  };

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-grey-700">{label}</label>
      )}

      {/* Input trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openCalendar}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-lg border ${inputBg ?? "bg-[#f6f6f6]"} px-3 py-2.5 text-sm transition-colors duration-200 focus:outline-none ${
          error
            ? "border-warning-500"
            : "border-grey-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <svg
          className="h-4 w-4 shrink-0 text-grey-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={`font-light ${displayValue ? "text-text-dark" : "text-text-muted"}`}>
          {displayValue || placeholder}
        </span>
      </button>

      {error && <p className="text-xs text-warning-500">{error}</p>}

      {/* Calendar Popup */}
      {isOpen && popupPos && (
        <div
          style={{
            position: "fixed",
            top: popupPos.top,
            right: popupPos.right,
            minWidth: popupPos.minWidth,
          }}
          className="z-[9999] rounded-2xl border border-grey-100 bg-white p-4 shadow-xl"
        >
          {/* Mode Toggle */}
          {showModeToggle && (
            <div className="mb-4 flex flex-row-reverse items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-sm text-[#333]">تاريخ ميلادي</span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    mode === "gregorian" ? "border-primary-500" : "border-grey-300"
                  }`}
                >
                  {mode === "gregorian" && (
                    <div className="h-3 w-3 rounded-full bg-primary-500" />
                  )}
                </div>
                <input
                  type="radio"
                  name={`calendar-mode-${label}`}
                  value="gregorian"
                  checked={mode === "gregorian"}
                  onChange={() => handleModeChange("gregorian")}
                  className="sr-only"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-sm text-[#333]">تاريخ هجري</span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    mode === "hijri" ? "border-primary-500" : "border-grey-300"
                  }`}
                >
                  {mode === "hijri" && (
                    <div className="h-3 w-3 rounded-full bg-primary-500" />
                  )}
                </div>
                <input
                  type="radio"
                  name={`calendar-mode-${label}`}
                  value="hijri"
                  checked={mode === "hijri"}
                  onChange={() => handleModeChange("hijri")}
                  className="sr-only"
                />
              </label>
            </div>
          )}

          {/* Month / Year Selectors */}
          <div className="mb-3 flex flex-row-reverse gap-2">
            {/* Month */}
            <div className="relative flex-1">
              <select
                value={mode === "gregorian" ? viewMonth : hijriViewMonth - 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (mode === "gregorian") setViewMonth(val);
                  else setHijriViewMonth(val + 1);
                }}
                className="w-full cursor-pointer appearance-none rounded-lg bg-[#F5F5F5] px-3 py-2 text-center text-sm text-[#333] focus:outline-none"
              >
                {(mode === "gregorian" ? GREGORIAN_MONTHS : HIJRI_MONTHS).map(
                  (m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ),
                )}
              </select>
              <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                <svg className="h-3 w-3 text-grey-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Year */}
            <div className="relative w-28">
              <select
                value={mode === "gregorian" ? viewYear : hijriViewYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (mode === "gregorian") setViewYear(val);
                  else setHijriViewYear(val);
                }}
                className="w-full cursor-pointer appearance-none rounded-lg bg-[#F5F5F5] px-3 py-2 text-center text-sm text-[#333] focus:outline-none"
              >
                {(mode === "gregorian" ? gregorianYears : hijriYears).map((y) => (
                  <option key={y} value={y}>
                    {mode === "hijri" ? `${y}هـ` : y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                <svg className="h-3 w-3 text-grey-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="mb-1 grid grid-cols-7">
            {DAY_NAMES.map((name, i) => (
              <div key={i} className="py-1 text-center text-xs font-medium text-[#333]">
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {mode === "gregorian"
              ? gregorianGrid.map((cell, i) =>
                  renderDayCell(cell.day, cell.date, cell.isCurrentMonth, i),
                )
              : hijriGrid.map((cell, i) =>
                  renderDayCell(cell.day, cell.gregorianDate, cell.isCurrentMonth, i),
                )}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!tempSelectedDate}
            className={`mt-4 w-full rounded-full py-3 text-base font-medium text-white transition-colors duration-200 ${
              tempSelectedDate
                ? "cursor-pointer bg-primary-500 hover:bg-primary-800"
                : "cursor-not-allowed bg-grey-300"
            }`}
          >
            تأكيد
          </button>
        </div>
      )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
