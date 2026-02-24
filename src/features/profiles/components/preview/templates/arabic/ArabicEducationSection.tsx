"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { Qualification } from "../../../../types/profile.types";

interface ArabicEducationSectionProps {
  qualifications: Qualification[] | null;
  content: {
    title: string;
    subtitle: string;
  };
  theme: ThemeColors;
}

export const ArabicEducationSection = ({
  qualifications,
  content,
  theme,
}: ArabicEducationSectionProps) => {
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
      <div
        className="flex items-start justify-start gap-2 md:gap-3 mb-4 md:mb-8 border-r-2 pr-3 md:pr-6"
        style={{ borderColor: theme.primary }}
      >
        <div className="text-right flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normal text-text-dark flex items-center gap-2 justify-start">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Education Cards with end strip */}
      <div className="flex items-stretch gap-0 bg-white rounded-[38px] border-2 overflow-hidden">
        <div className="flex-1 space-y-2 md:space-y-7">
          {qualifications.map((qual) => (
            <div key={qual.id} className="rounded-[36px] overflow-hidden">
              <div className="flex items-stretch">
                {/* Content */}
                <div className="flex-1 flex items-stretch justify-start py-4 px-4 gap-1 md:gap-6">
                  <div className="w-1 md:w-2 shrink-0 relative scale-x-[-1]">
                    <Image
                      src="/images/profiles/arabic/diamond-pattern.svg"
                      alt="diamond pattern"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="text-right flex flex-col gap-1 md:gap-4.5">
                    <h3 className="text-text-dark text-sm md:text-2xl lg:text-[28px] font-normal">
                      {qual.degreeType} {qual.major ?? qual.title ?? ""}
                    </h3>
                    <p className="text-text-muted text-xs md:text-xl lg:text-2xl font-light md:font-normal">
                      {qual.institution || qual.grade || "—"}
                    </p>
                    <p className="text-text-muted text-xs md:text-xl lg:text-2xl font-light md:font-normal">
                      {formatYear(qual.graduationDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pattern strip aligned to end of container */}
        <div className="w-24 md:w-32 lg:w-36 shrink-0 bg-[url('/images/profiles/arabic/card-pattern.svg')] bg-no-repeat bg-right bg-cover"></div>
      </div>
    </div>
  );
};
