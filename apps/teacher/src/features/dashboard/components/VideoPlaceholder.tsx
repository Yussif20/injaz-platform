"use client";

import React from "react";

interface VideoPlaceholderProps {
  title?: string;
  onPlay?: () => void;
}

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  title,
  onPlay,
}) => {
  return (
    <div className="w-full">
      {/* Title above video */}
      {title && (
        <h2 className="text-lg sm:text-xl font-medium text-secondary-700 text-center mb-4">
          {title}
        </h2>
      )}

      {/* Video placeholder */}
      <div
        className="relative w-full aspect-video bg-secondary-700 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group"
        onClick={onPlay}
      >
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-700 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
