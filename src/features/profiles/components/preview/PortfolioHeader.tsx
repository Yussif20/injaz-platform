"use client";

import Image from "next/image";
import type { ThemeColors } from "../../types/theme.types";

interface PortfolioHeaderProps {
  profileImage: string | null;
  teacherName: string;
  teacherRank: string;
  academicYear: string;
  onDownload: () => void;
  onShare: () => void;
  isDownloading?: boolean;
  content: {
    downloadFile: string;
    shareFile: string;
    fileTitle: string;
  };
  theme: ThemeColors;
}

export const PortfolioHeader = ({
  profileImage,
  teacherName,
  teacherRank,
  academicYear,
  onDownload,
  onShare,
  isDownloading = false,
  content,
  theme,
}: PortfolioHeaderProps) => {
  // Extract year from academic year name (e.g., "1446-1447 هـ | 2024-2025 م" -> "2025")
  const yearMatch = academicYear.match(/(\d{4})\s*م/);
  const year = yearMatch ? yearMatch[1] : academicYear;

  return (
    <div className="text-center py-8 px-4" style={{ backgroundColor: theme.background }}>
      {/* Decorative curved shape at top */}
      <div
        className="absolute top-0 left-0 right-0 h-40 rounded-b-[50%]"
        style={{ backgroundColor: theme.primaryLight }}
      />

      {/* Profile Image */}
      <div className="relative z-10 mb-4">
        <div
          className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4"
          style={{ borderColor: theme.primary }}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={teacherName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: theme.cardBg }}
            >
              <svg
                className="w-16 h-16"
                fill="none"
                stroke={theme.textMuted}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* File Title & Year */}
      <p
        className="text-sm mb-1"
        style={{ color: theme.textMuted }}
      >
        {content.fileTitle} - {year}
      </p>

      {/* Teacher Name */}
      <h1
        className="text-xl font-bold mb-1"
        style={{ color: theme.text }}
      >
        المعلم {teacherName}
      </h1>

      {/* Teacher Rank */}
      <p
        className="text-sm mb-6"
        style={{ color: theme.textMuted }}
      >
        {teacherRank}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-70"
          style={{
            backgroundColor: theme.cardBg,
            color: theme.text,
            border: `1px solid ${theme.border}`
          }}
        >
          {isDownloading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          {isDownloading ? "جاري التحميل..." : content.downloadFile}
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{
            backgroundColor: theme.primary,
            color: "#ffffff"
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {content.shareFile}
        </button>
      </div>
    </div>
  );
};
