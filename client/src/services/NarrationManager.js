import { normalizeLanguage, t } from "../i18n/localization.js";

const ENGLISH_VOICE_PRIORITY = [
  ["microsoft", "jenny"],
  ["microsoft", "aria"],
  ["microsoft", "zira"],
  ["samantha"],
  ["victoria"],
  ["google us english"],
  ["google uk english female"]
];

const FEMALE_VOICE_HINTS = [
  "female", "woman", "jenny", "aria", "zira", "samantha", "victoria", "karen", "susan"
];

const CHINESE_VOICE_HINTS = [
  "xiaoxiao", "xiaoyi", "huihui", "yunxi", "yunyang", "tingting", "mei-jia", "sin-ji"
];

const DEFAULT_SETTINGS = {
  narrationVoice: "",
  narrationVoices: { en: "", zh: "" },
  language: "en",
  narrationRate: 0.82,
  narrationPitch: 1.12,
  narrationVolume: 1
};

function clamp(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(maximum, Math.max(minimum, number))
    : fallback;
}

// GRASP Pure Fabrication: one manager owns browser speech, voice selection, and cancellation.
export class NarrationManager {
  constructor() {
    this.activeToken = 0;
    this.onStateChange = null;
    this.voices = [];
    this.voiceListeners = new Set();
    this.initialized = false;
    this.activeUtterance = null;
    this.pauseTimer = null;
    this.handleVoicesChanged = () => this.refreshVoices();
  }

  supported() {
    return typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window;
  }

  initialize() {
    if (this.initialized || !this.supported()) return;

    this.initialized = true;
    const synthesis = window.speechSynthesis;
    if (typeof synthesis.addEventListener === "function") {
      synthesis.addEventListener("voiceschanged", this.handleVoicesChanged);
    } else {
      const previousHandler = synthesis.onvoiceschanged;
      synthesis.onvoiceschanged = (event) => {
        previousHandler?.call(synthesis, event);
        this.handleVoicesChanged();
      };
    }
    this.refreshVoices();
  }

  refreshVoices() {
    if (!this.supported()) {
      this.voices = [];
      return this.voices;
    }

    this.voices = [...(window.speechSynthesis.getVoices?.() ?? [])].sort((left, right) => (
      left.lang.localeCompare(right.lang) || left.name.localeCompare(right.name)
    ));
    this.voiceListeners.forEach((listener) => listener(this.getVoices()));
    return this.voices;
  }

  getVoices() {
    this.initialize();
    return [...this.voices];
  }

  subscribeToVoices(listener) {
    this.initialize();
    this.voiceListeners.add(listener);
    listener(this.getVoices());
    return () => this.voiceListeners.delete(listener);
  }

  voiceMatchesLanguage(voice, language = "en") {
    const lang = normalizeLanguage(language);
    return lang === "zh"
      ? /^zh([-_]|$)/i.test(voice.lang)
      : /^en([-_]|$)/i.test(voice.lang);
  }

  voicesForLanguage(language = "en") {
    return this.getVoices().filter((voice) => this.voiceMatchesLanguage(voice, language));
  }

  hasVoiceForLanguage(language = "en") {
    return normalizeLanguage(language) === "en" || this.voicesForLanguage(language).length > 0;
  }

  voiceScore(voice, language = "en") {
    const name = voice.name.toLowerCase();
    const chinese = normalizeLanguage(language) === "zh";
    let score = this.voiceMatchesLanguage(voice, language) ? 1000 : 0;

    if (chinese) {
      const chineseIndex = CHINESE_VOICE_HINTS.findIndex((hint) => name.includes(hint));
      if (chineseIndex >= 0) score += 8000 - chineseIndex * 300;
    } else {
      const priorityIndex = ENGLISH_VOICE_PRIORITY.findIndex(
        (pattern) => pattern.every((part) => name.includes(part))
      );
      if (priorityIndex >= 0) score += 10000 - priorityIndex * 500;
      else if (FEMALE_VOICE_HINTS.some((hint) => name.includes(hint))) score += 5000;
    }

    if (name.includes("natural") || name.includes("neural")) score += 160;
    if (name.includes("online")) score += 80;
    if (voice.localService === false) score += 20;
    if (voice.default) score += 5;
    return score;
  }

  preferredVoice(language = "en") {
    return [...this.voicesForLanguage(language)].sort(
      (left, right) => this.voiceScore(right, language) - this.voiceScore(left, language)
    )[0] ?? null;
  }

