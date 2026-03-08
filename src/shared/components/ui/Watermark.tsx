"use client";

interface WatermarkProps {
  text?: string;
}

/**
 * Fixed full-screen watermark overlay for unsubscribed users.
 * Renders large diagonal text repeated every ~200px across the viewport.
 */
export function Watermark({ text = "إنجاز المعلم\nغير مدفوع" }: WatermarkProps) {
  const lines = text.split("\n");

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[50] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute"
        style={{
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: "rotate(-35deg)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 500px)",
          gridTemplateRows: "repeat(auto-fill, 800px)",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center select-none">
            {lines.map((line, j) => (
              <span
                key={j}
                className="text-5xl md:text-7xl font-bold leading-tight whitespace-nowrap"
                style={{ color: "rgba(180, 210, 210, 0.35)" }}
              >
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
