import { useState } from "react";
import { STATES } from "../data/states";
import type { QuestionOrder } from "../types";
import { useTranslation } from "../i18n/LanguageContext";
import SettingsBar from "./SettingsBar";

interface Props {
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
  onStart,
  onReset,
  hasSession,
  onResume,
}: Props) {
  const { t } = useTranslation();
  const [section, setSection] = useState<"general" | "state">("general");
  const [stateId, setStateId] = useState<string>(STATES[0].id);
  const [order, setOrder] = useState<QuestionOrder>("sequential");

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

          <button
            className="btn btn-primary full-width"
            onClick={() => onStart(section, section === "state" ? stateId : null, order)}
          >
            {t("startButton")}
          </button>

          <button className="btn btn-link full-width" onClick={onReset}>
            {t("resetProgress")}
          </button>
        </div>
      </div>
    </div>
  );
}
