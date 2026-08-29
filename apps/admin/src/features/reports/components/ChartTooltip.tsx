"use client";

/**
 * The tooltip both report charts render on hover.
 *
 * Each chart had its own copy, identical apart from the unit word, and each typed its props
 * as `any` — which meant `payload[0].value` was unchecked and a shape change in recharts
 * would have surfaced as a blank tooltip rather than a type error.
 *
 * The props are declared structurally rather than imported from recharts: only `active` and
 * the numeric `value` are ever read, and recharts passes a good deal more. Recharts calls
 * this with its own richer object, which satisfies this narrower contract.
 */
interface ChartTooltipProps {
  active?: boolean;
  payload?: { value?: number | string }[];
  /** Unit shown after the number, e.g. "ملف" or "ريال". */
  unit: string;
}

export function ChartTooltip({ active, payload, unit }: ChartTooltipProps) {
  const value = payload?.[0]?.value;
  if (!active || value === undefined) return null;

  const formatted =
    typeof value === "number" ? value.toLocaleString("ar-SA") : value;

  return (
    <div
      dir="rtl"
      className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm text-white shadow"
    >
      {formatted} {unit}
    </div>
  );
}
