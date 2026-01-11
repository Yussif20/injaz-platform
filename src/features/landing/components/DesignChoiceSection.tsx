import Image from "next/image";
import { landingContent } from "@/content";

export function DesignChoiceSection() {
  const { designChoiceSection } = landingContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="bg-card-bg rounded-[28px] overflow-hidden flex flex-col items-center text-center">
          {/* Title */}
          <h2 className="sm:text-lg md:text-2xl lg:text-4xl font-normal text-primary-500 mb-4 sm:mb-6 pt-8 sm:pt-12 md:pt-16 px-4 sm:px-12">
            {designChoiceSection.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base lg:text-2xl font-light text-[#4D4D4D] px-4 sm:px-12">
            {designChoiceSection.subtitle}
          </p>

          {/* Image - flush with bottom edge */}
          <div className="w-full mt-4 sm:mt-6">
            <Image
              src="/sections/design-choice/smartphones.svg"
              alt={designChoiceSection.imageAlt}
              width={1200}
              height={400}
              className="w-full h-auto object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
