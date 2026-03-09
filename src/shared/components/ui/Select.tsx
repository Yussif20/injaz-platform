"use client";

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (...args: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (...args: any[]) => any;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, className, disabled, name, value: controlledValue, onChange, onBlur },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState("");
    const [dropdownPosition, setDropdownPosition] = useState<{
      top: number;
      right: number;
      width: number;
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Hidden native select for react-hook-form ref compatibility
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const currentValue = controlledValue ?? internalValue;
    const selectedOption = options.find((o) => o.value === currentValue);

    // Merge refs so react-hook-form can read the hidden <select>
    const mergeRef = useCallback(
      (node: HTMLSelectElement | null) => {
        (hiddenSelectRef as React.MutableRefObject<HTMLSelectElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
      },
      [ref],
    );

    // Position dropdown when open (fixed portal)
    useLayoutEffect(() => {
      if (!isOpen || !triggerRef.current) {
        setDropdownPosition(null);
        return;
      }
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        width: rect.width,
      });
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const inContainer = containerRef.current && containerRef.current.contains(target);
        const inDropdown = dropdownRef.current && dropdownRef.current.contains(target);
        if (!inContainer && !inDropdown) setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      setInternalValue(optionValue);
      setIsOpen(false);

      // Update hidden select so react-hook-form picks up the change
      if (hiddenSelectRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLSelectElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(hiddenSelectRef.current, optionValue);
        hiddenSelectRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }

      onChange?.({ target: { name, value: optionValue } });
      onBlur?.({ target: { name, value: optionValue } });
    };

    return (
      <div className={`flex flex-col gap-2 ${className || ""}`} ref={containerRef}>
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

        {/* Hidden native select for react-hook-form */}
        <select
          ref={mergeRef}
          name={name}
          value={currentValue}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom trigger */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            relative w-full bg-white text-right
            text-xs sm:text-xs md:text-sm font-light sm:font-light md:font-normal
            px-3 py-2 pe-10 ps-3
            border rounded-2xl
            transition-colors duration-200
            cursor-pointer
            ${error ? "border-warning-500" : "border-[#EBEBEB] focus:border-primary-500"}
            ${disabled ? "opacity-60 cursor-not-allowed bg-[#E0E0E0]" : ""}
            focus:outline-none
            ${!selectedOption ? "text-grey-400" : "text-[#333333]"}
          `}
        >
          {selectedOption?.label || placeholder || ""}
          <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className={`w-4 h-4 text-grey-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        </button>

        {/* Dropdown: portaled so it floats over modals */}
        {isOpen &&
          dropdownPosition &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              data-onboarding-dropdown
              className="fixed z-100 bg-white border border-[#EBEBEB] rounded-2xl shadow-lg p-1"
              style={{
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                width: dropdownPosition.width,
              }}
            >
              {options.map((option) => {
                const isSelected = option.value === currentValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3
                      text-sm md:text-base transition-colors
                      ${isSelected ? "bg-[#F5F5F5] font-medium text-[#333] rounded-xl" : "text-[#555] hover:bg-[#FAFAFA]"}
                    `}
                  >
                    <span>{option.label}</span>
                    <span className="flex-shrink-0 w-5">
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>,
            document.body,
          )}

        {error && <p className="text-warning-500 text-xs">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
