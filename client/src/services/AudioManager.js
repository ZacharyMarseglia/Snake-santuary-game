// GRASP Pure Fabrication: synthesized audio stays independent from UI and Phaser.
export class AudioManager {
  constructor() {
    this.context = null;
    this.settings = { music: true, sound: true, musicVolume: 0.35, soundVolume: 0.7 };
    this.musicTimer = null;
    this.musicStep = 0;
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.music) this.stopMusic();
    else if (this.context) this.startMusic();
  }

  ensureContext() {
    if (!this.context) {
      if (typeof window === "undefined") return null;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") void this.context.resume().catch(() => {});
    return this.context;
  }

  tone(frequency, duration, volume, type = "sine", delay = 0) {
    const context = this.ensureContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  play(name) {
    if (!this.settings.sound) return;
    const volume = 0.055 * this.settings.soundVolume;
    const patterns = {
      click: [[440, 0.08, 0, "sine"]],
      start: [[392, 0.15, 0, "triangle"], [523, 0.22, 0.08, "triangle"], [659, 0.3, 0.16, "triangle"]],
      pickup: [[660, 0.12, 0, "sine"], [880, 0.18, 0.07, "sine"]],
      craft: [[294, 0.12, 0, "triangle"], [440, 0.18, 0.06, "triangle"], [587, 0.28, 0.14, "sine"]],
      ability: [[220, 0.18, 0, "sawtooth"], [440, 0.3, 0.06, "triangle"]],
      story: [[523, 0.3, 0, "sine"], [659, 0.35, 0.14, "sine"], [784, 0.45, 0.28, "sine"]],
      upgrade: [[330, 0.22, 0, "triangle"], [494, 0.28, 0.1, "triangle"], [659, 0.5, 0.2, "triangle"]],
      evolve: [[262, 0.3, 0, "sine"], [392, 0.4, 0.12, "triangle"], [523, 0.5, 0.24, "sine"], [784, 0.7, 0.38, "sine"]],
      pause: [[392, 0.12, 0, "triangle"], [294, 0.2, 0.08, "triangle"]]
    };
    (patterns[name] || patterns.click).forEach(([frequency, duration, delay, type]) => {
      this.tone(frequency, duration, volume, type, delay);
    });
  }

  startMusic() {
    if (!this.settings.music || this.musicTimer) return;
    this.ensureContext();
    const playBar = () => {
      if (!this.settings.music) return;
      const chords = [
        [196, 247, 294],
        [174, 220, 262],
        [220, 277, 330],
        [196, 247, 330]
      ];
      const chord = chords[this.musicStep % chords.length];
      const volume = 0.012 * this.settings.musicVolume;
      chord.forEach((note, index) => this.tone(note, 2.8, volume, "sine", index * 0.05));
      this.musicStep += 1;
    };
    playBar();
    this.musicTimer = globalThis.setInterval(playBar, 3200);
  }

  stopMusic() {
    globalThis.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }
}

export const audioManager = new AudioManager();
