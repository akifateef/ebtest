import { useTranslation } from "../i18n/LanguageContext";
import { LANGUAGES, type LanguageCode } from "../i18n/languages";
import { useTheme } from "../theme/ThemeContext";
import { THEMES, type ThemeId } from "../theme/themes";

export default function SettingsBar() {
  const { language, setLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-bar">
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
    </div>
  );
}
