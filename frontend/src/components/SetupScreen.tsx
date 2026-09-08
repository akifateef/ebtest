import { useMemo, useState } from "react";
import { STATES } from "../data/states";
import { ALL_QUESTIONS } from "../quiz";
import type { AnswersMap, QuestionOrder } from "../types";

interface Props {
  answers: AnswersMap;
  onStart: (
    section: "general" | "state",
    stateId: string | null,
    order: QuestionOrder
  ) => void;
  onReset: () => void;
  hasSession: boolean;
  onResume: () => void;
}

export default function SetupScreen({
  answers,
  onStart,
  onReset,
  hasSession,
  onResume,
}: Props) {
  const [section, setSection] = useState<"general" | "state">("general");
  const [stateId, setStateId] = useState<string>(STATES[0].id);
  const [order, setOrder] = useState<QuestionOrder>("sequential");

  const stats = useMemo(() => {
    const total = ALL_QUESTIONS.length;
    const answeredIds = Object.keys(answers);
    const answered = answeredIds.length;
    const correct = answeredIds.filter(
      (id) => answers[id] === ALL_QUESTIONS.find((q) => q.id === id)?.correctIndex
    ).length;
    return { total, answered, correct };
  }, [answers]);

  return (
    <div className="screen setup-screen">
      <div className="card">
        <h1>Einbürgerungstest Trainer</h1>
        <p className="subtitle">
          Übe die 300 allgemeinen Fragen sowie die 10 Fragen deines
          Bundeslandes zum Test „Leben in Deutschland“.
        </p>

        <div className="stats-box">
          <div>
            <strong>{stats.answered}</strong> / {stats.total} beantwortet
          </div>
          <div>
            <strong>{stats.correct}</strong> richtig beantwortet
          </div>
        </div>

        {hasSession && (
          <button className="btn btn-secondary full-width" onClick={onResume}>
            Letzte Sitzung fortsetzen
          </button>
        )}

        <fieldset className="field-group">
          <legend>Fragenbereich</legend>
          <label className="radio-row">
            <input
              type="radio"
              name="section"
              checked={section === "general"}
              onChange={() => setSection("general")}
            />
            Allgemeine Fragen (300)
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="section"
              checked={section === "state"}
              onChange={() => setSection("state")}
            />
            Fragen für ein Bundesland (10)
          </label>

          {section === "state" && (
            <select
              className="select"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
            >
              {STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </fieldset>

        <fieldset className="field-group">
          <legend>Reihenfolge</legend>
          <label className="radio-row">
            <input
              type="radio"
              name="order"
              checked={order === "sequential"}
              onChange={() => setOrder("sequential")}
            />
            Der Reihe nach
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="order"
              checked={order === "random"}
              onChange={() => setOrder("random")}
            />
            Zufällige Reihenfolge
          </label>
        </fieldset>

        <button
          className="btn btn-primary full-width"
          onClick={() => onStart(section, section === "state" ? stateId : null, order)}
        >
          Test starten
        </button>

        <button className="btn btn-link full-width" onClick={onReset}>
          Fortschritt zurücksetzen
        </button>
      </div>
    </div>
  );
}
