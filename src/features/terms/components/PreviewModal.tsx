"use client";

import { X, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { mockPreviewSections } from "../data/terms.mock";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
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

        {/* Content sections */}
        <div className="space-y-8">
          {mockPreviewSections.map((section, index) => (
            <div key={index} className="relative">
              {/* Link icon on the side */}
              <div className="absolute -start-2 top-0">
                <LinkIcon className="h-4 w-4 text-grey-300" />
              </div>

              {section.heading && (
                <h3 className="mb-3 text-center text-base font-medium text-text-dark">
                  {section.heading}
                </h3>
              )}
              <p className="text-sm leading-relaxed text-text-dark">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
