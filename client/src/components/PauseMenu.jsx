import { t } from "../i18n/localization.js";

export function PauseMenu({ onResume, onSettings, onStorybook, onGuide, onMainMenu, language = "en" }) {
  return (
    <div className="pause-backdrop">
      <article className="pause-card">
        <div className="pause-rune">II</div>
        <p className="eyebrow">{t("adventurePaused", language)}</p>
        <h2>{t("pauseTitle", language)}</h2>
        <p>{t("pauseBody", language)}</p>
        <div className="pause-actions">
          <button className="primary-button" onClick={onResume}>{t("resumeAdventure", language)}</button>
          <button onClick={onGuide}>{t("characterGuide", language)}</button>
          <button onClick={onStorybook}>{t("storybook", language)}</button>
          <button onClick={onSettings}>{t("settings", language)}</button>
          <button className="quiet-button" onClick={onMainMenu}>{t("returnMainMenu", language)}</button>
        </div>
        <small>{t("resumeHint", language)}</small>
      </article>
    </div>
  );
}
