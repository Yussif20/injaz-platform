"use client";

import type { ThemeColors } from "../../types/theme.types";
import type { PersonalInfo } from "../../types/profile.types";

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo | null;
  content: {
    title: string;
    birthday: string;
    email: string;
    nationalId: string;
    origin: string;
  };
  memberBadge: string;
  theme: ThemeColors;
}

export const PersonalInfoSection = ({
  personalInfo,
  content,
  memberBadge,
  theme,
}: PersonalInfoSectionProps) => {
  if (!personalInfo) return null;

  // Format date to Arabic format (e.g., "5/8/1986")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const infoItems = [
    {
      label: content.birthday,
      value: formatDate(personalInfo.birthDate),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: content.email,
      value: personalInfo.email || "—",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: content.nationalId,
      value: personalInfo.nationalId || "—",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      label: content.origin,
      value: personalInfo.address || "—",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="px-4 py-6">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Member Badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm"
        style={{
          backgroundColor: theme.primaryLight,
          color: theme.primary,
        }}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {memberBadge}
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: theme.primaryLight,
                color: theme.primary,
              }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs"
                style={{ color: theme.textMuted }}
              >
                {item.label}
              </p>
              <p
                className="text-sm font-medium truncate"
                style={{ color: theme.text }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
