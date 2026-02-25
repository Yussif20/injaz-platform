"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  useAcademicYears,
  useRanks,
  useProfileTypes,
  useCreateProfile,
  useUploadProfileImage,
} from "@/features/profiles";
import {
  useMyProfile,
  useUpdatePersonalInfo,
} from "@/features/dashboard";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/config";
import { dashboardContent } from "@/content";

function CreateFileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { createFile } = dashboardContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if we're in edit mode
  const isEditMode = searchParams.get("edit") === "true";
  const fileId = searchParams.get("fileId");

  // Fetch data from API
  const { academicYears, isLoading: yearsLoading } = useAcademicYears();
  const { ranks, isLoading: ranksLoading } = useRanks();
  const { profileTypes, isLoading: profileTypesLoading } = useProfileTypes();
  const { createProfileAsync } = useCreateProfile();
  const { updatePersonalInfoAsync } = useUpdatePersonalInfo();
  const { uploadImageAsync } = useUploadProfileImage();
  const { profile } = useMyProfile();

  // Form state - IDs are numbers from the API
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [rankDropdownOpen, setRankDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isLoading = yearsLoading || ranksLoading || profileTypesLoading;

  // Pre-fill form when opening in edit mode with file info from URL
  useEffect(() => {
    if (!isEditMode || !fileId || isLoading) return;
    const yearParam = searchParams.get("year");
    const rankIdParam = searchParams.get("rankId");
    const jobRankParam = searchParams.get("jobRank");
    if (yearParam && academicYears.length > 0) {
      const match = academicYears.find((y) => y.yearName === yearParam);
      if (match) setSelectedYear(match.id);
    }
    if (ranks.length > 0) {
      // Prefer rankId for reliable الرتبة الوظيفية pre-fill
      const rankIdNum = rankIdParam ? Number(rankIdParam) : NaN;
      const matchByRankId =
        !Number.isNaN(rankIdNum) &&
        ranks.find((r) => r.id === rankIdNum);
      const matchByTitle =
        !matchByRankId &&
        jobRankParam &&
        ranks.find(
          (r) =>
            r.titleFemale === jobRankParam ||
            r.titleMale === jobRankParam ||
            r.title === jobRankParam,
        );
      const match = matchByRankId || matchByTitle;
      if (match) setSelectedRank(match.id);
    }
  }, [
    isEditMode,
    fileId,
    isLoading,
    searchParams,
    academicYears,
    ranks,
  ]);

  // Profile types are for templates; we use first available for create API only
  const hasProfileTypes = profileTypes.length > 0;
  const defaultProfileTypeId = hasProfileTypes ? profileTypes[0].id : null;
  const isFormValid =
    selectedYear !== null &&
    selectedRank !== null &&
    hasProfileTypes;

  // Get gender-aware rank title
  const getRankTitle = (rank: {
    titleMale?: string | null;
    titleFemale?: string | null;
  }) => {
    return profile?.gender === 1
      ? rank.titleMale || rank.titleFemale || ""
      : rank.titleFemale || rank.titleMale || "";
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1GB limit)
      if (file.size > 1024 * 1024 * 1024) {
        setError("يجب أن لا يزيد حجم الصورة عن 1 جيجا");
        return;
      }

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
      // Step 1: Create profile (profile type from first available; templates management elsewhere)
      const response = await createProfileAsync({
        academicYearId: selectedYear!,
        profileTypeId: defaultProfileTypeId!,
      });

      if (!response.status) {
        const backendMsg =
          (response as { debug?: { backendMessage?: string } }).debug
            ?.backendMessage ?? (response as { message?: string }).message ?? "";
        const isAlreadyHasProfile =
          typeof backendMsg === "string" &&
          backendMsg.includes("ملف لهذه السنة");
        const errorInfo = isAlreadyHasProfile
          ? createFile.errorAlreadyHasProfileForYear
          : (response.message || "فشل في إنشاء الملف");
        setError(errorInfo);
        if (!isAlreadyHasProfile) console.error("Create profile failed:", response);
        return;
      }

      const profileId = (response as { data?: { id?: number } }).data?.id;

      // Step 2: Save rank (non-fatal)
      try {
        const currentInfo = profile?.personalInfo;
        await updatePersonalInfoAsync({
          rankId: selectedRank!,
          nationalId: currentInfo?.nationalId ?? undefined,
          birthDate: currentInfo?.birthDate ?? undefined,
          address: currentInfo?.address ?? undefined,
          email: currentInfo?.email ?? undefined,
        });
      } catch (rankErr) {
        console.warn("Rank save failed (non-fatal):", rankErr);
      }

      // Step 3: Upload image (non-fatal)
      if (selectedImage && profileId) {
        try {
          await uploadImageAsync({ profileId, file: selectedImage });
        } catch (imgErr) {
          console.warn("Image upload failed (non-fatal):", imgErr);
        }
      }

      // Step 4: Navigate to dashboard
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        response?: { data?: { message?: string; debug?: { backendMessage?: string } } };
      };
      const data = errorObj?.response?.data;
      const backendMsg = data?.debug?.backendMessage ?? data?.message ?? "";
      const isAlreadyHasProfile =
        typeof backendMsg === "string" &&
        backendMsg.includes("ملف لهذه السنة");
      const errorDetail = isAlreadyHasProfile
        ? createFile.errorAlreadyHasProfileForYear
        : data?.message || errorObj?.message || "حدث خطأ غير متوقع";
      setError(errorDetail);
      if (!isAlreadyHasProfile) console.error("Create profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedYearName = academicYears.find(
    (y) => y.id === selectedYear,
  )?.yearName;
  const selectedRankData = ranks.find((r) => r.id === selectedRank);
  const selectedRankName = selectedRankData ? getRankTitle(selectedRankData) : undefined;

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
          <div className="space-y-2 max-w-150">
            <label className="text-base font-normal text-secondary-800">
              {createFile.imageLabel}
              <span className="text-grey-400 text-sm mr-1">
                {createFile.imageHint}
              </span>
            </label>

            <div
              onClick={handleImageClick}
              className="relative w-full h-[200px] border-2 border-dashed border-grey-300 rounded-[20px] overflow-hidden cursor-pointer hover:border-primary-500 transition-colors flex items-center justify-center"
              style={{ backgroundColor: imagePreview ? "#B3B3B3" : "#F9FAFB" }}
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="صورة الملف"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {createFile.changeImage}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {/* Camera/Image Icon */}
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

                  {/* Size limit text */}
                  <span className="text-sm" style={{ color: "#666666" }}>
                    يجب أن لا يزيد حجم الصورة عن 1 جيجا
                  </span>

                  {/* Upload button with icon */}
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
                  setRankDropdownOpen(false);
                }}
                className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
              >
                <span
                  className={
                    selectedYearName ? "text-secondary-800" : "text-grey-400"
                  }
                >
                  {selectedYearName || createFile.yearPlaceholder}
                </span>
                <svg
                  className={`w-5 h-5 text-grey-400 shrink-0 transition-transform ${
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
                          <span className="text-secondary-800">
                            {year.yearName}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rank Selector */}
          <div className="space-y-2 max-w-150">
            <label className="text-base font-normal text-secondary-800">
              {createFile.jobRankLabel}
              <span className="text-warning-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRankDropdownOpen(!rankDropdownOpen);
                  setYearDropdownOpen(false);
                }}
                className="w-full bg-white border border-grey-200 rounded-2xl px-4 py-3 text-right flex items-center justify-between hover:border-primary-500 transition-colors"
              >
                <span
                  className={
                    selectedRankName ? "text-secondary-800" : "text-grey-400"
                  }
                >
                  {selectedRankName || createFile.jobRankPlaceholder}
                </span>
                <svg
                  className={`w-5 h-5 text-grey-400 shrink-0 transition-transform ${
                    rankDropdownOpen ? "rotate-180" : ""
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
              </button>

              {rankDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grey-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {ranks.length === 0 ? (
                      <div className="px-4 py-3 text-grey-500 text-center">
                        لا توجد رتب وظيفية متاحة
                      </div>
                    ) : (
                      ranks.map((rank) => (
                        <button
                          key={rank.id}
                          type="button"
                          onClick={() => {
                            setSelectedRank(rank.id);
                            setRankDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-right hover:bg-grey-50 transition-colors flex items-center justify-between ${
                            selectedRank === rank.id ? "bg-grey-50" : ""
                          }`}
                        >
                          {selectedRank === rank.id && (
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
                          <span className="text-secondary-800">
                            {getRankTitle(rank)}
                          </span>
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
              <span>{createFile.createFileButton}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Illustration - sm/md: above form; lg: left side only (one image per breakpoint) */}
      <div className="w-full lg:w-100 flex-shrink-0 flex items-center justify-end order-2">
        {/* Small screens */}
        <Image
          src="/images/dashboard/create-file/create-file-sm.svg"
          alt="إنشاء ملف"
          width={400}
          height={464}
          className="block md:hidden w-full h-auto max-h-116 object-left"
        />
        {/* Medium screens */}
        <Image
          src="/images/dashboard/create-file/create-file-md.svg"
          alt="إنشاء ملف"
          width={400}
          height={562}
          className="hidden md:block lg:hidden w-full h-auto max-h-140 object-left"
        />
        {/* Large screens only - no duplicate */}
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
