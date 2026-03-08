"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={`rounded-lg border px-4 py-2.5 text-start text-sm transition-colors placeholder:text-grey-400 focus:ring-2 focus:outline-none ${
            error
              ? "border-error-500 focus:ring-error-200"
              : "border-grey-300 focus:border-primary-500 focus:ring-primary-500/30"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-start text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
