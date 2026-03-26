"use client";

import type { ThemeColors } from "../../../../types/theme.types";
import type { ProfileSection } from "../../../../types/profile.types";
import { AchievementsContent } from "../AchievementsContent";

interface ArabicAchievementsSectionProps {
  sections: ProfileSection[] | null;
  content: {
    title: string;
    subtitle: string;
    weightLabel: string;
    attachmentLabel?: string;
  };
  theme: ThemeColors;
  isPdf?: boolean;
}

export const ArabicAchievementsSection = ({
  sections,
  content,
  theme,
  isPdf,
}: ArabicAchievementsSectionProps) => {
  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="mb-4 md:mb-8">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark">
              4
            </span>
            <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark">
              {content.title}
            </h2>
          </div>
          <div className="flex-1 h-px bg-[#E7E7E3] ms-4" />
        </div>
        <div className="text-right flex flex-col gap-2 md:gap-4 mt-2 md:mt-3">
          <p className="text-sm md:text-lg lg:text-xl font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Achievements Content */}
      <AchievementsContent
        sections={sections}
        content={content}
        theme={theme}
        imageRadius="15px"
        isPdf={isPdf}
      />
    </div>
  );
};
