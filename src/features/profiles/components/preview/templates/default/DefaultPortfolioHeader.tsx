"use client";

import Image from "next/image";
import type { ThemeColors } from "@/features/profiles/types/theme.types";

interface DefaultHeaderBarProps {
  onBack: () => void;
  onPublish: () => void;
  publishLabel: string;
  textColor: string;
  primaryColor: string;
}

interface DefaultPortfolioHeaderProps {
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

export const DefaultPortfolioHeader = ({
  teacherName,
  teacherRank,
  academicYear,
  onDownload,
  onShare,
  onBack,
  isDownloading = false,
  content,
  theme,
}: DefaultPortfolioHeaderProps) => {
  const publishLabel = content.publishFile ?? "نشر الملف";

  return (
    <div
      className="relative overflow-hidden px-4 pt-4 pb-8 md:pt-6 md:pb-10 lg:pt-8 lg:pb-12 bg-[url('/images/profiles/default/bg-mobile.svg')] md:bg-[url('/images/profiles/default/bg-tablet.svg')] lg:bg-[url('/images/profiles/default/bg-desktop.svg')] bg-cover bg-center"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-300 mx-auto">
        <DefaultHeaderBar
          onBack={onBack}
          onPublish={onShare}
          publishLabel={publishLabel}
          textColor={theme.text}
          primaryColor={theme.primary}
        />

        {/* Content block */}
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6 md:gap-8 lg:gap-10">
          {/* Text */}
          <div className="text-right flex-1 flex flex-col gap-2 md:gap-3">
            <p className="text-text-dark text-sm md:text-2xl lg:text-[28px] font-normal">
              {content.fileTitle} - 2025
            </p>
            <h1
              className="text-primary-500 text-lg md:text-[28px] lg:text-4xl font-normal"
              style={{ color: theme.primary }}
            >
              {teacherName}
            </h1>
            <p className="text-text-dark text-sm md:text-2xl lg:text-[28px] font-normal">
              {teacherRank}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={onDownload}
                disabled={isDownloading}
                className="flex bg-primary-500 text-white items-center gap-2 px-5 py-4 rounded-lg md:rounded-4xl text-sm md:text-base font-normal"
                style={{
                  opacity: isDownloading ? 0.8 : 1,
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

              <button
                onClick={onShare}
                className="bg-white text-primary-500 flex outline outline-primary-500 items-center gap-2 px-5 py-4 rounded-lg md:rounded-4xl text-sm md:text-base font-normal"
              >
                <Image
                  src="/images/profiles/default/share.svg"
                  alt="Share"
                  width={24}
                  height={24}
                />
                {content.shareFile}
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div
              className="relative w-50.5 h-50.5 md:w-89.5 md:h-89.5 rounded-full overflow-hidden p-3 border-2"
              style={{ borderColor: theme.primary }}
            >
              <div
                className="relative w-full h-full rounded-full overflow-hidden border-2"
                style={{ borderColor: theme.primary }}
              >
                <Image
                  src="/images/profiles/avatar.png"
                  alt={teacherName}
                  fill
                  sizes="(max-width: 768px) 190px, 350px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultHeaderBar = ({
  onBack,
  onPublish,
  publishLabel,
  textColor,
  primaryColor,
}: DefaultHeaderBarProps) => (
  <div className="flex items-center justify-between mb-6 md:mb-8">
    <button
      aria-label="رجوع"
      onClick={onBack}
      className="text-text-dark"
      style={{ color: textColor }}
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

    <p
      className="hidden md:block text-text-dark text-2xl lg:text-[28px] font-normal"
      style={{ color: textColor }}
    >
      معاينة الملف
    </p>

    <button
      onClick={onPublish}
      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-2xl md:rounded-3xl font-light text-xs md:text-base"
      style={{ backgroundColor: primaryColor, color: "#ffffff" }}
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
