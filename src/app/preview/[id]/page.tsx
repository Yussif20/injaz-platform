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
import { useProfileDetails, useMyProfiles } from "@/features/profiles/hooks";
import { PORTFOLIO_THEMES } from "@/features/profiles/types/theme.types";
import { TemplateId } from "@/features/profiles/types/template.types";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
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

/**
 * Convert all external <img> elements in a cloned document to inline data URLs
 * so html2canvas can render them (it cannot draw cross-origin images on canvas).
 * Fetches through /api/images/proxy to avoid CORS issues with Backblaze S3.
 */
async function inlineExternalImages(clonedDoc: Document): Promise<void> {
  const imgs = clonedDoc.querySelectorAll("img");
  const promises: Promise<void>[] = [];

  imgs.forEach((img) => {
    const src = img.getAttribute("src") || "";
    // Only convert external http(s) URLs — skip local, data:, and empty
    if (!src.startsWith("http://") && !src.startsWith("https://")) return;
    if (src.startsWith("data:")) return;

    const proxyUrl = `/api/images/proxy?url=${encodeURIComponent(src)}`;

    const p = fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
        return res.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      )
      .then((dataUrl) => {
        img.setAttribute("src", dataUrl);
      })
      .catch((err) => {
        console.warn("Could not inline image for capture:", src, err);
      });

    promises.push(p);
  });

  await Promise.all(promises);
}

/**
 * Convert a CSS color string that may use oklab/oklch to rgb/rgba.
 * html2canvas and some parsers don't support oklab, so we convert for the clone.
 */
function cssColorToRgb(cssValue: string): string {
  if (!cssValue || typeof cssValue !== "string") return cssValue;
  const v = cssValue.trim();
  if (!v.includes("oklab") && !v.includes("oklch")) return cssValue;

  // Parse oklab(L a b) or oklab(L a b / alpha)
  const oklabMatch = v.match(
    /oklab\s*\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i,
  );
  if (oklabMatch) {
    const L = Math.max(0, Math.min(1, parseFloat(oklabMatch[1])));
    const a = parseFloat(oklabMatch[2]);
    const b = parseFloat(oklabMatch[3]);
    const alpha = oklabMatch[4] != null ? parseFloat(oklabMatch[4]) : 1;
    const { r, g, b: bVal } = oklabToSrgb(L, a, b);
    const r255 = Math.round(r * 255);
    const g255 = Math.round(g * 255);
    const b255 = Math.round(bVal * 255);
    if (alpha < 1) return `rgba(${r255},${g255},${b255},${alpha})`;
    return `rgb(${r255},${g255},${b255})`;
  }

  // Parse oklch(L C h) or oklch(L C h / alpha) — convert to Lab then to rgb
  const oklchMatch = v.match(
    /oklch\s*\(\s*([\d.]+)\s+([\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i,
  );
  if (oklchMatch) {
    const L = Math.max(0, Math.min(1, parseFloat(oklchMatch[1])));
    const C = Math.max(0, parseFloat(oklchMatch[2]));
    const h = (parseFloat(oklchMatch[3]) * Math.PI) / 180;
    const alpha = oklchMatch[4] != null ? parseFloat(oklchMatch[4]) : 1;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);
    const { r, g, b: bVal } = oklabToSrgb(L, a, b);
    const r255 = Math.round(r * 255);
    const g255 = Math.round(g * 255);
    const b255 = Math.round(bVal * 255);
    if (alpha < 1) return `rgba(${r255},${g255},${b255},${alpha})`;
    return `rgb(${r255},${g255},${b255})`;
  }

  return cssValue;
}

/** Replace all oklab/oklch in a CSS string (e.g. full stylesheet text). */
function replaceOklabInCssText(cssText: string): string {
  if (!cssText || !/oklab|oklch/i.test(cssText)) return cssText;
  return cssText
    .replace(/oklab\s*\([^)]+\)/gi, (match) => cssColorToRgb(match))
    .replace(/oklch\s*\([^)]+\)/gi, (match) => cssColorToRgb(match));
}

