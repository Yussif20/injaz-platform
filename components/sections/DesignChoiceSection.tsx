import Image from "next/image";
import { content } from "@/lib/content";

export function DesignChoiceSection() {
  const { designChoiceSection } = content;

  return (
    <section className="pt-20 px-4 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="bg-card-bg rounded-[28px] px-12 pt-16 flex flex-col items-center text-center">
          {/* Title */}
          <h2 className="text-4xl font-normal text-primary-500 mb-6">
            {designChoiceSection.title}
          </h2>

          {/* Subtitle */}
          <p className="text-2xl font-light text-[#4D4D4D]">
            {designChoiceSection.subtitle}
          </p>

          {/* Image */}
          <div className="w-full relative h-32 sm:h-48 md:h-96">
            <Image
              src="/sections/design-choice/smartphones.svg"
              alt={designChoiceSection.imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
