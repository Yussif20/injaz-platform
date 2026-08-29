"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { ProfileSection } from "../../../../types/profile.types";
import { AchievementsContent } from "../AchievementsContent";

interface DefaultAchievementsSectionProps {
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

export const DefaultAchievementsSection = ({
  sections,
  content,
  theme,
  isPdf,
}: DefaultAchievementsSectionProps) => {
  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-start gap-2 md:gap-3 mb-4 md:mb-8">
        {/* Star Icon */}
        <div className="w-8.75 h-8.75 md:w-13.75 md:h-13.75 relative">
          <Image src="/images/profiles/default/star.svg" alt="" fill />
        </div>
        <div className="text-right flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark">
            {content.title}
          </h2>
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
        isPdf={isPdf}
      />
    </div>
  );
};
