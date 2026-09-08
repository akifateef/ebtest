import { useEffect, useState } from "react";
import SetupScreen from "./components/SetupScreen";
import QuizScreen from "./components/QuizScreen";
import { buildQuestionOrder } from "./quiz";
import {
  clearAnswers,
  loadAnswers,
  loadSession,
  saveAnswers,
  saveSession,
} from "./storage";
import type { AnswersMap, QuestionOrder, QuizSession } from "./types";
import { useTranslation } from "./i18n/LanguageContext";
import "./App.css";

export default function App() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<AnswersMap>(() => loadAnswers());
  const [session, setSession] = useState<QuizSession | null>(() => loadSession());
  const [view, setView] = useState<"setup" | "quiz">("setup");

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    document.title = t("appTitle");
  }, [t]);

  function handleStart(
    section: "general" | "state",
    stateId: string | null,
    order: QuestionOrder
  ) {
    const questionIds = buildQuestionOrder(section, stateId, order);
    setSession({ section, stateId, order, questionIds, currentIndex: 0 });
    setView("quiz");
  }

  function handleResume() {
    if (session) setView("quiz");
  }

  function handleSelect(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleNext() {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            currentIndex: Math.min(prev.currentIndex + 1, prev.questionIds.length - 1),
          }
        : prev
    );
  }

  function handleBack() {
    setSession((prev) =>
      prev ? { ...prev, currentIndex: Math.max(prev.currentIndex - 1, 0) } : prev
    );
  }

  function handleExit() {
    setView("setup");
  }

  function handleReset() {
    if (window.confirm(t("resetConfirm"))) {
      clearAnswers();
      setAnswers({});
    }
  }

  return (
    <>
      {view === "setup" || !session ? (
        <SetupScreen
          onStart={handleStart}
          onReset={handleReset}
          hasSession={!!session}
          onResume={handleResume}
        />
      ) : (
        <QuizScreen
          session={session}
          answers={answers}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
          onExit={handleExit}
          onReset={handleReset}
        />
      )}
    </>
  );
}
