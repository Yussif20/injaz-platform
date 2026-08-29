"use client";

import React from "react";
import Link from "next/link";
import { landingContent } from "@/content";
import { Accordion } from "@/shared/components/ui";
import Image from "next/image";

export const FAQSection: React.FC = () => {
  const { faqSection } = landingContent;
  const whatsappUrl = `https://wa.me/${faqSection.whatsappNumber}`;

  const accordionItems = faqSection.questions.map((q) => {
    const questionWithLink = q as typeof q & { answerWhatsappLabel?: string };
    const content =
      questionWithLink.answerWhatsappLabel && faqSection.whatsappNumber
        ? (
            <>
              {questionWithLink.answer.split(". ")[0]} على{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 underline hover:text-primary-800"
                dir="ltr"
              >
                +{faqSection.whatsappNumber}
              </a>
              . {questionWithLink.answer.split(". ").slice(1).join(". ")}
            </>
          )
        : q.answer;
    return {
      id: q.id,
      title: q.question,
      content,
    };
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-28">
          {/* Contact Box - Right side on desktop (sized to content) */}
          <div className="lg:w-fit lg:shrink-0 flex flex-col items-start text-right">
            <h2 className="text-[18px] sm:text-2xl lg:text-[28px] font-normal text-[#333] mb-2">
              {faqSection.title}
            </h2>
            <div className="lg:block hidden mt-6 mb-10">
              <p className="text-primary-500 text-[18px] font-light mb-2">
                {faqSection.contactUs}
              </p>
              <p className="text-[#666] text-[18px] font-light mb-6">
                {faqSection.contactDescription}
              </p>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full justify-center items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-3xl hover:bg-primary-800 transition-colors"
              >
                <Image
                  src="/icons/ui/support-white.svg"
                  alt="Support Icon"
                  width={24}
                  height={24}
                />
                <span>{faqSection.supportButton}</span>
              </Link>
            </div>{" "}
          </div>

          {/* FAQ Accordion - Left side on desktop (takes remaining space) */}
          <div className="lg:flex-1 lg:min-w-0">
            <Accordion items={accordionItems} />
          </div>
          <div className="lg:hidden w-full">
            <p className="text-primary-500 text-base md:text-[18px] font-light mb-2">
              {faqSection.contactUs}
            </p>
            <p className="text-grey-500 text-sm md:text-[18px] font-light mb-6">
              {faqSection.contactDescription}
            </p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full justify-center items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-3xl hover:bg-primary-700 transition-colors"
            >
              <Image
                src="/icons/ui/support-white.svg"
                alt="Support Icon"
                width={24}
                height={24}
              />
              <span>{faqSection.supportButton}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
