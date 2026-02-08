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
  // Use today as a reliable reference point instead of the distant Hijri epoch
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayH = gregorianToHijri(today);

  // Estimate offset in days from today
  const targetTotal = targetYear * 12 + targetMonth;
  const todayTotal = todayH.year * 12 + todayH.month;
  const monthDiff = targetTotal - todayTotal;
  const dayOffset = Math.round(monthDiff * 29.5306) - todayH.day + 1;

  let current = new Date(today.getTime() + dayOffset * 86400000);
  current.setHours(12, 0, 0, 0);
  let h = gregorianToHijri(current);

  // Coarse adjustment: jump by ~29 days per month difference
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

  // Fine-tune: scan day by day if still not in right month
  safety = 35;
  while ((h.year !== targetYear || h.month !== targetMonth) && safety > 0) {
    const curTotal = h.year * 12 + h.month;
    const direction = targetTotal > curTotal ? 1 : -1;
    current = new Date(current.getTime() + direction * 86400000);
    h = gregorianToHijri(current);
    safety--;
  }

  // Now in the correct month, scan backward to day 1
  // Keep checking we stay in the target month
  while (h.day > 1 && h.year === targetYear && h.month === targetMonth) {
    current = new Date(current.getTime() - 86400000);
    h = gregorianToHijri(current);
  }

  // If we overshot into the previous month, step forward one day
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
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخرة",
  "جمادي الأولى",
  "جمادي الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

// Arabic day names - in RTL grid, index 0 = rightmost column = Friday
const DAY_NAMES = ["جمعة", "سبت", "أحد", "اثنين", "ثلاثاء", "اربعاء", "خميس"];

// Map JS getDay() (0=Sun) to our grid index
// Grid: Fri(0), Sat(1), Sun(2), Mon(3), Tue(4), Wed(5), Thu(6)
function jsDayToGridIndex(jsDay: number): number {
  const map = [2, 3, 4, 5, 6, 0, 1]; // Sun=2, Mon=3, Tue=4, Wed=5, Thu=6, Fri=0, Sat=1
  return map[jsDay];
}

// ─── DatePicker Component ─────────────────────────────────────────────────────

type CalendarMode = "gregorian" | "hijri";

