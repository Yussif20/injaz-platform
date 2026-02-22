"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { Qualification } from "../../../../types/profile.types";

interface DarkEducationSectionProps {
  qualifications: Qualification[] | null;
  content: {
    title: string;
    subtitle: string;
  };
  theme: ThemeColors;
}

export const DarkEducationSection = ({
  qualifications,
  content,
}: DarkEducationSectionProps) => {
  if (!qualifications || qualifications.length === 0) return null;

  // Format graduation date to year only
  const formatYear = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-start justify-center gap-2 md:gap-3 mb-4 md:mb-8">
        <div className="text-center flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-[#F8F8F8]">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-[#BABABA]">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Education Cards */}
      <div
        className="space-y-2 md:space-y-7 rounded-[38px] border-2"
        style={{
          backgroundImage: "url('/images/profiles/dark/bg-card.svg')",
          backgroundColor: "#1B1F2B",
          borderColor: "#2A2E3A",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full rounded-t-[38px] py-4 bg-[linear-gradient(90deg,#091940_0%,#39539A_54.7%,#CBD9FF_109.4%)] flex items-center justify-center">
          <div className="h-8.75 md:h-14.5 lg:h-16.25 w-20 md:w-32 lg:w-40 relative">
            <Image
              src="/images/profiles/dark/education.svg"
              alt="education"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {qualifications.map((qual) => (
          <div
            key={qual.id}
            className="rounded-[36px] overflow-hidden flex relative"
          >
            {/* Content */}
            <div className="flex-1 flex items-stretch justify-start py-4 px-4 gap-2 md:gap-6">
              <div className="shrink-0 border-l border-[#88A3EC] md:border-l-2" />

              {/* Text Content */}
              <div className="text-right flex flex-col gap-2 md:gap-4.5 pr-2">
                <h3 className="text-[#F8F8F8] text-[14px] md:text-[24px] lg:text-[28px] font-normal">
                  {qual.degreeType} {qual.title}
                </h3>
                <p className="text-[#BABABA] text-[12px] md:text-[20px] lg:text-[24px] font-light md:font-normal">
                  {qual.institution || qual.grade || "—"}
                </p>
                <p className="text-[#BABABA] text-[12px] md:text-[20px] lg:text-[24px] font-light md:font-normal">
                  {formatYear(qual.graduationDate)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
