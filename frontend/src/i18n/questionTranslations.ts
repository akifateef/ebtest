import type { LanguageCode } from "./languages";

export interface QuestionTranslation {
  question: string;
  options: (string | null)[];
}

type TranslationFile = Record<string, QuestionTranslation>;

// Each language file is its own chunk, so it is only downloaded when a user
// actually asks to see a translation, keeping the main bundle small.
const translationModules = import.meta.glob<{ default: TranslationFile }>(
  "../data/translations/*.json"
);

const cache = new Map<LanguageCode, TranslationFile>();
const pending = new Map<LanguageCode, Promise<TranslationFile | null>>();

export function hasQuestionTranslations(language: LanguageCode): boolean {
  return `../data/translations/${language}.json` in translationModules;
}

export async function loadQuestionTranslations(
  language: LanguageCode
): Promise<TranslationFile | null> {
  if (cache.has(language)) {
    return cache.get(language)!;
  }
  const path = `../data/translations/${language}.json`;
  const importer = translationModules[path];
  if (!importer) {
    return null;
  }
  if (!pending.has(language)) {
    const promise = importer().then((mod) => {
      cache.set(language, mod.default);
      return mod.default;
    });
    pending.set(language, promise);
  }
  return pending.get(language)!;
}

export function getCachedQuestionTranslation(
  language: LanguageCode,
  questionId: string
): QuestionTranslation | null {
  return cache.get(language)?.[questionId] ?? null;
}
