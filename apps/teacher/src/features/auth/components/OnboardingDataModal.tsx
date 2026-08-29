"use client";

import { useEffect, useRef } from "react";
import { Button, Input, Select } from "@/shared/components/ui";

interface OnboardingDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  isLoading?: boolean;
  isEditing?: boolean;
  isFormValid?: boolean;
}

export function OnboardingDataModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel,
  isLoading = false,
  isEditing = false,
  isFormValid = true,
}: OnboardingDataModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close when clicking inside a portaled dropdown (e.g. year picker)
      if (
        target instanceof Element &&
        target.closest?.("[data-onboarding-dropdown]")
      ) {
        return;
      }
      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-[20px] md:rounded-3xl w-full max-w-md mx-4 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-grey-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="text-grey-500 hover:text-grey-700 transition-colors absolute right-6"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-base sm:text-base md:text-xl lg:text-xl font-normal text-[#333]">
            {title}
          </h2>
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-5 sm:space-y-5 md:space-y-7 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isFormValid}
              className={`w-full rounded-[20px]! h-12 font-light text-base ${
                !isFormValid ? "bg-[#EBEBEB]! text-[#666]!" : ""
              }`}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
