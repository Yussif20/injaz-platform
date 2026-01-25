"use client";

import Image from "next/image";
import type { ThemeColors } from "../../../../types/theme.types";

interface DarkContactSectionProps {
  content: {
    title: string;
  };
  whatsappNumber?: string | null;
  theme: ThemeColors;
}

export const DarkContactSection = ({
  content,
  whatsappNumber,
}: DarkContactSectionProps) => {
  const handleContact = () => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${cleanNumber}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="px-4 py-12 text-center">
      <div className="max-w-300 mx-auto flex flex-col items-center gap-4">
        {/* Contact Icon and Text */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-6 h-6 md:w-12.5 md:h-12.5 relative">
            <Image src="/images/profiles/dark/contact.svg" alt="Contact" fill />
          </div>
          <h3 className="text-[18px] md:text-[28px] font-semibold text-white">
            {content.title}
          </h3>
        </div>

        {/* WhatsApp Icon */}
        <div
          onClick={handleContact}
          className="cursor-pointer transition-all hover:opacity-80 hover:scale-110"
          title="تواصل عبر واتس أب"
        >
          <Image
            src="/images/profiles/dark/whatsapp.svg"
            alt="WhatsApp"
            width={24}
            height={24}
            className="w-6 h-6 md:w-17.5 md:h-17.5"
          />
        </div>
      </div>
    </div>
  );
};
