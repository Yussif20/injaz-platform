"use client";

import React from "react";
import Link from "next/link";
import { landingContent } from "@/content";
import { Accordion } from "@/shared/components/ui";
import Image from "next/image";

export const FAQSection: React.FC = () => {
  const { faqSection } = landingContent;

  const accordionItems = faqSection.questions.map((q) => ({
    id: q.id,
    title: q.question,
    content: q.answer,
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-28">
          {/* Contact Box - Right side on desktop */}
          <div className="lg:w-1/3 flex flex-col items-start text-right">
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
                href="https://wa.me/966548635554"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full  justify-center items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-3xl hover:bg-primary-700 transition-colors"
              >
                <Image
                  src="/icons/support-white.svg"
                  alt="Support Icon"
                  width={24}
                  height={24}
                />
                <span>{faqSection.supportButton}</span>
              </Link>
            </div>{" "}
          </div>

          {/* FAQ Accordion - Left side on desktop */}
          <div className="lg:w-2/3">
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
              href="https://wa.me/966548635554"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full md:w-1/3 justify-center items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-3xl hover:bg-primary-600 transition-colors"
            >
              <Image
                src="/icons/support-white.svg"
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
