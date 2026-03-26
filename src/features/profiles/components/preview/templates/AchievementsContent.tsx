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
  imageRadius?: string;
  isPdf?: boolean;
}

export const AchievementsContent = ({
  sections,
  content,
  theme,
  imageRadius,
  isPdf = false,
}: AchievementsContentProps) => {
  if (!sections || sections.length === 0) return null;

  // Filter sections that have at least one subsection with images
  const sectionsWithContent = sections.filter((section) =>
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

  // Chunk an array into groups of `size`
  function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  return (
    <div
      className="rounded-[36px] px-14 py-13 space-y-8 md:space-y-10"
      style={{ backgroundColor: outer }}
    >
      {sectionsWithContent.map((section, sectionIndex) => {
        const filteredSubs = section.subsections?.filter(
          (sub) => sub.images && sub.images.length > 0,
        ) ?? [];

        // First subsection alone on a page (with section title), then 2 per page
        const firstSub = filteredSubs[0];
        const remainingSubs = filteredSubs.slice(1);
        const remainingChunks = chunk(remainingSubs, 2);

        return (
          <div key={section.id}>
            {/* First page: section title + first subsection */}
            <div
              style={
                sectionIndex > 0
                  ? { breakBefore: "page" as const, paddingTop: "40px" }
                  : undefined
              }
            >
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

              {firstSub && (
                <div
                  className="rounded-[36px] px-14 py-13 space-y-8 md:space-y-12"
                  style={{ backgroundColor: inner }}
                >
                  <SubsectionGallery
                    key={firstSub.id}
                    images={firstSub.images || []}
                    subsectionTitle={firstSub.title}
                    attachmentLabel={content.attachmentLabel}
                    theme={theme}
                    imageRadius={imageRadius}
                    isPdf={isPdf}
                  />
                </div>
              )}
            </div>

            {/* Remaining subsections: 2 per page */}
            {remainingChunks.map((subsChunk, chunkIndex) => (
              <div
                key={`chunk-${chunkIndex}`}
                style={{ breakBefore: "page" as const, paddingTop: "40px" }}
              >
                <div
                  className="rounded-[36px] px-14 py-13 space-y-8 md:space-y-12"
                  style={{ backgroundColor: inner }}
                >
                  {subsChunk.map((subsection) => (
                    <SubsectionGallery
                      key={subsection.id}
                      images={subsection.images || []}
                      subsectionTitle={subsection.title}
                      attachmentLabel={content.attachmentLabel}
                      theme={theme}
                      imageRadius={imageRadius}
                      isPdf={isPdf}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
