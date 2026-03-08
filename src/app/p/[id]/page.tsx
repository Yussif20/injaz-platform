"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
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

type PageState = "loading" | "password_gate" | "profile" | "error";

export default function PublicProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const contentRef = useRef<HTMLDivElement>(null);

  const { previewPage } = dashboardContent;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/public/profiles/${profileId}`);
        const data = await res.json();

        if (!res.ok || !data.status) {
          setErrorMessage(data.message || "الملف غير موجود");
          setPageState("error");
          return;
        }

        const profile = data.data as ProfileDetails & { isPasswordProtected?: boolean };

        if (profile.isPasswordProtected) {
          setIsPasswordProtected(true);
          setPageState("password_gate");
          return;
        }

        // Check if profile is published
        if (profile.status !== "Published") {
          setErrorMessage("هذا الملف غير منشور");
          setPageState("error");
          return;
        }

        setProfileDetails(profile);
        setPageState("profile");
      } catch {
        setErrorMessage("حدث خطأ أثناء تحميل الملف");
        setPageState("error");
      }
    }
    fetchProfile();
  }, [profileId]);

  // Handle password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsVerifying(true);
    setPasswordError(null);

    try {
      const res = await fetch(`/api/public/profiles/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.status && data.data?.isValid) {
        // Password correct — reload profile data
        const profileRes = await fetch(`/api/public/profiles/${profileId}`);
        const profileData = await profileRes.json();

        if (profileData.status && profileData.data) {
          setProfileDetails(profileData.data);
          setPageState("profile");
        }
      } else {
        setPasswordError(data.message || "كلمة المرور غير صحيحة");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    } finally {
      setIsVerifying(false);
    }
  };

  // Get theme
  const templateId = (profileDetails?.templateId as TemplateId) || TemplateId.Default;
  const themeName = TEMPLATE_TO_THEME[templateId] || "default";
  const theme = PORTFOLIO_THEMES[themeName].colors;

  // Loading state
  if (pageState === "loading") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        dir="rtl"
        style={{ backgroundColor: theme.background }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  // Error state
  if (pageState === "error") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4"
        dir="rtl"
        style={{ backgroundColor: theme.background }}
      >
        <p className="text-grey-500 text-lg">{errorMessage}</p>
      </div>
    );
  }

  // Password gate
  if (pageState === "password_gate") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        dir="rtl"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-secondary-800 mb-2">
              ملف محمي بكلمة مرور
            </h1>
            <p className="text-grey-500 text-sm">
              يرجى إدخال كلمة المرور للوصول إلى هذا الملف
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3 rounded-xl border border-grey-200 text-right focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              {passwordError && (
                <p className="text-warning-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? "جاري التحقق..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Profile view (public, read-only, no action buttons)
  if (!profileDetails) return null;

  const profileImageUrl = normalizeImageUrl(profileDetails.imageUrl);

  // No-op handlers for header (public view has no download/share)
  const noop = () => {};

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      dir="rtl"
      style={{ backgroundColor: theme.background }}
    >
      <style jsx>{`
        div {
          scrollbar-color: ${theme.primary} transparent;
          scrollbar-width: thin;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: ${theme.primary}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background-color: ${theme.primary}dd; }
      `}</style>

      <div ref={contentRef} className="w-full relative pb-8" style={{ backgroundColor: theme.background }}>
        {/* Header - public view (no download/share buttons) */}
        {(() => {
          const commonHeaderProps = {
            teacherName: profileDetails.userName || "المعلم",
            teacherRank: profileDetails.personalInfo?.rankTitle || "معلم",
            academicYear: profileDetails.academicYearName || "",
            profileImageUrl,
            onDownload: noop,
            onShare: noop,
            onBack: noop,
            isDownloading: false,
            content: {
              downloadFile: "",
              shareFile: "",
              fileTitle: previewPage.fileTitle,
              publishFile: "",
            },
            theme,
          };
          if (templateId === TemplateId.Default) return <DefaultPortfolioHeader {...commonHeaderProps} />;
          if (templateId === TemplateId.Heritage) return <HeritagePortfolioHeader {...commonHeaderProps} />;
          if (templateId === TemplateId.Arabic) return <ArabicPortfolioHeader {...commonHeaderProps} />;
          return <DarkPortfolioHeader {...commonHeaderProps} />;
        })()}

        <div className="max-w-300 mx-auto">
          {templateId === TemplateId.Default ? (
            <DefaultPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritagePersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Arabic ? (
            <ArabicPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : (
            <DarkPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          )}

          {templateId === TemplateId.Default ? (
            <DefaultEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritageEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
          ) : (
            <ArabicEducationSection qualifications={profileDetails.qualifications} content={previewPage.education} theme={theme} />
          )}

          {templateId === TemplateId.Default ? (
            <DefaultCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritageCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
          ) : (
            <ArabicCareerSection careerJobs={profileDetails.careerJobs} content={previewPage.career} theme={theme} />
          )}

          {templateId === TemplateId.Default ? (
            <DefaultAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritageAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          ) : (
            <ArabicAchievementsSection sections={profileDetails.sections} content={previewPage.achievements} theme={theme} />
          )}

          {templateId === TemplateId.Default ? (
            <DefaultContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritageContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
          ) : (
            <ArabicContactSection content={previewPage.contact} whatsappNumber={profileDetails.personalInfo?.phoneNumber} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
}
