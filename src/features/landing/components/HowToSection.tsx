import Image from "next/image";
import { Button } from "@/shared/components/ui";
import { landingContent } from "@/content";

export const HowToSection = () => {
  const { howToSection } = landingContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        {/* Section Title */}
        <h2 className="text-base md:text-2xl lg:text-4xl font-normal text-center mb-5 md:mb-7 lg:mb-9">
          {howToSection.title}
        </h2>

        <div className="flex flex-col md:flex-row gap-5 md:gap-7 lg:gap-11 items-stretch">
          {/* Steps - Left Side */}
          <div className="flex-1 order-1 space-y-5">
            {howToSection.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                {/* Step Number Badge */}
                <div className="shrink-0 bg-[#E3EFEF] text-primary-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <p className="text-sm md:text-lg font-normal text-right text-text-dark mb-2">
                    {step.main}
                  </p>
                  <p className="text-sm md:text-lg font-light text-right text-[#666]">
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div className="pt-4">
              <Button variant="outline" size="lg" className="w-full font-light">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="9"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="12"
                    x2="15"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {howToSection.ctaButton}
              </Button>
            </div>
          </div>

          {/* Video - Right Side */}
          <div className="flex-1 min-h-96">
            <div className="bg-card-bg rounded-3xl relative w-full min-h-96 overflow-hidden">
              {/* Thumbnail Image */}
              <Image
                src="/sections/how/video-thumbnail.png"
                alt="How to tutorial thumbnail"
                fill
                className="object-cover"
              />

              {/* Video (Commented Out) */}
              {/* <video
                controls
                className="w-full h-full object-cover"
                poster="/sections/how/video-thumbnail.png"
              >
                <source src="/sections/how/how-to.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
