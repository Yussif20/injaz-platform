"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { SocialsForm } from "@/features/socials";
import { Phone, ChevronLeft } from "lucide-react";

export default function SocialsPage() {
  const { t } = useTranslation();
  const socialsT = t("socials");

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center text-text-dark">
          <Phone className="inline-block h-6 w-6 ml-2" />
          <h1 className="text-xl font-normal">{socialsT.title}</h1>
        </div>
        <button className="flex items-center text-primary-500">
          <h1 className="text-lg font-light">{socialsT.goBack}</h1>
          <ChevronLeft className="inline-block h-6 w-6 mr-2" />
        </button>
      </div>

      <div className="mt-8">
        <SocialsForm />
      </div>
    </div>
  );
}
