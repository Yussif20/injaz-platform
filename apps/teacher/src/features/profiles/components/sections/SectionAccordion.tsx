"use client";

import React, { useState } from "react";
import { TermCard } from "./TermCard";
import type { ProfileSection, SubsectionImage } from "../../types/profile.types";
import { dashboardContent } from "@/content";

interface SectionAccordionProps {
  section: ProfileSection;
  defaultExpanded?: boolean;
  onAddEvidence: (subsectionId: number) => void;
  onEditImage?: (subsectionId: number, image: SubsectionImage) => void;
  onDeleteImage?: (subsectionId: number, image: SubsectionImage) => void;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = ({
  section,
  defaultExpanded = false,
  onAddEvidence,
  onEditImage,
  onDeleteImage,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { sectionsPage } = dashboardContent;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-[#F2F2F2] rounded-2xl overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={toggleExpand}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-5 text-right"
      >
        {/* Chevron Icon (Left side in RTL) */}
        <svg
          className={`w-5 h-5 text-grey-500 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>

        {/* Title and Weight */}
        <div className="flex-1 text-right pr-4">
          <p className="text-sm text-grey-500 mb-1">
            {sectionsPage.weightLabel} {section.weightPercent}%
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-secondary-800">
            {section.title}
          </h3>
        </div>
      </button>

      {/* Section Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 pb-6 space-y-4">
            {section.subsections?.map((subsection) => (
              <TermCard
                key={subsection.id}
                subsection={subsection}
                onAddEvidence={() => onAddEvidence(subsection.id)}
                onEditImage={(image) => onEditImage?.(subsection.id, image)}
                onDeleteImage={(image) => onDeleteImage?.(subsection.id, image)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
