import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  note?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, note, className, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 sm:gap-3">
        {label && (
          <label className="text-xs sm:text-sm lg:text-[16px] font-normal text-text-dark">
            {label}
            {note && (
              <span className="text-grey-400 text-xs mr-1">{note}</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full bg-[#EBEBEB] text-text-dark placeholder:text-[#B3B3B3]
            text-xs sm:text-sm lg:text-[14px] text-right
            px-3 sm:px-4 py-2 sm:py-3
            border-2 rounded-xl sm:rounded-2xl
            transition-colors duration-200
            ${error ? "border-warning-500" : "border-transparent focus:border-primary-500"}
            ${disabled ? "opacity-60 cursor-not-allowed bg-[#E0E0E0]" : ""}
            focus:outline-none
            ${className || ""}
          `}
          {...props}
        />
        {error && (
          <p className="text-warning-500 text-xs">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
