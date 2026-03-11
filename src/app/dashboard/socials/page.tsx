"use client";

import { useTranslation } from "@/i18n/TranslationContext";
import { useRouter } from "@/i18n/navigation";
import { SocialsForm } from "@/features/socials";
import { Phone, ChevronLeft } from "lucide-react";

export default function SocialsPage() {
  const { t } = useTranslation();
  const socialsT = t("socials");
  const commonT = t("common");
  const router = useRouter();

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center text-text-dark">
          <Phone className="inline-block h-6 w-6 me-2" />
          <h1 className="text-xl font-normal">{socialsT.title}</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="flex items-center text-primary-500"
        >
          <h1 className="text-lg font-light">{commonT.goBack}</h1>
          <ChevronLeft className="inline-block h-6 w-6 ms-2" />
        </button>
      </div>

      <div className="mt-8">
        <SocialsForm />
      </div>
    </div>
  );
}
