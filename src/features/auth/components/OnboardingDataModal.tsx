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
}

export function OnboardingDataModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel,
  isLoading = false,
}: OnboardingDataModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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
        className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-200">
          <button
            type="button"
            onClick={onClose}
            className="text-grey-500 hover:text-grey-700 transition-colors"
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
          <h2 className="text-lg font-medium text-text-dark">{title}</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full !rounded-xl h-12"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
