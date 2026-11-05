/* Tiny synthesised courtroom soundscape — no external audio files. */

export class CourtAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    this.ambience = null;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? 0.55 : 0;
    this.master.connect(this.ctx.destination);

    const seconds = 2;
    const rate = this.ctx.sampleRate;
    this.noiseBuffer = this.ctx.createBuffer(1, rate * seconds, rate);
    const data = this.noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    this.startAmbience();
  }

  startAmbience() {
    if (!this.ctx || this.ambience) return;
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = 0.16;
    bus.connect(this.master);

    // low room tone
    const air = ctx.createBufferSource();
    air.buffer = this.noiseBuffer;
    air.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 380;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.12;
    air.connect(filter).connect(airGain).connect(bus);
    air.start();

    // distant building hum
    const hum = ctx.createGain();
    hum.gain.value = 0.018;
    hum.connect(bus);
    [55, 82.5, 110.3].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 1 : 0.4;
      osc.connect(g).connect(hum);
      osc.start();
    });

    // slow clock-like tick, very quiet
    const tick = () => {
      if (!this.ctx || this.ctx.state === 'closed') return;
      this.blip(1100, 0.012, 0.02, 'sine');
      this.ambience.timer = setTimeout(tick, 2000);
    };
    this.ambience = { bus, air, timer: setTimeout(tick, 2000) };
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(on ? 0.55 : 0, now, 0.04);
    }
    if (on) this.init();
  }

  blip(freq, gain, duration, type = 'square', slideTo = null) {
    if (!this.ctx || !this.enabled || this.ctx.state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.03);
  }

  click() {
    this.blip(240, 0.045, 0.05, 'square', 180);
  }

  select() {
    this.blip(420, 0.035, 0.05, 'square', 520);
  }

  deny() {
    this.blip(130, 0.06, 0.18, 'sawtooth', 90);
  }

  gavel() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(160, t + 0.2);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    noise.connect(filter).connect(ng).connect(this.master);
    noise.start(t);
    noise.stop(t + 0.26);

    const thump = ctx.createOscillator();
    const tg = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, t);
    thump.frequency.exponentialRampToValueAtTime(46, t + 0.18);
    tg.gain.setValueAtTime(0.32, t);
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    thump.connect(tg).connect(this.master);
    thump.start(t);
    thump.stop(t + 0.32);
  }

  stamp() {
    if (!this.ctx || !this.enabled) return;
    this.blip(85, 0.12, 0.16, 'sine', 45);
    this.blip(300, 0.03, 0.04, 'square', 180);
  }

  correct() {
    if (!this.ctx || !this.enabled) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.06, 0.28, 'triangle'), i * 95);
    });
  }

  wrong() {
    if (!this.ctx || !this.enabled) return;
    const notes = [311.13, 261.63, 196];
    notes.forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.075, 0.3, 'sawtooth'), i * 120);
    });
  }

  fanfare() {
    if (!this.ctx || !this.enabled) return;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.055, 0.5, 'triangle'), i * 140);
    });
  }
}
