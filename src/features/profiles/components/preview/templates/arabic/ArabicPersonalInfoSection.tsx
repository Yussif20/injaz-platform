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

  // Format date (Hijri "HYYYY-MM-DD" or Gregorian)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    if (dateStr.startsWith("H")) {
      const parts = dateStr.slice(1).split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]} هـ`;
      return dateStr;
    }
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

      {/* Info Cards Grid - 3 rows on sm/md, 2 rows on lg */}
      <div className="flex flex-col gap-3 md:gap-5">
        {/* Row 1: ID Card - full width on sm/md, 2/3 on lg */}
        <div className="flex gap-3 md:gap-5 h-24 md:h-32 lg:h-36">
          <div
            className="w-full lg:flex-2 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.dark.bg }}
          >
            <div className="pr-4 flex-3/5 text-right">
              <p className="text-white text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.nationalId}
              </p>
              <p className="text-white text-xs md:text-xl lg:text-2xl">
                {personalInfo.nationalId || "—"}
              </p>
            </div>
            <div className="shrink-0 flex-2/5 bg-[url('/images/profiles/arabic/personal-info-pattern-large-light.svg')] bg-cover bg-center w-full h-full"></div>
          </div>

          {/* Birthday Card - hidden on sm/md, 1/3 on lg */}
          <div
            className="hidden lg:flex flex-1 items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-1/3 bg-[url('/images/profiles/arabic/personal-info-pattern-small.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="text-[#543A31] flex-2/3 text-right pr-4">
              <p className=" text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.birthday}
              </p>
              <p className=" text-xs md:text-xl lg:text-2xl">
                {formatDate(personalInfo.birthDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Place (1/2 on sm/md) + Birthday (1/2 on sm/md, hidden on lg) | Place (1/3 on lg) + Email (2/3 on lg, hidden on sm/md) */}
        <div className="flex gap-3 md:gap-5 h-24 md:h-32 lg:h-36">
          {/* Place Card - 1/2 width on sm/md, 1/3 on lg */}
          <div
            className="flex-1 lg:flex-1 flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.dark.bg }}
          >
            <div className="flex-2/3 text-right pr-4">
              <p className="text-white text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.origin}
              </p>
              <p className="text-white text-xs md:text-xl lg:text-2xl">
                {personalInfo.address || "—"}
              </p>
            </div>
            <div className="shrink-0 flex-1/3 bg-[url('/images/profiles/arabic/personal-info-pattern-small-light.svg')] bg-cover bg-center w-full h-full"></div>
          </div>

          {/* Birthday Card - 1/2 width on sm/md, hidden on lg */}
          <div
            className="flex-1 lg:hidden flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-1/3 bg-[url('/images/profiles/arabic/personal-info-pattern-small.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="text-[#543A31] flex-2/3 text-right pr-4">
              <p className=" text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.birthday}
              </p>
              <p className=" text-xs md:text-xl lg:text-2xl">
                {formatDate(personalInfo.birthDate)}
              </p>
            </div>
          </div>

          {/* Email Card - hidden on sm/md, 2/3 on lg */}
          <div
            className="hidden lg:flex flex-2 items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-2/5 bg-[url('/images/profiles/arabic/personal-info-pattern-large.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="flex-3/5 text-right pr-4 text-[#543A31]">
              <p className="text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.email}
              </p>
              <p className="text-xs md:text-xl lg:text-2xl">
                {personalInfo.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Email Card - full width on sm/md, hidden on lg */}
        <div className="flex gap-3 md:gap-5 h-24 md:h-32 lg:hidden">
          <div
            className="w-full flex items-center justify-between rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_COLORS.light.bg }}
          >
            <div className="shrink-0 flex-2/5 bg-[url('/images/profiles/arabic/personal-info-pattern-large.svg')] bg-cover bg-center w-full h-full"></div>
            <div className="flex-3/5 text-right pr-4 text-[#543A31]">
              <p className="text-sm md:text-2xl lg:text-[28px] mb-1 md:mb-2">
                {content.email}
              </p>
              <p className="text-xs md:text-xl lg:text-2xl">
                {personalInfo.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
