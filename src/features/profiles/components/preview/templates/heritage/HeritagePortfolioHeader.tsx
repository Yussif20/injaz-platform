"use client";

import Image from "next/image";
import type { ThemeColors } from "@/features/profiles/types/theme.types";

interface HeritageHeaderBarProps {
  onBack: () => void;
  onPublish: () => void;
  publishLabel: string;
}

interface HeritagePortfolioHeaderProps {
  teacherName: string;
  teacherRank: string;
  academicYear: string;
  onDownload: () => void;
  onShare: () => void;
  onBack: () => void;
  isDownloading?: boolean;
  content: {
    downloadFile: string;
    shareFile: string;
    fileTitle: string;
    publishFile?: string;
  };
  theme: ThemeColors;
}

// PDF icon for download button
const PdfIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13H10.5C10.8978 13 11.2794 13.158 11.5607 13.4393C11.842 13.7206 12 14.1022 12 14.5C12 14.8978 11.842 15.2794 11.5607 15.5607C11.2794 15.842 10.8978 16 10.5 16H9V13Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 16V18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Share/Upload icon
const ShareIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6L12 2L8 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeritagePortfolioHeader = ({
  teacherName,
  teacherRank,
  academicYear,
  onDownload,
  onShare,
  onBack,
  isDownloading = false,
  content,
  theme,
}: HeritagePortfolioHeaderProps) => {
  const publishLabel = content.publishFile ?? "نشر الملف";

  return (
    <div className="relative overflow-hidden ">
      {/* Background with pattern and overlay */}
      <div className="absolute inset-0 bg-contain bg-center bg-repeat bg-[url('/images/profiles/heritage/header-bg.svg')] " />
      {/* Color overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#52161E", opacity: 0.85 }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-16">
        <div className="max-w-300 mx-auto">
          {/* Header Bar - Nav */}
          <HeritageHeaderBar
            onBack={onBack}
            onPublish={onShare}
            publishLabel={publishLabel}
          />

          {/* Main Content */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-20">
            {/* Profile Image - Left on desktop, centered on mobile */}
            <div className="flex justify-center md:justify-start mb-6 md:mb-0">
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/profiles/avatar.png"
                  alt={teacherName}
                  fill
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content - Right side */}
            <div className="flex-1 text-right flex flex-col gap-2 md:gap-3 lg:gap-4">
              {/* File title and year */}
              <p className="text-white/80 text-base md:text-xl lg:text-2xl font-light">
                {content.fileTitle} - {academicYear || "2025"}
              </p>

              {/* Teacher Name - Italic style */}
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-medium italic">
                {teacherName}
              </h1>

              {/* Teacher Rank */}
              <p className="text-white text-base md:text-xl lg:text-2xl font-normal">
                {teacherRank}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 mt-4 md:mt-6">
                {/* Share Button - Cream/White */}
                <button
                  onClick={onShare}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-normal transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#F5E6E8",
                    color: "#52161E",
                  }}
                >
                  <ShareIcon />
                  {content.shareFile}
                </button>

                {/* Download Button - Dark */}
                <button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-normal transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#3D1A22",
                    color: "#FFFFFF",
                    opacity: isDownloading ? 0.7 : 1,
                  }}
                >
                  <PdfIcon />
                  {isDownloading ? "جاري التحميل..." : content.downloadFile}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeritageHeaderBar = ({
  onBack,
  onPublish,
  publishLabel,
}: HeritageHeaderBarProps) => (
  <div className="flex items-center justify-between mb-6 md:mb-10 lg:mb-12">
    {/* Back Arrow */}
    <button
      aria-label="رجوع"
      onClick={onBack}
      className="text-white hover:opacity-80 transition-opacity"
    >
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    {/* Title - Hidden on mobile */}
    <p className="hidden md:block text-white text-xl lg:text-2xl font-normal">
      معاينة الملف
    </p>

    {/* Publish Button */}
    <button
      onClick={onPublish}
      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-2xl md:rounded-3xl font-light text-xs md:text-base transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#F5E6E8", color: "#52161E" }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {publishLabel}
    </button>
  </div>
);
