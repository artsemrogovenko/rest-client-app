export const SUPPORTED_LOCALES = ["en", "ru"] as const;
export type Locale = typeof SUPPORTED_LOCALES[number]; // "en" | "ru";

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(lang: string | undefined): lang is Locale {
  return !!lang && (SUPPORTED_LOCALES as readonly string[]).includes(lang);
}