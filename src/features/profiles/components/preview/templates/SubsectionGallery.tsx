"use client";

import { useRef, useState } from "react";
import type { ThemeColors } from "../../../types/theme.types";
import type { SubsectionImage } from "../../../types/profile.types";
import { normalizeImageSrc } from "@/shared/components/ui/ProfileImage";

interface SubsectionGalleryProps {
  images: SubsectionImage[];
  subsectionTitle: string | null;
  attachmentLabel?: string;
  theme: ThemeColors;
  imageRadius?: string;
}

export const SubsectionGallery = ({
  images,
  subsectionTitle,
  attachmentLabel,
  theme,
  imageRadius,
}: SubsectionGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];
  const thumbsRef = useRef<HTMLDivElement>(null);

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
    setSelectedIndex((prev) => {
      const next = prev > 0 ? prev - 1 : images.length - 1;
      scrollThumbIntoView(next);
      return next;
    });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => {
      const next = prev < images.length - 1 ? prev + 1 : 0;
      scrollThumbIntoView(next);
      return next;
    });
  };

  const scrollThumbIntoView = (index: number) => {
    const container = thumbsRef.current;
    if (!container) return;
    const thumb = container.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-10">
      {/* Attachment label + subsection title at top */}
      <p
        className="text-right text-xs font-light md:text-xl md:font-normal lg:text-2xl"
        style={{ color: attachmentLabelColor }}
      >
        {attachmentLabel} {subsectionTitle}
      </p>

      {/* Featured Image - full width with rounded corners */}
      <div
        className={`relative h-33.5 md:h-80 lg:h-125 w-full overflow-hidden bg-black/5 ${imageRadius ? "" : "rounded-2xl md:rounded-3xl"}`}
        style={imageRadius ? { borderRadius: imageRadius } : undefined}
      >
        <img
          src={
            selectedImage?.publicUrl
              ? normalizeImageSrc(selectedImage.publicUrl)
              : "/images/profiles/achievment.png"
          }
          alt={selectedImage?.description || "صورة الشاهد"}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Image title */}
      {selectedImage?.description && (
        <p
          className="text-xs font-normal md:text-2xl lg:text-[28px] text-right"
          style={{ color: subsectionTitleColor }}
        >
          {selectedImage.description}
        </p>
      )}

      {/* Navigation Arrows + Counter */}
      {images.length > 1 && (
        <div className="flex w-full items-center justify-start gap-2">
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
          <span
            className="text-xs md:text-sm tabular-nums mx-2"
            style={{ color: subsectionTitleColor }}
          >
            {selectedIndex + 1} / {images.length}
          </span>
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

      {/* Thumbnails - scrollable row */}
      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 justify-start overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setSelectedIndex(index);
                scrollThumbIntoView(index);
              }}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all shrink-0 ${
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
              <img
                src={
                  image?.publicUrl
                    ? normalizeImageSrc(image.publicUrl)
                    : "/images/profiles/achievment.png"
                }
                alt={`صورة ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
