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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        dir="rtl"
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-secondary-800 flex-1 text-right">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-grey-100 rounded-lg transition-colors mr-4 flex-shrink-0"
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
          <p className="text-grey-500 text-sm px-6 text-right">{message}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 p-6 pt-6">
          <Button
            type="button"
            variant="warning"
            size="lg"
            className={`flex-1 ${
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
            size="lg"
            className="flex-1"
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
