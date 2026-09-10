import { useState } from "react";
import { getQuestion } from "../quiz";
import { assetPath } from "../assetPath";
import type { AnswersMap } from "../types";
import OptionButton from "./OptionButton";
import { useTranslation } from "../i18n/LanguageContext";
import SettingsBar from "./SettingsBar";

interface Props {
  questionIds: string[];
  answers: AnswersMap;
  onBack: () => void;
}

export default function ExamReviewScreen({
  questionIds,
  answers,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const questionId = questionIds[index];
  const question = getQuestion(questionId);

  if (!question) {
    return (
      <div className="screen quiz-screen">
        <div className="page-wrap">
          <SettingsBar />
          <div className="card card-plain">
            <p>{t("loadError")}</p>
            <button className="btn btn-secondary" onClick={onBack}>
              {t("backToResultsButton")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selected = answers[questionId];
  const isAnswered = selected !== undefined;
  const isCorrect = selected === question.correctIndex;
  const progressPct = ((index + 1) / questionIds.length) * 100;
  const isLast = index === questionIds.length - 1;

  let statusClass = "review-status-unanswered";
  let statusLabel = t("examReviewUnanswered");
  if (isAnswered) {
    statusClass = isCorrect ? "review-status-correct" : "review-status-wrong";
    statusLabel = isCorrect ? t("examReviewCorrect") : t("examReviewWrong");
  }

  return (
    <div className="screen quiz-screen">
      <div className="page-wrap">
        <SettingsBar />

        <div className="card card-plain">
          <div className="quiz-header">
            <button className="btn btn-link" onClick={onBack}>
              ← {t("examResultTitle")}
            </button>
            <span className="quiz-title">{t("examReviewTitle")}</span>
            <span className={`review-status ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="progress-label">
            {t("progressLabel", {
              current: index + 1,
              total: questionIds.length,
            })}
          </div>

          <h2 className="question-text" dir="ltr">
            {question.question}
          </h2>

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
                answered
                revealAnswer
                readOnly
                onClick={() => {}}
              />
            ))}
          </div>

          <div className="quiz-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              {t("backButton")}
            </button>
            {isLast ? (
              <button className="btn btn-primary" onClick={onBack}>
                {t("backToResultsButton")}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  setIndex((i) => Math.min(questionIds.length - 1, i + 1))
                }
              >
                {t("nextButton")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
