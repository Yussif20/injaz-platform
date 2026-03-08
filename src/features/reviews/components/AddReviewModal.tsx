"use client";

import { useState, useRef } from "react";
import { X, Plus, Star, Upload, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { useCreateReview, useUploadReviewerPhoto } from "../hooks/useReviews";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddReviewModal({ isOpen, onClose }: AddReviewModalProps) {
  const { t } = useTranslation();
  const modalT = (t("reviews") as any).modal;
  const jobTitlesT = (t("reviews") as any).jobTitles;
  const { toast } = useToast();

  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createReview = useCreateReview();
  const uploadPhoto = useUploadReviewerPhoto();

  if (!isOpen) return null;

  const jobTitleOptions = [
    { value: "expertTeacher", label: jobTitlesT.expertTeacher },
    { value: "practiceTeacher", label: jobTitlesT.practiceTeacher },
    { value: "advancedTeacher", label: jobTitlesT.advancedTeacher },
  ];

  const selectedJobTitleLabel =
    jobTitleOptions.find((o) => o.value === selectedJobTitle)?.label ??
    selectedJobTitle;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setClientName("");
    setSelectedJobTitle("");
    setContent("");
    setRating(4);
    setImageFile(null);
    setImagePreview(null);
    setShowLogo(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createReview.mutate(
      {
        reviewerName: clientName,
        reviewerJobTitle: selectedJobTitleLabel,
        content,
        rating,
      },
      {
        onSuccess: (newReview) => {
          if (imageFile && !showLogo) {
            uploadPhoto.mutate(
              { id: newReview.id, file: imageFile },
              {
                onSuccess: () => {
                  toast({
                    type: "success",
                    message: "تمت إضافة التقييم بنجاح",
                  });
                  handleClose();
                },
                onError: (err) => {
                  // Review created but photo failed — close anyway, show partial success
                  toast({ type: "error", message: getErrorMessage(err) });
                  handleClose();
                },
              },
            );
          } else {
            toast({ type: "success", message: "تمت إضافة التقييم بنجاح" });
            handleClose();
          }
        },
        onError: (err) => {
          toast({ type: "error", message: getErrorMessage(err) });
        },
      },
    );
  };

  const isPending = createReview.isPending || uploadPhoto.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-8 flex items-center justify-center">
          <h2 className="text-lg font-medium text-text-dark">{modalT.title}</h2>
          <button
            onClick={handleClose}
            className="absolute start-0 rounded-lg p-1 text-grey-400 hover:bg-grey-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.clientName}
            </label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className={`w-full rounded-lg border border-grey-200 py-2.5 px-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none ${clientName ? "bg-white" : "bg-[#f6f6f6]"}`}
              placeholder={modalT.clientNamePlaceholder}
            />
          </div>

          {/* Job Title - Dropdown */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.jobTitle}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setJobTitleOpen(!jobTitleOpen)}
                className={`flex w-full items-center justify-between rounded-lg border border-grey-200 py-2.5 px-4 text-sm font-light text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none ${selectedJobTitle ? "bg-white" : "bg-[#f6f6f6]"}`}
              >
                <span
                  className={
                    selectedJobTitle ? "text-text-dark" : "text-text-muted"
                  }
                >
                  {selectedJobTitle
                    ? selectedJobTitleLabel
                    : modalT.jobTitlePlaceholder}
                </span>
                <ChevronDown className="h-4 w-4 text-grey-400" />
              </button>
              {jobTitleOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-grey-200 bg-white shadow-lg">
                  {jobTitleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedJobTitle(option.value);
                        setJobTitleOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-right text-sm text-text-dark hover:bg-grey-50"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.content}
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={`w-full resize-none rounded-lg border border-grey-200 py-2.5 px-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none ${content ? "bg-white" : "bg-[#f6f6f6]"}`}
              placeholder={modalT.contentPlaceholder}
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.selectRating}
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const starIndex = 5 - i; // RTL: 5 stars right-to-left
                const isActive = starIndex <= (hoveredStar || rating);
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onClick={() => setRating(starIndex)}
                    onMouseEnter={() => setHoveredStar(starIndex)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        isActive
                          ? "fill-amber-400 text-amber-400"
                          : "fill-grey-200 text-grey-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Image Upload — hidden when showLogo is on */}
          {!showLogo && (
            <div>
              <label className="mb-2 block text-sm font-medium text-text-dark">
                {modalT.clientImage}
              </label>
              <div
                className="cursor-pointer rounded-lg border border-dashed border-grey-300 bg-[#f6f6f6] px-6 py-6 text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mx-auto h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto h-6 w-6 text-grey-400" />
                    <p className="mt-2 text-xs text-grey-400">
                      {modalT.imageMaxSize}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-800">
                      <Upload className="h-4 w-4" />
                      {modalT.uploadImage}
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Show Site Logo Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = !showLogo;
                setShowLogo(next);
                if (next) {
                  setImageFile(null);
                  setImagePreview(null);
                }
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                showLogo ? "bg-primary-500" : "bg-grey-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  showLogo ? "start-0.5" : "end-0.5"
                }`}
              />
            </button>
            <label className="text-sm font-medium text-text-dark">
              {modalT.showSiteLogo}
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-[20px]! font-light!"
            size="lg"
            loading={isPending}
          >
            <Plus className="h-5 w-5" />
            {modalT.add}
          </Button>
        </form>
      </div>
    </div>
  );
}
