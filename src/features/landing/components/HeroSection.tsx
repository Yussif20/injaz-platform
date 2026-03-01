import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/routes";
import { landingContent } from "@/content";

export const HeroSection = () => {
  const { hero } = landingContent;

  return (
    <section className="flex flex-col gap-10 items-center justify-center py-12 sm:py-16 lg:py-20">
      {/* Hero Title with Highlight */}
      <h1 className="text-center max-w-4xl">
        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-text-dark leading-tight">
          {hero.titleStart}
          <span className="text-primary-500">{hero.titleHighlight}</span>
          {hero.titleEnd1}
          <br />
          {hero.titleEnd2}
        </span>
      </h1>

      {/* CTA Button with Icon */}
      <Link
        href={ROUTES.SIGN_UP}
        className="flex items-center justify-center gap-3 w-[200px] h-[54px] px-2 py-2 text-lg rounded-4xl bg-primary-500 text-white hover:bg-primary-800 active:bg-primary-700 transition-colors duration-200"
      >
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
      </Link>

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
