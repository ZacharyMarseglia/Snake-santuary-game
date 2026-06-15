import { useCallback, useEffect, useState } from "react";
import { narrationManager } from "../services/NarrationManager.js";
import { t } from "../i18n/localization.js";

export function NarrationControls({ title, story, lesson, settings = {} }) {
  const [reading, setReading] = useState(false);
  const [, setVoiceVersion] = useState(0);
  const supported = narrationManager.supported();
  const language = settings.language || "en";
  const voiceAvailable = narrationManager.hasVoiceForLanguage(language);

  const read = useCallback(() => {
    narrationManager.speak({ title, story, lesson }, settings, setReading);
  }, [title, story, lesson, settings]);

  useEffect(() => {
    if (settings.narration && supported) read();
    return () => narrationManager.stop();
  }, [read, settings.narration, supported, voiceAvailable]);

  useEffect(() => narrationManager.subscribeToVoices(() => {
    setVoiceVersion((current) => current + 1);
  }), []);

  if (!supported) return <small className="narration-unavailable">{t("narrationUnavailable", language)}</small>;
  if (!voiceAvailable) return <small className="narration-unavailable">{t("chineseVoiceUnavailable", language)}</small>;

  return (
    <div className="narration-controls">
      {reading ? (
        <button type="button" onClick={() => narrationManager.stop()}>{t("stopReading", language)}</button>
      ) : (
        <button type="button" onClick={read}>{t("readAloud", language)}</button>
      )}
    </div>
  );
}
