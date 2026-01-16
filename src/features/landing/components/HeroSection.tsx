import { Button } from "@/shared/components/ui";
import { landingContent } from "@/content";
import Image from "next/image";
import { ASSETS } from "@/config/assets";

export const HeroSection = () => {
  const { hero } = landingContent;

  return (
    <section className="flex flex-col gap-10 items-center justify-center py-12 sm:py-16 lg:py-20">
      {/* Hero Title with Highlight */}
      <h1 className="text-center max-w-4xl ">
        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-text-dark">
          {hero.titleStart}
          <span className="text-primary-500">{hero.titleHighlight}</span>
          {hero.titleEnd1}
          <br />
          {hero.titleEnd2}
        </span>
      </h1>

      {/* CTA Button with Icon */}
      <Button variant="primary" size="lg" className="flex items-center gap-3">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path
            d="M12 8v8m-4-4h8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {hero.ctaButton}
      </Button>

      {/* Hero Image */}
      <div
        className={`py-8 w-full max-w-3xl bg-[url('/images/landing/hero/hero-background.png')] bg-no-repeat bg-center bg-cover`}
      >
        <Image
          src="/images/landing/hero/hero-illustration.svg"
          alt={hero.imageAlt}
          width={1200}
          height={675}
          className="w-full h-auto rounded-lg"
          priority
        />
      </div>
    </section>
  );
};
