"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import { Button } from "@/shared/components/ui";
import { authContent } from "@/content";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const { signUp } = authContent;
  const modalRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch the terms the first time the modal is opened, then keep them for the session.
  //
  // `html` has to stay in the dependency list because the effect reads it, so setting it
  // re-runs this effect. Bailing out at the top makes that re-run a no-op. It previously
  // fell through to `else setLoading(false)`, a synchronous setState on every re-run that
  // React flagged as a cascading render — and one that could never do anything, since the
  // `finally` below has already cleared the flag.
  useEffect(() => {
    if (!isOpen || html) return;
    let cancelled = false;

    async function fetchTerms() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("/api/system-parameters/terms-and-conditions");
        const json = await res.json();
        if (!cancelled && json.status === "Success" && json.data?.content) {
          setHtml(json.data.content);
        } else if (!cancelled) {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTerms();

    return () => { cancelled = true; };
  }, [isOpen, html]);

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col text-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-grey-200">
          <h2 id="terms-modal-title" className="text-lg sm:text-xl font-medium text-text-dark text-center flex-1">
            {signUp.termsModalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-grey-500 hover:bg-grey-100 hover:text-grey-700 transition-colors"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && (
            <div className="text-center py-12 text-grey-600">
              قيد الإنشاء
            </div>
          )}
          {!loading && !error && html && (
            <div
              className="prose prose-sm sm:prose max-w-none text-center leading-relaxed text-grey-700"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-grey-200 flex justify-center">
          <Button
            type="button"
            onClick={onAccept}
            className="min-w-40 bg-primary-500 hover:bg-primary-800 text-white rounded-2xl font-light!"
          >
            {signUp.termsAcceptButton}
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
