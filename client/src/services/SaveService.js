import { defaultLanguage, normalizeLanguage, supportedLanguageIds } from "../i18n/localization.js";

// GRASP Pure Fabrication: persistence details stay outside React and Phaser.
export class SaveService {
  constructor(apiClient, storage = localStorage) {
    this.api = apiClient;
    this.storage = storage;
    this.playerKey = "scaleGuardiansPlayerId";
    this.narrationSettingsKey = "scaleGuardiansNarrationSettings";
    this.languageKey = "scaleGuardiansLanguage";
  }

  playerId() {
    return this.storage.getItem(this.playerKey);
  }

  localNarrationSettings() {
    try {
      const stored = JSON.parse(this.storage.getItem(this.narrationSettingsKey) || "{}");
      const { narrationSettingsVersion, language: _legacyLanguage, ...settings } = stored;
      if (narrationSettingsVersion !== 2) {
        if (settings.narrationRate == null || settings.narrationRate === 0.9) {
          settings.narrationRate = 0.82;
        }
        if (settings.narrationVolume == null || settings.narrationVolume === 0.9) {
          settings.narrationVolume = 1;
        }
      }
      return settings;
    } catch {
      return {};
    }
  }

  localLanguage() {
    const storedLanguage = this.storage.getItem(this.languageKey);
    return supportedLanguageIds.has(storedLanguage)
      ? storedLanguage
      : defaultLanguage;
  }

  saveLanguage(language) {
    const normalized = normalizeLanguage(language);
    this.storage.setItem(this.languageKey, normalized);
    return normalized;
  }

  saveNarrationSettings(settings = {}) {
    const narrationSettings = {
      narrationSettingsVersion: 2,
      narration: Boolean(settings.narration),
      narrationVoice: settings.narrationVoice || "",
      narrationVoices: {
        en: settings.narrationVoices?.en || "",
        zh: settings.narrationVoices?.zh || ""
      },
      narrationRate: Number(settings.narrationRate) || 0.82,
      narrationPitch: Number(settings.narrationPitch) || 1.12,
      narrationVolume: Number.isFinite(Number(settings.narrationVolume))
        ? Number(settings.narrationVolume)
        : 1
    };
    this.storage.setItem(this.narrationSettingsKey, JSON.stringify(narrationSettings));
  }

  async create(name) {
    const result = await this.api.createPlayer(name);
    this.storage.setItem(this.playerKey, result.playerId);
    return result;
  }

  load(playerId) {
    return this.api.load(playerId);
  }

  save(playerId, gameSave) {
    return this.api.save(playerId, gameSave);
  }

  reset(playerId) {
    return this.api.reset(playerId);
  }
}
