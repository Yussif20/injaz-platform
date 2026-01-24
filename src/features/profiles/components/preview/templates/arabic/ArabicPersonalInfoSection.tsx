"use client";

import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";

interface ArabicPersonalInfoSectionProps {
  personalInfo: PersonalInfo | null;
  content: {
    title: string;
    subtitle: string;
    birthday: string;
    email: string;
    nationalId: string;
    origin: string;
  };
  theme: ThemeColors;
}

// Card color configurations
const CARD_COLORS = {
  dark: {
    bg: "#543A31",
    text: "#FFFFFF",
    icon: "#D8CEC6",
  },
  light: {
    bg: "#D8CEC6",
    text: "#543A31",
    icon: "#543A31",
  },
};

export const ArabicPersonalInfoSection = ({
  personalInfo,
  content,
  theme,
}: ArabicPersonalInfoSectionProps) => {
  if (!personalInfo) return null;

  // Format date to Arabic format (e.g., "5/8/1988")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div
        className="flex items-start justify-start gap-2 md:gap-3 mb-4 md:mb-8 border-r-2 pr-3 md:pr-6"
        style={{ borderColor: theme.primary }}
      >
        <div className="text-right flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Info Cards Grid - 2 rows, equal height */}
      <div className="flex flex-col gap-3 md:gap-5">
        {/* Row 1: ID (2/3 right) + Birthday (1/3 left) */}
        <div className="flex gap-3 md:gap-5 h-24 md:h-32 lg:h-36">
          {/* ID Card - 2/3 width, dark bg */}
          <div
            className="flex-2 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.dark.bg }}
          >
            <div className="pr-4 flex-3/5 text-right">
              <p
                className=" text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_COLORS.dark.text }}
              >
                {content.nationalId}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_COLORS.dark.text, opacity: 0.9 }}
              >
                {personalInfo.nationalId || "—"}
              </p>
            </div>
            <div className="shrink-0 flex-2/5 bg-[url('/images/profiles/arabic/personal-info-pattern-large-light.svg')] bg-cover bg-center w-full h-full"></div>
          </div>

          {/* Birthday Card - 1/3 width, light bg */}
          <div
            className="flex-1 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-1/3 bg-[url('/images/profiles/arabic/personal-info-pattern-small.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="flex-2/3 text-right pr-4">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_COLORS.light.text }}
              >
                {content.birthday}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_COLORS.light.text, opacity: 0.9 }}
              >
                {formatDate(personalInfo.birthDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Place (1/3 right) + Email (2/3 left) */}
        <div className="flex gap-3 md:gap-5 h-24 md:h-32 lg:h-36">
          {/* Place Card - 1/3 width, dark bg */}
          <div
            className="flex-1 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.dark.bg }}
          >
            <div className="flex-2/3 text-right pr-4">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_COLORS.dark.text }}
              >
                {content.origin}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_COLORS.dark.text, opacity: 0.9 }}
              >
                {personalInfo.address || "—"}
              </p>
            </div>
            <div className="shrink-0 flex-1/3 bg-[url('/images/profiles/arabic/personal-info-pattern-small-light.svg')] bg-cover bg-center w-full h-full"></div>
          </div>

          {/* Email Card - 2/3 width, light bg */}
          <div
            className="flex-2 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-2/5 bg-[url('/images/profiles/arabic/personal-info-pattern-large.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="flex-3/5 text-right pr-4">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_COLORS.light.text }}
              >
                {content.email}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light break-all"
                style={{ color: CARD_COLORS.light.text, opacity: 0.9 }}
              >
                {personalInfo.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
