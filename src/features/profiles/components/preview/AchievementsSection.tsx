"use client";

import Image from "next/image";
import type { ThemeColors } from "../../types/theme.types";
import type { ProfileSection } from "../../types/profile.types";

interface AchievementsSectionProps {
  sections: ProfileSection[] | null;
  content: {
    title: string;
    subtitle: string;
    weightLabel: string;
  };
  theme: ThemeColors;
}

export const AchievementsSection = ({
  sections,
  content,
  theme,
}: AchievementsSectionProps) => {
  if (!sections || sections.length === 0) return null;

  // Filter sections that have at least one subsection with images
  const sectionsWithContent = sections.filter((section) =>
    section.subsections?.some((sub) => sub.images && sub.images.length > 0),
  );

  if (sectionsWithContent.length === 0) return null;

  return (
    <div className="px-4 py-6">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-1 h-6 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          {content.title}
        </h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm mb-4 mr-3" style={{ color: theme.textMuted }}>
        {content.subtitle}
      </p>

      {/* Sections */}
      <div className="space-y-6">
        {sectionsWithContent.map((section) => (
          <div key={section.id}>
            {/* Section Header */}
            <div
              className="p-4 rounded-t-xl"
              style={{
                backgroundColor: theme.primaryLight,
                borderBottom: `2px solid ${theme.primary}`,
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.primary }}
                >
                  {section.title}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.cardBg,
                    color: theme.primary,
                  }}
                >
                  {content.weightLabel}: {section.weightPercent}%
                </span>
              </div>
            </div>

            {/* Section Content */}
            <div
              className="p-4 rounded-b-xl"
              style={{
                backgroundColor: theme.cardBg,
                borderRight: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
                borderLeft: `1px solid ${theme.border}`,
              }}
            >
              {/* Subsections */}
              {section.subsections
                ?.filter((sub) => sub.images && sub.images.length > 0)
                .map((subsection) => (
                  <div key={subsection.id} className="mb-4 last:mb-0">
                    {/* Subsection Title */}
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: theme.text }}
                    >
                      {subsection.title}
                    </p>

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {subsection.images?.map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden"
                          style={{
                            backgroundColor: theme.border,
                          }}
                        >
                          {image.publicUrl ? (
                            <Image
                              src={image.publicUrl}
                              alt={image.description || "صورة الشاهد"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke={theme.textMuted}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}

                          {/* Image Description Overlay */}
                          {image.description && (
                            <div
                              className="absolute bottom-0 left-0 right-0 p-2 text-xs"
                              style={{
                                backgroundColor: "rgba(0,0,0,0.6)",
                                color: "#ffffff",
                              }}
                            >
                              {image.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
