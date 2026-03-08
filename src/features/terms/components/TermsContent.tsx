"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { useTermsContent, useSaveTerms } from "../hooks/useTerms";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewModal } from "./PreviewModal";

export function TermsContent() {
  const { t } = useTranslation();
  const termsT = t("terms") as any;
  const { toast } = useToast();

  const editorRef = useRef<HTMLDivElement>(null);
  const hasPopulated = useRef(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const { data, isLoading } = useTermsContent();
  const saveTerms = useSaveTerms();

  // Populate editor only on initial load — never overwrite user edits after save
  useEffect(() => {
    if (data && editorRef.current && !hasPopulated.current) {
      editorRef.current.innerHTML = data.content;
      hasPopulated.current = true;
    }
  }, [data]);

  const handleSave = () => {
    const html = editorRef.current?.innerHTML ?? "";
    saveTerms.mutate(html, {
      onSuccess: () => {
        toast({ type: "success", message: "تم حفظ الشروط والأحكام بنجاح" });
      },
      onError: (error) => {
        toast({ type: "error", message: getErrorMessage(error) });
      },
    });
  };

  const handlePreview = () => {
    setPreviewHtml(editorRef.current?.innerHTML ?? "");
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

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
          className="min-h-[400px] w-full rounded-lg border border-grey-200 bg-white p-4 text-sm leading-relaxed text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
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
          loading={saveTerms.isPending}
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
