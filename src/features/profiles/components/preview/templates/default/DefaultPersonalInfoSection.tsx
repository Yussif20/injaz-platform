"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";

interface DefaultPersonalInfoSectionProps {
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

// Curved dashed line SVG for connecting cards
const ConnectorLine = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M200 0 C 200 40, 380 60, 380 100 S 20 160, 20 200 S 380 260, 380 300 S 200 360, 200 400"
      stroke="#8CBFBF"
      strokeWidth="2.5"
      strokeDasharray="10 8"
      fill="none"
    />
  </svg>
);

// Mobile connector line (vertical flowing)
const MobileConnectorLine = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M50 0 C 80 60, 20 120, 50 180 S 80 240, 50 300 S 20 360, 50 420 S 80 480, 50 540 S 20 580, 50 600"
      stroke="#B8D8D8"
      strokeWidth="2"
      strokeDasharray="6 6"
      fill="none"
    />
  </svg>
);

export const DefaultPersonalInfoSection = ({
  personalInfo,
  content,
  theme,
}: DefaultPersonalInfoSectionProps) => {
  // Format birth date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  // Check if we have any personal info to display
  const hasData =
    personalInfo &&
    (personalInfo.birthDate ||
      personalInfo.email ||
      personalInfo.nationalId ||
      personalInfo.address);

  if (!hasData) return null;

  const birthDate = formatDate(personalInfo?.birthDate ?? null);

  // Card data configuration
  // patternSide: "start" means pattern renders first in flex (right in RTL), "end" means last (left in RTL)
  const cards = [
    {
      id: "birthday",
      label: content.birthday,
      value: birthDate,
      pattern: "/images/profiles/default/birthday-pattern.svg",
      position: "right" as const,
      patternSide: "end" as const, // Pattern on left/inner side
    },
    {
      id: "email",
      label: content.email,
      value: personalInfo?.email,
      pattern: "/images/profiles/default/email-pattern.svg",
      position: "left" as const,
      patternSide: "start" as const, // Pattern on right/inner side
    },
    {
      id: "nationalId",
      label: content.nationalId,
      value: personalInfo?.nationalId,
      pattern: "/images/profiles/default/id-pattern.svg",
      position: "right" as const,
      patternSide: "start" as const, // Pattern on right/outer side
    },
    {
      id: "origin",
      label: content.origin,
      value: personalInfo?.address,
      pattern: "/images/profiles/default/city-pattern.svg",
      position: "left" as const,
      patternSide: "end" as const, // Pattern on left/inner side
    },
  ].filter((card) => card.value); // Only show cards with values

  if (cards.length === 0) return null;

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-start gap-2 md:gap-3 mb-6 md:mb-10">
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

      {/* Cards Container - Desktop with zigzag layout */}
      <div className="hidden md:block relative">
        {/* Connector Line - positioned behind cards */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <ConnectorLine className="w-[70%] lg:w-[65%] max-w-[600px] h-full opacity-80" />
        </div>

        {/* Cards */}
        <div className="relative space-y-6 lg:space-y-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`flex ${
                card.position === "right" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className="w-[320px] lg:w-[380px] rounded-[28px] lg:rounded-[36px] overflow-hidden flex"
                style={{ backgroundColor: theme.primary }}
              >
                {/* Pattern - renders first (right side in RTL) */}
                {card.patternSide === "start" && (
                  <div className="w-20 lg:w-24 shrink-0 relative">
                    <Image
                      src={card.pattern}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex-1 flex flex-col justify-center py-5 lg:py-6 px-4 lg:px-6 ${
                    card.position === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <h3 className="text-white text-base lg:text-lg font-semibold mb-1 lg:mb-2">
                    {card.label}
                  </h3>
                  <p className="text-white/90 text-sm lg:text-base font-light">
                    {card.value}
                  </p>
                </div>

                {/* Pattern - renders last (left side in RTL) */}
                {card.patternSide === "end" && (
                  <div className="w-20 lg:w-24 shrink-0 relative">
                    <Image
                      src={card.pattern}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Container - Mobile/Tablet stacked layout */}
      <div className="md:hidden relative">
        {/* Connector Line - positioned behind cards */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 pointer-events-none">
          <MobileConnectorLine className="w-24 h-full opacity-60" />
        </div>

        {/* Cards */}
        <div className="relative space-y-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className="w-[85%] max-w-[300px] rounded-[24px] overflow-hidden flex"
                style={{ backgroundColor: theme.primary }}
              >
                {/* Pattern - renders first (right side in RTL) */}
                {card.patternSide === "start" && (
                  <div className="w-16 shrink-0 relative">
                    <Image
                      src={card.pattern}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex-1 flex flex-col justify-center py-4 px-4 ${
                    card.position === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <h3 className="text-white text-sm font-semibold mb-1">
                    {card.label}
                  </h3>
                  <p className="text-white/90 text-xs font-light">
                    {card.value}
                  </p>
                </div>

                {/* Pattern - renders last (left side in RTL) */}
                {card.patternSide === "end" && (
                  <div className="w-16 shrink-0 relative">
                    <Image
                      src={card.pattern}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
