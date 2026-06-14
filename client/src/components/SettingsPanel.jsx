import { useEffect, useMemo, useState } from "react";
import { audioManager } from "../services/AudioManager.js";
import { narrationService } from "../services/NarrationService.js";

const settingCopy = {
  music: ["Ambient music", "A quiet magical soundtrack while exploring."],
  sound: ["Sound effects", "Chimes for discoveries, abilities, and upgrades."],
  narration: ["Narration", "Automatically reads story and lesson popups aloud."],
  reducedMotion: ["Reduced motion", "Turns off decorative bobbing and shortens effects."]
};

export function SettingsPanel({ save, setSave, resetGame, hasPlayer }) {
  const [voices, setVoices] = useState(() => narrationService.getVoices());
  const [testingVoice, setTestingVoice] = useState(false);

  useEffect(() => {
    const unsubscribe = narrationService.subscribeToVoices(setVoices);
    return () => {
      unsubscribe();
      narrationService.stop();
    };
  }, []);

  const updateSetting = (key, value) => {
    setSave((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const automaticVoice = useMemo(() => narrationService.preferredVoice(), [voices]);
  const testVoice = () => {
    if (testingVoice) {
      narrationService.stop();
      return;
    }
    narrationService.speak({
      title: "The Scale Guardians",
      story: "Welcome, brave guardian, to a cozy world of rivers, clouds, gardens, and glowing stars.",
      lesson: "Every part of nature has a story to share."
    }, save.settings, setTestingVoice);
  };

  return (
    <div className="settings-content">
      {["music", "sound", "narration", "reducedMotion"].map((key) => (
        <label className="setting-row" key={key}>
          <span><strong>{settingCopy[key][0]}</strong><small>{settingCopy[key][1]}</small></span>
          <input type="checkbox" checked={Boolean(save.settings[key])} onChange={() => updateSetting(key, !save.settings[key])} />
        </label>
      ))}
      <label className="volume-row">
        <span><strong>Music volume</strong><small>{Math.round((save.settings.musicVolume ?? 0.35) * 100)}%</small></span>
        <input type="range" min="0" max="1" step="0.05" value={save.settings.musicVolume ?? 0.35} onChange={(event) => updateSetting("musicVolume", Number(event.target.value))} />
      </label>
      <label className="volume-row">
        <span><strong>Effects volume</strong><small>{Math.round((save.settings.soundVolume ?? 0.7) * 100)}%</small></span>
        <input type="range" min="0" max="1" step="0.05" value={save.settings.soundVolume ?? 0.7} onChange={(event) => updateSetting("soundVolume", Number(event.target.value))} />
      </label>
      <section className="narration-settings-card">
        <div className="narration-settings-heading">
          <span><strong>Storyteller voice</strong><small>Choose the voice used for stories and nature lessons.</small></span>
          <button type="button" onClick={testVoice} disabled={!narrationService.supported()}>
            {testingVoice ? "Stop Test" : "Test Voice"}
          </button>
        </div>
        <label className="voice-select-row">
          <span>Voice</span>
          <select
            value={save.settings.narrationVoice ?? ""}
            onChange={(event) => updateSetting("narrationVoice", event.target.value)}
            disabled={!narrationService.supported()}
          >
            <option value="">
              {automaticVoice ? `Automatic - ${automaticVoice.name}` : "Automatic - Best English voice"}
            </option>
            {voices.map((voice, index) => (
              <option key={`${voice.voiceURI}-${index}`} value={voice.voiceURI || voice.name}>
                {voice.name} ({voice.lang || "Unknown language"})
              </option>
            ))}
          </select>
        </label>
        <small className="voice-quality-note">
          Voice quality depends on voices installed in your browser or computer.
        </small>
        {narrationService.supported() && voices.length === 0 && (
          <small className="voice-loading-note">Waiting for Chrome to load its available voices...</small>
        )}
        <label className="volume-row">
          <span><strong>Narration speed</strong><small>{(save.settings.narrationRate ?? 0.82).toFixed(2)}x</small></span>
          <input type="range" min="0.65" max="1.1" step="0.01" value={save.settings.narrationRate ?? 0.82} onChange={(event) => updateSetting("narrationRate", Number(event.target.value))} />
        </label>
        <label className="volume-row">
          <span><strong>Narration pitch</strong><small>{(save.settings.narrationPitch ?? 1.12).toFixed(2)}</small></span>
          <input type="range" min="0.8" max="1.4" step="0.02" value={save.settings.narrationPitch ?? 1.12} onChange={(event) => updateSetting("narrationPitch", Number(event.target.value))} />
        </label>
        <label className="volume-row">
          <span><strong>Narration volume</strong><small>{Math.round((save.settings.narrationVolume ?? 1) * 100)}%</small></span>
          <input type="range" min="0" max="1" step="0.05" value={save.settings.narrationVolume ?? 1} onChange={(event) => updateSetting("narrationVolume", Number(event.target.value))} />
        </label>
      </section>
      <div className="settings-actions">
        <button onClick={() => audioManager.play("pickup")}>Test sound</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>Fullscreen</button>
      </div>
      <div className="controls-card">
        <strong>Controls</strong>
        <span><kbd>WASD</kbd> or arrow keys to move</span>
        <span><kbd>E</kbd> to use biome gates, the Guardian Workbench, and return portals</span>
        <span><kbd>Space</kbd> to use an ability, harvest resources, and restore challenge targets</span>
        <span><kbd>Esc</kbd> or <kbd>P</kbd> to pause</span>
      </div>
      <button className="danger-button" onClick={resetGame} disabled={!hasPlayer}>Reset current adventure</button>
    </div>
  );
}
