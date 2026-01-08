import Image from "next/image";
import { content } from "@/lib/content";

export const BannerSection = () => {
  const { bannerSection } = content;

  return (
    <section className="w-full">
      <Image
        src="/sections/banner/banner-mobile.svg"
        alt={bannerSection.title}
        width={1920}
        height={600}
        className="block w-full h-auto md:hidden"
        priority
        sizes="100vw"
      />
      <Image
        src="/sections/banner/banner.svg"
        alt={bannerSection.title}
        width={1920}
        height={600}
        className="hidden md:block w-full h-auto"
        priority
        sizes="100vw"
      />
    </section>
  );
};
