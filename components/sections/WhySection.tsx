import Image from "next/image";
import { content } from "@/lib/content";

export const WhySection = () => {
  const { whySection } = content;

  return (
    <section className="bg-white text-text-dark py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl font-normal  text-center mb-12">
          {whySection.title}
        </h2>

        {/* Cards Container */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Text Right, Image Left */}
          <div className="bg-card-bg rounded-3xl h-50 flex items-center justify-between px-8">
            <p className="w-1/2 text-center text-[28px] ">
              {whySection.card1Text}
            </p>
            <div className="w-1/2 flex items-center justify-center h-full">
              <Image
                src="/sections/why/why-card-1.png"
                alt="Card 1"
                width={300}
                height={150}
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          {/* Card 2: Two Sub-Cards */}
          <div className="flex gap-6 text-xl">
            {/* Right Sub-Card: Title Top, Image Bottom */}
            <div className="flex-1 bg-card-bg rounded-3xl h-50 flex justify-between">
              <div className="flex flex-col items-end justify-end p-6">
                <p className=" text-right text-xl ">
                  {whySection.card2RightTitleLine1}
                  <br />
                  {whySection.card2RightTitleLine2}
                </p>
              </div>
              <div className="h-full">
                <Image
                  src="/sections/why/why-card-2-left.png"
                  alt="Card 2 Left"
                  width={150}
                  height={100}
                  className="h-full w-auto rounded-3xl"
                />
              </div>
            </div>

            {/* Left Sub-Card: Image Top, Title Bottom */}
            <div className="flex-1 bg-card-bg rounded-3xl h-50 flex flex-col items-center justify-between">
              <div className="flex-1 flex items-center justify-center">
                <p className=" ">{whySection.card2LeftTitle}</p>
              </div>
              <div className="flex-1 items-center justify-center h-full">
                <Image
                  src="/sections/why/why-card-2-right.png"
                  alt="Card 2 Right"
                  width={150}
                  height={100}
                  className="h-full w-auto"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Text Left, Image Right */}
          <div className="bg-card-bg rounded-3xl h-50 flex items-center justify-between">
            <div className="flex items-center justify-start h-full">
              <Image
                src="/sections/why/why-card-3.png"
                alt="Card 3"
                width={300}
                height={150}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="w-1/2 text-center text-[28px] ">
              {whySection.card3Text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
