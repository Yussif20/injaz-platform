"use client";

import type { ThemeColors } from "../../types/theme.types";
import type { CareerJob } from "../../types/profile.types";

interface CareerSectionProps {
  careerJobs: CareerJob[] | null;
  content: {
    title: string;
    subtitle: string;
  };
  theme: ThemeColors;
}

export const CareerSection = ({
  careerJobs,
  content,
  theme,
}: CareerSectionProps) => {
  if (!careerJobs || careerJobs.length === 0) return null;

  // Format year range
  const formatYearRange = (startYear: number, endYear: number | null) => {
    if (endYear) {
      return `${startYear} - ${endYear}`;
    }
    return `${startYear} - الآن`;
  };

  return (
    <div className="px-4 py-6">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-1 h-6 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
        <h2
          className="text-lg font-semibold"
          style={{ color: theme.text }}
        >
          {content.title}
        </h2>
      </div>

      {/* Subtitle */}
      <p
        className="text-sm mb-4 mr-3"
        style={{ color: theme.textMuted }}
      >
        {content.subtitle}
      </p>

      {/* Career Jobs Timeline */}
      <div className="relative mr-3">
        {/* Timeline Line */}
        <div
          className="absolute right-[11px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: theme.border }}
        />

        {/* Job Items */}
        <div className="space-y-4">
          {careerJobs.map((job, index) => (
            <div
              key={job.id}
              className="relative pr-8"
            >
              {/* Timeline Dot */}
              <div
                className="absolute right-0 top-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme.primaryLight,
                  border: `2px solid ${theme.primary}`,
                }}
              >
                <svg
                  className="w-3 h-3"
                  fill={theme.primary}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>

              {/* Card */}
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {/* Rank Badge */}
                <span
                  className="inline-block px-2 py-1 rounded-md text-xs font-medium mb-2"
                  style={{
                    backgroundColor: theme.primaryLight,
                    color: theme.primary,
                  }}
                >
                  {job.rank}
                </span>

                {/* Job Title */}
                <h3
                  className="text-sm font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  {job.title}
                </h3>

                {/* School & Stage */}
                <p
                  className="text-xs mb-1"
                  style={{ color: theme.textMuted }}
                >
                  {job.school}
                  {job.educationalStage && ` - ${job.educationalStage}`}
                </p>

                {/* Year Range */}
                <p
                  className="text-xs"
                  style={{ color: theme.textMuted }}
                >
                  {formatYearRange(job.startYear, job.endYear)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
