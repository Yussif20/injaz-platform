"use client";

import Image from "next/image";

export function OnboardingImageCollage() {
  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-full bg-primary-500 rounded-3xl overflow-hidden">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full p-3">
        {/* Top Left - Logo area */}
        <div className="row-span-1 bg-primary-400/30 rounded-2xl flex items-center justify-center p-4">
          <div className="text-center">
            <span className="text-white text-3xl font-bold block">انجاز</span>
          </div>
        </div>

        {/* Top Right - Logo area continued */}
        <div className="row-span-1 bg-primary-400/30 rounded-2xl flex items-center justify-center p-4">
          <div className="text-center">
            <span className="text-white text-3xl font-bold block">المعلم</span>
          </div>
        </div>

        {/* Middle - Large image spanning both columns */}
        <div className="col-span-2 row-span-1 bg-primary-400/50 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-primary-300/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Left */}
        <div className="row-span-1 bg-primary-400/30 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary-300/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Right */}
        <div className="row-span-1 bg-primary-400/30 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary-300/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Overlay Logo */}
      <div className="absolute top-4 left-4 z-10">
        <Image
          src="/logo/logo-white.svg"
          alt="انجاز المعلم"
          width={60}
          height={70}
          className="h-14 w-auto"
        />
      </div>
    </div>
  );
}
