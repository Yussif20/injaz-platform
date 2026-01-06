// import Image from "next/image";
import { content } from "@/lib/content";

export const BannerSection = () => {
  const { bannerSection } = content;

  return (
    <section className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto flex justify-between ">
        {/* Text Column */}
        <div className="flex-1 py-12 flex flex-col justify-center gap-4">
          <h3 className="text-4xl font-normal text-right">
            {bannerSection.title}
          </h3>
          <p className="text-2xl font-light text-right">
            {bannerSection.subtitle}
          </p>
        </div>

        {/* Image Column */}
        {/* <div className="relative flex-1 min-h-47.5 bg-[url('/sections/banner/banner-bg.png')] bg-no-repeat bg-center bg-cover"></div> */}
      </div>
    </section>
  );
};
