import { useEffect, useMemo, useState } from "react";
import { STATES } from "../data/states";
import type { AnswersMap, QuestionOrder, QuizSectionType } from "../types";
import { useTranslation } from "../i18n/LanguageContext";
import SettingsBar from "./SettingsBar";
import { assetPath } from "../assetPath";
import { getWrongQuestionIds } from "../quiz";

const OFFICIAL_PDF_PATH = "docs/gesamtfragenkatalog-lebenindeutschland.pdf";

interface Props {
  answers: AnswersMap;
  onStart: (
    section: QuizSectionType,
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
  const { t } = useTranslation();
  const [section, setSection] = useState<QuizSectionType>("general");
  const [stateId, setStateId] = useState<string>(STATES[0].id);
  const [order, setOrder] = useState<QuestionOrder>("sequential");

  const wrongCount = useMemo(
    () => getWrongQuestionIds(answers).length,
    [answers]
  );

  useEffect(() => {
    if (section === "mistakes" && wrongCount === 0) {
      setSection("general");
    }
  }, [section, wrongCount]);

  return (
    <div className="screen setup-screen">
      <div className="page-wrap">
        <SettingsBar />

        <div className="card card-plain">
          <h1>{t("appTitle")}</h1>
          <p className="subtitle">{t("appSubtitle")}</p>

          {hasSession && (
            <button className="btn btn-secondary full-width" onClick={onResume}>
              {t("resumeSession")}
            </button>
          )}

          <fieldset className="field-group">
            <legend>{t("sectionLegend")}</legend>
            <label className="radio-row">
              <input
                type="radio"
                name="section"
                checked={section === "general"}
                onChange={() => setSection("general")}
              />
              {t("generalOption")}
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="section"
                checked={section === "state"}
                onChange={() => setSection("state")}
              />
              {t("stateOption")}
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="section"
                checked={section === "mistakes"}
                disabled={wrongCount === 0}
                onChange={() => setSection("mistakes")}
              />
              {t("mistakesOption", { count: wrongCount })}
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="section"
                checked={section === "exam"}
                onChange={() => setSection("exam")}
              />
              {t("examOption")}
            </label>

            {(section === "state" || section === "exam") && (
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

          {section !== "exam" && (
            <fieldset className="field-group">
              <legend>{t("orderLegend")}</legend>
              <label className="radio-row">
                <input
                  type="radio"
                  name="order"
                  checked={order === "sequential"}
                  onChange={() => setOrder("sequential")}
                />
                {t("sequentialOption")}
              </label>
              <label className="radio-row">
                <input
                  type="radio"
                  name="order"
                  checked={order === "random"}
                  onChange={() => setOrder("random")}
                />
                {t("randomOption")}
              </label>
            </fieldset>
          )}

          <button
            className="btn btn-primary full-width"
            onClick={() =>
              onStart(
                section,
                section === "state" || section === "exam" ? stateId : null,
                order
              )
            }
          >
            {t("startButton")}
          </button>

          <button className="btn btn-link full-width" onClick={onReset}>
            {t("resetProgress")}
          </button>

          <a
            className="btn btn-secondary full-width"
            href={assetPath(OFFICIAL_PDF_PATH)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("officialPdfButton")}
          </a>
        </div>
      </div>
    </div>
  );
}
