"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import type { ThemeColors } from "@/features/profiles/types/theme.types";

interface ArabicHeaderBarProps {
  onBack: () => void;
  onPublish: () => void;
  publishLabel: string;
  isPublished?: boolean;
  textColor: string;
  primaryColor: string;
}

interface ArabicPortfolioHeaderProps {
  teacherName: string;
  teacherRank: string;
  academicYear: string;
  profileImageUrl?: string | null;
  onDownload: () => void;
  onDownloadAsImage?: () => void;
  onShare: () => void;
  onPublish?: () => void;
  isPublished?: boolean;
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

const ArabicHeaderBar = ({
  onBack,
  onPublish,
  publishLabel,
  isPublished = false,
  textColor,
  primaryColor,
}: ArabicHeaderBarProps) => (
  <div data-preview-bar className="flex items-center justify-between mb-6 md:mb-8">
    <button
      data-back-button
      onClick={onBack}
      className="text-text-dark hover:text-text-muted transition-colors"
      aria-label="Back"
    >
      <Image
        src="/icons/ui/arrow-right.svg"
        alt="Back"
        width={24}
        height={24}
        className="md:w-6 md:h-6 invert"
      />
    </button>

    <h3
      className="text-text-dark text-lg md:text-2xl font-normal hidden sm:block"
      style={{ color: textColor }}
    >
      معاينة الملف
    </h3>

    <button
      data-share-button
      onClick={onPublish}
      className="text-sm md:text-base font-normal px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl transition-colors"
      style={isPublished
        ? { backgroundColor: "#B1363E", color: "#ffffff", border: "2px solid #B1363E" }
        : { backgroundColor: "#ffffff", color: primaryColor, border: `2px solid ${primaryColor}` }
      }
    >
      {publishLabel}
    </button>
  </div>
);

export const ArabicPortfolioHeader = ({
  teacherName,
  teacherRank,
  profileImageUrl,
  onDownload,
  onDownloadAsImage,
  onShare,
  onPublish,
  isPublished = false,
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
          onPublish={onPublish ?? onShare}
          publishLabel={publishLabel}
          isPublished={isPublished}
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
                data-download-button
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

              {onDownloadAsImage && content.downloadAsImage && (
                <button
                  data-download-image-button
                  onClick={onDownloadAsImage}
                  disabled={isDownloading}
                  className="flex bg-white text-[#543A31] border-2 border-[#543A31] items-center gap-2 px-5 py-4 rounded-lg md:rounded-4xl text-sm md:text-base font-normal"
                  style={{
                    opacity: isDownloading ? 0.8 : 1,
                  }}
                >
                  <ImageIcon className="w-6 h-6 shrink-0 text-[#543A31]" />
                  {isDownloading ? "جاري التحميل..." : content.downloadAsImage}
                </button>
              )}

              <button
                data-share-button
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
            <div className="relative w-50.5 h-50.5 md:w-89.5 md:h-89.5 overflow-hidden" style={{ borderRadius: "15px" }}>
              <div className="relative w-full h-full overflow-hidden">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImageUrl} alt={teacherName} className="w-full h-full object-cover" />
                ) : (
                  <Image src="/images/profiles/arabic/fallback-header-image.svg" alt={teacherName} fill className="object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
