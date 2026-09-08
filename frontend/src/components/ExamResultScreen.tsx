import { useTranslation } from "../i18n/LanguageContext";
import type { ExamResult } from "../types";
import { EXAM_PASS_THRESHOLD } from "../types";
import SettingsBar from "./SettingsBar";

interface Props {
  result: ExamResult;
  onBackToOverview: () => void;
  onRetry: () => void;
  onReview: () => void;
}

export default function ExamResultScreen({
  result,
  onBackToOverview,
  onRetry,
  onReview,
}: Props) {
  const { t } = useTranslation();
  const { total, correct, passed, timedOut } = result;

  return (
    <div className="screen setup-screen">
      <div className="page-wrap">
        <SettingsBar />

        <div className="card card-plain">
          <h1>{t("examResultTitle")}</h1>

          {timedOut && <p className="subtitle">{t("examTimeUp")}</p>}

          <div
            className={`exam-result-badge ${
              passed ? "exam-result-pass" : "exam-result-fail"
            }`}
          >
            {passed ? t("examPassed") : t("examFailed")}
          </div>

          <p className="exam-score">
            {t("examScoreLabel", { correct, total })}
          </p>
          <p className="subtitle">
            {t("examPassThreshold", { min: EXAM_PASS_THRESHOLD, total })}
          </p>

          <button
            className="btn btn-secondary full-width"
            onClick={onReview}
          >
            {t("reviewAnswersButton")}
          </button>
          <button className="btn btn-primary full-width" onClick={onRetry}>
            {t("retryExamButton")}
          </button>
          <button
            className="btn btn-link full-width"
            onClick={onBackToOverview}
          >
            {t("backToOverview")}
          </button>
        </div>
      </div>
    </div>
  );
}
