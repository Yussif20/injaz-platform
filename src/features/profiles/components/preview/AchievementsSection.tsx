"use client";

import { useState } from "react";
import Image from "next/image";
import type { ThemeColors } from "../../types/theme.types";
import type { ProfileSection, ProfileSubsection, SubsectionImage } from "../../types/profile.types";

interface AchievementsSectionProps {
  sections: ProfileSection[] | null;
  content: {
    title: string;
    subtitle: string;
    weightLabel: string;
    attachmentLabel?: string;
  };
  theme: ThemeColors;
}

// Subsection gallery component with featured image and thumbnails
const SubsectionGallery = ({
  images,
  subsectionTitle,
  attachmentLabel,
  theme,
}: {
  images: SubsectionImage[];
  subsectionTitle: string | null;
  attachmentLabel?: string;
  theme: ThemeColors;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      {/* Description text at top - right aligned */}
      {selectedImage?.description && (
        <p className="text-right text-text-muted text-sm md:text-base mb-3">
          {attachmentLabel} {selectedImage.description}
        </p>
      )}

      {/* Featured Image - full width with rounded corners */}
      <div className="relative aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden">
        <Image
          src={selectedImage?.publicUrl || "/images/profiles/achievment.png"}
          alt={selectedImage?.description || "صورة الشاهد"}
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <p className="text-text-dark text-base md:text-xl lg:text-2xl font-medium text-right mt-4">
        {subsectionTitle}
      </p>

      {/* Navigation Arrows - below title, aligned to left (appears on left in RTL) */}
      {images.length > 1 && (
        <div className="flex items-center justify-start gap-3 mt-3">
          <button
            onClick={handleNext}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.primary }}
            aria-label="التالي"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handlePrev}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.primary }}
            aria-label="السابق"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
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
        </div>
      )}

      {/* Thumbnail Gallery - evenly spaced */}
      {images.length > 1 && (
        <div className="mt-4 md:mt-6">
          <div className="grid grid-cols-5 md:grid-cols-6 gap-3 md:gap-4">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-xl md:rounded-2xl overflow-hidden transition-all ${
                  index === selectedIndex
                    ? "ring-2 ring-offset-2"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{
                  ...(index === selectedIndex && {
                    ["--tw-ring-color" as string]: theme.primary,
                  }),
                }}
              >
                <Image
                  src={image.publicUrl || "/images/profiles/achievment.png"}
                  alt={image.description || `صورة ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mock data for testing UI - TODO: Remove in production
const MOCK_SECTIONS: ProfileSection[] = [
  {
    id: 1,
    title: "أداء الواجبات الوظيفية",
    weightPercent: 10,
    displayOrder: 1,
    subsections: [
      {
        id: 101,
        title: "إعداد المعلم للإختبارات الخاصة بالترم الأول",
        weightPercent: 5,
        displayOrder: 1,
        images: [
          { id: 1, imagePath: null, publicUrl: null, description: "إعداد ومتابعة الدروس والإختبارات", displayOrder: 1 },
          { id: 2, imagePath: null, publicUrl: null, description: "متابعة الطلاب", displayOrder: 2 },
          { id: 3, imagePath: null, publicUrl: null, description: "تقييم الأداء", displayOrder: 3 },
          { id: 4, imagePath: null, publicUrl: null, description: "إعداد التقارير", displayOrder: 4 },
          { id: 5, imagePath: null, publicUrl: null, description: "المشاركة في الأنشطة", displayOrder: 5 },
          { id: 6, imagePath: null, publicUrl: null, description: "التطوير المهني", displayOrder: 6 },
        ],
      },
      {
        id: 102,
        title: "متابعة أداء الطلاب",
        weightPercent: 5,
        displayOrder: 2,
        images: [
          { id: 7, imagePath: null, publicUrl: null, description: "إعداد ومتابعة الدروس والإختبارات", displayOrder: 1 },
          { id: 8, imagePath: null, publicUrl: null, description: "تقييم الطلاب", displayOrder: 2 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "فعاليات يوم الطالب",
    weightPercent: 20,
    displayOrder: 2,
    subsections: [
      {
        id: 201,
        title: "أنشطة فكرية ليوم الطالب",
        weightPercent: 10,
        displayOrder: 1,
        images: [
          { id: 9, imagePath: null, publicUrl: null, description: "فعاليات يوم الطالب", displayOrder: 1 },
          { id: 10, imagePath: null, publicUrl: null, description: "المسابقات الثقافية", displayOrder: 2 },
          { id: 11, imagePath: null, publicUrl: null, description: "العروض الطلابية", displayOrder: 3 },
          { id: 12, imagePath: null, publicUrl: null, description: "التكريمات", displayOrder: 4 },
          { id: 13, imagePath: null, publicUrl: null, description: "الأنشطة الرياضية", displayOrder: 5 },
          { id: 14, imagePath: null, publicUrl: null, description: "المعارض", displayOrder: 6 },
        ],
      },
    ],
  },
];

export const AchievementsSection = ({
  sections,
  content,
  theme,
}: AchievementsSectionProps) => {
  // Use mock data for testing if no real sections available
  // TODO: Remove mock data usage in production
  const useMockData = !sections || sections.length === 0 ||
    !sections.some((section) => section.subsections?.some((sub) => sub.images && sub.images.length > 0));

  const sectionsToUse = useMockData ? MOCK_SECTIONS : sections;

  // Filter sections that have at least one subsection with images
  const sectionsWithContent = sectionsToUse!.filter((section) =>
    section.subsections?.some((sub) => sub.images && sub.images.length > 0)
  );

  if (sectionsWithContent.length === 0) return null;

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-start justify-start gap-2 md:gap-3 mb-6 md:mb-8">
        {/* Star Icon */}
        <div className="w-8 h-8 md:w-10 md:h-10 relative shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            style={{ color: theme.primary }}
          >
            <path
              d="M12 2L14.09 8.26L20.7 8.82L15.55 13.14L17.18 19.77L12 16.27L6.82 19.77L8.45 13.14L3.3 8.82L9.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Title and Subtitle */}
        <div className="text-right flex flex-col gap-1 md:gap-2">
          <h2
            className="text-lg md:text-2xl lg:text-[28px] font-semibold"
            style={{ color: theme.primary }}
          >
            {content.title}
          </h2>
          <p className="text-sm md:text-base lg:text-lg font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8 md:space-y-10">
        {sectionsWithContent.map((section) => (
          <div key={section.id}>
            {/* Section Weight Badge */}
            <div className="flex justify-end mb-2">
              <span
                className="text-xs md:text-sm px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {content.weightLabel} {section.weightPercent}%
              </span>
            </div>

            {/* Section Title */}
            <h3
              className="text-base md:text-xl lg:text-2xl font-semibold text-right mb-4 md:mb-6"
              style={{ color: theme.primary }}
            >
              {section.title}
            </h3>

            {/* Subsections */}
            <div className="space-y-8 md:space-y-12">
              {section.subsections
                ?.filter((sub) => sub.images && sub.images.length > 0)
                .map((subsection) => (
                  <SubsectionGallery
                    key={subsection.id}
                    images={subsection.images || []}
                    subsectionTitle={subsection.title}
                    attachmentLabel={content.attachmentLabel}
                    theme={theme}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
