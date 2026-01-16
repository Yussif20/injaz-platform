"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MobilePromoSidebar } from "@/features/dashboard";
import { useAcademicYears, useProfileTypes, useCreateProfile } from "@/features/profiles";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/config";
import { dashboardContent } from "@/content";

function CreateFileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { createFile } = dashboardContent;

  // Check if we're in edit mode
  const isEditMode = searchParams.get("edit") === "true";
  const fileId = searchParams.get("fileId");

  // Fetch data from API
  const { academicYears, isLoading: yearsLoading } = useAcademicYears();
  const { profileTypes, isLoading: typesLoading } = useProfileTypes();
  const { createProfileAsync, isLoading: creating } = useCreateProfile();

  // Form state
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = yearsLoading || typesLoading;
  const isFormValid = selectedYear !== null && selectedType !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError(null);

    try {
      const response = await createProfileAsync({
        academicYearId: selectedYear!,
        profileTypeId: selectedType!,
      });

      if (response.status) {
        router.push(ROUTES.DASHBOARD);
      } else {
        setError(response.message || "فشل في إنشاء الملف");
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
      console.error("Create profile error:", err);
    }
  };

  const selectedYearName = academicYears.find((y) => y.id === selectedYear)?.name;
  const selectedTypeName = profileTypes.find((t) => t.id === selectedType)?.nameMale;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-8" dir="rtl">
      {/* Main Form Area */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Page Title */}
          <h1 className="text-2xl font-medium text-secondary-800">
            {isEditMode ? createFile.editPageTitle : createFile.pageTitle}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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
                  setTypeDropdownOpen(false);
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
                <span className={selectedYearName ? "text-secondary-800" : "text-grey-400"}>
                  {selectedYearName || createFile.yearPlaceholder}
                </span>
              </button>

              {yearDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {academicYears.length === 0 ? (
                      <div className="px-4 py-3 text-grey-500 text-center">
                        لا توجد سنوات دراسية متاحة
                      </div>
                    ) : (
                      academicYears.map((year) => (
                        <button
                          key={year.id}
                          type="button"
                          onClick={() => {
                            setSelectedYear(year.id);
                            setYearDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${
                            selectedYear === year.id ? "bg-grey-50" : ""
                          }`}
                        >
                          {selectedYear === year.id && (
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
                          <span className="text-secondary-800">{year.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Type Selector */}
          <div className="space-y-2 max-w-[600px]">
            <label className="text-base font-normal text-secondary-800">
              {createFile.jobRankLabel}
              <span className="text-warning-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setYearDropdownOpen(false);
                }}
                className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-grey-400 transition-transform ${
                    typeDropdownOpen ? "rotate-180" : ""
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
                <span className={selectedTypeName ? "text-secondary-800" : "text-grey-400"}>
                  {selectedTypeName || createFile.jobRankPlaceholder}
                </span>
              </button>

              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {profileTypes.length === 0 ? (
                      <div className="px-4 py-3 text-grey-500 text-center">
                        لا توجد أنواع ملفات متاحة
                      </div>
                    ) : (
                      profileTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSelectedType(type.id);
                            setTypeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${
                            selectedType === type.id ? "bg-grey-50" : ""
                          }`}
                        >
                          {selectedType === type.id && (
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
                          <span className="text-secondary-800">{type.nameMale}</span>
                        </button>
                      ))
                    )}
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
              disabled={!isFormValid || creating}
              isLoading={creating}
              className={`!w-full !h-12 !rounded-2xl flex items-center justify-center gap-2 ${
                !isFormValid ? "!bg-grey-200 !text-grey-400" : ""
              }`}
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>{createFile.createFileButton}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Promotional Sidebar - Desktop Only */}
      <MobilePromoSidebar />
    </div>
  );
}

export default function CreateFilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <CreateFileContent />
    </Suspense>
  );
}
