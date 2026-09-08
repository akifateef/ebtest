import { useEffect, useMemo, useState } from "react";
import { getQuestion } from "../quiz";
import { assetPath } from "../assetPath";
import type { AnswersMap, QuizSession } from "../types";
import { EXAM_DURATION_MS } from "../types";
import OptionButton from "./OptionButton";
import { STATES } from "../data/states";
import { useTranslation } from "../i18n/LanguageContext";

interface Props {
  session: QuizSession;
  answers: AnswersMap;
  onSelect: (questionId: string, optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  onReset: () => void;
  onFinishExam: (timedOut: boolean) => void;
  onAbortExam: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function QuizScreen({
  session,
  answers,
  onSelect,
  onNext,
  onBack,
  onExit,
  onReset,
  onFinishExam,
  onAbortExam,
}: Props) {
  const { t } = useTranslation();
  const { questionIds, currentIndex } = session;
  const questionId = questionIds[currentIndex];
  const question = getQuestion(questionId);
  const isExam = session.section === "exam";

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isExam) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isExam]);

  const remainingMs =
    isExam && session.examStartedAt
      ? Math.max(0, session.examStartedAt + EXAM_DURATION_MS - now)
      : null;

  useEffect(() => {
    if (isExam && remainingMs === 0) {
      onFinishExam(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs]);

  const title = useMemo(() => {
    if (session.section === "general") return t("generalTitle");
    if (session.section === "mistakes") return t("mistakesTitle");
    if (session.section === "exam") return t("examTitle");
    const state = STATES.find((s) => s.id === session.stateId);
    return state ? `${t("stateLabel")}: ${state.name}` : t("stateLabel");
  }, [session, t]);

  if (!question) {
    return (
      <div className="screen quiz-screen">
        <div className="page-wrap">
          <div className="card card-plain">
            <p>{t("loadError")}</p>
            <button className="btn btn-secondary" onClick={onExit}>
              {t("backToOverview")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selected = answers[questionId];
  const answered = selected !== undefined;
  const progressPct = ((currentIndex + 1) / questionIds.length) * 100;
  const isLastQuestion = currentIndex === questionIds.length - 1;

  function handleFinishOrNext() {
    if (isLastQuestion) {
      if (isExam) {
        onFinishExam(false);
      } else {
        onExit();
      }
    } else {
      onNext();
    }
  }

  return (
    <div className="screen quiz-screen">
      <div className="page-wrap">
        <div className="card card-plain">
          <div className="quiz-header">
            <button className="btn btn-link" onClick={onExit}>
              ← {t("overview")}
            </button>
            <span className="quiz-title">{title}</span>
            {isExam ? (
              <button className="btn btn-link" onClick={onAbortExam}>
                {t("abortExamLink")}
              </button>
            ) : (
              <button className="btn btn-link" onClick={onReset}>
                {t("resetLink")}
              </button>
            )}
          </div>

          {isExam && remainingMs !== null && (
            <div
              className={`exam-timer ${
                remainingMs <= 5 * 60 * 1000 ? "exam-timer-low" : ""
              }`}
            >
              {t("examTimeRemaining", { time: formatTime(remainingMs) })}
            </div>
          )}

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="progress-label">
            {t("progressLabel", {
              current: currentIndex + 1,
              total: questionIds.length,
            })}
          </div>

          <h2 className="question-text" dir="ltr">{question.question}</h2>

          {question.contextImage && (
            <figure className="context-figure">
              <img
                src={assetPath(question.contextImage)}
                alt=""
                className="context-image"
              />
              {(question.contextCaption || question.imageCredit) && (
                <figcaption dir="ltr">
                  {question.contextCaption}
                  {question.contextCaption && question.imageCredit ? " · " : ""}
                  {question.imageCredit}
                </figcaption>
              )}
            </figure>
          )}

          <div
            className={`options-grid ${
              question.options[0].image ? "options-grid-image" : ""
            }`}
            dir="ltr"
          >
            {question.options.map((opt, idx) => (
              <OptionButton
                key={idx}
                option={{
                  text: opt.text,
                  image: opt.image ? assetPath(opt.image) : null,
                }}
                index={idx}
                isSelected={selected === idx}
                isCorrect={idx === question.correctIndex}
                answered={answered}
                revealAnswer={!isExam}
                onClick={() => onSelect(questionId, idx)}
              />
            ))}
          </div>

          <div className="quiz-footer">
            <button
              className="btn btn-secondary"
              onClick={onBack}
              disabled={currentIndex === 0}
            >
              {t("backButton")}
            </button>
            <button className="btn btn-primary" onClick={handleFinishOrNext}>
              {isLastQuestion ? t("finishButton") : t("nextButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
