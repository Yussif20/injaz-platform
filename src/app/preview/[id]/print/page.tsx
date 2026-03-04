"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  DefaultEducationSection,
  DefaultCareerSection,
  DefaultPortfolioHeader,
  DefaultPersonalInfoSection,
  DefaultAchievementsSection,
  DefaultContactSection,
  DarkEducationSection,
  DarkCareerSection,
  DarkPortfolioHeader,
  DarkPersonalInfoSection,
  DarkAchievementsSection,
  DarkContactSection,
  HeritagePortfolioHeader,
  HeritagePersonalInfoSection,
  HeritageEducationSection,
  HeritageCareerSection,
  HeritageAchievementsSection,
  HeritageContactSection,
  ArabicPortfolioHeader,
  ArabicPersonalInfoSection,
  ArabicEducationSection,
  ArabicCareerSection,
  ArabicAchievementsSection,
  ArabicContactSection,
} from "@/features/profiles";
import { PORTFOLIO_THEMES } from "@/features/profiles/types/theme.types";
import { TemplateId } from "@/features/profiles/types/template.types";
import type { ProfileDetails } from "@/features/profiles/types";
import { dashboardContent } from "@/content";
import { PUBLIC_API_BASE_URL, PUBLIC_STORAGE_BASE_URL } from "@/shared/lib/api";

function normalizeImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  const path = s.replace(/^\//, "");
  const base = path.startsWith("uploads/")
    ? PUBLIC_STORAGE_BASE_URL.replace(/\/$/, "")
    : PUBLIC_API_BASE_URL.replace(/\/$/, "");
  return `${base}/${path}`;
}

const TEMPLATE_TO_THEME: Record<TemplateId, keyof typeof PORTFOLIO_THEMES> = {
  [TemplateId.Default]: "default",
  [TemplateId.Dark]: "dark",
  [TemplateId.Heritage]: "heritage",
  [TemplateId.Arabic]: "arabic",
};

/**
 * Print-only preview page for Puppeteer export.
 * Renders the profile template without interactive UI (no buttons, no theme selector).
 * Accessed via /preview/[id]/print?token=<export-token>
 */
export default function PrintPreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const profileId = params.id as string;
  const token = searchParams.get("token");
  const templateIdParam = searchParams.get("templateId");

  const { previewPage } = dashboardContent;

  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing token");
      setIsLoading(false);
      return;
    }

    // Fetch profile details using the export token
    // The token is verified server-side in the /api/export/profile route
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/export/profile?token=${encodeURIComponent(token!)}`);
        if (!res.ok) {
          setError(`Failed to fetch profile: ${res.status}`);
          setIsLoading(false);
          return;
        }
        const json = await res.json();
        if (json.status && json.data) {
          setProfileDetails(json.data.details);
          setImageUrl(json.data.imageUrl || null);
        } else {
          setError(json.message || "Failed to fetch profile");
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Profile not found"}</p>
      </div>
    );
  }

  // Use templateId from query params (user's current selection) if provided,
  // otherwise fall back to the profile's saved templateId
  const selectedTemplateId = (templateIdParam ? Number(templateIdParam) : profileDetails.templateId) as TemplateId || TemplateId.Default;
  const themeName = TEMPLATE_TO_THEME[selectedTemplateId] || "default";
  const theme = PORTFOLIO_THEMES[themeName].colors;
  const profileImageUrl = normalizeImageUrl(imageUrl ?? profileDetails.imageUrl);

  // No-op handlers — buttons are rendered but hidden by CSS print rules
  const noop = () => {};

  const commonHeaderProps = {
    teacherName: profileDetails.userName || "المعلم",
    teacherRank: profileDetails.personalInfo?.rankTitle || "معلم",
    academicYear: profileDetails.academicYearName || "",
    profileImageUrl,
    onDownload: noop,
    onDownloadAsImage: noop,
    onShare: noop,
    onBack: noop,
    isDownloading: false,
    content: {
      downloadFile: previewPage.downloadFile,
      downloadAsImage: previewPage.downloadAsImage,
      shareFile: previewPage.shareFile,
      fileTitle: previewPage.fileTitle,
      publishFile: previewPage.publishFile ?? "نشر الملف",
    },
    theme,
  };

  return (
    <div
      className="w-full"
      dir="rtl"
      data-print-ready="true"
      style={{ backgroundColor: theme.background }}
    >
      {/* Hide interactive buttons and add print-friendly CSS */}
      <style>{`
        [data-back-button],
        [data-theme-button],
        [data-download-button],
        [data-download-image-button],
        [data-share-button] {
          display: none !important;
        }

        /* Prevent content from being cut mid-element in PDF */
        section, [data-section] {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Ensure images load fully for Puppeteer */
        img {
          break-inside: avoid;
        }
      `}</style>

      {/* Header Section */}
      {selectedTemplateId === TemplateId.Default && <DefaultPortfolioHeader {...commonHeaderProps} />}
      {selectedTemplateId === TemplateId.Heritage && <HeritagePortfolioHeader {...commonHeaderProps} />}
      {selectedTemplateId === TemplateId.Arabic && <ArabicPortfolioHeader {...commonHeaderProps} />}
      {selectedTemplateId === TemplateId.Dark && <DarkPortfolioHeader {...commonHeaderProps} />}

      {/* Main content */}
      <div className="max-w-300 mx-auto">
        {/* Personal Info */}
        {selectedTemplateId === TemplateId.Default ? (
          <DefaultPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
        ) : selectedTemplateId === TemplateId.Heritage ? (
          <HeritagePersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
        ) : selectedTemplateId === TemplateId.Arabic ? (
          <ArabicPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
        ) : (
          <DarkPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
        )}

        {/* Education */}
        {selectedTemplateId === TemplateId.Default ? (
          <DefaultEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
        ) : selectedTemplateId === TemplateId.Dark ? (
          <DarkEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
        ) : selectedTemplateId === TemplateId.Heritage ? (
          <HeritageEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
        ) : (
          <ArabicEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
        )}

        {/* Career */}
        {selectedTemplateId === TemplateId.Default ? (
          <DefaultCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
        ) : selectedTemplateId === TemplateId.Dark ? (
          <DarkCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
        ) : selectedTemplateId === TemplateId.Heritage ? (
          <HeritageCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
        ) : (
          <ArabicCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
        )}

        {/* Achievements */}
        {selectedTemplateId === TemplateId.Default ? (
          <DefaultAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
        ) : selectedTemplateId === TemplateId.Dark ? (
          <DarkAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
        ) : selectedTemplateId === TemplateId.Heritage ? (
          <HeritageAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
        ) : (
          <ArabicAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
        )}

        {/* Contact */}
        {selectedTemplateId === TemplateId.Default ? (
          <DefaultContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
        ) : selectedTemplateId === TemplateId.Dark ? (
          <DarkContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
        ) : selectedTemplateId === TemplateId.Heritage ? (
          <HeritageContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
        ) : (
          <ArabicContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
        )}
      </div>
    </div>
  );
}
