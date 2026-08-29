"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
  isLoading = false,
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white px-6 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-8 text-center text-xl font-normal text-text-dark">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-3xl bg-warning-500 py-2.5 text-base font-light text-white transition-colors hover:bg-warning-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-3xl border border-primary-500 py-2.5 text-base font-light text-primary-500 transition-colors hover:bg-primary-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
