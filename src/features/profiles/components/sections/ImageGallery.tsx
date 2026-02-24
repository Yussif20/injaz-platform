"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { SubsectionImage } from "../../types/profile.types";
import { dashboardContent } from "@/content";

interface ImageGalleryProps {
  images: SubsectionImage[];
  maxSlots?: number;
  onEditImage?: (image: SubsectionImage) => void;
  onDeleteImage?: (image: SubsectionImage) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  maxSlots = 8,
  onEditImage,
  onDeleteImage,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { imageActions } = dashboardContent;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  // Create slots array with images and empty placeholders
  const slots = Array.from({ length: maxSlots }, (_, index) => {
    return images[index] || null;
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const toggleMenu = (imageId: number) => {
    setActiveMenuId(activeMenuId === imageId ? null : imageId);
  };

  const handleEditClick = (image: SubsectionImage) => {
    if (onEditImage) {
      onEditImage(image);
    }
    setActiveMenuId(null);
  };

  const handleDeleteClick = (image: SubsectionImage) => {
    if (onDeleteImage) {
      onDeleteImage(image);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left Arrow (appears on right in RTL) */}
      <button
        type="button"
        onClick={scrollLeft}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-primary-500 text-primary-500 hover:bg-primary-50 transition-colors"
      >
        <svg
          className="w-4 h-4"
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

      {/* Images Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slots.map((image, index) => (
          <div
            key={image?.id || `empty-${index}`}
            className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-grey-100 border border-grey-200"
          >
            {image ? (
              <>
                {/* Image */}
                <Image
                  src={image.publicUrl || "/placeholder-image.jpg"}
                  alt={image.description || "صورة الشاهد"}
                  fill
                  className="object-cover"
                />

                {/* Three-dot Menu Button */}
                <button
                  type="button"
                  onClick={() => toggleMenu(image.id)}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-800 transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {activeMenuId === image.id && (
                  <div
                    ref={menuRef}
                    className="absolute top-8 right-1 bg-white rounded-lg shadow-lg border border-grey-200 py-1 z-20 min-w-28"
                  >
                    <button
                      type="button"
                      onClick={() => handleEditClick(image)}
                      className="w-full flex items-center justify-end gap-2 px-3 py-2 text-sm text-grey-700 hover:bg-grey-50 transition-colors"
                    >
                      <span>{imageActions.edit}</span>
                      <Image
                        src="/icons/ui/edit.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(image)}
                      className="w-full flex items-center justify-end gap-2 px-3 py-2 text-sm text-warning-500 hover:bg-grey-50 transition-colors"
                    >
                      <span>{imageActions.delete}</span>
                      <Image
                        src="/icons/ui/delete.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty placeholder
              <div className="w-full h-full bg-grey-100" />
            )}
          </div>
        ))}
      </div>

      {/* Right Arrow (appears on left in RTL) */}
      <button
        type="button"
        onClick={scrollRight}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-primary-500 text-primary-500 hover:bg-primary-50 transition-colors"
      >
        <svg
          className="w-4 h-4"
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
    </div>
  );
};
