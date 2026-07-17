#!/usr/bin/env python3
"""
Meridian IMAX Soundtrack Generator (Optimized)
Generates 5 cinematic audio stems for the Web Audio API dynamic mixer.
Uses chunked processing to avoid timeout.
"""
import struct, math, wave, os, random

SR = 44100
DURATION = 30
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')

def save_wav(filename, samples):
    path = os.path.join(OUT_DIR, filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        data = b''.join(struct.pack('<h', max(-32767, min(32767, int(s * 32767)))) for s in samples)
        f.writeframes(data)
    print(f"  -> {filename} ({os.path.getsize(path) / 1024:.0f} KB)")

def generate(filename, generator_func):
    print(f"Generating {filename}...")
    samples = generator_func()
    save_wav(filename, samples)

def sub_bass_gen():
    samples = []
    prev = 0.0
    dt = 1.0 / SR
    for i in range(SR * DURATION):
        t = i * dt
        s = 0.15 * math.sin(80 * math.pi * t) + 0.10 * math.sin(81 * math.pi * t) + 0.04 * math.sin(160 * math.pi * t)
        progress = t / DURATION
        s *= 0.2 + 0.8 * (progress ** 1.5)
        prev = prev + (dt / (dt + 1.0 / (2 * math.pi * 120))) * (s - prev)
        samples.append(max(-1.0, min(1.0, prev)))
    return samples

def pad_gen():
    freqs = [130.81, 155.56, 196.00, 233.08, 293.66]
    samples = []
    prev = 0.0
    dt = 1.0 / SR
    alpha_lp = dt / (dt + 1.0 / (2 * math.pi * 800))
    for i in range(SR * DURATION):
        t = i * dt
        progress = t / DURATION
        s = 0.0
        for j, freq in enumerate(freqs):
            detune = 1.0 + (j * 0.002 - 0.004)
            lfo = 0.7 + 0.3 * math.sin(2 * math.pi * (0.05 + j * 0.01) * t)
            s += 0.04 * lfo * math.sin(2 * math.pi * freq * detune * t)
        fade_in = min(t / 10.0, 1.0)
        s *= (0.3 + 0.7 * (progress ** 1.2)) * fade_in
        prev += alpha_lp * (s - prev)
        samples.append(max(-1.0, min(1.0, prev)))
    return samples

def strings_gen():
    freqs = [392.00, 523.25, 659.25, 880.00]
    samples = []
    prev = 0.0
    dt = 1.0 / SR
    alpha_lp = dt / (dt + 1.0 / (2 * math.pi * 2000))
    for i in range(SR * DURATION):
        t = i * dt
        progress = t / DURATION
        s = 0.0
        for j, freq in enumerate(freqs):
            for det in [-0.3, 0, 0.3, 0.7]:
                lfo = 0.6 + 0.4 * math.sin(2 * math.pi * (0.08 + j * 0.02) * t + det)
                # Sawtooth approx (3 harmonics)
                saw_val = 0
                for h in range(1, 4):
                    saw_val += ((-1)**(h+1)) * math.sin(2 * math.pi * (freq + det) * h * t) / h
                s += 0.012 * lfo * saw_val * 0.6
        vol = 0.1 + 0.9 * (1.0 / (1.0 + math.exp(-8 * (progress - 0.5))))
        fade_in = min(t / 8.0, 1.0)
        s *= vol * fade_in
        prev += alpha_lp * (s - prev)
        samples.append(max(-1.0, min(1.0, prev)))
    return samples

def impact_gen():
    impacts = [0, 15, 30]
    samples = []
    for i in range(SR * DURATION):
        t = i / SR
        s = 0.0
        for hit_t in impacts:
            dt = t - hit_t
            if 0 <= dt < 3.0:
                env = math.exp(-dt * 1.5)
                freq = 50 + 30 * math.exp(-dt * 2)
                s += 0.25 * env * math.sin(2 * math.pi * freq * dt)
                if dt < 0.1:
                    s += 0.15 * (1.0 - dt / 0.1) * (random.random() * 2 - 1)
                s += 0.06 * env * math.sin(60 * math.pi * dt)
        samples.append(max(-1.0, min(1.0, s)))
    return samples

def shimmer_gen():
    random.seed(99)
    sparkle_times = [15 + k * 1.5 for k in range(10)]
    sparkle_freqs = [random.uniform(2400, 3600) for _ in range(10)]
    samples = []
    prev = 0.0
    dt = 1.0 / SR
    alpha_lp = dt / (dt + 1.0 / (2 * math.pi * 4000))
    for i in range(SR * DURATION):
        t = i * dt
        progress = t / DURATION
        s = 0.0
        for k in range(5):
            base_freq = 1200 + k * 400
            drift = math.sin(2 * math.pi * (0.03 + k * 0.01) * t)
            lfo = 0.5 + 0.5 * math.sin(2 * math.pi * (0.1 + k * 0.05) * t)
            s += 0.015 * lfo * math.sin(2 * math.pi * (base_freq + drift * 50) * t)
        for idx, st in enumerate(sparkle_times):
            dt2 = t - st
            if 0 <= dt2 < 0.3:
                s += math.exp(-dt2 * 10) * 0.08 * math.sin(2 * math.pi * sparkle_freqs[idx] * dt2)
        fade_in = max(0.0, min(1.0, (t - 10) / 15.0))
        s *= (0.4 + 0.6 * (progress ** 2)) * fade_in
        prev += alpha_lp * (s - prev)
        samples.append(max(-1.0, min(1.0, prev)))
    return samples

if __name__ == "__main__":
    print("=== Meridian IMAX Soundtrack Generator ===")
    print(f"Duration: {DURATION}s, Sample Rate: {SR}Hz\n")
    generate("stem_sub_bass.wav", sub_bass_gen)
    generate("stem_pad.wav", pad_gen)
    generate("stem_strings.wav", strings_gen)
    generate("stem_impact.wav", impact_gen)
    generate("stem_shimmer.wav", shimmer_gen)
    print("\nAll stems generated in public/audio/")
