/**
 * SoundtrackEngine — Real-time Web Audio API mixer for the IMAX experience.
 * 
 * Loads 5 pre-generated audio stems and crossfades them based on scroll progress.
 * Each stem's volume is controlled by a curve that maps scroll position (0-1)
 * to create a Hans Zimmer-like building score.
 * 
 * Usage:
 *   const engine = new SoundtrackEngine();
 *   await engine.init();
 *   engine.setProgress(0.0); // hero
 *   engine.setProgress(0.5); // manifesto
 *   engine.setProgress(1.0); // collection
 *   engine.mute();
 *   engine.destroy();
 */

const STEMS = [
  { name: 'sub_bass',   file: '/audio/stem_sub_bass.wav',  baseVolume: 0.7 },
  { name: 'pad',        file: '/audio/stem_pad.wav',       baseVolume: 0.5 },
  { name: 'strings',    file: '/audio/stem_strings.wav',    baseVolume: 0.4 },
  { name: 'impact',     file: '/audio/stem_impact.wav',     baseVolume: 0.6 },
  { name: 'shimmer',    file: '/audio/stem_shimmer.wav',    baseVolume: 0.35 },
];

// Volume curves per stem: [progress, volume] pairs that define the mix
// progress 0.0 = top of page (hero), 1.0 = bottom (collection)
const VOLUME_CURVES = {
  sub_bass: [
    [0.0, 0.3],   // quiet at start
    [0.1, 0.6],   // builds during hero
    [0.3, 0.8],   // strong in manifesto
    [0.6, 0.9],   // peaks at porsche
    [1.0, 0.5],   // settles in collection
  ],
  pad: [
    [0.0, 0.0],   // silent at start
    [0.1, 0.0],   // still silent
    [0.2, 0.4],   // fades in during manifesto
    [0.4, 0.7],   // strong
    [0.6, 0.8],   // builds
    [0.8, 0.6],   // eases off
    [1.0, 0.3],   // quiet for products
  ],
  strings: [
    [0.0, 0.0],
    [0.3, 0.0],
    [0.4, 0.2],   // enters mid-page
    [0.55, 0.6],  // building
    [0.7, 1.0],   // crescendo at porsche
    [0.85, 0.5],  // falling
    [1.0, 0.2],   // quiet
  ],
  impact: [
    [0.0, 0.8],   // first hit at start
    [0.15, 0.0],  // fades
    [0.35, 0.8],  // second hit at manifesto
    [0.5, 0.0],   // fades
    [0.65, 0.8],  // third hit at porsche
    [0.8, 0.0],   // fades
    [1.0, 0.0],   // silent
  ],
  shimmer: [
    [0.0, 0.0],
    [0.6, 0.0],
    [0.75, 0.3],  // enters late
    [0.85, 0.6],  // builds
    [1.0, 0.8],   // peaks at collection
  ],
};

function interpolateCurve(curve, progress) {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));
  
  // Find the two control points we're between
  for (let i = 0; i < curve.length - 1; i++) {
    const [p0, v0] = curve[i];
    const [p1, v1] = curve[i + 1];
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0);
      // Smooth interpolation (ease in-out)
      const smooth = t * t * (3 - 2 * t);
      return v0 + (v1 - v0) * smooth;
    }
  }
  // Outside range — return last value
  return curve[curve.length - 1][1];
}

export default class SoundtrackEngine {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.sources = {};
    this.gains = {};
    this.masterGain = null;
    this.isPlaying = false;
    this.progress = 0;
    this._started = false;
  }

  async init() {
    if (this.ctx) return;
    
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;
    this.masterGain.connect(this.ctx.destination);

    // Load all stems in parallel
    const loadPromises = STEMS.map(async (stem) => {
      try {
        const response = await fetch(stem.file);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.buffers[stem.name] = audioBuffer;
      } catch (e) {
        console.warn(`SoundtrackEngine: Failed to load stem "${stem.name}":`, e.message);
      }
    });

    await Promise.all(loadPromises);
  }

  play() {
    if (this._started) return;
    if (!this.ctx || Object.keys(this.buffers).length === 0) return;
    
    // Resume context if suspended (autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this._started = true;
    this.isPlaying = true;

    STEMS.forEach((stem) => {
      if (!this.buffers[stem.name]) return;

      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[stem.name];
      source.loop = true;

      const gainNode = this.ctx.createGain();
      gainNode.gain.value = 0;

      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      source.start(0);

      this.sources[stem.name] = source;
      this.gains[stem.name] = gainNode;
    });

    // Apply initial progress
    this.setProgress(this.progress);
  }

  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
    
    if (!this.isPlaying) return;

    const now = this.ctx.currentTime;
    const fadeTime = 0.15; // smooth 150ms transitions

    STEMS.forEach((stem) => {
      const gainNode = this.gains[stem.name];
      if (!gainNode) return;

      const curve = VOLUME_CURVES[stem.name];
      const targetVolume = interpolateCurve(curve, this.progress) * stem.baseVolume;
      
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setTargetAtTime(targetVolume, now, fadeTime / 3);
    });
  }

  mute() {
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0, now, 0.3);
  }

  unmute() {
    if (!this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(1, now, 0.3);
  }

  destroy() {
    Object.values(this.sources).forEach((source) => {
      try { source.stop(); } catch (e) {}
    });
    if (this.ctx) {
      this.ctx.close();
    }
    this.ctx = null;
    this.sources = {};
    this.gains = {};
    this.buffers = {};
    this._started = false;
    this.isPlaying = false;
  }
}
