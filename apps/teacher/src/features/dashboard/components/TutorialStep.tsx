import React from "react";

interface TutorialStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  stepNumber,
  title,
  description,
  children,
}) => {
  return (
    <div className="bg-shade-100 rounded-xl lg:rounded-2xl p-4 sm:p-6">
      {/* Step header with number */}
      <div className="flex items-start gap-4">
        {/* Step content */}
        <div className="flex-1">
          {/* Title bar */}
          <div className="inline-block bg-primary-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-normal mb-4">
            {title}
          </div>

          {/* Description */}
          {description && (
            <p className="text-grey-600 text-xs sm:text-sm mb-4">
              {description}
            </p>
          )}

          {/* Additional content (images, buttons, etc.) */}
          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Step number */}
        <div className="shrink-0 text-2xl sm:text-3xl font-light text-grey-400">
          -{stepNumber}
        </div>
      </div>
    </div>
  );
};
