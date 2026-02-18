"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import { mockTermsContent } from "../data/terms.mock";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewModal } from "./PreviewModal";

export function TermsContent() {
  const { t } = useTranslation();
  const termsT = t("terms") as any;

  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  // Set initial content once on mount (not via dangerouslySetInnerHTML to avoid React overwriting user edits)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = mockTermsContent;
    }
  }, []);

  const handleSave = () => {
    const html = editorRef.current?.innerHTML ?? "";
    console.log("Terms saved:", html);
    // TODO: POST to API
  };

  const handlePreview = () => {
    setPreviewHtml(editorRef.current?.innerHTML ?? "");
    setIsPreviewOpen(true);
  };

  return (
    <>
      {/* Editor card */}
      <div className="rounded-2xl border border-grey-200 bg-white p-6">
        {/* Toolbar */}
        <div className="mb-4 flex justify-center">
          <EditorToolbar editorRef={editorRef} />
        </div>

        {/* Label */}
        <h3 className="mb-3 text-right text-base font-medium text-text-dark">
          {termsT.textContent}
        </h3>

        {/* Contenteditable editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dir="rtl"
          className="min-h-[400px] w-full rounded-lg border border-grey-200 bg-white p-4 text-sm leading-relaxed text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePreview}
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
        html={previewHtml}
      />
    </>
  );
}
