"use client";

import React from "react";
import { Button } from "@/shared/components/ui";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "warning" | "danger";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  isLoading = false,
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6 pb-2 sm:pb-4 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-secondary-800 flex-1 text-right min-w-0 break-words">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-1 hover:bg-grey-100 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
            aria-label="إغلاق"
          >
            <svg
              className="w-5 h-5 text-grey-500"
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
        </div>

        {/* Message (optional) */}
        {message && (
          <p className="text-grey-500 text-sm px-4 sm:px-6 pb-4 sm:pb-2 text-right min-w-0 break-words overflow-y-auto">
            {message}
          </p>
        )}

        {/* Action buttons: stack on mobile, row on sm+ */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 pt-2 sm:pt-4 flex-shrink-0">
          <Button
            type="button"
            variant="warning"
            size="md"
            className={`w-full sm:flex-1 py-3 sm:py-2.5 ${
              variant === "danger"
                ? "!bg-warning-600 hover:!bg-warning-700"
                : ""
            }`}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full sm:flex-1 py-3 sm:py-2.5"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
