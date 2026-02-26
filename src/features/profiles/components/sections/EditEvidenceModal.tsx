"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { dashboardContent } from "@/content";
import type { SubsectionImage } from "../../types/profile.types";

interface EditEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; image?: File }) => void;
  isLoading?: boolean;
  image: SubsectionImage | null;
  apiError?: string | null;
}

export const EditEvidenceModal: React.FC<EditEvidenceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  image,
  apiError,
}) => {
  const { addEvidenceModal, editEvidenceModal } = dashboardContent;
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageTitle, setImageTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Initialize form with existing image data when modal opens
  useEffect(() => {
    if (isOpen && image) {
      setImageTitle(image.description || "");
      setImagePreview(image.publicUrl ?? null);
      setSelectedImage(null);
      setErrors({});
    }
  }, [isOpen, image]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImageTitle("");
      setSelectedImage(null);
      setImagePreview(null);
      setErrors({});
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isLoading, onClose]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1GB limit)
      const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
      if (file.size > maxSize) {
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    const newErrors: { title?: string } = {};

    if (!imageTitle.trim()) {
      newErrors.title = "عنوان الصورة مطلوب";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: imageTitle.trim(),
      image: selectedImage || undefined,
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 text-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-grey-500 hover:text-grey-700 transition-colors disabled:opacity-50"
        >
          <svg
            className="w-6 h-6"
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

        {/* Title */}
        <h2
          id="modal-title"
          className="text-xl font-semibold text-secondary-800 text-center mb-6"
        >
          {editEvidenceModal.title}
        </h2>

        {/* Image Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-800 mb-2">
            {addEvidenceModal.imageTitleLabel}
            <span className="text-warning-500">*</span>
          </label>
          <input
            type="text"
            value={imageTitle}
            onChange={(e) => {
              setImageTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder={addEvidenceModal.imageTitlePlaceholder}
            className={`w-full px-4 py-3 bg-[#EBEBEB] rounded-xl text-right outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.title ? "ring-2 ring-warning-500" : ""
            }`}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-warning-500">{errors.title}</p>
          )}
        </div>

        {/* Image Picker */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={isLoading}
          />

          <div className="w-full h-[200px] rounded-[20px] border-2 border-solid border-grey-200 overflow-hidden">
            {imagePreview ? (
              // Image Preview
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-full h-full object-contain bg-[#666666]"
              />
            ) : (
              // Upload Placeholder
              <div className="w-full h-full bg-[#EBEBEB] flex flex-col items-center justify-center gap-3">
                {/* Upload Icon */}
                <svg
                  className="w-10 h-10 text-grey-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                {/* Size Limit Text */}
                <p className="text-sm text-[#666666]">
                  {addEvidenceModal.imageSizeLimit}
                </p>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{addEvidenceModal.uploadImage}</span>
                </button>
              </div>
            )}
          </div>

          {/* Change Image Button (when image is selected) */}
          {imagePreview && (
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isLoading}
              className="mt-2 flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{addEvidenceModal.changeImage}</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-800 text-white py-4 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            editEvidenceModal.submitButton
          )}
        </button>
        {apiError && (
          <p className="mt-2 text-sm text-warning-500 text-center">{apiError}</p>
        )}
      </div>
    </div>
  );

  // Use portal to render modal at document root
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};
