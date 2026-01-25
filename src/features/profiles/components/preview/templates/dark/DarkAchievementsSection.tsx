"use client";

import type { ThemeColors } from "../../../../types/theme.types";
import type { ProfileSection } from "../../../../types/profile.types";
import { AchievementsContent } from "../AchievementsContent";

interface DarkAchievementsSectionProps {
  sections: ProfileSection[] | null;
  content: {
    title: string;
    subtitle: string;
    weightLabel: string;
    attachmentLabel?: string;
  };
  theme: ThemeColors;
}

export const DarkAchievementsSection = ({
  sections,
  content,
  theme,
}: DarkAchievementsSectionProps) => {
  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-start justify-center gap-2 md:gap-3 mb-4 md:mb-8 pr-3 md:pr-6">
        <div className="text-center flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-[#F8F8F8]">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-[#BABABA]">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Achievements Content */}
      <AchievementsContent
        sections={sections}
        content={content}
        theme={theme}
      />
    </div>
  );
};
