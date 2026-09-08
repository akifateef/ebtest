import { useMemo } from "react";
import { getQuestion } from "../quiz";
import { assetPath } from "../assetPath";
import type { AnswersMap, QuizSession } from "../types";
import OptionButton from "./OptionButton";
import { STATES } from "../data/states";

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
  const { questionIds, currentIndex } = session;
  const questionId = questionIds[currentIndex];
  const question = getQuestion(questionId);

  const title = useMemo(() => {
    if (session.section === "general") return "Allgemeine Fragen";
    const state = STATES.find((s) => s.id === session.stateId);
    return state ? `Bundesland: ${state.name}` : "Bundesland";
  }, [session]);

  if (!question) {
    return (
      <div className="screen quiz-screen">
        <div className="card">
          <p>Frage konnte nicht geladen werden.</p>
          <button className="btn btn-secondary" onClick={onExit}>
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  const selected = answers[questionId];
  const answered = selected !== undefined;
  const progressPct = ((currentIndex + 1) / questionIds.length) * 100;

  return (
    <div className="screen quiz-screen">
      <div className="card">
        <div className="quiz-header">
          <button className="btn btn-link" onClick={onExit}>
            ← Übersicht
          </button>
          <span className="quiz-title">{title}</span>
          <button className="btn btn-link" onClick={onReset}>
            Zurücksetzen
          </button>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="progress-label">
          Frage {currentIndex + 1} von {questionIds.length}
        </div>

        <h2 className="question-text">{question.question}</h2>

        {question.contextImage && (
          <figure className="context-figure">
            <img
              src={assetPath(question.contextImage)}
              alt=""
              className="context-image"
            />
            {(question.contextCaption || question.imageCredit) && (
              <figcaption>
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
            Zurück
          </button>
          <button
            className="btn btn-primary"
            onClick={currentIndex === questionIds.length - 1 ? onExit : onNext}
          >
            {currentIndex === questionIds.length - 1 ? "Fertig" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
