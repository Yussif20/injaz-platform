"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";
import {
  gregorianISOToGregorianDisplay,
  gregorianISOToHijriDisplay,
} from "@/shared/lib/hijri-utils";

interface DarkPersonalInfoSectionProps {
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

export const DarkPersonalInfoSection = ({
  personalInfo,
  content,
  theme,
}: DarkPersonalInfoSectionProps) => {
  if (!personalInfo) return null;

  // Format date with both Gregorian and Hijri (returns object for two-line display)
  const formatDate = (
    dateStr: string,
  ): { gregorian: string; hijri: string } | null => {
    if (!dateStr) return null;
    const iso = dateStr.split("T")[0];
    return {
      gregorian: gregorianISOToGregorianDisplay(iso),
      hijri: gregorianISOToHijriDisplay(iso),
    };
  };

  const cards = [
    {
      id: "origin",
      label: content.origin,
      value: personalInfo.address || "—",
      icon: "place-card.svg",
    },
    {
      id: "nationalId",
      label: content.nationalId,
      value: personalInfo.nationalId || "—",
      icon: "id-card.svg",
    },
    {
      id: "email",
      label: content.email,
      value: personalInfo.email || "—",
      icon: "email-card.svg",
    },
    {
      id: "birthday",
      label: content.birthday,
      value: formatDate(personalInfo.birthDate),
      icon: "birthday-card.svg",
      isDateField: true,
    },
  ];

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div
        className="flex items-start justify-center gap-2 md:gap-3 mb-4 md:mb-8 border-r-2 pr-3 md:pr-6"
        style={{ borderColor: theme.primary }}
      >
        <div className="text-center flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-[#F8F8F8]">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-[#BABABA]">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Info Cards Grid - 1 card per row on sm/md, 2 per row on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative flex h-23 md:h-40.5 items-center gap-3 md:gap-4 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl overflow-hidden border-2"
            style={{
              backgroundImage: "url('/images/profiles/dark/bg-card.svg')",
              backgroundColor: "#1B1F2B",
              borderColor: "#2A2E3A",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scaleX(-1)",
            }}
          >
            {/* Inner wrapper to reverse the flip so content reads normally */}
            <div className="flex items-center gap-3 md:gap-4 w-full" style={{ transform: "scaleX(-1)" }}>
              {/* Text Content - Right Side */}
              <div className="flex-1 text-right relative z-10 flex flex-col" style={{ gap: "14px" }}>
                <p className="text-[#F8F8F8] text-sm lg:text-2xl font-medium">
                  {card.label}
                </p>
                {(card as { isDateField?: boolean }).isDateField && card.value ? (
                  <div className="text-[#F8F8F8] text-xs md:text-xl font-light">
                    <p>
                      {
                        (card.value as { gregorian: string; hijri: string })
                          .gregorian
                      }
                    </p>
                    <p>
                      {(card.value as { gregorian: string; hijri: string }).hijri}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#F8F8F8] text-xs md:text-xl break-all font-light">
                    {card.value as string}
                  </p>
                )}
              </div>

              {/* Card Image - Left Side */}
              <div className="w-18 h-16 md:w-34.5 md:h-28.5 lg:w-32 lg:h-32 shrink-0 relative z-10">
                <Image
                  src={`/images/profiles/dark/${card.icon}`}
                  alt={card.label}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
