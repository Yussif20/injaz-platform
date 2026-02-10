"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import { mockTermsContent } from "../data/terms.mock";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewModal } from "./PreviewModal";

export function TermsContent() {
  const { t } = useTranslation();
  const termsT = t("terms") as any;

  const [content, setContent] = useState(mockTermsContent);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = () => {
    console.log("Terms saved:", content);
  };

  return (
    <>
      {/* Editor card */}
      <div className="rounded-2xl border border-grey-200 bg-white p-6">
        {/* Toolbar */}
        <div className="mb-4 flex justify-center">
          <EditorToolbar />
        </div>

        {/* Label */}
        <h3 className="mb-3 text-right text-base font-medium text-text-dark">
          {termsT.textContent}
        </h3>

        {/* Text editor area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] w-full resize-none rounded-lg border border-grey-200 bg-white p-4 text-sm leading-relaxed text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          dir="rtl"
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsPreviewOpen(true)}
          className="w-full rounded-[20px]! font-light!"
        >
          {termsT.preview}
        </Button>
        <Button
          size="lg"
          onClick={handleSave}
          className="w-full rounded-[20px]! font-light!"
        >
          {termsT.save}
        </Button>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
