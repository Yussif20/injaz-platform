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
import type { ProfileDetails } from "@/features/profiles/types/profile.types";
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
 * Print-only page for public shared profiles.
 * Puppeteer navigates here to generate the PDF.
 * Fetches profile data via the public ShareLinks API (no auth required).
 */
export default function SharedPrintPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shareToken = params.token as string;
  const password = searchParams.get("password");

  const { previewPage } = dashboardContent;

  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        let url = `/api/public/shared/${shareToken}`;
        if (password) {
          url += `?password=${encodeURIComponent(password)}`;
        }
        const res = await fetch(url);
        const json = await res.json();

        if (res.ok && json.status && json.data) {
          setProfileDetails(json.data as ProfileDetails);
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
  }, [shareToken, password]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
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

  const rawTemplateId = Number(profileDetails.templateId);
  const VALID_TEMPLATE_IDS = [TemplateId.Default, TemplateId.Dark, TemplateId.Heritage, TemplateId.Arabic] as number[];
  const templateId: TemplateId = VALID_TEMPLATE_IDS.includes(rawTemplateId)
    ? (rawTemplateId as TemplateId)
    : TemplateId.Default;
  const themeName = TEMPLATE_TO_THEME[templateId] || "default";
  const theme = PORTFOLIO_THEMES[themeName].colors;
  const profileImageUrl = normalizeImageUrl(profileDetails.imageUrl);

  function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const qualifications = profileDetails.qualifications ?? [];
  const careerJobs = profileDetails.careerJobs ?? [];
  const combineEduCareer = qualifications.length <= 1 && careerJobs.length <= 1;

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
      publishFile: "",
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
      <style>{`
        [data-back-button],
        [data-theme-button],
        [data-download-button],
        [data-download-image-button],
        [data-share-button],
        [data-preview-bar] {
          display: none !important;
        }
        body {
          width: 100%;
          overflow-x: hidden;
        }
        section, [data-section] {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        img {
          break-inside: avoid;
        }

        /* Force dark personal info cards into 2-column desktop layout at A4 width */
        .grid.grid-cols-1.lg\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 20px !important;
        }
        .grid.grid-cols-1.lg\\:grid-cols-2 > div {
          height: 162px !important;
          padding: 24px !important;
          border-radius: 24px !important;
          font-size: 12px !important;
        }
        .grid.grid-cols-1.lg\\:grid-cols-2 > div p {
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
      `}</style>

      {templateId === TemplateId.Default && <DefaultPortfolioHeader {...commonHeaderProps} />}
      {templateId === TemplateId.Heritage && <HeritagePortfolioHeader {...commonHeaderProps} />}
      {templateId === TemplateId.Arabic && <ArabicPortfolioHeader {...commonHeaderProps} />}
      {templateId === TemplateId.Dark && <DarkPortfolioHeader {...commonHeaderProps} />}

      <div className="max-w-300 mx-auto">
        {/* Personal Info */}
        <div>
          {templateId === TemplateId.Default ? (
            <DefaultPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritagePersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Arabic ? (
            <ArabicPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : (
            <DarkPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          )}
        </div>

        {/* Education & Career — max 2 cards per page, combine if both ≤1 */}
        {combineEduCareer ? (
          <div style={{ breakBefore: "page", paddingTop: "40px" }}>
            {qualifications.length > 0 && (
              templateId === TemplateId.Default ? (
                <DefaultEducationSection qualifications={qualifications} content={previewPage.education} theme={theme} />
              ) : templateId === TemplateId.Dark ? (
                <DarkEducationSection qualifications={qualifications} content={previewPage.education} theme={theme} />
              ) : templateId === TemplateId.Heritage ? (
                <HeritageEducationSection qualifications={qualifications} content={previewPage.education} theme={theme} />
              ) : (
                <ArabicEducationSection qualifications={qualifications} content={previewPage.education} theme={theme} />
              )
            )}
            {careerJobs.length > 0 && (
              templateId === TemplateId.Default ? (
                <DefaultCareerSection careerJobs={careerJobs} content={previewPage.career} theme={theme} />
              ) : templateId === TemplateId.Dark ? (
                <DarkCareerSection careerJobs={careerJobs} content={previewPage.career} theme={theme} />
              ) : templateId === TemplateId.Heritage ? (
                <HeritageCareerSection careerJobs={careerJobs} content={previewPage.career} theme={theme} />
              ) : (
                <ArabicCareerSection careerJobs={careerJobs} content={previewPage.career} theme={theme} />
              )
            )}
          </div>
        ) : (
          <>
            {chunk(qualifications, 2).map((eduChunk, i) => (
              <div key={`edu-${i}`} style={{ breakBefore: "page", paddingTop: "40px" }}>
                {templateId === TemplateId.Default ? (
                  <DefaultEducationSection qualifications={eduChunk} content={previewPage.education} theme={theme} />
                ) : templateId === TemplateId.Dark ? (
                  <DarkEducationSection qualifications={eduChunk} content={previewPage.education} theme={theme} />
                ) : templateId === TemplateId.Heritage ? (
                  <HeritageEducationSection qualifications={eduChunk} content={previewPage.education} theme={theme} />
                ) : (
                  <ArabicEducationSection qualifications={eduChunk} content={previewPage.education} theme={theme} />
                )}
              </div>
            ))}
            {chunk(careerJobs, 2).map((careerChunk, i) => (
              <div key={`career-${i}`} style={{ breakBefore: "page", paddingTop: "40px" }}>
                {templateId === TemplateId.Default ? (
                  <DefaultCareerSection careerJobs={careerChunk} content={previewPage.career} theme={theme} />
                ) : templateId === TemplateId.Dark ? (
                  <DarkCareerSection careerJobs={careerChunk} content={previewPage.career} theme={theme} />
                ) : templateId === TemplateId.Heritage ? (
                  <HeritageCareerSection careerJobs={careerChunk} content={previewPage.career} theme={theme} />
                ) : (
                  <ArabicCareerSection careerJobs={careerChunk} content={previewPage.career} theme={theme} />
                )}
              </div>
            ))}
          </>
        )}

        {/* Achievements — always start on a new page */}
        <div style={{ breakBefore: "page", paddingTop: "40px" }}>
          {templateId === TemplateId.Default ? (
            <DefaultAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritageAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : (
            <ArabicAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          )}
        </div>

        {/* Contact section removed from PDF export */}
      </div>
    </div>
  );
}
