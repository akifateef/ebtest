import type { AnswersMap, QuizSession } from "./types";

const ANSWERS_KEY = "lid_answers_v1";
const SESSION_KEY = "lid_session_v1";

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
