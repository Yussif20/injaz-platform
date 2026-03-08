"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@/config/routes";
import { landingContent } from "@/content";
import { clientApi } from "@/shared/lib/api";

interface SystemParameterDto {
  id: number;
  key: string;
  value: string;
  dataType: string;
  category: string;
  isActive: boolean;
}

function getYoutubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
  } catch {
    return null;
  }
}

export const HowToSection = () => {
  const { howToSection } = landingContent;

  const { data: youtubeUrl } = useQuery({
    queryKey: ["systemParameters", "socials", "youtube"],
    queryFn: async () => {
      const res = await clientApi.get<{ status: string; data: SystemParameterDto[] }>(
        "/api/system-parameters/socials",
      );
      const params = res.data.data ?? [];
      const youtube = params.find((p) => p.key === "youtube");
      return youtube?.value || null;
    },
    staleTime: 60 * 60 * 1000,
  });

  const embedId = youtubeUrl ? getYoutubeEmbedId(youtubeUrl) : null;

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
              <Link
                href={ROUTES.SIGN_UP}
                className="flex justify-center items-center gap-2 w-full font-light rounded-4xl border-2 bg-white border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 transition-colors duration-200 h-[54px] px-2 py-2 text-lg"
              >
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
              </Link>
            </div>
          </div>

          {/* Video - Right Side */}
          <div className="flex-1 min-h-96 self-end">
            <div className="bg-card-bg rounded-3xl relative w-full min-h-96 overflow-hidden">
              {embedId ? (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-3xl"
                  src={`https://www.youtube.com/embed/${embedId}`}
                  title={howToSection.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src="/images/landing/how/video-thumbnail.png"
                  alt="How to tutorial thumbnail"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
