"use client";

import Image from "next/image";
import type { ThemeColors } from "@/features/profiles/types/theme.types";

interface ArabicHeaderBarProps {
  onBack: () => void;
  onPublish: () => void;
  publishLabel: string;
  textColor: string;
  primaryColor: string;
}

interface ArabicPortfolioHeaderProps {
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

const ArabicHeaderBar = ({
  onBack,
  onPublish,
  publishLabel,
  textColor,
  primaryColor,
}: ArabicHeaderBarProps) => (
  <div className="flex items-center justify-between mb-6 md:mb-8">
    <button
      onClick={onBack}
      className="text-text-dark hover:text-text-muted transition-colors"
      aria-label="Back"
    >
      <Image
        src="/icons/ui/arrow-left.svg"
        alt="Back"
        width={24}
        height={24}
        className="md:w-6 md:h-6"
      />
    </button>

    <h3
      className="text-text-dark text-lg md:text-2xl font-normal hidden sm:block"
      style={{ color: textColor }}
    >
      معاينة الملف
    </h3>

    <button
      onClick={onPublish}
      className="bg-white text-sm md:text-base font-normal px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl hover:bg-gray-100 transition-colors"
      style={{ color: primaryColor, border: `2px solid ${primaryColor}` }}
    >
      {publishLabel}
    </button>
  </div>
);

export const ArabicPortfolioHeader = ({
  teacherName,
  teacherRank,
  onDownload,
  onShare,
  onBack,
  isDownloading = false,
  content,
  theme,
}: ArabicPortfolioHeaderProps) => {
  const publishLabel = content.publishFile ?? "نشر الملف";

  return (
    <div className="relative overflow-hidden px-4 pt-4 pb-8 md:pt-6 md:pb-10 lg:pt-8 lg:pb-12 bg-[url('/images/profiles/arabic/header-bg.svg')] bg-cover bg-center">
      <div className="max-w-300 mx-auto">
        <ArabicHeaderBar
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
                className="flex bg-[#543A31] text-white items-center gap-2 px-5 py-4 rounded-lg md:rounded-4xl text-sm md:text-base font-normal"
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
                className="bg-white text-[#543A31] flex outline outline-[#543A31] items-center gap-2 px-5 py-4 rounded-lg md:rounded-4xl text-sm md:text-base font-normal"
              >
                <Image
                  src="/images/profiles/heritage/share.svg"
                  alt="Share"
                  width={24}
                  height={24}
                />
                {content.shareFile}
              </button>
            </div>
          </div>

          {/* Avatar */}
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-50.5 h-50.5 md:w-89.5 md:h-89.5 rounded-full overflow-hidden p-3 border-2 border-[#543A31]">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#543A31]">
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
