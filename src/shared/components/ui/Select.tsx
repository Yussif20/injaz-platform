"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string | number) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      id,
      options,
      placeholder,
      onChange,
      value,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-start text-sm font-medium text-grey-700"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-start text-sm transition-colors focus:ring-2 focus:outline-none ${
            error
              ? "border-error-500 focus:ring-error-200"
              : "border-grey-300 focus:border-primary-500 focus:ring-primary-200"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-start text-xs text-error-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
