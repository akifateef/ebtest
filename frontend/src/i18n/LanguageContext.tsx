import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE, RTL_LANGUAGES, type LanguageCode } from "./languages";
import { TRANSLATIONS, type TranslationKey } from "./translations";
import { loadLanguage, saveLanguage } from "../storage";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(
    () => loadLanguage() ?? DEFAULT_LANGUAGE
  );

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute(
      "dir",
      RTL_LANGUAGES.includes(language) ? "rtl" : "ltr"
    );
  }, [language]);

  function setLanguage(next: LanguageCode) {
    setLanguageState(next);
  }

  function t(
    key: TranslationKey,
    vars?: Record<string, string | number>
  ): string {
    const template =
      TRANSLATIONS[language]?.[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key];
    if (!vars) return template;
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
      template
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
