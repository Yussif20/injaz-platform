"use client";

import type { ThemeColors } from "../../../types/theme.types";
import type { ProfileSection } from "../../../types/profile.types";
import { SubsectionGallery } from "./SubsectionGallery";

interface AchievementsContentProps {
  sections: ProfileSection[] | null;
  content: {
    title: string;
    subtitle: string;
    weightLabel: string;
    attachmentLabel?: string;
  };
  theme: ThemeColors;
}

// Mock data for development
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
          {
            id: 1,
            imagePath: null,
            publicUrl: null,
            description: "إعداد ومتابعة الدروس والإختبارات",
            displayOrder: 1,
          },
          {
            id: 2,
            imagePath: null,
            publicUrl: null,
            description: "متابعة الطلاب",
            displayOrder: 2,
          },
          {
            id: 3,
            imagePath: null,
            publicUrl: null,
            description: "تقييم الأداء",
            displayOrder: 3,
          },
          {
            id: 4,
            imagePath: null,
            publicUrl: null,
            description: "إعداد التقارير",
            displayOrder: 4,
          },
          {
            id: 5,
            imagePath: null,
            publicUrl: null,
            description: "المشاركة في الأنشطة",
            displayOrder: 5,
          },
          {
            id: 6,
            imagePath: null,
            publicUrl: null,
            description: "المعارض",
            displayOrder: 6,
          },
        ],
      },
    ],
  },
];

export const AchievementsContent = ({
  sections,
  content,
  theme,
}: AchievementsContentProps) => {
  // Use mock data for testing if no real sections available
  // TODO: Remove mock data usage in production
  const useMockData =
    !sections ||
    sections.length === 0 ||
    !sections.some((section) =>
      section.subsections?.some((sub) => sub.images && sub.images.length > 0),
    );

  const sectionsToUse = useMockData ? MOCK_SECTIONS : sections;

  // Filter sections that have at least one subsection with images
  const sectionsWithContent = sectionsToUse!.filter((section) =>
    section.subsections?.some((sub) => sub.images && sub.images.length > 0),
  );

  if (sectionsWithContent.length === 0) return null;

  const themeBgMap: Record<string, { outer: string; inner: string }> = {
    "#008387": { outer: "#F2F2F2", inner: "#FFFFFF" }, // default
    "#6b2a3d": { outer: "#EBE9E4", inner: "#FFFFFF" }, // heritage
    "#5c4033": { outer: "#EBE9E4", inner: "#FFFFFF" }, // arabic
    "#12263a": { outer: "#1B1F2B", inner: "#161A24" }, // dark
  };

  const weightColorMap: Record<string, string> = {
    "#008387": "#008387", // default
    "#6b2a3d": "#51161D", // heritage
    "#5c4033": "#543A31", // arabic
    "#12263a": "#BABABA", // dark
  };

  const titleColorMap: Record<string, string> = {
    "#008387": "#333333", // default
    "#6b2a3d": "#333333", // heritage
    "#5c4033": "#333333", // arabic
    "#12263a": "#F8F8F8", // dark
  };

  const { outer, inner } = themeBgMap[theme.primary] || {
    outer: theme.cardBg || theme.background || "#F2F2F2",
    inner: theme.cardBg || "#FFFFFF",
  };

  const weightColor = weightColorMap[theme.primary] || "#008387";
  const titleColor = titleColorMap[theme.primary] || "#333333";

  return (
    <div
      className="rounded-[36px] px-14 py-13 space-y-8 md:space-y-10"
      style={{ backgroundColor: outer }}
    >
      {sectionsWithContent.map((section) => (
        <div key={section.id}>
          {/* Section Weight Badge */}
          <div
            className="flex justify-start mb-2 text-xs font-light md:text-xl lg:text-2xl"
            style={{ color: weightColor }}
          >
            {content.weightLabel} {section.weightPercent}%
          </div>

          {/* Section Title */}
          <h3
            className="text-sm font-light md:text-2xl md:font-normal lg:text-[28px] text-right mb-4 md:mb-6"
            style={{ color: titleColor }}
          >
            {section.title}
          </h3>

          {/* Subsections */}
          <div
            className="rounded-[36px] px-14 py-13 space-y-8 md:space-y-12"
            style={{ backgroundColor: inner }}
          >
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
  );
};
