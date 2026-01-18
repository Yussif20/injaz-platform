"use client";

import React from "react";
import { ImageGallery } from "./ImageGallery";
import type { ProfileSubsection, SubsectionImage } from "../../types/profile.types";
import { dashboardContent } from "@/content";

interface TermCardProps {
  subsection: ProfileSubsection;
  onAddEvidence: () => void;
  onEditImage?: (image: SubsectionImage) => void;
  onDeleteImage?: (image: SubsectionImage) => void;
}

export const TermCard: React.FC<TermCardProps> = ({
  subsection,
  onAddEvidence,
  onEditImage,
  onDeleteImage,
}) => {
  const { sectionsPage } = dashboardContent;
  const hasImages = subsection.images && subsection.images.length > 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5">
      {/* Subsection Title */}
      <p className="text-center text-grey-600 mb-4">
        {subsection.title}
      </p>

      {/* Image Gallery (if has images) */}
      {hasImages && (
        <div className="mb-4">
          <ImageGallery
            images={subsection.images!}
            onEditImage={onEditImage}
            onDeleteImage={onDeleteImage}
          />
        </div>
      )}

      {/* Add Evidence Button */}
      <button
        type="button"
        onClick={onAddEvidence}
        className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl transition-colors duration-200"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>
          {hasImages ? sectionsPage.addAnotherEvidence : sectionsPage.addEvidence}
        </span>
      </button>
    </div>
  );
};
