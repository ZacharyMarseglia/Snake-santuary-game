import { useEffect, useMemo, useState } from "react";
import { audioManager } from "../services/AudioManager.js";
import { narrationManager } from "../services/NarrationManager.js";
import { languages, t } from "../i18n/localization.js";

const settingCopy = {
  music: ["ambientMusic", "ambientMusicHelp"],
  sound: ["soundEffects", "soundEffectsHelp"],
  narration: ["narration", "narrationHelp"],
  reducedMotion: ["reducedMotion", "reducedMotionHelp"]
};

export function SettingsPanel({ save, setSave, onLanguageChange, resetGame, hasPlayer }) {
  const [voices, setVoices] = useState(() => narrationManager.getVoices());
  const [testingVoice, setTestingVoice] = useState(false);
  const language = save.settings.language || "en";

  useEffect(() => {
    const unsubscribe = narrationManager.subscribeToVoices(setVoices);
    return () => {
      unsubscribe();
      narrationManager.stop();
    };
  }, []);

  const updateSetting = (key, value) => {
    setSave((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const languageVoices = useMemo(
    () => voices.filter((voice) => narrationManager.voiceMatchesLanguage(voice, language)),
    [voices, language]
  );
  const automaticVoice = useMemo(
    () => narrationManager.preferredVoice(language),
    [voices, language]
  );
  const selectedVoice = save.settings.narrationVoices?.[language] || "";
  const updateVoice = (value) => {
    setSave((current) => ({
      ...current,
      settings: {
        ...current.settings,
        narrationVoices: {
          ...(current.settings.narrationVoices || {}),
          [language]: value
        }
      }
    }));
  };
  const testVoice = () => {
    if (testingVoice) {
      narrationManager.stop();
      return;
    }
    narrationManager.speak(language === "zh" ? {
      title: "鳞片守护者",
      story: "欢迎来到河流、云朵、花园和星光闪耀的温馨世界。",
      lesson: "自然的每一部分都有故事可以分享。"
    } : {
      title: "The Scale Guardians",
      story: "Welcome, brave guardian, to a cozy world of rivers, clouds, gardens, and glowing stars.",
      lesson: "Every part of nature has a story to share."
    }, save.settings, setTestingVoice);
  };

  return (
    <div className="settings-content">
      <label className="voice-select-row language-select-row">
        <span><strong>{t("language", language)}</strong><small>{t("languageHelp", language)}</small></span>
        <select
          value={language}
          onChange={(event) => {
            narrationManager.stop();
            onLanguageChange(event.target.value);
          }}
        >
          {languages.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>
      {["music", "sound", "narration", "reducedMotion"].map((key) => (
        <label className="setting-row" key={key}>
          <span><strong>{t(settingCopy[key][0], language)}</strong><small>{t(settingCopy[key][1], language)}</small></span>
          <input type="checkbox" checked={Boolean(save.settings[key])} onChange={() => updateSetting(key, !save.settings[key])} />
        </label>
      ))}
      <label className="volume-row">
        <span><strong>{t("musicVolume", language)}</strong><small>{Math.round((save.settings.musicVolume ?? 0.35) * 100)}%</small></span>
        <input type="range" min="0" max="1" step="0.05" value={save.settings.musicVolume ?? 0.35} onChange={(event) => updateSetting("musicVolume", Number(event.target.value))} />
      </label>
      <label className="volume-row">
        <span><strong>{t("effectsVolume", language)}</strong><small>{Math.round((save.settings.soundVolume ?? 0.7) * 100)}%</small></span>
        <input type="range" min="0" max="1" step="0.05" value={save.settings.soundVolume ?? 0.7} onChange={(event) => updateSetting("soundVolume", Number(event.target.value))} />
      </label>
      <section className="narration-settings-card">
        <div className="narration-settings-heading">
          <span><strong>{t("storytellerVoice", language)}</strong><small>{t("storytellerHelp", language)}</small></span>
          <button type="button" onClick={testVoice} disabled={!narrationManager.supported() || !narrationManager.hasVoiceForLanguage(language)}>
            {testingVoice ? t("stopTest", language) : t("testVoice", language)}
          </button>
        </div>
        <label className="voice-select-row">
          <span>{t("voice", language)}</span>
          <select
            value={selectedVoice}
            onChange={(event) => updateVoice(event.target.value)}
            disabled={!narrationManager.supported()}
          >
            <option value="">
              {automaticVoice
                ? t("automaticVoice", language, { name: automaticVoice.name })
                : t(language === "zh" ? "automaticChinese" : "automaticEnglish", language)}
            </option>
            {languageVoices.map((voice, index) => (
              <option key={`${voice.voiceURI}-${index}`} value={voice.voiceURI || voice.name}>
                {voice.name} ({voice.lang || t("unknownLanguage", language)})
              </option>
            ))}
          </select>
        </label>
        <small className="voice-quality-note">
          {t("voiceQuality", language)}
        </small>
        {narrationManager.supported() && languageVoices.length === 0 && (
          <small className="voice-loading-note">
            {language === "zh" ? t("chineseVoiceUnavailable", language) : t("voicesLoading", language)}
          </small>
        )}
        <label className="volume-row">
          <span><strong>{t("narrationSpeed", language)}</strong><small>{(save.settings.narrationRate ?? 0.82).toFixed(2)}x</small></span>
          <input type="range" min="0.65" max="1.1" step="0.01" value={save.settings.narrationRate ?? 0.82} onChange={(event) => updateSetting("narrationRate", Number(event.target.value))} />
        </label>
        <label className="volume-row">
          <span><strong>{t("narrationPitch", language)}</strong><small>{(save.settings.narrationPitch ?? 1.12).toFixed(2)}</small></span>
          <input type="range" min="0.8" max="1.4" step="0.02" value={save.settings.narrationPitch ?? 1.12} onChange={(event) => updateSetting("narrationPitch", Number(event.target.value))} />
        </label>
        <label className="volume-row">
          <span><strong>{t("narrationVolume", language)}</strong><small>{Math.round((save.settings.narrationVolume ?? 1) * 100)}%</small></span>
          <input type="range" min="0" max="1" step="0.05" value={save.settings.narrationVolume ?? 1} onChange={(event) => updateSetting("narrationVolume", Number(event.target.value))} />
        </label>
      </section>
      <div className="settings-actions">
        <button onClick={() => audioManager.play("pickup")}>{t("testSound", language)}</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>{t("fullscreen", language)}</button>
      </div>
      <div className="controls-card">
        <strong>{t("controls", language)}</strong>
        <span>{t("moveControl", language)}</span>
        <span>{t("interactControl", language)}</span>
        <span>{t("abilityControl", language)}</span>
        <span>{t("pauseControl", language)}</span>
      </div>
      <button className="danger-button" onClick={resetGame} disabled={!hasPlayer}>{t("resetAdventure", language)}</button>
    </div>
  );
}
