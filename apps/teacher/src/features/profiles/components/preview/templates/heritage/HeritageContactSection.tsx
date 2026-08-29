"use client";

import type { ThemeColors } from "../../../../types/theme.types";

interface HeritageContactSectionProps {
  content: {
    title: string;
  };
  whatsappNumber?: string | null;
  theme: ThemeColors;
}

export const HeritageContactSection = ({
  content,
  whatsappNumber,
  theme,
}: HeritageContactSectionProps) => {
  const handleContact = () => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${cleanNumber}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="px-4 py-12">
      <div className="mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 w-[85%]">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: theme.primary, opacity: 0.5 }}
          />
          <h3
            className="text-[18px] md:text-[28px] font-semibold whitespace-nowrap"
            style={{ color: theme.primary }}
          >
            {content.title}
          </h3>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: theme.primary, opacity: 0.5 }}
          />
        </div>

        <div className="flex items-center gap-3" dir="ltr">
          <span
            className="text-[18px] md:text-[24px] font-medium tracking-wide"
            style={{ color: theme.text }}
          >
            {whatsappNumber}
          </span>
          <button
            onClick={handleContact}
            disabled={!whatsappNumber}
            className="cursor-pointer transition-all hover:opacity-80 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent border-0 p-0"
            title="تواصل عبر واتس أب"
            aria-label="WhatsApp"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/profiles/heritage/whatsapp.svg"
              alt="WhatsApp"
              className="w-6 h-6 md:w-8 md:h-8"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
