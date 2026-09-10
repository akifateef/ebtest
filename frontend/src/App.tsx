import { useEffect, useState } from "react";
import SetupScreen from "./components/SetupScreen";
import QuizScreen from "./components/QuizScreen";
import ExamResultScreen from "./components/ExamResultScreen";
import ExamReviewScreen from "./components/ExamReviewScreen";
import { buildQuestionOrder, getQuestion } from "./quiz";
import { STATES } from "./data/states";
import {
  clearAnswers,
  loadAnswers,
  loadSession,
  saveAnswers,
  saveSession,
} from "./storage";
import type {
  AnswersMap,
  ExamResult,
  QuestionOrder,
  QuizSectionType,
  QuizSession,
} from "./types";
import { EXAM_PASS_THRESHOLD } from "./types";
import { useTranslation } from "./i18n/LanguageContext";
import "./App.css";

const EXAM_DEEP_LINK_PARAM = "exam";

// Supports opening a URL like "?exam=berlin" to jump straight into the exam
// simulation for that Bundesland, bypassing the setup screen entirely.
function getExamDeepLinkStateId(): string | null {
  if (typeof window === "undefined") return null;
  const stateParam = new URLSearchParams(window.location.search).get(
    EXAM_DEEP_LINK_PARAM
  );
  if (!stateParam) return null;
  return STATES.some((s) => s.id === stateParam) ? stateParam : null;
}

// Keeps the "?exam=<stateId>" query param in the address bar in sync with
// whichever exam is currently active, so the URL is always a valid direct
// link back to it (and can be bookmarked/shared from any point).
function setExamQueryParam(stateId: string | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (stateId) {
    url.searchParams.set(EXAM_DEEP_LINK_PARAM, stateId);
  } else {
    url.searchParams.delete(EXAM_DEEP_LINK_PARAM);
  }
  window.history.replaceState(null, "", url.toString());
}

export default function App() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<AnswersMap>(() => loadAnswers());
  const [session, setSession] = useState<QuizSession | null>(() => {
    const deepLinkStateId = getExamDeepLinkStateId();
    const existing = loadSession();
    if (deepLinkStateId) {
      // If an exam for this exact state is already in progress (e.g. the
      // page was just refreshed), resume it instead of starting over.
      if (existing?.section === "exam" && existing.stateId === deepLinkStateId) {
        return existing;
      }
      return {
        section: "exam",
        stateId: deepLinkStateId,
        order: "random",
        questionIds: buildQuestionOrder("exam", deepLinkStateId, "random"),
        currentIndex: 0,
        examStartedAt: Date.now(),
      };
    }
    return existing;
  });
  const [view, setView] = useState<"setup" | "quiz" | "examResult" | "examReview">(
    () => (getExamDeepLinkStateId() ? "quiz" : "setup")
  );
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

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
    section: QuizSectionType,
    stateId: string | null,
    order: QuestionOrder
  ) {
    const questionIds = buildQuestionOrder(section, stateId, order, answers);
    setSession({
      section,
      stateId,
      order,
      questionIds,
      currentIndex: 0,
      examStartedAt: section === "exam" ? Date.now() : undefined,
    });
    setView("quiz");
    setExamQueryParam(section === "exam" ? stateId : null);
  }

  function handleResume() {
    if (!session) return;
    setView("quiz");
    setExamQueryParam(session.section === "exam" ? session.stateId : null);
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

  function handleAbortExam() {
    if (window.confirm(t("examAbortConfirm"))) {
      setSession(null);
      setView("setup");
      setExamQueryParam(null);
    }
  }

  function handleFinishExam(timedOut: boolean) {
    if (!session) return;
    const total = session.questionIds.length;
    const correct = session.questionIds.filter(
      (id) => answers[id] === getQuestion(id)?.correctIndex
    ).length;
    setExamResult({
      total,
      correct,
      passed: correct >= EXAM_PASS_THRESHOLD,
      timedOut,
      stateId: session.stateId,
      questionIds: session.questionIds,
    });
    setSession(null);
    setView("examResult");
    setExamQueryParam(null);
  }

  function handleReviewExam() {
    setView("examReview");
  }

  function handleBackToExamResult() {
    setView("examResult");
  }

  function handleExamBackToOverview() {
    setExamResult(null);
    setView("setup");
  }

  function handleRetryExam() {
    if (!examResult) return;
    handleStart("exam", examResult.stateId, "random");
    setExamResult(null);
  }

  function handleReset() {
    if (window.confirm(t("resetConfirm"))) {
      clearAnswers();
      setAnswers({});
    }
  }

  if (view === "examReview" && examResult) {
    return (
      <ExamReviewScreen
        questionIds={examResult.questionIds}
        answers={answers}
        onBack={handleBackToExamResult}
      />
    );
  }

  if (view === "examResult" && examResult) {
    return (
      <ExamResultScreen
        result={examResult}
        onBackToOverview={handleExamBackToOverview}
        onRetry={handleRetryExam}
        onReview={handleReviewExam}
      />
    );
  }

  return (
    <>
      {view === "setup" || !session ? (
        <SetupScreen
          answers={answers}
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
          onFinishExam={handleFinishExam}
          onAbortExam={handleAbortExam}
        />
      )}
    </>
  );
}
