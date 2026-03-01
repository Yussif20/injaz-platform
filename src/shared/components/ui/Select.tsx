import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, className, disabled, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm md:text-base font-normal text-[#333]">
            {label.includes("*") ? (
              <>
                {label.split("*").flatMap((part, i) =>
                  i === 0 ? [part] : [<span key={i} className="text-warning-500">*</span>, part],
                )}
              </>
            ) : (
              label
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              w-full bg-white
              text-[#333333]
              text-xs sm:text-xs md:text-sm font-light sm:font-light md:font-normal text-right
              px-3 py-2 pe-10 ps-3
              border rounded-2xl
              transition-colors duration-200
              appearance-none cursor-pointer
              ${
                error
                  ? "border-warning-500"
                  : "border-[#EBEBEB] focus:border-primary-500"
              }
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
          {/* Arrow icon - on inline-end so RTL has no extra spacing on text side */}
          <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none">
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
        {error && <p className="text-warning-500 text-xs">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
