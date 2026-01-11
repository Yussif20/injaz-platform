import React from "react";

interface DataCardProps {
  label: string;
  value: string;
  className?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div className={`text-right ${className}`}>
      {/* Label */}
      <div className="text-lg font-normal text-text-dark mb-1">{label}</div>
      {/* Value */}
      <div className="text-lg font-light text-grey-600">{value}</div>
    </div>
  );
};
