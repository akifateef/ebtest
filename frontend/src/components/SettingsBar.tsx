import { useTranslation } from "../i18n/LanguageContext";
import { LANGUAGES, type LanguageCode } from "../i18n/languages";
import { useTheme } from "../theme/ThemeContext";
import { THEMES, type ThemeId } from "../theme/themes";
import { useFontSize } from "../theme/FontSizeContext";

interface Props {
  className?: string;
}

export default function SettingsBar({ className }: Props) {
  const { language, setLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { decreaseFontSize, increaseFontSize, canDecrease, canIncrease } =
    useFontSize();

  return (
    <div className={["settings-bar", className].filter(Boolean).join(" ")}>
      <label className="settings-field">
        <span className="settings-label">{t("languageLabel")}</span>
        <select
          className="select settings-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
            </option>
          ))}
        </select>
      </label>

      <label className="settings-field">
        <span className="settings-label">{t("themeLabel")}</span>
        <select
          className="select settings-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeId)}
        >
          {THEMES.map((th) => (
            <option key={th.id} value={th.id}>
              {t(th.labelKey)}
            </option>
          ))}
        </select>
      </label>

      <div className="settings-field settings-field-font-size">
        <span className="settings-label">{t("fontSizeLabel")}</span>
        <div className="font-size-controls">
          <button
            type="button"
            className="btn btn-secondary font-size-btn"
            onClick={decreaseFontSize}
            disabled={!canDecrease}
            aria-label={t("decreaseFontSize")}
            title={t("decreaseFontSize")}
          >
            A−
          </button>
          <button
            type="button"
            className="btn btn-secondary font-size-btn"
            onClick={increaseFontSize}
            disabled={!canIncrease}
            aria-label={t("increaseFontSize")}
            title={t("increaseFontSize")}
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
