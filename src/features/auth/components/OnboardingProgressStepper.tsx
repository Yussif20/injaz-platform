"use client";

export type OnboardingStep = "basicInfo" | "qualifications" | "careerJobs";

interface OnboardingProgressStepperProps {
  currentStep: OnboardingStep;
  steps: {
    basicInfo: string;
    qualifications: string;
    careerJobs: string;
  };
}

export function OnboardingProgressStepper({
  currentStep,
  steps,
}: OnboardingProgressStepperProps) {
  const stepOrder: OnboardingStep[] = ["basicInfo", "qualifications", "careerJobs"];
  const currentIndex = stepOrder.indexOf(currentStep);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="flex flex-col items-end">
      {stepOrder.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === stepOrder.length - 1;

        return (
          <div key={step} className="flex items-center gap-3">
            {/* Step Label */}
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                status === "completed"
                  ? "text-primary-500"
                  : status === "current"
                  ? "text-primary-500"
                  : "text-grey-400"
              }`}
            >
              {step === "basicInfo" && steps.basicInfo}
              {step === "qualifications" && steps.qualifications}
              {step === "careerJobs" && steps.careerJobs}
            </span>

            {/* Step Indicator and Line */}
            <div className="flex flex-col items-center">
              {/* Circle Indicator */}
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

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`w-0.5 h-28 ${
                    status === "completed" || status === "current"
                      ? "bg-primary-500"
                      : "bg-grey-300"
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
