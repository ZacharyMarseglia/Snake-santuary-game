// GRASP Pure Fabrication: browser speech lifecycle stays outside React story components.
const PRIORITY_VOICE_PATTERNS = [
  ["microsoft", "jenny"],
  ["microsoft", "aria"],
  ["microsoft", "zira"],
  ["samantha"],
  ["victoria"],
  ["google us english"],
  ["google uk english female"]
];

const FEMALE_VOICE_HINTS = [
  "female",
  "woman",
  "jenny",
  "aria",
  "zira",
  "samantha",
  "victoria",
  "karen",
  "susan"
];

const DEFAULT_SETTINGS = {
  narrationVoice: "",
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

export class NarrationService {
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

    this.voices = [...(window.speechSynthesis.getVoices?.() ?? [])].sort((left, right) => {
      const leftEnglish = /^en([-_]|$)/i.test(left.lang) ? 0 : 1;
      const rightEnglish = /^en([-_]|$)/i.test(right.lang) ? 0 : 1;
      return leftEnglish - rightEnglish || left.name.localeCompare(right.name);
    });
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

  voiceScore(voice) {
    const name = voice.name.toLowerCase();
    const priorityIndex = PRIORITY_VOICE_PATTERNS.findIndex(
      (pattern) => pattern.every((part) => name.includes(part))
    );
    const hasFemaleHint = FEMALE_VOICE_HINTS.some((hint) => name.includes(hint));
    let score = /^en([-_]|$)/i.test(voice.lang) ? 1000 : 0;
    if (priorityIndex >= 0) score += 10000 - priorityIndex * 500;
    else if (hasFemaleHint) score += 5000;
    if (name.includes("natural") || name.includes("neural")) score += 160;
    if (name.includes("online")) score += 80;
    if (voice.localService === false) score += 20;
    if (voice.default) score += 5;
    return score;
  }

  preferredVoice() {
    const english = this.voices.filter((voice) => /^en([-_]|$)/i.test(voice.lang));
    const candidates = english.length > 0 ? english : this.voices;
    return [...candidates].sort((left, right) => this.voiceScore(right) - this.voiceScore(left))[0] ?? null;
  }

  resolveVoice(selectedVoice = "") {
    this.initialize();
    if (selectedVoice) {
      const selected = this.voices.find((voice) => (
        voice.voiceURI === selectedVoice || voice.name === selectedVoice
      ));
      if (selected) return selected;
    }
    return this.preferredVoice();
  }

  splitSentences(text = "") {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (!normalized) return [];

    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
      return [...segmenter.segment(normalized)]
        .map(({ segment }) => segment.trim())
        .filter(Boolean);
    }

    return normalized.match(/[^.!?]+(?:[.!?]+["']?|$)/g)?.map((sentence) => sentence.trim()) ?? [normalized];
  }

  narrationChunks({ title, story, lesson }) {
    const chunks = [];
    if (title?.trim()) chunks.push({ text: title.trim(), pauseAfter: 650 });

    const paragraphs = String(story || "").split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const sentences = this.splitSentences(paragraph);
      sentences.forEach((sentence, sentenceIndex) => {
        const paragraphEnds = sentenceIndex === sentences.length - 1;
        const storyEnds = paragraphEnds && paragraphIndex === paragraphs.length - 1;
        chunks.push({
          text: sentence,
          pauseAfter: storyEnds ? 750 : paragraphEnds ? 520 : 280
        });
      });
    });

    const lessonSentences = this.splitSentences(lesson);
    lessonSentences.forEach((sentence, index) => {
      chunks.push({
        text: index === 0 ? `Lesson. ${sentence}` : sentence,
        pauseAfter: index === lessonSentences.length - 1 ? 0 : 320
      });
    });
    return chunks;
  }

  createUtterance(text, options, voice) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice?.lang || "en-US";
    utterance.rate = clamp(options.narrationRate, 0.65, 1.1, DEFAULT_SETTINGS.narrationRate);
    utterance.pitch = clamp(options.narrationPitch, 0.8, 1.4, DEFAULT_SETTINGS.narrationPitch);
    utterance.volume = clamp(options.narrationVolume, 0, 1, DEFAULT_SETTINGS.narrationVolume);
    return utterance;
  }

  speak({ title, story, lesson }, settings = {}, onStateChange) {
    this.stop();
    if (!this.supported()) {
      onStateChange?.(false);
      return false;
    }

    const chunks = this.narrationChunks({ title, story, lesson });
    if (chunks.length === 0) {
      onStateChange?.(false);
      return false;
    }

    const options = { ...DEFAULT_SETTINGS, ...settings };
    const token = ++this.activeToken;
    const voice = this.resolveVoice(options.narrationVoice);
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
    utterance.onerror = () => this.finish(token);
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
    if (this.supported()) window.speechSynthesis.cancel();
    this.onStateChange?.(false);
    this.onStateChange = null;
  }
}

export const narrationService = new NarrationService();
