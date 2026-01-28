"use client";

export type OnboardingStep = "basicInfo" | "qualifications" | "careerJobs";

interface OnboardingProgressStepperProps {
  currentStep: OnboardingStep;
  steps: {
    basicInfo: string;
    qualifications: string;
    careerJobs: string;
  };
  direction?: "vertical" | "horizontal";
}

export function OnboardingProgressStepper({
  currentStep,
  steps,
  direction = "vertical",
}: OnboardingProgressStepperProps) {
  const stepOrder: OnboardingStep[] = [
    "basicInfo",
    "qualifications",
    "careerJobs",
  ];
  const currentIndex = stepOrder.indexOf(currentStep);
  const isHorizontal = direction === "horizontal";

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div
      className={
        isHorizontal
          ? "flex flex-row items-center justify-between gap-4 w-full"
          : "flex flex-col items-start h-full"
      }
    >
      {stepOrder.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === stepOrder.length - 1;
        const label =
          step === "basicInfo"
            ? steps.basicInfo
            : step === "qualifications"
              ? steps.qualifications
              : steps.careerJobs;
        const labelClass =
          status === "completed" || status === "current"
            ? "text-primary-500"
            : "text-grey-400";
        const lineClass =
          status === "completed" || status === "current"
            ? "bg-primary-500"
            : "bg-grey-300";

        if (isHorizontal) {
          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-center w-full">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    status === "completed"
                      ? "bg-primary-500 border-primary-500"
                      : status === "current"
                        ? "border-primary-500 bg-white"
                        : "border-grey-300 bg-white"
                  }`}
                >
                  {status === "completed" && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {status === "current" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                  )}
                  {status === "pending" && (
                    <div className="w-2 h-2 rounded-full bg-grey-300" />
                  )}
                </div>
                {!isLast && <div className={`h-0.5 flex-1 ${lineClass}`} />}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${labelClass}`}
              >
                {label}
              </span>
            </div>
          );
        }

        // Vertical layout
        return (
          <div
            key={step}
            className={`flex items-start gap-3 ${!isLast ? "flex-1" : ""}`}
          >
            {/* Circle + connecting line column (right side in RTL) */}
            <div className="flex flex-col items-center h-full">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  status === "completed"
                    ? "bg-primary-500 border-primary-500"
                    : status === "current"
                      ? "border-primary-500 bg-white"
                      : "border-grey-300 bg-white"
                }`}
              >
                {status === "completed" && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {status === "current" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                )}
                {status === "pending" && (
                  <div className="w-2 h-2 rounded-full bg-grey-300" />
                )}
              </div>

              {/* Connecting line - centered under circle */}
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-4 ${lineClass}`} />
              )}
            </div>

            {/* Text label (left side in RTL) */}
            <span
              className={`text-sm font-medium whitespace-nowrap leading-6 ${labelClass}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
