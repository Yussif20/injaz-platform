"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";
import type { CareerJob } from "../../../../types/profile.types";

interface DarkCareerSectionProps {
  careerJobs: CareerJob[] | null;
  content: {
    title: string;
    subtitle: string;
  };
  theme: ThemeColors;
}

export const DarkCareerSection = ({
  careerJobs,
  content,
}: DarkCareerSectionProps) => {
  if (!careerJobs || careerJobs.length === 0) return null;

  // Format year range
  const formatYearRange = (startYear: number, endYear: number | null) => {
    if (endYear) {
      return `${endYear} - ${startYear}`;
    }
    return `الآن - ${startYear}`;
  };

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-start gap-2 md:gap-3 mb-4 md:mb-8">
        {/* Star Icon */}
        <div className="w-8.75 h-8.75 md:w-13.75 md:h-13.75 relative">
          <Image src="/icons/templates/dark/star.svg" alt="" fill />
        </div>
        <div className="text-right flex flex-col gap-2 md:gap-4">
          <h2 className="text-lg md:text-2xl lg:text-[28px] font-normaltext-text-dark">
            {content.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl font-light text-text-muted">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Career Cards */}
      <div className="space-y-2 md:space-y-7">
        {careerJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-[36px] overflow-hidden bg-card-bg "
          >
            <div className="flex items-stretch">
              {/* Content - Right Side */}
              <div className="flex-1 flex items-center justify-start py-4 px-4">
                <div className="flex items-center gap-4">
                  {/* Briefcase Icon */}
                  <div className="w-4 h-4 md:w-10 md:h-10 lg:w-12.5 lg:h-12.5 shrink-0 relative">
                    <Image
                      src="/icons/templates/dark/work.svg"
                      alt="briefcase icon"
                      fill
                    />
                  </div>

                  {/* Text Content */}
                  <div className="text-right border-r md:border-r-[3px] border-primary-500 flex flex-col gap-1 md:gap-6 pr-1 md:pr-6">
                    <h3 className="text-text-dark text-sm md:text-2xl lg:text-[28px] font-normal ">
                      {job.rank || job.title}
                    </h3>
                    <p className="text-text-muted text-xs md:text-xl lg:text-2xl font-light md:font-normal">
                      {job.school}
                      {job.educationalStage && ` - ${job.educationalStage}`}
                    </p>
                    <p className="text-text-muted  text-xs md:text-xl lg:text-2xl font-light md:font-normal">
                      {formatYearRange(job.startYear, job.endYear)} •
                    </p>
                  </div>
                </div>
              </div>

              {/* Geometric Pattern - Left Side */}
              <div className="w-24 md:w-32 lg:w-40 shrink-0 bg-[url('/icons/templates/dark/geometric-pattern.svg')] bg-repeat bg-center"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
