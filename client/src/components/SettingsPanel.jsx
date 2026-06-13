import { audioManager } from "../services/AudioManager.js";

const settingCopy = {
  music: ["Ambient music", "A quiet magical soundtrack while exploring."],
  sound: ["Sound effects", "Chimes for discoveries, abilities, and upgrades."],
  reducedMotion: ["Reduced motion", "Turns off decorative bobbing and shortens effects."]
};

export function SettingsPanel({ save, setSave, resetGame, hasPlayer }) {
  const updateSetting = (key, value) => {
    setSave((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  return (
    <div className="settings-content">
      {["music", "sound", "reducedMotion"].map((key) => (
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
      <div className="settings-actions">
        <button onClick={() => audioManager.play("pickup")}>Test sound</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>Fullscreen</button>
      </div>
      <div className="controls-card">
        <strong>Controls</strong>
        <span><kbd>WASD</kbd> or arrow keys to move</span>
        <span><kbd>E</kbd> to use biome gates, the Guardian Workbench, and return portals</span>
        <span><kbd>Space</kbd> to use an ability and harvest nearby resources</span>
        <span><kbd>Esc</kbd> or <kbd>P</kbd> to pause</span>
      </div>
      <button className="danger-button" onClick={resetGame} disabled={!hasPlayer}>Reset current adventure</button>
    </div>
  );
}
