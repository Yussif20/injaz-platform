/**
 * Step Indicator Component for multi-step forms
 */

"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  text-sm sm:text-base font-medium transition-colors duration-300
                  ${isActive ? "bg-primary-500 text-white" : ""}
                  ${isCompleted ? "bg-primary-500 text-white" : ""}
                  ${!isActive && !isCompleted ? "bg-grey-200 text-grey-500" : ""}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {labels && labels[index] && (
                <span
                  className={`
                    text-xs mt-1 hidden sm:block
                    ${isActive || isCompleted ? "text-primary-500" : "text-grey-400"}
                  `}
                >
                  {labels[index]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {stepNumber < totalSteps && (
              <div
                className={`
                  w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors duration-300
                  ${isCompleted ? "bg-primary-500" : "bg-grey-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
