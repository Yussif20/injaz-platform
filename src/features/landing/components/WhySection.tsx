import Image from "next/image";
import { landingContent } from "@/content";

export const WhySection = () => {
  const { whySection } = landingContent;

  return (
    <section className="bg-white text-text-dark py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        {/* Section Title */}
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-normal text-center mb-6 sm:mb-11">
          {whySection.title}
        </h2>

        {/* Cards Container */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Card 1: Text Right, Image Left */}
          <div className="bg-card-bg rounded-2xl sm:rounded-3xl h-30 sm:h-37.5 md:h-50 flex flex-row items-center overflow-hidden">
            <p className="flex-1 text-center text-base md:text-2xl lg:text-[28px] px-4">
              {whySection.card1Text}
            </p>
            <div className="h-full">
              <Image
                src="/images/landing/why/why-card-1.svg"
                alt="Card 1"
                width={300}
                height={200}
                className="h-full w-auto object-cover object-right"
              />
            </div>
          </div>

          {/* Card 2: Two Sub-Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row-reverse">
            {/* Left Sub-Card (appears on right on desktop due to flex-row-reverse) */}
            <div className="flex-1 bg-card-bg rounded-2xl sm:rounded-3xl h-40 sm:h-45 flex flex-col items-center justify-between overflow-hidden">
              <p className="text-center text-base md:text-lg lg:text-xl  p-4 pb-0">
                {whySection.card2LeftTitle}
              </p>
              <div className="w-full flex justify-center">
                <Image
                  src="/images/landing/why/why-card-2-left.svg"
                  alt="Card 2 Left"
                  width={200}
                  height={120}
                  className="w-auto h-20 sm:h-25 object-contain"
                />
              </div>
            </div>

            {/* Right Sub-Card (appears on left on desktop due to flex-row-reverse) */}
            <div className="flex-1 bg-card-bg rounded-2xl sm:rounded-3xl h-40 sm:h-45 flex flex-col-reverse sm:flex-row justify-between overflow-hidden">
              <div className="flex flex-col items-end justify-end p-4 sm:p-6">
                <p className="text-right text-base md:text-lg lg:text-xl">
                  {whySection.card2RightTitleLine1}
                  <br className="hidden md:block" />
                  {whySection.card2RightTitleLine2}
                </p>
              </div>
              <div className="w-full sm:w-auto sm:h-full">
                <Image
                  src="/images/landing/why/why-card-2-right.svg"
                  alt="Card 2 Right"
                  width={180}
                  height={180}
                  className="w-full sm:w-auto sm:h-full object-cover object-left rounded-tl-2xl sm:rounded-tl-3xl"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Text Left, Image Right */}
          <div className="bg-card-bg rounded-2xl sm:rounded-3xl h-30 sm:h-37.5 md:h-50 flex flex-row items-center overflow-hidden">
            <div className="h-full">
              <Image
                src="/images/landing/why/why-card-3.svg"
                alt="Card 3"
                width={300}
                height={200}
                className="h-full w-auto object-cover object-left"
              />
            </div>
            <p className="flex-1 text-center text-base md:text-2xl lg:text-[28px] px-4">
              {whySection.card3Text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