interface DatePickerProps {
  label?: string;
  value?: string; // ISO format YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "اختر التاريخ",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CalendarMode>("gregorian");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  );
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  // Gregorian navigation state
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  // Hijri navigation state
  const [hijriViewYear, setHijriViewYear] = useState(() => {
    return gregorianToHijri(new Date()).year;
  });
  const [hijriViewMonth, setHijriViewMonth] = useState(() => {
    return gregorianToHijri(new Date()).month;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize from value
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        const h = gregorianToHijri(d);
        setHijriViewYear(h.year);
        setHijriViewMonth(h.month);
      }
    }
  }, [value]);

  // Close on outside click
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

  const openCalendar = () => {
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

  // Format display value
  const displayValue = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  // ─── Gregorian Calendar Grid ──────────────────────────────────────────────

  const gregorianGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startGridIndex = jsDayToGridIndex(firstDay.getDay());
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { day: number; date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = startGridIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cells.push({
        day: d,
        date: new Date(viewYear, viewMonth - 1, d),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        date: new Date(viewYear, viewMonth, d),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill 6 rows
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        date: new Date(viewYear, viewMonth + 1, d),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // ─── Hijri Calendar Grid (optimized: compute day 1 once, then increment) ──

  const hijriGrid = useMemo(() => {
    const daysInMonth = getHijriMonthDays(hijriViewYear, hijriViewMonth);
    const firstDayGregorian = findGregorianForHijriDay1(
      hijriViewYear,
      hijriViewMonth,
    );
    const startGridIndex = jsDayToGridIndex(firstDayGregorian.getDay());

    // Previous hijri month info
    const prevHijriMonth = hijriViewMonth === 1 ? 12 : hijriViewMonth - 1;
    const prevHijriYear =
      hijriViewMonth === 1 ? hijriViewYear - 1 : hijriViewYear;
    const prevMonthDays = getHijriMonthDays(prevHijriYear, prevHijriMonth);

    const cells: {
      day: number;
      gregorianDate: Date;
      isCurrentMonth: boolean;
    }[] = [];

    // Calculate the Gregorian date for the first cell of the grid
    // It's (startGridIndex) days before the first of the current Hijri month
    const gridStartGregorian = new Date(
      firstDayGregorian.getTime() - startGridIndex * 86400000,
    );

    // Previous month trailing days
    for (let i = 0; i < startGridIndex; i++) {
      const hijriDay = prevMonthDays - startGridIndex + 1 + i;
      cells.push({
        day: hijriDay,
        gregorianDate: new Date(
          gridStartGregorian.getTime() + i * 86400000,
        ),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        gregorianDate: new Date(
          firstDayGregorian.getTime() + (d - 1) * 86400000,
        ),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remaining = 42 - cells.length;
    const afterLastDay = new Date(
      firstDayGregorian.getTime() + daysInMonth * 86400000,
    );
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        gregorianDate: new Date(
          afterLastDay.getTime() + (d - 1) * 86400000,
        ),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [hijriViewYear, hijriViewMonth]);

  // ─── Year options ─────────────────────────────────────────────────────────

  const gregorianYears = useMemo(() => {
    const years = [];
    for (let y = new Date().getFullYear(); y >= 1940; y--) {
      years.push(y);
    }
    return years;
  }, []);

  const hijriYears = useMemo(() => {
    const currentHijri = gregorianToHijri(new Date());
    const years = [];
    for (let y = currentHijri.year + 1; y >= 1360; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // ─── Date comparison helpers ──────────────────────────────────────────────

  const isSameDay = useCallback((d1: Date, d2: Date | null): boolean => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }, []);

  const todayDate = useMemo(() => new Date(), []);

  // ─── Render ───────────────────────────────────────────────────────────────

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
        className={`
          w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm
          transition-colors duration-150 cursor-pointer
          ${
            selected
              ? "bg-primary-500 text-white font-medium"
              : isCurrentMonth
                ? today
                  ? "bg-primary-200 text-primary-800 font-medium"
                  : "bg-[#E8F4F4] text-[#333] hover:bg-primary-200"
                : "text-grey-300"
          }
        `}
      >
        {day}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {label && (
        <label className="text-sm md:text-base font-normal text-[#333]">
          {label}
        </label>
      )}

      {/* Input trigger */}
      <button
        type="button"
        onClick={openCalendar}
        className={`
          w-full bg-white text-right
          text-xs sm:text-xs md:text-sm font-light sm:font-light md:font-normal
          px-3 py-2
          border rounded-2xl
          transition-colors duration-200
          ${error ? "border-warning-500" : "border-[#EBEBEB] focus:border-primary-500"}
          focus:outline-none
          flex items-center justify-between
        `}
      >
        <svg
          className="w-5 h-5 text-grey-400 shrink-0"
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
        <span className={displayValue ? "text-[#333]" : "text-[#B3B3B3]"}>
          {displayValue || placeholder}
        </span>
      </button>

      {error && <p className="text-warning-500 text-xs">{error}</p>}

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-grey-100 p-4 min-w-[320px]">
          {/* Calendar Type Toggle */}
          <div className="flex items-center justify-between mb-4 flex-row-reverse">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-[#333]">تاريخ ميلادي</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  mode === "gregorian"
                    ? "border-primary-500"
                    : "border-grey-300"
                }`}
              >
                {mode === "gregorian" && (
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                )}
              </div>
              <input
                type="radio"
                name="calendar-mode"
                value="gregorian"
                checked={mode === "gregorian"}
                onChange={() => handleModeChange("gregorian")}
                className="sr-only"
              />
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-[#333]">تاريخ هجري</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  mode === "hijri" ? "border-primary-500" : "border-grey-300"
                }`}
              >
                {mode === "hijri" && (
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                )}
              </div>
              <input
                type="radio"
                name="calendar-mode"
                value="hijri"
                checked={mode === "hijri"}
                onChange={() => handleModeChange("hijri")}
                className="sr-only"
              />
            </label>
          </div>

          {/* Month / Year Selectors */}
          <div className="flex gap-2 mb-3 flex-row-reverse">
            {/* Month Select */}
            <div className="relative flex-1">
              <select
                value={mode === "gregorian" ? viewMonth : hijriViewMonth - 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (mode === "gregorian") {
                    setViewMonth(val);
                  } else {
                    setHijriViewMonth(val + 1);
                  }
                }}
                className="w-full appearance-none bg-[#F5F5F5] rounded-lg px-3 py-2 text-sm text-[#333] text-center cursor-pointer focus:outline-none"
              >
                {(mode === "gregorian" ? GREGORIAN_MONTHS : HIJRI_MONTHS).map(
                  (m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ),
                )}
              </select>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-3 h-3 text-grey-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Year Select */}
            <div className="relative w-28">
              <select
                value={mode === "gregorian" ? viewYear : hijriViewYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (mode === "gregorian") {
                    setViewYear(val);
                  } else {
                    setHijriViewYear(val);
                  }
                }}
                className="w-full appearance-none bg-[#F5F5F5] rounded-lg px-3 py-2 text-sm text-[#333] text-center cursor-pointer focus:outline-none"
              >
                {(mode === "gregorian" ? gregorianYears : hijriYears).map(
                  (y) => (
                    <option key={y} value={y}>
                      {mode === "hijri" ? `${y}هـ` : y}
                    </option>
                  ),
                )}
              </select>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-3 h-3 text-grey-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map((name, i) => (
              <div
                key={i}
                className="text-center text-xs text-[#333] font-medium py-1"
              >
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
                  renderDayCell(
                    cell.day,
                    cell.gregorianDate,
                    cell.isCurrentMonth,
                    i,
                  ),
                )}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!tempSelectedDate}
            className={`
              w-full mt-4 py-3 rounded-full text-white text-base font-medium
              transition-colors duration-200
              ${
                tempSelectedDate
                  ? "bg-primary-500 hover:bg-primary-600 cursor-pointer"
                  : "bg-grey-300 cursor-not-allowed"
              }
            `}
          >
            تأكيد
          </button>
        </div>
      )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
