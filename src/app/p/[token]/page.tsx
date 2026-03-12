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

/** The backend share endpoint may return extra fields not in ProfileDetails type */
interface SharedProfileData extends ProfileDetails {
  userFullName?: string | null;
}

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
  const token = params.token as string;
  const contentRef = useRef<HTMLDivElement>(null);

  const { previewPage } = dashboardContent;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [profileDetails, setProfileDetails] = useState<SharedProfileData | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  // Store the password used to unlock (needed for PDF export of password-protected profiles)
  const [unlockedPassword, setUnlockedPassword] = useState<string | null>(null);

  // Fetch profile on mount via ShareLinks token endpoint
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/public/shared/${token}`);
        const data = await res.json();

        if (res.status === 403 && data.passwordRequired) {
          setPageState("password_gate");
          return;
        }

        if (!res.ok || !data.status) {
          setErrorMessage(data.message || "الملف غير موجود");
          setPageState("error");
          return;
        }

        setProfileDetails(data.data as SharedProfileData);
        setPageState("profile");
      } catch {
        setErrorMessage("حدث خطأ أثناء تحميل الملف");
        setPageState("error");
      }
    }
    fetchProfile();
  }, [token]);

  // Handle password submit — single request with ?password= param
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsVerifying(true);
    setPasswordError(null);

    try {
      const res = await fetch(
        `/api/public/shared/${token}?password=${encodeURIComponent(password)}`
      );
      const data = await res.json();

      if (res.ok && data.status && data.data) {
        setProfileDetails(data.data as SharedProfileData);
        setUnlockedPassword(password);
        setPageState("profile");
      } else {
        setPasswordError(data.message || "كلمة المرور غير صحيحة");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    } finally {
      setIsVerifying(false);
    }
  };

  // Get theme — coerce templateId to number to handle string values from backend
  const rawTemplateId = Number(profileDetails?.templateId);
  const VALID_TEMPLATE_IDS = [TemplateId.Default, TemplateId.Dark, TemplateId.Heritage, TemplateId.Arabic] as number[];
  const templateId: TemplateId = VALID_TEMPLATE_IDS.includes(rawTemplateId)
    ? (rawTemplateId as TemplateId)
    : TemplateId.Default;
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

  // Password gate — modal over blurred real template background
  if (pageState === "password_gate") {
    const noop = () => {};
    const placeholderHeaderProps = {
      teacherName: "المعلم محمد أحمد",
      teacherRank: "معلم خبير",
      academicYear: "2025",
      profileImageUrl: null,
      onDownload: noop,
      onShare: noop,
      onBack: noop,
      isDownloading: false,
      content: {
        downloadFile: "حمل الملف",
        shareFile: "مشاركة",
        fileTitle: previewPage.fileTitle,
        publishFile: "",
      },
      theme,
    };
    const placeholderPersonalInfo = {
      nationalId: "••••••••••",
      birthDate: "١٩٩٠/٠١/٠١",
      address: "المملكة العربية السعودية",
      email: "example@email.com",
      rankTitle: "معلم خبير",
      phoneNumber: "+966 ••• ••• ••••",
    };
    const placeholderQualifications = [
      { id: 1, degreeType: "بكالوريوس", title: "التربية والتعليم", graduationDate: "2015-06-15" },
    ];
    const placeholderCareerJobs = [
      { id: 1, school: "مدرسة النموذجية", educationalStage: "المرحلة المتوسطة", startYear: 2018, endYear: null },
    ];

    return (
      <div className="fixed inset-0 overflow-hidden" dir="rtl">
        {/* Blurred background — real template components with placeholder data */}
        <div className="absolute inset-0 overflow-y-auto blur-[6px] pointer-events-none select-none" aria-hidden="true">
          <div className="w-full relative pb-8" style={{ backgroundColor: theme.background }}>
            <DefaultPortfolioHeader {...placeholderHeaderProps} />
            <div className="max-w-300 mx-auto">
              <DefaultPersonalInfoSection personalInfo={placeholderPersonalInfo} content={previewPage.personalInfo} theme={theme} />
              <DefaultEducationSection qualifications={placeholderQualifications} content={previewPage.education} theme={theme} />
              <DefaultCareerSection careerJobs={placeholderCareerJobs} content={previewPage.career} theme={theme} />
              <DefaultAchievementsSection sections={[]} content={previewPage.achievements} theme={theme} />
            </div>
          </div>
        </div>

        {/* Modal overlay */}
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-secondary-800 mb-3">
                كلمة مرور الملف
              </h1>
              <p className="text-grey-500 text-sm">
                يجب ادخال كلمة مرور الملف لتستطيع الإطلاع عليه
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-2 text-right">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                className="w-full text-white py-3.5 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: theme.primary }}
              >
                {isVerifying ? "جاري التحقق..." : "دخول"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Profile view (public, read-only, no action buttons)
  if (!profileDetails) return null;

  const profileImageUrl = normalizeImageUrl(profileDetails.imageUrl);

  // Resolve teacher name: prefer userFullName (display name) over userName (may be phone)
  const resolvedTeacherName = profileDetails.userFullName
    || (profileDetails.userName && !/^\+?\d[\d\s-]{7,}$/.test(profileDetails.userName) ? profileDetails.userName : null)
    || "المعلم";

  // Download as PDF via server-side Puppeteer (public, no auth needed)
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      let url = `/api/export/shared-pdf?token=${encodeURIComponent(token)}`;
      if (unlockedPassword) {
        url += `&password=${encodeURIComponent(unlockedPassword)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `ملف_إنجاز_${resolvedTeacherName}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء تحميل الملف");
    } finally {
      setIsDownloading(false);
    }
  };

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
      {/* Hide back/publish bar — not relevant for public shared view */}
      <style>{`
        [data-preview-bar] { display: none !important; }
      `}</style>

      <div ref={contentRef} className="w-full relative pb-8" style={{ backgroundColor: theme.background }}>
        {/* Header - public view (no download/share buttons) */}
        {(() => {
          const commonHeaderProps = {
            teacherName: resolvedTeacherName,
            teacherRank: profileDetails.personalInfo?.rankTitle || "معلم",
            academicYear: profileDetails.academicYearName || "",
            profileImageUrl,
            onDownload: handleDownload,
            onShare: noop,
            onBack: noop,
            isDownloading,
            content: {
              downloadFile: previewPage.downloadFile,
              shareFile: "",
              fileTitle: previewPage.fileTitle,
              publishFile: "",
            },
            theme,
          };
          if (templateId === TemplateId.Default) return <DefaultPortfolioHeader {...commonHeaderProps} />;
          if (templateId === TemplateId.Dark) return <DarkPortfolioHeader {...commonHeaderProps} />;
          if (templateId === TemplateId.Heritage) return <HeritagePortfolioHeader {...commonHeaderProps} />;
          return <ArabicPortfolioHeader {...commonHeaderProps} />;
        })()}

        <div className="max-w-300 mx-auto">
          {templateId === TemplateId.Default ? (
            <DefaultPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Dark ? (
            <DarkPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : templateId === TemplateId.Heritage ? (
            <HeritagePersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
          ) : (
            <ArabicPersonalInfoSection personalInfo={profileDetails.personalInfo} content={previewPage.personalInfo} theme={theme} />
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
