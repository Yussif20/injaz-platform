"use client";

import React from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";

export const MobilePromoSidebar: React.FC = () => {
  const { createFile } = dashboardContent;

  return (
    <div className="hidden xl:flex flex-col items-center justify-start bg-shade-100 rounded-3xl p-8 min-h-[600px] w-[320px]">
      {/* Title */}
      <h2 className="text-2xl font-medium text-secondary-800 text-center">
        {createFile.promoTitle}
      </h2>
      <p className="text-2xl font-medium text-secondary-800 text-center mb-2">
        {createFile.promoSubtitle}
      </p>

      {/* Description */}
      <p className="text-primary-500 text-base mb-4">{createFile.promoDescription}</p>

      {/* App Store Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[200px] mb-6">
        {/* Play Store */}
        <a
          href="#"
          className="flex items-center gap-2 bg-white border border-grey-200 rounded-xl px-4 py-2 hover:shadow-md transition-shadow"
        >
          <Image
            src="/icons/play-store.svg"
            alt="Play Store"
            width={24}
            height={24}
          />
          <div className="text-right flex-1">
            <p className="text-[10px] text-grey-500">Get it from</p>
            <p className="text-sm font-medium text-secondary-800">Play Store</p>
          </div>
        </a>

        {/* App Store */}
        <a
          href="#"
          className="flex items-center gap-2 bg-white border border-grey-200 rounded-xl px-4 py-2 hover:shadow-md transition-shadow"
        >
          <Image
            src="/icons/app-store.svg"
            alt="App Store"
            width={24}
            height={24}
          />
          <div className="text-right flex-1">
            <p className="text-[10px] text-grey-500">Get it from</p>
            <p className="text-sm font-medium text-secondary-800">App Store</p>
          </div>
        </a>
      </div>

      {/* Phone Mockup */}
      <div className="relative flex-1 w-full flex items-end justify-center">
        <Image
          src="/pages/dashboard/create-file/smartphone-mockup.svg"
          alt="Mobile app preview"
          width={240}
          height={400}
          className="object-contain"
        />
      </div>
    </div>
  );
};
