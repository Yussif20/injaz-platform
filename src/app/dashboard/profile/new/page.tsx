"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  useAcademicYears,
  useProfileTypes,
  useCreateProfile,
  useUploadProfileImage,
  useUpdateProfileAcademicYear,
  useUpdateProfileType,
} from "@/features/profiles";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/config";
import { dashboardContent } from "@/content";
import { PUBLIC_API_BASE_URL, PUBLIC_STORAGE_BASE_URL } from "@/shared/lib/api";

function normalizeImageUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("/")) return s;
  const path = s.replace(/^\//, "");
  const base = path.startsWith("uploads/")
    ? PUBLIC_STORAGE_BASE_URL.replace(/\/$/, "")
    : PUBLIC_API_BASE_URL.replace(/\/$/, "");
  return `${base}/${path}`;
}

function CreateFileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { createFile } = dashboardContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = searchParams.get("edit") === "true";
  const fileIdParam = searchParams.get("fileId");

  // Fetch reference data
  const { academicYears, isLoading: yearsLoading } = useAcademicYears();
  const { profileTypes, isLoading: profileTypesLoading } = useProfileTypes();

  // Mutations
  const { createProfileAsync } = useCreateProfile();
  const { uploadImageAsync } = useUploadProfileImage();
  const { updateAcademicYearAsync } = useUpdateProfileAcademicYear();
  const { updateProfileTypeAsync } = useUpdateProfileType();

  // Form state
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedProfileType, setSelectedProfileType] = useState<number | null>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [profileTypeDropdownOpen, setProfileTypeDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isLoading = yearsLoading || profileTypesLoading;

  // Pre-fill fields in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    // Show existing image immediately (doesn't depend on API data)
    const imageUrlParam = searchParams.get("imageUrl");
    if (imageUrlParam) {
      setImagePreview(normalizeImageUrl(imageUrlParam));
    }

    if (isLoading) return;

    const yearParam = searchParams.get("year");
    if (yearParam && academicYears.length > 0) {
      const match = academicYears.find((y) => y.yearName === yearParam);
      if (match) setSelectedYear(match.id);
    }

    const profileTypeIdParam = searchParams.get("profileTypeId");
    if (profileTypeIdParam) {
      setSelectedProfileType(Number(profileTypeIdParam));
    }
  }, [isEditMode, isLoading, searchParams, academicYears]);

  const hasProfileTypes = profileTypes.length > 0;
  const isFormValid = selectedYear !== null && selectedProfileType !== null && hasProfileTypes;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeBytes = 1024 * 1024; // 1 MB
      if (file.size > maxSizeBytes) {
        setError(createFile.imageSizeLimit);
        return;
      }
      setError(null);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode && fileIdParam) {
        // Edit mode: call update APIs for year and profile type
        const profileId = Number(fileIdParam);

        const [yearRes, typeRes] = await Promise.all([
          updateAcademicYearAsync({ profileId, academicYearId: selectedYear! }),
          updateProfileTypeAsync({ profileId, profileTypeId: selectedProfileType! }),
        ]);

        if (!yearRes.status) {
          setError(yearRes.message || "فشل تحديث السنة الدراسية");
          return;
        }
        if (!typeRes.status) {
          setError(typeRes.message || "فشل تحديث نوع الملف");
          return;
        }

        // Upload image if changed (non-fatal)
        if (selectedImage) {
          try {
            await uploadImageAsync({ profileId, file: selectedImage });
          } catch (imgErr) {
            console.warn("Image upload failed (non-fatal):", imgErr);
          }
        }

        router.push(ROUTES.DASHBOARD);
      } else {
        // Create mode
        const response = await createProfileAsync({
          academicYearId: selectedYear!,
          profileTypeId: selectedProfileType!,
          templateId: 1,
        });

        if (!response.status) {
          const backendMsg =
            (response as { debug?: { backendMessage?: string } }).debug
              ?.backendMessage ?? (response as { message?: string }).message ?? "";
          const isAlreadyHasProfile =
            typeof backendMsg === "string" &&
            backendMsg.includes("ملف لهذه السنة");
          setError(
            isAlreadyHasProfile
              ? createFile.errorAlreadyHasProfileForYear
              : response.message || "فشل في إنشاء الملف"
          );
          return;
        }

        const profileId = (response as { data?: { id?: number } }).data?.id;

        // Upload image (non-fatal)
        if (selectedImage && profileId) {
          try {
            await uploadImageAsync({ profileId, file: selectedImage });
          } catch (imgErr) {
            console.warn("Image upload failed (non-fatal):", imgErr);
          }
        }

        router.push(ROUTES.DASHBOARD);
      }
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          "حدث خطأ غير متوقع"
      );
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedYearName = academicYears.find((y) => y.id === selectedYear)?.yearName;
  const selectedProfileTypeName = profileTypes.find((p) => p.id === selectedProfileType)?.typeName;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8" dir="rtl">
      {/* Main Form Area */}
      <div className="flex-1 order-2 lg:order-1">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col items-stretch"
        >
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

          {/* Warning if no profile types available */}
          {!isLoading && !hasProfileTypes && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <strong>تنبيه:</strong> لا توجد أنواع ملفات متاحة حالياً. يرجى التواصل مع الإدارة لإضافة أنواع الملفات.
            </div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-4 max-w-150">
            <label className="text-base font-normal text-secondary-800">
              {createFile.imageLabel}
              <span className="text-grey-400 text-sm mr-1">
                {createFile.imageHint}
              </span>
            </label>

            <div
              onClick={handleImageClick}
              className="mt-2 relative w-full h-[200px] border-2 border-dashed border-grey-300 rounded-[20px] overflow-hidden cursor-pointer hover:border-primary-500 transition-colors flex items-center justify-center"
              style={{ backgroundColor: imagePreview ? "#B3B3B3" : "#F9FAFB" }}
            >
              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="صورة الملف"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="inline-flex flex-row-reverse items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-white text-sm font-medium">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/icons/ui/image-upload-white.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                      <span>{createFile.changeImage}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="#666666"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm" style={{ color: "#666666" }}>
                    {createFile.imageSizeLimit}
                  </span>
                  <div className="flex items-center gap-2 text-primary-500">
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-sm font-medium">
                      {createFile.uploadImage}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Year Selector */}
          <div className="space-y-2 max-w-150">
            <label className="text-base font-normal text-secondary-800">
              {createFile.yearLabel}
              <span className="text-warning-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setYearDropdownOpen(!yearDropdownOpen);
                  setProfileTypeDropdownOpen(false);
                }}
                className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
              >
                <span className={selectedYearName ? "text-secondary-800" : "text-grey-400"}>
                  {selectedYearName || createFile.yearPlaceholder}
                </span>
                <svg
                  className={`w-5 h-5 text-grey-400 shrink-0 transition-transform ${yearDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
                          className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${selectedYear === year.id ? "bg-grey-50" : ""}`}
                        >
                          {selectedYear === year.id && (
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className="text-secondary-800">{year.yearName}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Type Selector */}
          <div className="space-y-2 max-w-150">
            <label className="text-base font-normal text-secondary-800">
              {createFile.profileTypeLabel}
              <span className="text-warning-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileTypeDropdownOpen(!profileTypeDropdownOpen);
                  setYearDropdownOpen(false);
                }}
                className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
              >
                <span className={selectedProfileTypeName ? "text-secondary-800" : "text-grey-400"}>
                  {selectedProfileTypeName || createFile.profileTypePlaceholder}
                </span>
                <svg
                  className={`w-5 h-5 text-grey-400 shrink-0 transition-transform ${profileTypeDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {profileTypes.length === 0 ? (
                      <div className="px-4 py-3 text-grey-500 text-center">
                        لا توجد أنواع ملفات متاحة
                      </div>
                    ) : (
                      profileTypes.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => {
                            setSelectedProfileType(pt.id);
                            setProfileTypeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${selectedProfileType === pt.id ? "bg-grey-50" : ""}`}
                        >
                          {selectedProfileType === pt.id && (
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className="text-secondary-800">{pt.typeName}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="max-w-150">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
              isLoading={isSubmitting}
              className={`w-full p-2 rounded-3xl flex items-center justify-center gap-2 ${
                !isFormValid ? "bg-grey-200! text-grey-400!" : ""
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
              <span>
                {isEditMode ? createFile.saveChangesButton : createFile.createFileButton}
              </span>
            </Button>
          </div>
        </form>
      </div>

      {/* Illustration */}
      <div className="w-full lg:w-100 flex-shrink-0 flex items-center justify-end order-2">
        <Image
          src="/images/dashboard/create-file/create-file-sm.svg"
          alt="إنشاء ملف"
          width={400}
          height={464}
          className="block md:hidden w-full h-auto max-h-116 object-left"
        />
        <Image
          src="/images/dashboard/create-file/create-file-md.svg"
          alt="إنشاء ملف"
          width={400}
          height={562}
          className="hidden md:block lg:hidden w-full h-auto max-h-140 object-left"
        />
        <Image
          src="/images/dashboard/create-file/create-file.svg"
          alt="إنشاء ملف"
          width={400}
          height={685}
          className="hidden lg:block w-full h-auto max-h-170 object-left"
        />
      </div>
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
