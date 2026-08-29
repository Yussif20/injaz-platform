"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, content } from "@/lib/content";

const DEFAULT_LOCALE: Locale = "ar";

interface TranslationContextType {
  locale: Locale;
  t: (namespace: keyof (typeof content)[Locale]) => any;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = DEFAULT_LOCALE;

  const t = (namespace: keyof (typeof content)[Locale]) => {
    return content[locale][namespace];
  };

  return (
    <TranslationContext.Provider value={{ locale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