function oklabToSrgb(
  L: number,
  a: number,
  b: number,
): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const rLin =
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin =
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin =
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const linearToGamma = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return {
    r: Math.max(0, Math.min(1, linearToGamma(rLin))),
    g: Math.max(0, Math.min(1, linearToGamma(gLin))),
    b: Math.max(0, Math.min(1, linearToGamma(bLin))),
  };
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

  // Download as PDF handler using html2canvas + jspdf (client-side)
  const handleDownload = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);

    // Replace oklab/oklch in document styles before capture so html2canvas never parses them
    const styleBackups: { el: HTMLStyleElement; original: string }[] = [];
    const doc = contentRef.current.ownerDocument;
    if (doc) {
      doc.querySelectorAll("style").forEach((el) => {
        const text = el.textContent;
        if (text && /oklab|oklch/i.test(text)) {
          styleBackups.push({ el: el as HTMLStyleElement, original: text });
          (el as HTMLStyleElement).textContent = replaceOklabInCssText(text);
        }
      });
    }

    try {
      // Dynamically import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Hide floating buttons, back, share, and download during capture
      const backButton = document.querySelector(
        "[data-back-button]",
      ) as HTMLElement;
      const themeButton = document.querySelector(
        "[data-theme-button]",
      ) as HTMLElement;
      const downloadButton = document.querySelector(
        "[data-download-button]",
      ) as HTMLElement;
      const downloadImageButtons = document.querySelectorAll(
        "[data-download-image-button]",
      ) as NodeListOf<HTMLElement>;
      const shareButtons = document.querySelectorAll(
        "[data-share-button]",
      ) as NodeListOf<HTMLElement>;
      if (backButton) backButton.style.visibility = "hidden";
      if (themeButton) themeButton.style.visibility = "hidden";
      if (downloadButton) downloadButton.style.visibility = "hidden";
      downloadImageButtons.forEach((el) => {
        el.style.visibility = "hidden";
      });
      shareButtons.forEach((el) => {
        el.style.visibility = "hidden";
      });

      // Capture the content with color format workaround
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.background,
        scrollY: -window.scrollY,
        windowHeight: contentRef.current.scrollHeight,
        logging: false,
        onclone: async (clonedDoc) => {
          // Inline external images as data URLs so html2canvas can render them
          await inlineExternalImages(clonedDoc);

          // Force all elements to use RGB colors (html2canvas doesn't support oklab)
          const win = clonedDoc.defaultView || window;
          const allElements = clonedDoc.body.querySelectorAll("*");
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computed = win.getComputedStyle(el);

              const setRgb = (prop: keyof CSSStyleDeclaration, value: string) => {
                if (!value) return;
                (el.style as unknown as Record<string, string>)[prop as string] = cssColorToRgb(value);
              };

              if (computed.color) setRgb("color", computed.color);
              if (
                computed.backgroundColor &&
                computed.backgroundColor !== "rgba(0, 0, 0, 0)"
              ) {
                setRgb("backgroundColor", computed.backgroundColor);
              }
              if (computed.borderTopColor)
                setRgb("borderTopColor", computed.borderTopColor);
              if (computed.borderRightColor)
                setRgb("borderRightColor", computed.borderRightColor);
              if (computed.borderBottomColor)
                setRgb("borderBottomColor", computed.borderBottomColor);
              if (computed.borderLeftColor)
                setRgb("borderLeftColor", computed.borderLeftColor);
              if (computed.outlineColor)
                setRgb("outlineColor", computed.outlineColor);
              if (computed.textDecorationColor)
                setRgb("textDecorationColor", computed.textDecorationColor);
              if (computed.columnRuleColor)
                setRgb("columnRuleColor", computed.columnRuleColor);
            }
          });
          // Fix gradient text (bg-clip-text): html2canvas shows it as a rectangle, so use solid color in clone
          clonedDoc.querySelectorAll("[data-screenshot-text-color]").forEach((el) => {
            if (el instanceof HTMLElement) {
              const color = el.getAttribute("data-screenshot-text-color");
              if (color) {
                el.style.color = color;
                el.style.background = "none";
                el.style.backgroundColor = "transparent";
                el.style.backgroundImage = "none";
              }
            }
          });
          // Replace oklab/oklch in clone stylesheets so the renderer doesn't parse them
          try {
            const sheets = clonedDoc.querySelectorAll("style");
            sheets.forEach((styleEl) => {
              let text = styleEl.textContent;
              if (!text || !/oklab|oklch/i.test(text)) return;
              text = text.replace(/oklab\s*\([^)]+\)/gi, (match) => cssColorToRgb(match));
              text = text.replace(/oklch\s*\([^)]+\)/gi, (match) => cssColorToRgb(match));
              styleEl.textContent = text;
            });
          } catch {
            // ignore
          }
        },
      });

      // Show buttons again
      if (backButton) backButton.style.visibility = "";
      if (themeButton) themeButton.style.visibility = "";
      if (downloadButton) downloadButton.style.visibility = "";
      downloadImageButtons.forEach((el) => {
        el.style.visibility = "";
      });
      shareButtons.forEach((el) => {
        el.style.visibility = "";
      });

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
      // Restore original styles (remove oklab replacement)
      styleBackups.forEach(({ el, original }) => {
        el.textContent = original;
      });
      // Ensure buttons are visible again if capture failed
      const backBtn = document.querySelector("[data-back-button]") as HTMLElement;
      const themeBtn = document.querySelector("[data-theme-button]") as HTMLElement;
      const downloadBtn = document.querySelector("[data-download-button]") as HTMLElement;
      const downloadImageBtns = document.querySelectorAll("[data-download-image-button]") as NodeListOf<HTMLElement>;
      const shareBtns = document.querySelectorAll("[data-share-button]") as NodeListOf<HTMLElement>;
      if (backBtn) backBtn.style.visibility = "";
      if (themeBtn) themeBtn.style.visibility = "";
      if (downloadBtn) downloadBtn.style.visibility = "";
      downloadImageBtns.forEach((el) => {
        el.style.visibility = "";
      });
      shareBtns.forEach((el) => {
        el.style.visibility = "";
      });
    }
  };

  // Download as image (PNG) handler
  const handleDownloadAsImage = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);

    const styleBackups: { el: HTMLStyleElement; original: string }[] = [];
    const doc = contentRef.current.ownerDocument;
    if (doc) {
      doc.querySelectorAll("style").forEach((el) => {
        const text = el.textContent;
        if (text && /oklab|oklch/i.test(text)) {
          styleBackups.push({ el: el as HTMLStyleElement, original: text });
          (el as HTMLStyleElement).textContent = replaceOklabInCssText(text);
        }
      });
    }

    try {
      const html2canvas = (await import("html2canvas")).default;

      const backButton = document.querySelector("[data-back-button]") as HTMLElement;
      const themeButton = document.querySelector("[data-theme-button]") as HTMLElement;
      const downloadButton = document.querySelector("[data-download-button]") as HTMLElement;
      const downloadImageButtons = document.querySelectorAll("[data-download-image-button]") as NodeListOf<HTMLElement>;
      const shareButtons = document.querySelectorAll("[data-share-button]") as NodeListOf<HTMLElement>;
      if (backButton) backButton.style.visibility = "hidden";
      if (themeButton) themeButton.style.visibility = "hidden";
      if (downloadButton) downloadButton.style.visibility = "hidden";
      downloadImageButtons.forEach((el) => {
        el.style.visibility = "hidden";
      });
      shareButtons.forEach((el) => {
        el.style.visibility = "hidden";
      });

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.background,
        scrollY: -window.scrollY,
        windowHeight: contentRef.current.scrollHeight,
        logging: false,
        onclone: async (clonedDoc) => {
          // Inline external images as data URLs so html2canvas can render them
          await inlineExternalImages(clonedDoc);

          const win = clonedDoc.defaultView || window;
          const allElements = clonedDoc.body.querySelectorAll("*");
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computed = win.getComputedStyle(el);
              const setRgb = (prop: keyof CSSStyleDeclaration, value: string) => {
                if (!value) return;
                (el.style as unknown as Record<string, string>)[prop as string] = cssColorToRgb(value);
              };
              if (computed.color) setRgb("color", computed.color);
              if (computed.backgroundColor && computed.backgroundColor !== "rgba(0, 0, 0, 0)")
                setRgb("backgroundColor", computed.backgroundColor);
              if (computed.borderTopColor) setRgb("borderTopColor", computed.borderTopColor);
              if (computed.borderRightColor) setRgb("borderRightColor", computed.borderRightColor);
              if (computed.borderBottomColor) setRgb("borderBottomColor", computed.borderBottomColor);
              if (computed.borderLeftColor) setRgb("borderLeftColor", computed.borderLeftColor);
              if (computed.outlineColor) setRgb("outlineColor", computed.outlineColor);
              if (computed.textDecorationColor) setRgb("textDecorationColor", computed.textDecorationColor);
              if (computed.columnRuleColor) setRgb("columnRuleColor", computed.columnRuleColor);
            }
          });
          clonedDoc.querySelectorAll("[data-screenshot-text-color]").forEach((el) => {
            if (el instanceof HTMLElement) {
              const color = el.getAttribute("data-screenshot-text-color");
              if (color) {
                el.style.color = color;
                el.style.background = "none";
                el.style.backgroundColor = "transparent";
                el.style.backgroundImage = "none";
              }
            }
          });
          try {
            clonedDoc.querySelectorAll("style").forEach((styleEl) => {
              let text = styleEl.textContent;
              if (!text || !/oklab|oklch/i.test(text)) return;
              text = text.replace(/oklab\s*\([^)]+\)/gi, (m) => cssColorToRgb(m));
              text = text.replace(/oklch\s*\([^)]+\)/gi, (m) => cssColorToRgb(m));
              styleEl.textContent = text;
            });
          } catch {
            // ignore
          }
        },
      });

      if (backButton) backButton.style.visibility = "";
      if (themeButton) themeButton.style.visibility = "";
      if (downloadButton) downloadButton.style.visibility = "";
      downloadImageButtons.forEach((el) => {
        el.style.visibility = "";
      });
      shareButtons.forEach((el) => {
        el.style.visibility = "";
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `ملف_إنجاز_${profileDetails?.userName || "المعلم"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("حدث خطأ أثناء تحميل الصورة");
    } finally {
      setIsDownloading(false);
      styleBackups.forEach(({ el, original }) => {
        el.textContent = original;
      });
      const backBtn = document.querySelector("[data-back-button]") as HTMLElement;
      const themeBtn = document.querySelector("[data-theme-button]") as HTMLElement;
      const downloadBtn = document.querySelector("[data-download-button]") as HTMLElement;
      const downloadImageBtns = document.querySelectorAll("[data-download-image-button]") as NodeListOf<HTMLElement>;
      const shareBtns = document.querySelectorAll("[data-share-button]") as NodeListOf<HTMLElement>;
      if (backBtn) backBtn.style.visibility = "";
      if (themeBtn) themeBtn.style.visibility = "";
      if (downloadBtn) downloadBtn.style.visibility = "";
      downloadImageBtns.forEach((el) => {
        el.style.visibility = "";
      });
      shareBtns.forEach((el) => {
        el.style.visibility = "";
      });
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
            onBack: handleGoBack,
            isDownloading,
            content: {
              downloadFile: previewPage.downloadFile,
              downloadAsImage: previewPage.downloadAsImage,
              shareFile: previewPage.shareFile,
              fileTitle: previewPage.fileTitle,
              publishFile: previewPage.publishFile ?? "نشر الملف",
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
    </div>
  );
}
