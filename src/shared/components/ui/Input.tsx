import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  note?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, note, className, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm md:text-base font-normal text-[#333]">
            {label}
            {note && <span className="text-grey-400 text-xs mr-1">{note}</span>}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full bg-white text-[#333] placeholder:text-[#B3B3B3]
            text-xs md:text-sm font-light md:font-normal text-right leading-normal
            px-3 py-2
            border rounded-2xl
            transition-colors duration-200
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
        />
        {error && <p className="text-warning-500 text-xs">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
