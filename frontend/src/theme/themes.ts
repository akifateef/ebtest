import type { TranslationKey } from "../i18n/translations";

export type ThemeId = "light" | "dark" | "solarized-light" | "solarized-dark";

export interface ThemeInfo {
  id: ThemeId;
  labelKey: TranslationKey;
}

export const THEMES: ThemeInfo[] = [
  { id: "light", labelKey: "themeLight" },
  { id: "dark", labelKey: "themeDark" },
  { id: "solarized-light", labelKey: "themeSolarizedLight" },
  { id: "solarized-dark", labelKey: "themeSolarizedDark" },
];

export const DEFAULT_THEME: ThemeId = "light";
