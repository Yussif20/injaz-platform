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

// Decorative floral icon component
const FloralIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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

// Card color configurations
const CARD_COLORS = {
  nationalId: {
    bg: "#6B3A3A",
    text: "#FFFFFF",
    icon: "#C9A89A",
  },
  origin: {
    bg: "#E8E4DF",
    text: "#4A4A4A",
    icon: "#6B3A3A",
  },
  birthday: {
    bg: "#8A9A8E",
    text: "#FFFFFF",
    icon: "#6B3A3A",
  },
  email: {
    bg: "#4A5F5F",
    text: "#FFFFFF",
    icon: "#C9A89A",
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

  const infoCards = [
    {
      key: "nationalId",
      label: content.nationalId,
      value: personalInfo.nationalId || "—",
      colors: CARD_COLORS.nationalId,
    },
    {
      key: "origin",
      label: content.origin,
      value: personalInfo.address || "—",
      colors: CARD_COLORS.origin,
    },
    {
      key: "birthday",
      label: content.birthday,
      value: formatDate(personalInfo.birthDate),
      colors: CARD_COLORS.birthday,
    },
    {
      key: "email",
      label: content.email,
      value: personalInfo.email || "—",
      colors: CARD_COLORS.email,
    },
  ];

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

      {/* Info Cards Grid - 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {infoCards.map((card) => (
          <div
            key={card.key}
            className="flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl md:rounded-3xl min-h-[100px] md:min-h-[120px]"
            style={{ backgroundColor: card.colors.bg }}
          >
            {/* Text Content */}
            <div className="flex-1 text-right">
              <p
                className="text-base md:text-xl lg:text-2xl font-normal mb-1 md:mb-2"
                style={{ color: card.colors.text }}
              >
                {card.label}
              </p>
              <p
                className="text-sm md:text-lg lg:text-xl font-light"
                style={{ color: card.colors.text, opacity: 0.9 }}
              >
                {card.value}
              </p>
            </div>

            {/* Decorative Icon */}
            <div className="shrink-0">
              <FloralIcon
                className="w-12 h-12 md:w-16 md:h-16"
                style={{ color: card.colors.icon } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
