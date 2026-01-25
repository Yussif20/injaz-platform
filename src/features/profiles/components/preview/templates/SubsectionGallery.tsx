"use client";

import { useState } from "react";
import Image from "next/image";
import type { ThemeColors } from "../../../types/theme.types";
import type { SubsectionImage } from "../../../types/profile.types";

interface SubsectionGalleryProps {
  images: SubsectionImage[];
  subsectionTitle: string | null;
  attachmentLabel?: string;
  theme: ThemeColors;
}

export const SubsectionGallery = ({
  images,
  subsectionTitle,
  attachmentLabel,
  theme,
}: SubsectionGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  const attachmentLabelColorMap: Record<string, string> = {
    "#008387": "#333333", // default
    "#6b2a3d": "#333333", // heritage
    "#5c4033": "#4D4D4D", // arabic
    "#12263a": "#BABABA", // dark
  };

  const subsectionTitleColorMap: Record<string, string> = {
    "#008387": "#333333", // default
    "#6b2a3d": "#333333", // heritage
    "#5c4033": "#333333", // arabic
    "#12263a": "#F8F8F8", // dark
  };

  const arrowBgColorMap: Record<string, { bg: string; border?: string }> = {
    "#008387": { bg: "#008387" }, // default
    "#6b2a3d": { bg: "#51161D" }, // heritage
    "#5c4033": { bg: "#543A31" }, // arabic
    "#12263a": { bg: "transparent", border: "1px solid #FFFFFF" }, // dark
  };

  const attachmentLabelColor =
    attachmentLabelColorMap[theme.primary] || "#333333";
  const subsectionTitleColor =
    subsectionTitleColorMap[theme.primary] || "#333333";
  const arrowStyle = arrowBgColorMap[theme.primary] || { bg: theme.primary };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-10">
      {/* Description text at top - right aligned */}
      {selectedImage?.description && (
        <p
          className="text-right text-xs font-light md:text-xl md:font-normal lg:text-2xl"
          style={{ color: attachmentLabelColor }}
        >
          {attachmentLabel} {selectedImage.description}
        </p>
      )}

      {/* Featured Image - full width with rounded corners */}
      <div className="relative h-33.5 md:h-80 lg:h-125 w-full rounded-2xl md:rounded-3xl overflow-hidden">
        <Image
          src={selectedImage?.publicUrl || "/images/profiles/achievment.png"}
          alt={selectedImage?.description || "صورة الشاهد"}
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <p
        className="text-xs font-normal md:text-2xl lg:text-[28px] text-right"
        style={{ color: subsectionTitleColor }}
      >
        {subsectionTitle}
      </p>

      {/* Navigation Arrows - below title, aligned to left (appears on left in RTL) */}
      {images.length > 1 && (
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: arrowStyle.bg,
              border: arrowStyle.border,
            }}
            aria-label="السابق"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: arrowStyle.bg,
              border: arrowStyle.border,
            }}
            aria-label="التالي"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Thumbnails - show only for multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-start">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={
                index === selectedIndex
                  ? { boxShadow: `0 0 0 2px ${theme.primary}` }
                  : undefined
              }
              aria-label={`صورة ${index + 1}`}
            >
              <Image
                src={image?.publicUrl || "/images/profiles/achievment.png"}
                alt={`صورة ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
