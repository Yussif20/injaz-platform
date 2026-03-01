"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: "text-warning-500",
    button: "warning" as const,
  },
  warning: {
    icon: "text-warning-500",
    button: "warning" as const,
  },
  primary: {
    icon: "text-primary-500",
    button: "primary" as const,
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "primary",
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const styles = variantStyles[variant];

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 text-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close X - top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-grey-500 hover:bg-grey-100 hover:text-grey-700 transition-colors"
          aria-label="إغلاق"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Message (centered question) */}
        <p id="modal-title" className="text-secondary-800 text-center mb-10 pr-10 text-base md:text-lg">
          {message}
        </p>

        {/* Actions: reversed order - Cancel then Confirm (outline teal, solid red) */}
        <div className="flex flex-row-reverse gap-5 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 max-w-40 rounded-2xl font-light! border-2 border-primary-500 text-primary-500 bg-white hover:bg-primary-50"
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.button}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 max-w-40 rounded-2xl font-light!"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document root
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};
