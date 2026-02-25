"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { PersonalInfo } from "../../../../types/profile.types";

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

  const cards = [
    {
      id: "nationalId",
      label: content.nationalId,
      value: personalInfo.nationalId || "—",
      icon: "id-card.svg",
    },
    {
      id: "birthday",
      label: content.birthday,
      value: formatDate(personalInfo.birthDate),
      icon: "birthday-card.svg",
    },
    {
      id: "origin",
      label: content.origin,
      value: personalInfo.address || "—",
      icon: "place-card.svg",
    },
    {
      id: "email",
      label: content.email,
      value: personalInfo.email || "—",
      icon: "email-card.svg",
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
            className="relative flex h-23 md:h-40.5 items-center gap-3 md:gap-4 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl bg-[url('/images/profiles/dark/card-bg.svg')] bg-cover bg-center overflow-hidden"
          >
            {/* Radial gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(10, 16, 31, 0) 0%, #161A24 83.33%)",
              }}
            ></div>

            {/* Text Content - Right Side */}
            <div className="flex-1 text-right relative z-10">
              <p className="text-[#F8F8F8] text-sm lg:text-2xl font-medium">
                {card.label}
              </p>
              <p className="text-[#F8F8F8] text-xs md:text-xl break-all font-light">
                {card.value}
              </p>
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
        ))}
      </div>
    </div>
  );
};
