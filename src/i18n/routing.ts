// Locale configuration
export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export const DEFAULT_LOCALE = "ar" as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
