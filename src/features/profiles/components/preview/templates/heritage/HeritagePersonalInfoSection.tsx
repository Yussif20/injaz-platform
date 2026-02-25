"use client";

import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";
import Image from "next/image";

interface HeritagePersonalInfoSectionProps {
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

// Card color configurations with heritage colors
const CARD_STYLES = {
  origin: {
    bg: "#EBE9E4",
    text: "#4A4A4A",
    icon: "#602726",
  },
  nationalId: {
    bg: "#602726",
    text: "#FFFFFF",
    icon: "#C9A89A",
  },
  email: {
    bg: "#828A7D",
    text: "#FFFFFF",
    icon: "#602726",
  },
  birthday: {
    bg: "#B2BAAF",
    text: "#4A4A4A",
    icon: "#602726",
  },
};

export const HeritagePersonalInfoSection = ({
  personalInfo,
  content,
}: HeritagePersonalInfoSectionProps) => {
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
      <div className="flex items-start justify-start gap-2 md:gap-3 mb-4 md:mb-8 border-r-2 border-[#602726] pr-3 md:pr-6">
        <div className="text-right flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Info Cards Grid - Custom Layout */}
      {/* RTL: first column = right (2/3), second column = left (1/3) */}
      <div className="h-55 md:h-125 flex gap-3 md:gap-5 lg:gap-6">
        {/* Right Column (2/3 width): Place (40%) + Email (60%) */}
        <div className="flex-2 flex flex-col gap-3 md:gap-5 lg:gap-6">
          {/* Place/Origin Card - 40% height */}
          <div
            className="flex-40 flex flex-col lg:flex-row gap-2 md:gap-5 lg:gap-9 items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.origin.bg }}
          >
            <div className="shrink-0 relative w-10 md:w-25 lg:w-31 h-6 md:h-14 lg:h-18">
              <Image
                src="/images/profiles/heritage/pattern-place.svg"
                alt="diamond pattern"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center lg:text-right">
              <p
                className="text-sm md:text-2xl lg:text-[28px] font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.origin.text }}
              >
                {content.origin}
              </p>
              <p
                className="text-xs md:text-xl lg:text-2xl font-light"
                style={{ color: CARD_STYLES.origin.text, opacity: 0.9 }}
              >
                {personalInfo.address || "—"}
              </p>
            </div>
          </div>

          {/* Email Card - 60% height */}
          <div
            className="flex-60 flex flex-col lg:flex-row gap-2 md:gap-5 lg:gap-9 items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.email.bg }}
          >
            <div className="shrink-0 relative w-10 md:w-25 lg:w-31 h-6 md:h-14 lg:h-18">
              <Image
                src="/images/profiles/heritage/pattern-email.svg"
                alt="diamond pattern"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center lg:text-right">
              <p
                className="text-sm md:text-2xl lg:text-[28px] font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.email.text }}
              >
                {content.email}
              </p>
              <p
                className="text-xs md:text-xl lg:text-2xl font-light break-all"
                style={{ color: CARD_STYLES.email.text, opacity: 0.9 }}
              >
                {personalInfo.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Left Column (1/3 width): ID (60%) + Birthday (40%) */}
        <div className="flex-1 flex flex-col gap-3 md:gap-5 lg:gap-6">
          {/* National ID Card - 60% height */}
          <div
            className="flex-60 flex flex-col lg:flex-row gap-2 md:gap-5 lg:gap-9 items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.nationalId.bg }}
          >
            <div className="shrink-0 relative w-10 md:w-25 lg:w-31 h-6 md:h-14 lg:h-18">
              <Image
                src="/images/profiles/heritage/pattern-light.svg"
                alt="diamond pattern"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center lg:text-right">
              <p
                className="text-sm md:text-2xl lg:text-[28px] font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.nationalId.text }}
              >
                {content.nationalId}
              </p>
              <p
                className="text-xs md:text-xl lg:text-2xl font-light"
                style={{ color: CARD_STYLES.nationalId.text, opacity: 0.9 }}
              >
                {personalInfo.nationalId || "—"}
              </p>
            </div>
          </div>

          {/* Birthday Card - 40% height */}
          <div
            className="flex-40 flex flex-col lg:flex-row gap-2 md:gap-5 lg:gap-9 items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.birthday.bg }}
          >
            <div className="shrink-0 relative w-10 md:w-25 lg:w-31 h-6 md:h-14 lg:h-18">
              <Image
                src="/images/profiles/heritage/pattern-dark.svg"
                alt="diamond pattern"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center lg:text-right">
              <p
                className="text-sm md:text-2xl lg:text-[28px] font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.birthday.text }}
              >
                {content.birthday}
              </p>
              <p
                className="text-xs md:text-xl lg:text-2xl font-light"
                style={{ color: CARD_STYLES.birthday.text, opacity: 0.9 }}
              >
                {formatDate(personalInfo.birthDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
