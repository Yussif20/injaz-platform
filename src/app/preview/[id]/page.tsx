"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ThemeSelector,
  // Template Components
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
import { useProfileDetails, useMyProfiles, useProfileCapabilities, usePublishProfile, useUnpublishProfile, useCreateShareLink } from "@/features/profiles/hooks";
import { PORTFOLIO_THEMES } from "@/features/profiles/types/theme.types";
import { TemplateId } from "@/features/profiles/types/template.types";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { PUBLIC_API_BASE_URL, PUBLIC_STORAGE_BASE_URL } from "@/shared/lib/api";
import { Watermark } from "@/shared/components/ui";

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

// Map template ID to theme name for colors
const TEMPLATE_TO_THEME: Record<TemplateId, keyof typeof PORTFOLIO_THEMES> = {
  [TemplateId.Default]: "default",
  [TemplateId.Dark]: "dark",
  [TemplateId.Heritage]: "heritage",
  [TemplateId.Arabic]: "arabic",
};

export default function ProfilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  const contentRef = useRef<HTMLDivElement>(null);

  const { previewPage } = dashboardContent;

  // Capability checks
  const capabilities = useProfileCapabilities();

  // Publish/unpublish hooks
  const { publishAsync, isLoading: isPublishing } = usePublishProfile();
  const { unpublishAsync, isLoading: isUnpublishing } = useUnpublishProfile();

  // Share link creation
  const { createShareLinkAsync } = useCreateShareLink();

  // Toast for blocked actions
  const [blockToast, setBlockToast] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  // Download loading state
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch profile details
  const { profileDetails, isLoading } = useProfileDetails(Number(profileId));

  // Fetch profile list to get imageUrl (the /details endpoint doesn't return it)
  const { profiles } = useMyProfiles();
  const profileFromList = profiles.find((p) => String(p.id) === profileId);

  // Selected template state - initialized from profile data
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    TemplateId.Default,
  );

  // Update selectedTemplateId when profileDetails loads
  useEffect(() => {
    if (profileDetails?.templateId) {
      setSelectedTemplateId(profileDetails.templateId as TemplateId);
    }
  }, [profileDetails?.templateId]);

  // Get theme colors based on selected template
  const themeName = TEMPLATE_TO_THEME[selectedTemplateId] || "default";
  const theme = PORTFOLIO_THEMES[themeName].colors;

  // Go back handler
  const handleGoBack = () => {
    router.back();
  };

  // Show blocked action toast
  const showBlockedToast = (action: "download" | "share" | "publish") => {
    let message: string;
    if (capabilities.blockedReason === "not_subscribed") {
      message = action === "download"
        ? previewPage.subscribeToDownload
        : action === "publish"
        ? previewPage.subscribeToPublish
        : previewPage.subscribeToShare;
    } else {
      message = action === "download"
        ? previewPage.completeProfileToDownload
        : action === "publish"
        ? previewPage.completeProfileToPublish
        : previewPage.completeProfileToShare;
    }
    setBlockToast({ message, type: "warning" });
    setTimeout(() => setBlockToast(null), 3000);
  };

  // Download as PDF via server-side Puppeteer
  const handleDownload = async () => {
    if (!capabilities.canDownload) {
      showBlockedToast("download");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/export/pdf?profileId=${profileId}&templateId=${selectedTemplateId}`);
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ملف_إنجاز_${profileDetails?.userName || "المعلم"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء تحميل الملف");
    } finally {
      setIsDownloading(false);
    }
  };

  // Download as image (PNG) via server-side Puppeteer
  const handleDownloadAsImage = async () => {
    if (!capabilities.canDownload) {
      showBlockedToast("download");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/export/image?profileId=${profileId}&templateId=${selectedTemplateId}`);
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ملف_إنجاز_${profileDetails?.userName || "المعلم"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("حدث خطأ أثناء تحميل الصورة");
    } finally {
      setIsDownloading(false);
    }
  };

  // Share handler — creates a tracked share link via the ShareLinks API
  const handleShare = async () => {
    if (!capabilities.canShare) {
      showBlockedToast("share");
      return;
    }

    // Default fallback URL
    const fallbackUrl = `${window.location.origin}/p/${profileId}`;
    let shareUrl = fallbackUrl;

    try {
      const result = await createShareLinkAsync({ profileId: Number(profileId) });
      if (result?.data?.shareUrl) {
        shareUrl = result.data.shareUrl;
      }
    } catch (error) {
      console.error("Error creating share link, using fallback URL:", error);
    }

    const shareData = {
      title: `ملف إنجاز ${profileDetails?.userName || "المعلم"}`,
      text: `شاهد ملف إنجاز ${profileDetails?.userName || "المعلم"}`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setBlockToast({ message: "تم مشاركة الرابط بنجاح", type: "success" });
        setTimeout(() => setBlockToast(null), 3000);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setBlockToast({ message: "تم نسخ الرابط!", type: "success" });
        setTimeout(() => setBlockToast(null), 3000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      try {
        await navigator.clipboard.writeText(shareUrl);
        setBlockToast({ message: "تم نسخ الرابط!", type: "success" });
        setTimeout(() => setBlockToast(null), 3000);
      } catch {
        console.error("Error copying to clipboard");
      }
    }
  };

  // Determine if profile is currently published
  const isPublished = profileDetails?.status === "Published";

  // Publish handler
  const handlePublish = async () => {
    if (!capabilities.canPublish) {
      showBlockedToast("publish");
      return;
    }
    try {
      const result = await publishAsync(Number(profileId));
      if (result.status) {
        setBlockToast({ message: "تم نشر الملف بنجاح", type: "success" });
        setTimeout(() => setBlockToast(null), 3000);
      } else {
        setBlockToast({ message: result.message || "فشل نشر الملف", type: "warning" });
        setTimeout(() => setBlockToast(null), 3000);
      }
    } catch {
      setBlockToast({ message: "حدث خطأ أثناء نشر الملف", type: "warning" });
      setTimeout(() => setBlockToast(null), 3000);
    }
  };

  // Unpublish handler
  const handleUnpublish = async () => {
    try {
      const result = await unpublishAsync(Number(profileId));
      if (result.status) {
        setBlockToast({ message: "تم إلغاء نشر الملف بنجاح", type: "success" });
        setTimeout(() => setBlockToast(null), 3000);
      } else {
        setBlockToast({ message: result.message || "فشل إلغاء نشر الملف", type: "warning" });
        setTimeout(() => setBlockToast(null), 3000);
      }
    } catch {
      setBlockToast({ message: "حدث خطأ أثناء إلغاء نشر الملف", type: "warning" });
      setTimeout(() => setBlockToast(null), 3000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Not found state
  if (!profileDetails) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <p className="text-grey-500 mb-4">{previewPage.notFound}</p>
        <Link
          href={ROUTES.DASHBOARD}
          className="text-primary-500 hover:text-primary-800"
        >
          {previewPage.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      dir="rtl"
      style={{ backgroundColor: theme.background }}
    >
      {/* Dynamic Scrollbar Styles */}
      <style jsx>{`
        /* Firefox scrollbar */
        div {
          scrollbar-color: ${theme.primary} transparent;
          scrollbar-width: thin;
        }

        /* Webkit scrollbar (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: ${theme.primary};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: ${theme.primary}dd;
        }
      `}</style>

      {/* Watermark for unsubscribed users */}
      {capabilities.showWatermark && <Watermark text={previewPage.watermarkText} />}

      {/* Portfolio Content */}
      <div
        ref={contentRef}
        className="w-full relative pb-8"
        style={{ backgroundColor: theme.background }}
      >
        {/* Header Section - Template-aware */}
        {(() => {
          const profileImageUrl = normalizeImageUrl(profileFromList?.imageUrl ?? profileDetails.imageUrl);
          const commonHeaderProps = {
            teacherName: profileDetails.userName || "المعلم",
            teacherRank: profileDetails.personalInfo?.rankTitle || "معلم",
            academicYear: profileDetails.academicYearName || "",
            profileImageUrl,
            onDownload: handleDownload,
            onDownloadAsImage: handleDownloadAsImage,
            onShare: handleShare,
            onPublish: isPublished ? handleUnpublish : handlePublish,
            isPublished,
            onBack: handleGoBack,
            isDownloading,
            content: {
              downloadFile: previewPage.downloadFile,
              downloadAsImage: previewPage.downloadAsImage,
              shareFile: previewPage.shareFile,
              fileTitle: previewPage.fileTitle,
              publishFile: isPublished ? "إلغاء النشر" : (previewPage.publishFile ?? "نشر الملف"),
            },
            theme,
          };
          if (selectedTemplateId === TemplateId.Default) return <DefaultPortfolioHeader {...commonHeaderProps} />;
          if (selectedTemplateId === TemplateId.Heritage) return <HeritagePortfolioHeader {...commonHeaderProps} />;
          if (selectedTemplateId === TemplateId.Arabic) return <ArabicPortfolioHeader {...commonHeaderProps} />;
          return <DarkPortfolioHeader {...commonHeaderProps} />;
        })()}

        {/* Main content constrained to max width */}
        <div className="max-w-300 mx-auto">
          {/* Personal Info Section - Template-aware */}
{selectedTemplateId === TemplateId.Default ? (
              <DefaultPersonalInfoSection
                personalInfo={profileDetails.personalInfo}
                content={previewPage.personalInfo}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Heritage ? (
              <HeritagePersonalInfoSection
                personalInfo={profileDetails.personalInfo}
                content={previewPage.personalInfo}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Arabic ? (
              <ArabicPersonalInfoSection
                personalInfo={profileDetails.personalInfo}
                content={previewPage.personalInfo}
                theme={theme}
              />
            ) : (
              <DarkPersonalInfoSection
                personalInfo={profileDetails.personalInfo}
                content={previewPage.personalInfo}
                theme={theme}
              />
            )}

          {/* Education Section - Template-aware */}
          {selectedTemplateId === TemplateId.Default ? (
              <DefaultEducationSection
                qualifications={profileDetails.qualifications}
                content={previewPage.education}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Dark ? (
              <DarkEducationSection
                qualifications={profileDetails.qualifications}
                content={previewPage.education}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Heritage ? (
              <HeritageEducationSection
                qualifications={profileDetails.qualifications}
                content={previewPage.education}
                theme={theme}
              />
            ) : (
              <ArabicEducationSection
                qualifications={profileDetails.qualifications}
                content={previewPage.education}
                theme={theme}
              />
            )}

          {/* Career Section - Template-aware */}
          {selectedTemplateId === TemplateId.Default ? (
              <DefaultCareerSection
                careerJobs={profileDetails.careerJobs}
                content={previewPage.career}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Dark ? (
              <DarkCareerSection
                careerJobs={profileDetails.careerJobs}
                content={previewPage.career}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Heritage ? (
              <HeritageCareerSection
                careerJobs={profileDetails.careerJobs}
                content={previewPage.career}
                theme={theme}
              />
            ) : (
              <ArabicCareerSection
                careerJobs={profileDetails.careerJobs}
                content={previewPage.career}
                theme={theme}
              />
            )}

          {/* Achievements Section - Template-aware */}
          {selectedTemplateId === TemplateId.Default ? (
              <DefaultAchievementsSection
                sections={profileDetails.sections}
                content={previewPage.achievements}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Dark ? (
              <DarkAchievementsSection
                sections={profileDetails.sections}
                content={previewPage.achievements}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Heritage ? (
              <HeritageAchievementsSection
                sections={profileDetails.sections}
                content={previewPage.achievements}
                theme={theme}
              />
            ) : (
              <ArabicAchievementsSection
                sections={profileDetails.sections}
                content={previewPage.achievements}
                theme={theme}
              />
            )}

          {/* Contact Section - Template-aware */}
          {selectedTemplateId === TemplateId.Default ? (
              <DefaultContactSection
                content={previewPage.contact}
                whatsappNumber={profileDetails.personalInfo?.phoneNumber}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Dark ? (
              <DarkContactSection
                content={previewPage.contact}
                whatsappNumber={profileDetails.personalInfo?.phoneNumber}
                theme={theme}
              />
            ) : selectedTemplateId === TemplateId.Heritage ? (
              <HeritageContactSection
                content={previewPage.contact}
                whatsappNumber={profileDetails.personalInfo?.phoneNumber}
                theme={theme}
              />
            ) : (
              <ArabicContactSection
                content={previewPage.contact}
                whatsappNumber={profileDetails.personalInfo?.phoneNumber}
                theme={theme}
              />
            )}
        </div>
      </div>

      {/* Template Selector - Floating Button + Modal */}
      <div data-theme-button>
        <ThemeSelector
          currentTemplate={selectedTemplateId}
          onTemplateChange={setSelectedTemplateId}
          content={previewPage.themeSelector}
        />
      </div>

      {/* Action toast */}
      {blockToast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm text-center ${blockToast.type === "success" ? "bg-success-500" : "bg-warning-500"}`}>
          {blockToast.message}
        </div>
      )}
    </div>
  );
}
