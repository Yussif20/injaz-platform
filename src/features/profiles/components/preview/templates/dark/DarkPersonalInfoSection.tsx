"use client";

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

  // Format date to Arabic format (e.g., "5/8/1988")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const cards = [
    {
      id: "nationalId",
      label: content.nationalId,
      value: personalInfo.nationalId || "—",
    },
    {
      id: "birthday",
      label: content.birthday,
      value: formatDate(personalInfo.birthDate),
    },
    {
      id: "origin",
      label: content.origin,
      value: personalInfo.address || "—",
    },
    {
      id: "email",
      label: content.email,
      value: personalInfo.email || "—",
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
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-white">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-gray-400">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Info Cards Grid - 1 card per row on sm/md, 2 per row on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex h-23 md:h-40.5 flex-col gap-2 md:gap-3 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl bg-[url('/images/profiles/dark/card-bg.svg')] bg-cover bg-center"
          >
            <p className="text-white text-sm md:text-xl lg:text-2xl font-normal">
              {card.label}
            </p>
            <p className="text-gray-300 text-xs md:text-lg lg:text-xl font-light break-all">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
