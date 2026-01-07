import Image from "next/image";
import { content } from "@/lib/content";

export const BannerSection = () => {
  const { bannerSection } = content;

  return (
    <section className="w-full">
      {/*
        Original banner content commented per request:
        <div className="bg-primary-500 text-white w-screen">
          <div className="max-w-7xl mx-auto flex justify-between">
            <div className="flex-1 py-12 flex flex-col justify-center gap-4">
              <h3 className="text-4xl font-normal text-right">{bannerSection.title}</h3>
              <p className="text-2xl font-light text-right">{bannerSection.subtitle}</p>
            </div>
            <div className="relative flex-1 min-h-47.5 bg-[url('/sections/banner/banner-bg.png')] bg-no-repeat bg-center bg-cover"></div>
          </div>
        </div>
      */}
      <Image
        src="/sections/banner/banner.svg"
        alt={bannerSection.title}
        width={1920}
        height={600}
        className="block w-full h-auto"
        priority
      />
    </section>
  );
};
