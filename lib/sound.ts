"use client";

// Web Audio API Mechanical Sound Engine
// Synthesizes crisp, minimal mechanical "kat / tick" feedback without external audio assets.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastMenuTickTime: number = 0;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("portfolio_sound_muted");
        this.muted = saved === "true";
      } catch {
        this.muted = false;
      }

      // Auto-unlock on first user interaction
      const unlock = () => {
        this.init();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("scroll", unlock);
      };
      window.addEventListener("pointerdown", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
      window.addEventListener("scroll", unlock, { passive: true });
    }
  }

  private init(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    this.initialized = true;
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("portfolio_sound_muted", String(this.muted));
        window.dispatchEvent(new CustomEvent("portfolio-audio-toggled", { detail: { muted: this.muted } }));
      } catch {}
    }
    if (!this.muted) {
      this.playMenuTick();
    }
    return this.muted;
  }

  /**
   * Menu Tick: Crisp, high-frequency micro-click for Command Palette list items
   */
  public playMenuTick(pitchMod: number = 1.0) {
    if (this.muted) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    // Throttle to avoid audio glitching when cursor swipes across 10 items quickly
    if (now - this.lastMenuTickTime < 32) return;
    this.lastMenuTickTime = now;

    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;

      // 1. Transient burst (micro-noise pop for mechanical contact)
      const bufferSize = Math.floor(ctx.sampleRate * 0.006); // 6ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Decaying noise
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(2200 * pitchMod, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.007);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // 2. Resonant body tick (snappy sine pulse)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const oscFilter = ctx.createBiquadFilter();

      osc.type = "sine";
      const startFreq = 1800 * pitchMod;
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, t + 0.012);

      oscFilter.type = "bandpass";
      oscFilter.frequency.setValueAtTime(1400 * pitchMod, t);
      oscFilter.Q.setValueAtTime(3.5, t);

      oscGain.gain.setValueAtTime(0.07, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(t);
      osc.start(t);
      noise.stop(t + 0.008);
      osc.stop(t + 0.015);
    } catch {}
  }

  /**
   * Section Tick: Deeper, satisfying mechanical "kat" ratchet for section boundary crossing
   */
  public playSectionTick() {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;

      // 1. Initial click pop (sharp transient mechanical latch)
      const bufferSize = Math.floor(ctx.sampleRate * 0.01); // 10ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1600, t);
      noiseFilter.Q.setValueAtTime(2.0, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.14, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // 2. Heavier body click (ratchet latch)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(820, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.024);

      oscGain.gain.setValueAtTime(0.12, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(t);
      osc.start(t);
      noise.stop(t + 0.014);
      osc.stop(t + 0.026);
    } catch {}
  }
}

// Global Singleton
export const sound = typeof window !== "undefined" ? new SoundEngine() : (null as unknown as SoundEngine);
