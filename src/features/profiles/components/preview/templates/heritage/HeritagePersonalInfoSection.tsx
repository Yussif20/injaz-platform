"use client";

import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";

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

// Decorative floral icon component
const FloralIcon = ({
  className,
  color,
}: {
  className?: string;
  color: string;
}) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ color }}
  >
    {/* Center cross petals */}
    <path
      d="M40 20L45 35H55L47 43L50 58L40 50L30 58L33 43L25 35H35L40 20Z"
      fill="currentColor"
      opacity="0.8"
    />
    {/* Top diamond */}
    <path d="M40 5L45 15L40 25L35 15L40 5Z" fill="currentColor" opacity="0.6" />
    {/* Bottom diamond */}
    <path
      d="M40 55L45 65L40 75L35 65L40 55Z"
      fill="currentColor"
      opacity="0.6"
    />
    {/* Left diamond */}
    <path d="M5 40L15 35L25 40L15 45L5 40Z" fill="currentColor" opacity="0.6" />
    {/* Right diamond */}
    <path
      d="M55 40L65 35L75 40L65 45L55 40Z"
      fill="currentColor"
      opacity="0.6"
    />
    {/* Corner dots */}
    <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
    <circle cx="60" cy="20" r="3" fill="currentColor" opacity="0.4" />
    <circle cx="20" cy="60" r="3" fill="currentColor" opacity="0.4" />
    <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.4" />
  </svg>
);

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
  theme,
}: HeritagePersonalInfoSectionProps) => {
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
      <div className="h-[200px] md:h-[500px] flex gap-3 md:gap-5 lg:gap-6">
        {/* Right Column (2/3 width): Place (40%) + Email (60%) */}
        <div className="flex-[2] flex flex-col gap-3 md:gap-5 lg:gap-6">
          {/* Place/Origin Card - 40% height */}
          <div
            className="flex-[40] flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.origin.bg }}
          >
            <div className="flex-1 text-right">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.origin.text }}
              >
                {content.origin}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_STYLES.origin.text, opacity: 0.9 }}
              >
                {personalInfo.address || "—"}
              </p>
            </div>
            <div className="shrink-0">
              <FloralIcon
                className="w-10 h-10 md:w-16 md:h-16"
                color={CARD_STYLES.origin.icon}
              />
            </div>
          </div>

          {/* Email Card - 60% height */}
          <div
            className="flex-[60] flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.email.bg }}
          >
            <div className="flex-1 text-right">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.email.text }}
              >
                {content.email}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light break-all"
                style={{ color: CARD_STYLES.email.text, opacity: 0.9 }}
              >
                {personalInfo.email || "—"}
              </p>
            </div>
            <div className="shrink-0">
              <FloralIcon
                className="w-10 h-10 md:w-16 md:h-16"
                color={CARD_STYLES.email.icon}
              />
            </div>
          </div>
        </div>

        {/* Left Column (1/3 width): ID (60%) + Birthday (40%) */}
        <div className="flex-1 flex flex-col gap-3 md:gap-5 lg:gap-6">
          {/* National ID Card - 60% height */}
          <div
            className="flex-[60] flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.nationalId.bg }}
          >
            <div className="flex-1 text-right">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.nationalId.text }}
              >
                {content.nationalId}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_STYLES.nationalId.text, opacity: 0.9 }}
              >
                {personalInfo.nationalId || "—"}
              </p>
            </div>
            <div className="shrink-0">
              <FloralIcon
                className="w-10 h-10 md:w-16 md:h-16"
                color={CARD_STYLES.nationalId.icon}
              />
            </div>
          </div>

          {/* Birthday Card - 40% height */}
          <div
            className="flex-[40] flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ backgroundColor: CARD_STYLES.birthday.bg }}
          >
            <div className="flex-1 text-right">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: CARD_STYLES.birthday.text }}
              >
                {content.birthday}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: CARD_STYLES.birthday.text, opacity: 0.9 }}
              >
                {formatDate(personalInfo.birthDate)}
              </p>
            </div>
            <div className="shrink-0">
              <FloralIcon
                className="w-10 h-10 md:w-16 md:h-16"
                color={CARD_STYLES.birthday.icon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
