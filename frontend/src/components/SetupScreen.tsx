import { useEffect, useMemo, useState } from "react";
import { STATES } from "../data/states";
import type { AnswersMap, QuestionOrder, QuizSectionType } from "../types";
import {
  EXAM_DURATION_MS,
  EXAM_GENERAL_COUNT,
  EXAM_PASS_THRESHOLD,
  EXAM_QUESTION_COUNT,
  EXAM_STATE_COUNT,
  QUESTION_POOL_SIZE,
} from "../types";
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
        <SettingsBar className="home-settings-bar" />

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

        <div className="card card-plain info-card">
          <h2>{t("infoTitle")}</h2>
          <p className="info-text">{t("infoCategoriesBody")}</p>
          <p className="info-text">
            {t("infoExamBody", {
              total: EXAM_QUESTION_COUNT,
              general: EXAM_GENERAL_COUNT,
              state: EXAM_STATE_COUNT,
              minutes: EXAM_DURATION_MS / 60000,
              pass: EXAM_PASS_THRESHOLD,
            })}
          </p>
        </div>

        <div className="card card-plain info-card">
          <h2>{t("aboutTestTitle")}</h2>
          <table className="about-test-table">
            <thead>
              <tr>
                <th>{t("aboutTestDetailColumn")}</th>
                <th>{t("aboutTestInfoColumn")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("aboutTestOfficialNameLabel")}</td>
                <td>{t("aboutTestOfficialNameValue")}</td>
              </tr>
              <tr>
                <td>{t("aboutTestQuestionsLabel")}</td>
                <td>
                  {t("aboutTestQuestionsValue", {
                    total: EXAM_QUESTION_COUNT,
                    pool: QUESTION_POOL_SIZE,
                  })}
                </td>
              </tr>
              <tr>
                <td>{t("aboutTestTimeLabel")}</td>
                <td>
                  {t("aboutTestTimeValue", {
                    minutes: EXAM_DURATION_MS / 60000,
                  })}
                </td>
              </tr>
              <tr>
                <td>{t("aboutTestPassLabel")}</td>
                <td>
                  {t("aboutTestPassValue", {
                    pass: EXAM_PASS_THRESHOLD,
                    total: EXAM_QUESTION_COUNT,
                  })}
                </td>
              </tr>
              <tr>
                <td>{t("aboutTestFeeLabel")}</td>
                <td>{t("aboutTestFeeValue")}</td>
              </tr>
              <tr>
                <td>{t("aboutTestFormatLabel")}</td>
                <td>{t("aboutTestFormatValue")}</td>
              </tr>
              <tr>
                <td>{t("aboutTestStateLabel")}</td>
                <td>
                  {t("aboutTestStateValue", {
                    state: EXAM_STATE_COUNT,
                    total: EXAM_QUESTION_COUNT,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
