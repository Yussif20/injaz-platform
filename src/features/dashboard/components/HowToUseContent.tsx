"use client";

import React from "react";
import { dashboardContent } from "@/content";
import { VideoPlaceholder } from "./VideoPlaceholder";
import { TutorialStep } from "./TutorialStep";
import { Button } from "@/shared/components/ui";

export const HowToUseContent: React.FC = () => {
  const { howToUse } = dashboardContent;

  const handlePlayVideo = () => {
    // TODO: Implement video playback
    console.log("Play video clicked");
  };

  return (
    <div className="space-y-6">
      {/* Video Section */}
      <VideoPlaceholder title={howToUse.pageTitle} onPlay={handlePlayVideo} />

      {/* Tutorial Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <TutorialStep stepNumber={1} title={howToUse.steps[0].title}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Placeholder for sidebar screenshot */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="space-y-2 text-xs text-grey-500">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-grey-200"></span>
                  <span>الرئيسية</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-grey-200"></span>
                  <span>أنشئ ملف</span>
                </div>
                <div className="flex items-center gap-2 bg-shade-100 px-2 py-1 rounded">
                  <span className="w-4 h-4 rounded bg-primary-500"></span>
                  <span className="text-primary-500">حسابي</span>
                </div>
              </div>
            </div>
            {/* Placeholder for main content screenshot */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex-1">
              <div className="space-y-1 text-xs text-grey-400">
                <div className="h-3 bg-grey-200 rounded w-3/4"></div>
                <div className="h-3 bg-grey-200 rounded w-1/2"></div>
                <div className="h-3 bg-grey-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </TutorialStep>

        {/* Step 2 */}
        <TutorialStep stepNumber={2} title={howToUse.steps[1].title}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Placeholder for create file screenshot */}
            <div className="bg-white rounded-xl p-3 shadow-sm flex-1">
              <div className="border-2 border-grey-200 rounded-lg p-3">
                <div className="text-xs text-grey-500 text-center">إنشاء ملف جديد</div>
                <div className="mt-2 space-y-2">
                  <div className="h-3 bg-grey-200 rounded w-full"></div>
                  <div className="h-3 bg-grey-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            {/* Sidebar mini */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="space-y-2 text-xs text-grey-500">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-grey-200"></span>
                  <span>الرئيسية</span>
                </div>
                <div className="flex items-center gap-2 bg-shade-100 px-2 py-1 rounded">
                  <span className="w-4 h-4 rounded bg-primary-500"></span>
                  <span className="text-primary-500">أنشئ ملف</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-grey-200"></span>
                  <span>حسابي</span>
                </div>
              </div>
            </div>
          </div>
        </TutorialStep>

        {/* Step 3 */}
        <TutorialStep
          stepNumber={3}
          title={howToUse.steps[2].title}
          description={howToUse.steps[2].description}
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">
              {howToUse.buttons.addItems}
            </Button>
            <Button variant="outline" size="sm">
              {howToUse.buttons.previewFile}
            </Button>
          </div>
          <div className="mt-3 bg-shade-200 text-primary-600 text-xs sm:text-sm py-2 px-4 rounded-full inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>إضافة شعبة</span>
          </div>
        </TutorialStep>

        {/* Step 4 */}
        <TutorialStep stepNumber={4} title={howToUse.steps[3].title}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Template options */}
            <div className="flex gap-2">
              {["افتراضي", "واكى", "بوكي", "عربي"].map((template, index) => (
                <div
                  key={template}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xs ${
                    index === 0
                      ? "bg-primary-500 text-white ring-2 ring-primary-300"
                      : "bg-grey-200 text-grey-600"
                  }`}
                >
                  {template}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              {howToUse.buttons.customizeTemplate}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              {howToUse.buttons.saveAsDraft}
            </Button>
            <Button variant="outline" size="sm">
              {howToUse.buttons.preview}
            </Button>
          </div>
        </TutorialStep>

        {/* Step 5 */}
        <TutorialStep stepNumber={5} title={howToUse.steps[4].title}>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              {howToUse.buttons.preview}
            </Button>
            <span className="bg-success-500 text-white text-xs px-3 py-1 rounded-full">
              {howToUse.buttons.published}
            </span>
          </div>
        </TutorialStep>
      </div>
    </div>
  );
};
