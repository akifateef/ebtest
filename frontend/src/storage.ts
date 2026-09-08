import type { AnswersMap, QuizSession } from "./types";
import type { LanguageCode } from "./i18n/languages";
import type { ThemeId } from "./theme/themes";

const ANSWERS_KEY = "lid_answers_v1";
const SESSION_KEY = "lid_session_v1";
const LANGUAGE_KEY = "lid_language_v1";
const THEME_KEY = "lid_theme_v1";

export function loadAnswers(): AnswersMap {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as AnswersMap) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(answers: AnswersMap): void {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function clearAnswers(): void {
  localStorage.removeItem(ANSWERS_KEY);
}

export function loadSession(): QuizSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as QuizSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: QuizSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function loadLanguage(): LanguageCode | null {
  try {
    return localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
  } catch {
    return null;
  }
}

export function saveLanguage(language: LanguageCode): void {
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function loadTheme(): ThemeId | null {
  try {
    return localStorage.getItem(THEME_KEY) as ThemeId | null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: ThemeId): void {
  localStorage.setItem(THEME_KEY, theme);
}
