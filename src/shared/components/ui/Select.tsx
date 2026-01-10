import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 sm:gap-3">
        {label && (
          <label className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              w-full bg-[#EBEBEB] text-text-dark
              text-xs sm:text-sm lg:text-[14px] text-right
              px-3 sm:px-4 py-2 sm:py-3 pr-10
              border-2 rounded-xl sm:rounded-2xl
              transition-colors duration-200
              appearance-none cursor-pointer
              ${error ? "border-warning-500" : "border-transparent focus:border-primary-500"}
              ${disabled ? "opacity-60 cursor-not-allowed bg-[#E0E0E0]" : ""}
              focus:outline-none
              ${className || ""}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Arrow icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-grey-500"
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
        {error && (
          <p className="text-warning-500 text-xs">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