  resolveVoice(selectedVoice = "", language = "en") {
    this.initialize();
    if (selectedVoice) {
      const selected = this.voices.find((voice) => (
        voice.voiceURI === selectedVoice || voice.name === selectedVoice
      ));
      if (selected && this.voiceMatchesLanguage(selected, language)) return selected;
    }
    return this.preferredVoice(language);
  }

  splitSentences(text = "", language = "en") {
    const normalized = String(text).replace(/\s+/g, " ").trim();
    if (!normalized) return [];

    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      const locale = normalizeLanguage(language) === "zh" ? "zh-CN" : "en-US";
      return [...new Intl.Segmenter(locale, { granularity: "sentence" }).segment(normalized)]
        .map(({ segment }) => segment.trim())
        .filter(Boolean);
    }

    return normalized.match(/[^.!?。！？]+(?:[.!?。！？]+["']?|$)/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) ?? [normalized];
  }

  narrationChunks({ title, story, lesson }, language = "en") {
    const chunks = [];
    if (title?.trim()) chunks.push({ text: title.trim(), pauseAfter: 600 });

    const storyParagraphs = String(story || "").split(/\n+/).filter((paragraph) => paragraph.trim());
    storyParagraphs.forEach((paragraph, paragraphIndex) => {
      const sentences = this.splitSentences(paragraph, language);
      sentences.forEach((sentence, sentenceIndex) => {
        const finalSentence = sentenceIndex === sentences.length - 1;
        const finalParagraph = paragraphIndex === storyParagraphs.length - 1;
        chunks.push({
          text: sentence,
          pauseAfter: finalSentence && finalParagraph ? 700 : finalSentence ? 500 : 260
        });
      });
    });

    this.splitSentences(lesson, language).forEach((sentence, index, sentences) => {
      chunks.push({
        text: index === 0 ? `${t("lessonPrefix", language)}。${sentence}` : sentence,
        pauseAfter: index === sentences.length - 1 ? 0 : 300
      });
    });
    return chunks;
  }

  createUtterance(text, options, voice) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice?.lang || (normalizeLanguage(options.language) === "zh" ? "zh-CN" : "en-US");
    utterance.rate = clamp(options.narrationRate, 0.65, 1.1, DEFAULT_SETTINGS.narrationRate);
    utterance.pitch = clamp(options.narrationPitch, 0.8, 1.4, DEFAULT_SETTINGS.narrationPitch);
    utterance.volume = clamp(options.narrationVolume, 0, 1, DEFAULT_SETTINGS.narrationVolume);
    return utterance;
  }

  speak({ title = "", story = "", lesson = "" }, settings = {}, onStateChange) {
    this.stop();
    if (!this.supported()) {
      onStateChange?.(false);
      return false;
    }

    const options = { ...DEFAULT_SETTINGS, ...settings };
    const language = normalizeLanguage(options.language);
    if (!this.hasVoiceForLanguage(language)) {
      onStateChange?.(false);
      return false;
    }

    const chunks = this.narrationChunks({ title, story, lesson }, language);
    if (chunks.length === 0) {
      onStateChange?.(false);
      return false;
    }

    const token = ++this.activeToken;
    const selectedVoice = options.narrationVoices?.[language] || options.narrationVoice;
    const voice = this.resolveVoice(selectedVoice, language);
    this.onStateChange = onStateChange;

    try {
      onStateChange?.(true);
      this.speakChunk(chunks, 0, options, voice, token);
      return true;
    } catch {
      this.finish(token);
      return false;
    }
  }

  speakChunk(chunks, index, options, voice, token) {
    if (token !== this.activeToken) return;
    if (index >= chunks.length) {
      this.finish(token);
      return;
    }

    const chunk = chunks[index];
    const utterance = this.createUtterance(chunk.text, options, voice);
    this.activeUtterance = utterance;
    utterance.onend = () => {
      if (token !== this.activeToken) return;
      this.activeUtterance = null;
      this.pauseTimer = setTimeout(() => {
        this.pauseTimer = null;
        this.speakChunk(chunks, index + 1, options, voice, token);
      }, chunk.pauseAfter);
    };
    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") this.finish(token);
    };
    window.speechSynthesis.speak(utterance);
  }

  finish(token) {
    if (token !== this.activeToken) return;
    this.activeUtterance = null;
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.onStateChange?.(false);
    this.onStateChange = null;
  }

  stop() {
    this.activeToken += 1;
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.activeUtterance = null;
    const previousStateChange = this.onStateChange;
    this.onStateChange = null;
    if (this.supported()) window.speechSynthesis.cancel();
    previousStateChange?.(false);
  }
}

export const narrationManager = new NarrationManager();
