// ─── Hijri/Gregorian Conversion Utilities ─────────────────────────────────────
// Extracted from DatePicker.tsx — no external dependencies (Intl only).

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
 * Convert a DatePicker Hijri value ("H1445-07-15") → Gregorian ISO ("2024-01-25").
 * Returns the value as-is if it is already a Gregorian date (no H prefix).
 */
export function hijriValueToGregorianISO(value: string): string {
  if (!value.startsWith("H")) return value;
  const hijriYMD = value.slice(1);
  const [y, m, d] = hijriYMD.split("-").map((x) => parseInt(x, 10));
  const day1 = findGregorianForHijriDay1(y, m);
  const result = new Date(day1.getTime() + (d - 1) * 86400000);
  const year = result.getFullYear();
  const month = String(result.getMonth() + 1).padStart(2, "0");
  const day = String(result.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const monthName = GREGORIAN_MONTHS[date.getMonth()] ?? String(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day} ${monthName} ${year} م`;
}
