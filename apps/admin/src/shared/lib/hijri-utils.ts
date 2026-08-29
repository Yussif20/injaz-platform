// ─── Hijri/Gregorian Display Utilities ──────────────────────────────────────
// Ported from injaz-almoalem — uses Intl only (no external deps).

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

/**
 * "2000-01-15" → "15 رمضان 1420 هـ"
 */
export function gregorianISOToHijriDisplay(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const h = gregorianToHijri(date);
  const monthName = HIJRI_MONTHS[h.month - 1] ?? String(h.month);
  return `${h.day} ${monthName} ${h.year} هـ`;
}

/**
 * "2000-01-15" → "15 يناير 2000 م"
 */
export function gregorianISOToGregorianDisplay(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const monthName =
    GREGORIAN_MONTHS[date.getMonth()] ?? String(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day} ${monthName} ${year} م`;
}

/**
 * Format an ISO date as "gregorian  •  hijri"
 * e.g. "15 يناير 2000 م  •  15 رمضان 1420 هـ"
 */
export function formatDateDual(iso: string): string {
  const g = gregorianISOToGregorianDisplay(iso);
  const h = gregorianISOToHijriDisplay(iso);
  return `${g}  •  ${h}`;
}

/**
 * Format a year as "2020 / 1442 ھ"
 * Uses August 1 of that year for accurate Gregorian→Hijri alignment.
 */
export function formatYearDual(year: number | string): string {
  const y = typeof year === "string" ? parseInt(year, 10) : year;
  if (isNaN(y)) return String(year);
  const dateInSecondHalf = new Date(y, 7, 1); // August 1
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
  });
  const parts = formatter.formatToParts(dateInSecondHalf);
  const yearPart = parts.find((p) => p.type === "year");
  const hijri = yearPart
    ? parseInt(yearPart.value.replace(/\D/g, ""), 10)
    : y - 622;
  return `${y} / ${hijri} ھ`;
}

/**
 * Format a year range as "2020 / 1442 ھ - 2024 / 1446 ھ"
 */
export function formatYearRangeDual(
  startYear: number | string,
  endYear?: number | string | null,
): string {
  const start = formatYearDual(startYear);
  if (endYear == null) return start;
  const end = formatYearDual(endYear);
  return `${start} - ${end}`;
}
