import questionsData from "./data/questions.json";
import type { AnswersMap, Question, QuestionOrder, QuizSectionType } from "./types";
import { EXAM_GENERAL_COUNT, EXAM_STATE_COUNT } from "./types";

export const ALL_QUESTIONS = questionsData as Question[];

const QUESTIONS_BY_ID: Record<string, Question> = {};
for (const q of ALL_QUESTIONS) {
  QUESTIONS_BY_ID[q.id] = q;
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS_BY_ID[id];
}

export function getGeneralQuestions(): Question[] {
  return ALL_QUESTIONS.filter((q) => q.section === "general").sort(
    (a, b) => a.number - b.number
  );
}

export function getStateQuestions(stateId: string): Question[] {
  return ALL_QUESTIONS.filter(
    (q) => q.section === "state" && q.stateId === stateId
  ).sort((a, b) => a.number - b.number);
}

export function getWrongQuestionIds(answers: AnswersMap): string[] {
  return ALL_QUESTIONS.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== q.correctIndex
  ).map((q) => q.id);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildExamQuestionOrder(stateId: string): string[] {
  const generalIds = getGeneralQuestions().map((q) => q.id);
  const stateIds = getStateQuestions(stateId).map((q) => q.id);
  const chosenGeneral = shuffle(generalIds).slice(0, EXAM_GENERAL_COUNT);
  const chosenState = shuffle(stateIds).slice(0, EXAM_STATE_COUNT);
  return shuffle([...chosenGeneral, ...chosenState]);
}

export function buildQuestionOrder(
  section: QuizSectionType,
  stateId: string | null,
  order: QuestionOrder,
  answers: AnswersMap = {}
): string[] {
  if (section === "exam") {
    return buildExamQuestionOrder(stateId ?? "");
  }
  let ids: string[];
  if (section === "mistakes") {
    ids = getWrongQuestionIds(answers);
  } else {
    const questions =
      section === "general" ? getGeneralQuestions() : getStateQuestions(stateId ?? "");
    ids = questions.map((q) => q.id);
  }
  return order === "random" ? shuffle(ids) : ids;
}
