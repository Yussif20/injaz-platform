"use client";

import React from "react";
import Link from "next/link";
import { landingContent } from "@/content";
import { Accordion } from "@/shared/components/ui";

export const FAQSection: React.FC = () => {
  const { faqSection } = landingContent;

  const accordionItems = faqSection.questions.map((q) => ({
    id: q.id,
    title: q.question,
    content: q.answer,
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Contact Box - Right side on desktop */}
          <div className="lg:w-1/3 flex flex-col items-end text-right">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-[#333] mb-2">
              {faqSection.title}
            </h2>
            <p className="text-primary-500 text-sm sm:text-base mb-2">
              {faqSection.contactUs}
            </p>
            <p className="text-grey-500 text-sm sm:text-base mb-6">
              {faqSection.contactDescription}
            </p>
            <Link
              href="https://wa.me/966548635554"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors"
            >
              <span>{faqSection.supportButton}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </Link>
          </div>

          {/* FAQ Accordion - Left side on desktop */}
          <div className="lg:w-2/3">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>
    </section>
  );
};
