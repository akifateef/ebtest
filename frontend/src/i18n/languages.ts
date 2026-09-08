export type LanguageCode =
  | "de"
  | "en"
  | "tr"
  | "ar"
  | "ru"
  | "uk"
  | "pl"
  | "fr"
  | "es"
  | "it"
  | "zh"
  | "ja"
  | "ur";

export interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "de", nativeName: "Deutsch" },
  { code: "en", nativeName: "English" },
  { code: "tr", nativeName: "Türkçe" },
  { code: "ar", nativeName: "العربية" },
  { code: "ru", nativeName: "Русский" },
  { code: "uk", nativeName: "Українська" },
  { code: "pl", nativeName: "Polski" },
  { code: "fr", nativeName: "Français" },
  { code: "es", nativeName: "Español" },
  { code: "it", nativeName: "Italiano" },
  { code: "zh", nativeName: "中文" },
  { code: "ja", nativeName: "日本語" },
  { code: "ur", nativeName: "اردو" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "de";

export const RTL_LANGUAGES: LanguageCode[] = ["ar", "ur"];
