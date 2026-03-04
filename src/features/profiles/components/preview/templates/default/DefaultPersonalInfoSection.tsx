"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";
import {
  gregorianISOToGregorianDisplay,
  gregorianISOToHijriDisplay,
} from "@/shared/lib/hijri-utils";

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

export const DefaultPersonalInfoSection = ({
  personalInfo,
  content,
  theme,
}: DefaultPersonalInfoSectionProps) => {
  // Format birth date with both Gregorian and Hijri (returns object for two-line display)
  const formatDate = (
    dateString: string | null,
  ): { gregorian: string; hijri: string } | null => {
    if (!dateString) return null;
    try {
      const iso = dateString.split("T")[0];
      return {
        gregorian: gregorianISOToGregorianDisplay(iso),
        hijri: gregorianISOToHijriDisplay(iso),
      };
    } catch {
      return null;
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

  const birthDateFormatted = formatDate(personalInfo?.birthDate ?? null);

  // Card data configuration
  // patternSide: "start" means pattern renders first in flex (right in RTL), "end" means last (left in RTL)
  const cards = [
    {
      id: "birthday",
      label: content.birthday,
      value: birthDateFormatted
        ? `${birthDateFormatted.gregorian}\n${birthDateFormatted.hijri}`
        : null,
      valueLines: birthDateFormatted
        ? [birthDateFormatted.gregorian, birthDateFormatted.hijri]
        : null,
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
      contentAlign: "right" as const, // Title and value aligned right
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
    <div className="relative py-6 overflow-hidden">
      {/* Zig-zag background pattern - full screen width */}
      <div
        className="absolute inset-0 pointer-events-none bg-repeat-y bg-center opacity-80"
        style={{
          backgroundImage: "url('/images/profiles/default/zig-zag.svg')",
          backgroundSize: "100% auto",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-30vw",
          marginBottom: "-25vw",
          width: "52vw",
          // transform: "scaleX(-1)",
        }}
      />

      {/* Content wrapper with padding */}
      <div className="relative px-4">
        {/* Section Header */}
        <div className="flex items-center justify-start gap-2 md:gap-3 mb-6 md:mb-10 relative">
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
                    className={`flex-1 min-w-0 flex flex-col justify-center py-5 lg:py-6 px-4 lg:px-6 ${
                      (card as { contentAlign?: "right" | "left" })
                        .contentAlign === "right"
                        ? "text-right"
                        : (card as { contentAlign?: "right" | "left" })
                              .contentAlign === "left"
                          ? "text-left"
                          : card.position === "right"
                            ? "text-right"
                            : "text-left"
                    }`}
                  >
                    <h3 className="text-white text-base lg:text-lg font-semibold mb-1 lg:mb-2">
                      {card.label}
                    </h3>
                    {(card as { valueLines?: string[] | null }).valueLines ? (
                      <div className="text-white/90 text-sm lg:text-base font-light">
                        {(card as { valueLines: string[] }).valueLines.map(
                          (line, i) => (
                            <p key={i}>{line}</p>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-white/90 text-sm lg:text-base font-light wrap-break-word">
                        {card.value}
                      </p>
                    )}
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
                    className={`flex-1 min-w-0 flex flex-col justify-center py-4 px-4 ${
                      (card as { contentAlign?: "right" | "left" })
                        .contentAlign === "right"
                        ? "text-right"
                        : (card as { contentAlign?: "right" | "left" })
                              .contentAlign === "left"
                          ? "text-left"
                          : card.position === "right"
                            ? "text-right"
                            : "text-left"
                    }`}
                  >
                    <h3 className="text-white text-sm font-semibold mb-1">
                      {card.label}
                    </h3>
                    <p className="text-white/90 text-xs font-light break-words">
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
    </div>
  );
};
