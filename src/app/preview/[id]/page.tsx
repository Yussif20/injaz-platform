"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PortfolioHeader,
  PersonalInfoSection,
  EducationSection,
  CareerSection,
  AchievementsSection,
  ContactButton,
  ThemeSelector,
  // Classic Template Components
  ClassicEducationSection,
  ClassicCareerSection,
} from "@/features/profiles";
import { useProfileDetails } from "@/features/profiles/hooks";
import {
  PORTFOLIO_THEMES,
  type ThemeName,
} from "@/features/profiles/types/theme.types";
import { TemplateId } from "@/features/profiles/types/template.types";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

export default function ProfilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  const contentRef = useRef<HTMLDivElement>(null);

  const { previewPage } = dashboardContent;

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default");
  const theme = PORTFOLIO_THEMES[currentTheme].colors;

  // Download loading state
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch profile details
  const { profileDetails, isLoading } = useProfileDetails(Number(profileId));

  // Go back handler
  const handleGoBack = () => {
    router.back();
  };

  // Download as PDF handler using html2canvas + jspdf (client-side)
  const handleDownload = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);

    try {
      // Dynamically import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Hide floating buttons during capture
      const backButton = document.querySelector(
        "[data-back-button]",
      ) as HTMLElement;
      const themeButton = document.querySelector(
        "[data-theme-button]",
      ) as HTMLElement;
      if (backButton) backButton.style.visibility = "hidden";
      if (themeButton) themeButton.style.visibility = "hidden";

      // Capture the content
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.background,
        scrollY: -window.scrollY,
        windowHeight: contentRef.current.scrollHeight,
      });

      // Show buttons again
      if (backButton) backButton.style.visibility = "";
      if (themeButton) themeButton.style.visibility = "";

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      const fileName = `ملف_إنجاز_${profileDetails?.userName || "المعلم"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء تحميل الملف");
    } finally {
      setIsDownloading(false);
    }
  };

  // Share handler
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/p/${profileId}`;
    const shareData = {
      title: `ملف إنجاز ${profileDetails?.userName || "المعلم"}`,
      text: `شاهد ملف إنجاز ${profileDetails?.userName || "المعلم"}`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("تم نسخ الرابط!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("تم نسخ الرابط!");
      } catch {
        console.error("Error copying to clipboard");
      }
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
          className="text-primary-500 hover:text-primary-600"
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
      {/* Back Button - Fixed at top right */}
      <button
        data-back-button
        onClick={handleGoBack}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
        }}
        aria-label="رجوع"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={theme.text}
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

      {/* Portfolio Content */}
      <div
        ref={contentRef}
        className="w-full relative pb-8"
        style={{ backgroundColor: theme.background }}
      >
        {/* Header Section */}
        <PortfolioHeader
          profileImage={null} // TODO: Add profile image when available
          teacherName={profileDetails.userName || "المعلم"}
          teacherRank={profileDetails.personalInfo?.rankTitle || "معلم"}
          academicYear={profileDetails.academicYearName || ""}
          onDownload={handleDownload}
          onShare={handleShare}
          isDownloading={isDownloading}
          content={{
            downloadFile: previewPage.downloadFile,
            shareFile: previewPage.shareFile,
            fileTitle: previewPage.fileTitle,
          }}
          theme={theme}
        />

        {/* Personal Info Section */}
        <PersonalInfoSection
          personalInfo={profileDetails.personalInfo}
          content={previewPage.personalInfo}
          memberBadge={previewPage.memberBadge}
          theme={theme}
        />

        {/* Education Section - Template-aware */}
        {profileDetails.templateId === TemplateId.Classic ? (
          <ClassicEducationSection
            qualifications={profileDetails.qualifications}
            content={previewPage.education}
            theme={theme}
          />
        ) : (
          <EducationSection
            qualifications={profileDetails.qualifications}
            content={previewPage.education}
            theme={theme}
          />
        )}

        {/* Career Section - Template-aware */}
        {profileDetails.templateId === TemplateId.Classic ? (
          <ClassicCareerSection
            careerJobs={profileDetails.careerJobs}
            content={previewPage.career}
            theme={theme}
          />
        ) : (
          <CareerSection
            careerJobs={profileDetails.careerJobs}
            content={previewPage.career}
            theme={theme}
          />
        )}

        {/* Achievements Section */}
        <AchievementsSection
          sections={profileDetails.sections}
          content={previewPage.achievements}
          theme={theme}
        />

        {/* Contact Button */}
        <ContactButton
          content={previewPage.contact}
          whatsappNumber={profileDetails.personalInfo?.phoneNumber}
          theme={theme}
        />
      </div>

      {/* Theme Selector - Floating Button + Modal */}
      <div data-theme-button>
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          content={previewPage.themeSelector}
        />
      </div>
    </div>
  );
}
