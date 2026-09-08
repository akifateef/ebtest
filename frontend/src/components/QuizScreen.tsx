import { useMemo } from "react";
import { getQuestion } from "../quiz";
import { assetPath } from "../assetPath";
import type { AnswersMap, QuizSession } from "../types";
import OptionButton from "./OptionButton";
import { STATES } from "../data/states";
import { useTranslation } from "../i18n/LanguageContext";
import SettingsBar from "./SettingsBar";

interface Props {
  session: QuizSession;
  answers: AnswersMap;
  onSelect: (questionId: string, optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  onReset: () => void;
}

export default function QuizScreen({
  session,
  answers,
  onSelect,
  onNext,
  onBack,
  onExit,
  onReset,
}: Props) {
  const { t } = useTranslation();
  const { questionIds, currentIndex } = session;
  const questionId = questionIds[currentIndex];
  const question = getQuestion(questionId);

  const title = useMemo(() => {
    if (session.section === "general") return t("generalTitle");
    const state = STATES.find((s) => s.id === session.stateId);
    return state ? `${t("stateLabel")}: ${state.name}` : t("stateLabel");
  }, [session, t]);

  if (!question) {
    return (
      <div className="screen quiz-screen">
        <div className="page-wrap">
          <SettingsBar />
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

  return (
    <div className="screen quiz-screen">
      <div className="page-wrap">
        <SettingsBar />

        <div className="card card-plain">
          <div className="quiz-header">
            <button className="btn btn-link" onClick={onExit}>
              ← {t("overview")}
            </button>
            <span className="quiz-title">{title}</span>
            <button className="btn btn-link" onClick={onReset}>
              {t("resetLink")}
            </button>
          </div>

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
            <button
              className="btn btn-primary"
              onClick={currentIndex === questionIds.length - 1 ? onExit : onNext}
            >
              {currentIndex === questionIds.length - 1
                ? t("finishButton")
                : t("nextButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
