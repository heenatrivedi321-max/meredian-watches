import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MERIDIAN".split('');

// ============================================================
// IMAX-STYLE PROJECTOR SOUND (Web Audio API)
// ============================================================
function playIntroSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Deep rumble (projector motor)
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = 'sine';
    rumble.frequency.value = 55;
    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    rumbleGain.gain.setValueAtTime(0.08, now + 2.5);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
    rumble.connect(rumbleGain).connect(ctx.destination);
    rumble.start(now);
    rumble.stop(now + 3.5);

    // Countdown clicks (like film reel ticks)
    for (let i = 0; i < 4; i++) {
      const tick = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tick.type = 'square';
      tick.frequency.value = 800;
      tickGain.gain.setValueAtTime(0, now + i * 0.6);
      tickGain.gain.linearRampToValueAtTime(0.06, now + i * 0.6 + 0.01);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.6 + 0.08);
      tick.connect(tickGain).connect(ctx.destination);
      tick.start(now + i * 0.6);
      tick.stop(now + i * 0.6 + 0.1);
    }

    // Final reveal — shimmer sweep
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();
    shimmerFilter.type = 'bandpass';
    shimmerFilter.frequency.value = 2000;
    shimmerFilter.Q.value = 3;
    shimmer.type = 'sawtooth';
    shimmer.frequency.setValueAtTime(200, now + 2.8);
    shimmer.frequency.exponentialRampToValueAtTime(1200, now + 3.2);
    shimmer.frequency.exponentialRampToValueAtTime(400, now + 3.8);
    shimmerGain.gain.setValueAtTime(0, now + 2.8);
    shimmerGain.gain.linearRampToValueAtTime(0.08, now + 3.0);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
    shimmer.connect(shimmerFilter).connect(shimmerGain).connect(ctx.destination);
    shimmer.start(now + 2.8);
    shimmer.stop(now + 4);

    // Impact on MERIDIAN reveal
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impact.type = 'sine';
    impact.frequency.setValueAtTime(80, now + 3);
    impact.frequency.exponentialRampToValueAtTime(30, now + 3.5);
    impactGain.gain.setValueAtTime(0.2, now + 3);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
    impact.connect(impactGain).connect(ctx.destination);
    impact.start(now + 3);
    impact.stop(now + 3.7);
  } catch (e) {}
}

// ============================================================
// GOLD PARTICLES
// ============================================================
function GoldParticles({ active }) {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 20,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 1.5,
      duration: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 300,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #C9A96E 0%, #d4a84380 50%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 6}px #C9A96E80`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={active ? {
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            y: [0, -80 - Math.random() * 300],
            x: [0, p.drift],
          } : {}}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// SHOCKWAVE RING
// ============================================================
function ShockRing({ active, delay = 0 }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A96E]/30"
      initial={{ width: 0, height: 0, opacity: 0 }}
      animate={active ? {
        width: ['0vw', '140vw'],
        height: ['0vw', '140vw'],
        opacity: [0.5, 0],
        borderWidth: [2, 0.2],
      } : {}}
      transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

// ============================================================
// COUNTDOWN NUMBER
// ============================================================
function CountdownNumber({ number, active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={number}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [2, 1, 1, 0.8] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-extralight text-white/10"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 100 }}
          >
            {number}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// MAIN INTRO SPLASH
// ============================================================
export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (!soundPlayed.current) {
      soundPlayed.current = true;
      playIntroSound();
    }

    // Phase timeline:
    // 0: Black + film grain (instant)
    // 1: Countdown 4 (0.3s)
    // 2: Countdown 3 (0.9s)
    // 3: Countdown 2 (1.5s)
    // 4: Countdown 1 (2.1s)
    // 5: MERIDIAN reveal (2.7s)
    // 6: Tagline (3.3s)
    // 7: Done (4.2s)
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1700),
      setTimeout(() => setPhase(5), 2200),
      setTimeout(() => setPhase(6), 3000),
      setTimeout(() => setPhase(7), 4000),
      setTimeout(() => onComplete(), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const showReveal = phase >= 5;
  const countdownNumber = phase <= 4 ? 5 - phase : 0;

  return (
    <AnimatePresence>
      {phase < 7 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
              animation: 'grain-shift 0.15s steps(3) infinite',
            }}
          />

          {/* Projector flicker effect */}
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            animate={{
              opacity: [0, 0.02, 0, 0.015, 0, 0.01, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: phase < 5 ? Infinity : 0,
              repeatDelay: 0.1,
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* Countdown */}
          <CountdownNumber number={countdownNumber} active={phase >= 1 && phase <= 4} />

          {/* Radial gold glow (appears on reveal) */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.06) 35%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={showReveal ? { width: '100vw', height: '70vh', opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Shockwave rings */}
          <ShockRing active={showReveal} delay={0} />
          <ShockRing active={showReveal} delay={0.15} />

          {/* Gold particles */}
          <GoldParticles active={showReveal} />

          {/* Gold line (IMAX-style center line) */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #C9A96E 20%, #e8d5a3 50%, #C9A96E 80%, transparent 100%)',
              boxShadow: '0 0 30px #C9A96E60, 0 0 100px #C9A96E30',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={showReveal ? { width: '60vw', opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* MERIDIAN letters — 3D flip reveal */}
          {showReveal && (
            <div className="relative flex items-center justify-center" style={{ perspective: '800px' }}>
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="relative text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] font-extralight tracking-tighter"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 200,
                    color: '#fff',
                    textShadow: '0 0 80px rgba(201,169,110,0.5), 0 0 160px rgba(201,169,110,0.2)',
                  }}
                  initial={{ opacity: 0, y: 60, rotateX: -100, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{
                    opacity: [0, 1.1, 1],
                    y: [60, -10, 0],
                    rotateX: [-100, 6, 0],
                    scale: [0.5, 1.06, 1],
                    filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
                  }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          )}

          {/* Tagline */}
          <motion.p
            className="mt-8 sm:mt-12 text-[0.9rem] sm:text-[1.2rem] md:text-[1.6rem] lg:text-[2rem] tracking-[0.35em] sm:tracking-[0.4em] uppercase font-light"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: 'linear-gradient(90deg, #fff 0%, #C9A96E 50%, #fff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 6 ? { opacity: 1, y: 0, backgroundPosition: '200% 50%' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Your wrist called.
          </motion.p>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-[7vh] left-0 h-[1px] bg-gradient-to-r from-[#C9A96E] via-[#e8d5a3] to-[#C9A96E]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
