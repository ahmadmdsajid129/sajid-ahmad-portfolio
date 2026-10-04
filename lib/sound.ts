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

  /**
   * Flap Tick: Subtle, rhythmic mechanical split-flap slap sound (Solari board)
   */
  public playFlapTick(pitchMod: number = 1.0) {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;

      // 1. Soft impact thud (card slap against hinge stop)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320 * pitchMod, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.018);

      oscGain.gain.setValueAtTime(0.08, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // 2. Plastic card click transient
      const bufferSize = Math.floor(ctx.sampleRate * 0.005);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400 * pitchMod, t);
      filter.Q.setValueAtTime(3.0, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(t);
      noise.start(t);
      osc.stop(t + 0.022);
      noise.stop(t + 0.01);
    } catch {}
  }

  /**
   * Mechanical Keyboard Key Click (Cherry MX Blue / Typewriter simulation)
   * Plays realistic click + clack when typing into any input.
   */
  public playKeyClick(key: string = "a") {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const lowerKey = key.toLowerCase();

      if (lowerKey === " " || key === "Spacebar") {
        // Spacebar: deep bottom-out thud with stabilizer wire rattle
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.035);

        oscGain.gain.setValueAtTime(0.18, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.036);

        // Stabilizer wire micro-click
        const bufferSize = Math.floor(ctx.sampleRate * 0.008);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(950, t);
        filter.Q.setValueAtTime(2.0, t);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.09, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(t);
        noise.start(t);
        osc.stop(t + 0.04);
        noise.stop(t + 0.02);
      } else if (lowerKey === "backspace" || lowerKey === "delete") {
        // Backspace: heavier mechanical latch release click
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

        oscGain.gain.setValueAtTime(0.14, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.026);

        const bufferSize = Math.floor(ctx.sampleRate * 0.006);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(1800, t);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(t);
        noise.start(t);
        osc.stop(t + 0.03);
        noise.stop(t + 0.012);
      } else if (lowerKey === "enter") {
        // Enter: heavier carriage return mechanical chunk
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.038);

        oscGain.gain.setValueAtTime(0.2, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.042);
      } else {
        // Regular key: Cherry MX Blue dual-stage tactile click
        // Subtle randomized pitch variation (±8%) for authentic non-robotic feel
        const pitchMod = 0.92 + Math.random() * 0.16;

        // Stage 1: Sharp click leaf release transient
        const bufferSize = Math.floor(ctx.sampleRate * 0.005);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(2800 * pitchMod, t);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        // Stage 2: Housing clack
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(740 * pitchMod, t);
        osc.frequency.exponentialRampToValueAtTime(240 * pitchMod, t + 0.016);

        oscGain.gain.setValueAtTime(0.08, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        noise.start(t);
        osc.start(t);
        noise.stop(t + 0.01);
        osc.stop(t + 0.02);
      }
    } catch {}
  }

}

// Global Singleton
export const sound = typeof window !== "undefined" ? new SoundEngine() : (null as unknown as SoundEngine);
