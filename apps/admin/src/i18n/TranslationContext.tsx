"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, content } from "@/lib/content";

const DEFAULT_LOCALE: Locale = "ar";

type Namespace = keyof (typeof content)[Locale];

interface TranslationContextType {
  locale: Locale;
  /**
   * Look up a namespace of copy. Generic over the namespace, so the caller gets that
   * namespace's real shape back. This used to return `any`, which is why nearly every call
   * site wrote `t("reviews") as any` — a cast that bought nothing and hid every mistyped
   * translation key behind it.
   */
  t: <N extends Namespace>(namespace: N) => (typeof content)[Locale][N];
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = DEFAULT_LOCALE;

  const t = <N extends Namespace>(namespace: N) => content[locale][namespace];

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
