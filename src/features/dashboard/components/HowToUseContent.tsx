"use client";

import React from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";

export const HowToUseContent: React.FC = () => {
  const { howToUse } = dashboardContent;

  const steps = [
    {
      number: 1,
      image: "/images/dashboard/how-to-use/step-1.svg",
      mobileImage: "/images/dashboard/how-to-use/step-1-mobile.svg",
    },
    {
      number: 2,
      image: "/images/dashboard/how-to-use/step-2.svg",
      mobileImage: "/images/dashboard/how-to-use/step-2-mobile.svg",
    },
    {
      number: 3,
      image: "/images/dashboard/how-to-use/step-3.svg",
      mobileImage: "/images/dashboard/how-to-use/step-3-mobile.svg",
    },
    {
      number: 4,
      image: "/images/dashboard/how-to-use/step-4.svg",
      mobileImage: "/images/dashboard/how-to-use/step-4-mobile.svg",
    },
    {
      number: 5,
      image: "/images/dashboard/how-to-use/step-5.svg",
      mobileImage: "/images/dashboard/how-to-use/step-5-mobile.svg",
    },
  ];

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 space-y-8">
      {/* Title - aligned right */}
      <h1 className="text-lg sm:text-xl font-medium text-secondary-700 text-right">
        {howToUse.pageTitle}
      </h1>

      {/* Video Thumbnail Image */}
      <div className="w-full">
        {/* Mobile version */}
        <Image
          src="/images/dashboard/how-to-use/video-thumbnail-mobile.svg"
          alt="video thumbnail"
          width={800}
          height={450}
          className="w-full h-auto rounded-xl lg:rounded-2xl md:hidden"
        />
        {/* Desktop/Tablet version */}
        <Image
          src="/images/dashboard/how-to-use/video-thumbnail.svg"
          alt="video thumbnail"
          width={800}
          height={450}
          className="w-full h-auto rounded-xl lg:rounded-2xl hidden md:block"
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="space-y-3">
            {/* Step Number - aligned right */}
            <p className="text-xl font-medium text-secondary-700 text-right">
              {step.number}-
            </p>
            {/* Step Image - Mobile */}
            <Image
              src={step.mobileImage}
              alt={`step ${step.number}`}
              width={800}
              height={400}
              className="w-full h-auto rounded-xl md:hidden"
            />
            {/* Step Image - Desktop/Tablet */}
            <Image
              src={step.image}
              alt={`step ${step.number}`}
              width={800}
              height={400}
              className="w-full h-auto rounded-xl hidden md:block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
