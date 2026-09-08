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

export interface QuizSession {
  section: "general" | "state";
  stateId: string | null;
  order: QuestionOrder;
  questionIds: string[];
  currentIndex: number;
}

export type AnswersMap = Record<string, number>;
