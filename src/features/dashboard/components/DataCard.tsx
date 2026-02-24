import React from "react";

interface DataCardProps {
  label: string;
  value: string;
  className?: string;
  /** Use "ltr" for phone numbers so digits display correctly in RTL layout */
  valueDir?: "ltr" | "rtl";
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  className = "",
  valueDir,
}) => {
  return (
    <div className={`text-right ${className}`}>
      {/* Label */}
      <div className="text-lg font-normal text-text-dark mb-1">{label}</div>
      {/* Value */}
      <div
        className="text-lg font-light text-grey-600"
        dir={valueDir}
      >
        {value}
      </div>
    </div>
  );
};
