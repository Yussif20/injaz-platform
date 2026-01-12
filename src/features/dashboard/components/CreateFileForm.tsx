"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";
import { Button } from "@/shared/components/ui";

interface FormData {
  image: File | null;
  imagePreview: string | null;
  year: string;
  jobRank: string;
  dateType: "gregorian" | "hijri";
}

export interface EditFileData {
  id: string;
  year: string;
  jobRank: string;
  imageUrl?: string;
}

interface CreateFileFormProps {
  isEditMode?: boolean;
  initialData?: EditFileData;
  onSubmit?: (data: FormData, fileId?: string) => void;
}

export const CreateFileForm: React.FC<CreateFileFormProps> = ({
  isEditMode = false,
  initialData,
  onSubmit,
}) => {
  const { createFile } = dashboardContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine date type from initial year (hijri years end with "هـ")
  const getInitialDateType = (): "gregorian" | "hijri" => {
    if (initialData?.year?.includes("هـ")) return "hijri";
    return "gregorian";
  };

  const [formData, setFormData] = useState<FormData>({
    image: null,
    imagePreview: initialData?.imageUrl || null,
    year: initialData?.year || "",
    jobRank: initialData?.jobRank || "",
    dateType: getInitialDateType(),
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        image: null,
        imagePreview: initialData.imageUrl || null,
        year: initialData.year || "",
        jobRank: initialData.jobRank || "",
        dateType: initialData.year?.includes("هـ") ? "hijri" : "gregorian",
      });
    }
  }, [initialData]);

  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);

  const years =
    formData.dateType === "gregorian"
      ? createFile.gregorianYears
      : createFile.hijriYears;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleYearSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }));
    setYearDropdownOpen(false);
  };

  const handleJobRankSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, jobRank: value }));
    setJobDropdownOpen(false);
  };

  const handleDateTypeChange = (type: "gregorian" | "hijri") => {
    setFormData((prev) => ({ ...prev, dateType: type, year: "" }));
  };

  const isFormValid = formData.year && formData.jobRank;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      if (onSubmit) {
        onSubmit(formData, initialData?.id);
      } else {
        console.log(isEditMode ? "Updating file:" : "Creating file:", formData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-medium text-secondary-800">
        {isEditMode ? createFile.editPageTitle : createFile.pageTitle}
      </h1>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="text-base font-normal text-secondary-800">
          {createFile.imageLabel}{" "}
          <span className="text-grey-400">{createFile.imageHint}</span>
        </label>

        {formData.imagePreview ? (
          // Image Uploaded State
          <div className="relative w-full max-w-[600px] h-[200px] rounded-2xl overflow-hidden">
            <Image
              src={formData.imagePreview}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={handleImageClick}
                className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{createFile.changeImage}</span>
              </button>
            </div>
          </div>
        ) : (
          // Upload State
          <div
            onClick={handleImageClick}
            className="w-full max-w-[600px] h-[200px] border-2 border-dashed border-grey-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary-500 transition-colors bg-white"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B3B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-grey-400 text-sm">{createFile.imageSizeLimit}</p>
            <button
              type="button"
              className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{createFile.uploadImage}</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Year Selector */}
      <div className="space-y-2 max-w-[600px]">
        <label className="text-base font-normal text-secondary-800">
          {createFile.yearLabel}
          <span className="text-warning-500">*</span>
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setYearDropdownOpen(!yearDropdownOpen);
              setJobDropdownOpen(false);
            }}
            className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
          >
            <svg
              className={`w-5 h-5 text-grey-400 transition-transform ${
                yearDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className={formData.year ? "text-secondary-800" : "text-grey-400"}>
              {formData.year || createFile.yearPlaceholder}
            </span>
          </button>

          {yearDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
              {/* Date Type Toggle */}
              <div className="flex border-b border-grey-100 p-2">
                <button
                  type="button"
                  onClick={() => handleDateTypeChange("hijri")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
                    formData.dateType === "hijri"
                      ? "text-primary-500"
                      : "text-grey-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.dateType === "hijri"
                        ? "border-primary-500"
                        : "border-grey-300"
                    }`}
                  >
                    {formData.dateType === "hijri" && (
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <span>{createFile.dateTypes.hijri}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDateTypeChange("gregorian")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
                    formData.dateType === "gregorian"
                      ? "text-primary-500"
                      : "text-grey-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.dateType === "gregorian"
                        ? "border-primary-500"
                        : "border-grey-300"
                    }`}
                  >
                    {formData.dateType === "gregorian" && (
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <span>{createFile.dateTypes.gregorian}</span>
                </button>
              </div>

              {/* Year Options */}
              <div className="max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year.value}
                    type="button"
                    onClick={() => handleYearSelect(year.value)}
                    className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${
                      formData.year === year.value ? "bg-grey-50" : ""
                    }`}
                  >
                    {formData.year === year.value && (
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span className="text-secondary-800">{year.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Rank Selector */}
      <div className="space-y-2 max-w-[600px]">
        <label className="text-base font-normal text-secondary-800">
          {createFile.jobRankLabel}
          <span className="text-warning-500">*</span>
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setJobDropdownOpen(!jobDropdownOpen);
              setYearDropdownOpen(false);
            }}
            className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
          >
            <svg
              className={`w-5 h-5 text-grey-400 transition-transform ${
                jobDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className={formData.jobRank ? "text-secondary-800" : "text-grey-400"}>
              {formData.jobRank || createFile.jobRankPlaceholder}
            </span>
          </button>

          {jobDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                {createFile.jobRanks.map((rank) => (
                  <button
                    key={rank.value}
                    type="button"
                    onClick={() => handleJobRankSelect(rank.value)}
                    className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${
                      formData.jobRank === rank.value ? "bg-grey-50" : ""
                    }`}
                  >
                    {formData.jobRank === rank.value && (
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span className="text-secondary-800">{rank.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="max-w-[600px]">
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid}
          className={`!w-full !h-12 !rounded-2xl flex items-center justify-center gap-2 ${
            !isFormValid ? "!bg-grey-200 !text-grey-400" : ""
          }`}
        >
          {isEditMode ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          )}
          <span>
            {isEditMode ? createFile.saveChangesButton : createFile.createFileButton}
          </span>
        </Button>
      </div>
    </form>
  );
};
