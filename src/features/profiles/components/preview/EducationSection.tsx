"use client";

import type { ThemeColors } from "../../types/theme.types";
import type { Qualification } from "../../types/profile.types";

interface EducationSectionProps {
  qualifications: Qualification[] | null;
  content: {
    title: string;
    subtitle: string;
  };
  theme: ThemeColors;
}

export const EducationSection = ({
  qualifications,
  content,
  theme,
}: EducationSectionProps) => {
  if (!qualifications || qualifications.length === 0) return null;

  // Format graduation date to year only
  const formatYear = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.getFullYear().toString();
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

      {/* Qualifications Timeline */}
      <div className="relative mr-3">
        {/* Timeline Line */}
        <div
          className="absolute right-[11px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: theme.border }}
        />

        {/* Qualification Items */}
        <div className="space-y-4">
          {qualifications.map((qual, index) => (
            <div
              key={qual.id}
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
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
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
                {/* Degree Type Badge */}
                <span
                  className="inline-block px-2 py-1 rounded-md text-xs font-medium mb-2"
                  style={{
                    backgroundColor: theme.primaryLight,
                    color: theme.primary,
                  }}
                >
                  {qual.degreeType}
                </span>

                {/* Qualification Title */}
                <h3
                  className="text-sm font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  {qual.title}
                </h3>

                {/* Grade & Year */}
                <p
                  className="text-xs"
                  style={{ color: theme.textMuted }}
                >
                  {qual.grade && `${qual.grade} - `}
                  {formatYear(qual.graduationDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
