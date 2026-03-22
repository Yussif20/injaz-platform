"use client";

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

  const attachmentLabelColor =
    attachmentLabelColorMap[theme.primary] || "#333333";
  const subsectionTitleColor =
    subsectionTitleColorMap[theme.primary] || "#333333";

  // Chunk images into groups of 4 (2 rows × 2 cols) for PDF pagination
  const IMAGES_PER_PAGE = 4;
  const imageChunks: SubsectionImage[][] = [];
  for (let i = 0; i < images.length; i += IMAGES_PER_PAGE) {
    imageChunks.push(images.slice(i, i + IMAGES_PER_PAGE));
  }

  return (
    <>
      {imageChunks.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className="flex flex-col gap-5 lg:gap-10"
          style={chunkIndex > 0 ? { breakBefore: "page" as const, paddingTop: "40px" } : undefined}
        >
          {/* Attachment label + subsection title - only on first chunk */}
          {chunkIndex === 0 && (
            <p
              className="text-right text-xs font-light md:text-xl md:font-normal lg:text-2xl"
              style={{ color: attachmentLabelColor }}
            >
              {attachmentLabel} {subsectionTitle}
            </p>
          )}

          {/* Images Grid - 2 per row, max 2 rows per page */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {chunk.map((image) => (
              <div key={image.id} className="flex flex-col gap-2">
                <div
                  className={`relative aspect-square w-full overflow-hidden bg-black/5 ${imageRadius ? "" : "rounded-2xl md:rounded-3xl"}`}
                  style={imageRadius ? { borderRadius: imageRadius } : undefined}
                >
                  <img
                    src={
                      image?.publicUrl
                        ? normalizeImageSrc(image.publicUrl)
                        : "/images/profiles/achievment.png"
                    }
                    alt={image?.description || "صورة الشاهد"}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                {image?.description && (
                  <p
                    className="text-xs font-normal md:text-base lg:text-lg text-right"
                    style={{ color: subsectionTitleColor }}
                  >
                    {image.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
