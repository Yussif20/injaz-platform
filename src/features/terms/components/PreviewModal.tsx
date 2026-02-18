"use client";

import { X } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
}

export function PreviewModal({ isOpen, onClose, html }: PreviewModalProps) {
  const { t } = useTranslation();
  const termsT = t("terms") as any;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-dark">
            {termsT.previewTitle}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-grey-400 hover:bg-grey-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rendered content */}
        <div
          dir="rtl"
          className="prose prose-sm max-w-none text-sm leading-relaxed text-text-dark"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
