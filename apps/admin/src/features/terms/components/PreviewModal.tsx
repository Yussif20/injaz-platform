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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 md:p-10"
      onClick={onClose}
    >
      <div
        className="h-[96vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6 flex min-h-10 items-center justify-center">
          <h2 className="text-center text-2xl font-semibold text-text-dark md:text-3xl">
            {termsT.previewTitle}
          </h2>
          <button
            onClick={onClose}
            className="absolute end-0 top-1/2 -translate-y-1/2 rounded-lg p-1 text-grey-400 hover:bg-grey-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rendered content */}
        <div className="min-h-[75vh] px-2 py-8 md:min-h-[80vh] md:px-8 md:py-12 lg:px-12 lg:py-16">
          <div
            dir="rtl"
            className="prose prose-sm mx-auto max-w-4xl text-sm leading-loose text-text-dark"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
