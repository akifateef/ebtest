export interface QuestionOption {
  text: string | null;
  image: string | null;
}

export interface Question {
  id: string;
  number: number;
  section: "general" | "state";
  stateId: string | null;
  stateName: string | null;
  category: string | null;
  question: string;
  imageCredit: string | null;
  options: QuestionOption[];
  correctIndex: number;
  contextImage: string | null;
  contextCaption: string | null;
}

export type QuestionOrder = "sequential" | "random";

export type QuizSectionType = "general" | "state" | "mistakes" | "exam";

export interface QuizSession {
  section: QuizSectionType;
  stateId: string | null;
  order: QuestionOrder;
  questionIds: string[];
  currentIndex: number;
  examStartedAt?: number;
}

export type AnswersMap = Record<string, number>;

export interface ExamResult {
  total: number;
  correct: number;
  passed: boolean;
  timedOut: boolean;
  stateId: string | null;
  questionIds: string[];
}

export const EXAM_QUESTION_COUNT = 33;
export const EXAM_GENERAL_COUNT = 30;
export const EXAM_STATE_COUNT = 3;
export const EXAM_PASS_THRESHOLD = 17;
export const EXAM_DURATION_MS = 60 * 60 * 1000;
