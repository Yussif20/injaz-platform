"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
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
  profileImageUrl?: string | null;
  onDownload: () => void;
  onDownloadAsImage?: () => void;
  onShare: () => void;
  onBack: () => void;
  isDownloading?: boolean;
  content: {
    downloadFile: string;
    downloadAsImage?: string;
    shareFile: string;
    fileTitle: string;
    publishFile?: string;
  };
  theme: ThemeColors;
}

export const HeritagePortfolioHeader = ({
  teacherName,
  teacherRank,
  academicYear,
  profileImageUrl,
  onDownload,
  onDownloadAsImage,
  onShare,
  onBack,
  isDownloading = false,
  content,
}: HeritagePortfolioHeaderProps) => {
  const publishLabel = content.publishFile ?? "نشر الملف";

  return (
    <div className="relative overflow-hidden ">
      {/* Background with pattern and overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-repeat bg-[url('/images/profiles/heritage/header-bg.svg')] " />
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
          <div className="flex flex-col md:flex-row-reverse md:items-center md:gap-12 lg:gap-20">
            {/* Profile Image - Left on desktop, centered on mobile */}
            <div className="flex justify-center md:justify-end mb-6 md:mb-0">
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImageUrl}
                    alt={teacherName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/profiles/heritage/fallback-header-image.svg"
                    alt={teacherName}
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                    className="object-cover"
                  />
                )}
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
                  data-share-button
                  onClick={onShare}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-normal transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#F5E6E8",
                    color: "#52161E",
                  }}
                >
                  <Image
                    src="/images/profiles/heritage/share.svg"
                    alt="Share"
                    width={24}
                    height={24}
                  />
                  {content.shareFile}
                </button>

                {/* Download as Image Button */}
                {onDownloadAsImage && content.downloadAsImage && (
                  <button
                    data-download-image-button
                    onClick={onDownloadAsImage}
                    disabled={isDownloading}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-normal transition-opacity hover:opacity-90 border-2 border-[#F5E6E8]"
                    style={{
                      backgroundColor: "transparent",
                      color: "#F5E6E8",
                      opacity: isDownloading ? 0.7 : 1,
                    }}
                  >
                    <ImageIcon className="w-6 h-6 shrink-0 text-white" />
                    {isDownloading ? "جاري التحميل..." : content.downloadAsImage}
                  </button>
                )}

                {/* Download Button - Dark */}
                <button
                  data-download-button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-normal transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#3D1A22",
                    color: "#FFFFFF",
                    opacity: isDownloading ? 0.7 : 1,
                  }}
                >
                  <Image
                    src="/images/profiles/default/file.svg"
                    alt="Download"
                    width={24}
                    height={24}
                  />
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
  <div data-preview-bar className="flex items-center justify-between mb-6 md:mb-10 lg:mb-12">
    {/* Back Arrow */}
    <button
      data-back-button
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
      data-share-button
      onClick={onPublish}
      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-2xl md:rounded-3xl font-light text-xs md:text-base transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#F5E6E8", color: "#52161E" }}
    >
      {publishLabel}
    </button>
  </div>
);
