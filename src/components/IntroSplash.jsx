import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MERIDIAN".split('');

function playIntroSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // 1. "TA" - Punchy 808 sub-bass thud + metallic gear click (t = 0.0s)
    const oscTa = ctx.createOscillator();
    const gainTa = ctx.createGain();
    oscTa.type = 'sine';
    oscTa.frequency.setValueAtTime(140, now);
    oscTa.frequency.exponentialRampToValueAtTime(35, now + 0.15);
    gainTa.gain.setValueAtTime(0.35, now);
    gainTa.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    oscTa.connect(gainTa).connect(ctx.destination);
    oscTa.start(now);
    oscTa.stop(now + 0.2);

    // 2. "DUMMMM" - Deep resonant Netflix-style luxury boom (t = 0.18s)
    const oscDum = ctx.createOscillator();
    const gainDum = ctx.createGain();
    oscDum.type = 'triangle';
    oscDum.frequency.setValueAtTime(85, now + 0.18);
    oscDum.frequency.exponentialRampToValueAtTime(32, now + 2.2);
    gainDum.gain.setValueAtTime(0, now + 0.18);
    gainDum.gain.linearRampToValueAtTime(0.45, now + 0.22);
    gainDum.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    oscDum.connect(gainDum).connect(ctx.destination);
    oscDum.start(now + 0.18);
    oscDum.stop(now + 2.6);

    // High shimmer harmonic resonance overlay
    const oscShimmer = ctx.createOscillator();
    const gainShimmer = ctx.createGain();
    oscShimmer.type = 'sine';
    oscShimmer.frequency.setValueAtTime(440, now + 0.2);
    oscShimmer.frequency.exponentialRampToValueAtTime(880, now + 0.5);
    oscShimmer.frequency.exponentialRampToValueAtTime(220, now + 2.0);
    gainShimmer.gain.setValueAtTime(0, now + 0.2);
    gainShimmer.gain.linearRampToValueAtTime(0.09, now + 0.3);
    gainShimmer.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    oscShimmer.connect(gainShimmer).connect(ctx.destination);
    oscShimmer.start(now + 0.2);
    oscShimmer.stop(now + 2.3);

  } catch (e) {
    // Audio Context not allowed or failed
  }
}

function GoldParticles({ active }) {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
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

function ShockRing({ active, delay = 0 }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A96E]/40"
      initial={{ width: 0, height: 0, opacity: 0 }}
      animate={active ? {
        width: [0, '130vw'],
        height: [0, '130vw'],
        opacity: [0.7, 0],
        borderWidth: [2, 0.3],
      } : {}}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (!soundPlayed.current) {
      soundPlayed.current = true;
      playIntroSound();
    }
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Radial gold glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(201,169,110,0.3) 0%, rgba(201,169,110,0.08) 35%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={phase >= 1 ? { width: '100vw', height: '70vh', opacity: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Shockwave rings */}
          <ShockRing active={phase >= 1} delay={0} />
          <ShockRing active={phase >= 1} delay={0.12} />
          <ShockRing active={phase >= 2} delay={0} />

          {/* Gold floating particles */}
          <GoldParticles active={phase >= 1} />

          {/* Gold line */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #C9A96E 20%, #e8d5a3 50%, #C9A96E 80%, transparent 100%)',
              boxShadow: '0 0 25px #C9A96E70, 0 0 80px #C9A96E40',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 0 ? '55vw' : 0,
              opacity: phase >= 0 ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* MERIDIAN letters */}
          <div className="relative flex items-center justify-center" style={{ perspective: '800px' }}>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="relative text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] font-bold tracking-tighter"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#fff',
                  textShadow: '0 0 60px rgba(201,169,110,0.6), 0 0 120px rgba(201,169,110,0.3), 0 0 200px rgba(201,169,110,0.15)',
                }}
                initial={{ opacity: 0, y: 60, rotateX: -120, scale: 0.5, filter: 'blur(12px)' }}
                animate={phase >= 1 ? {
                  opacity: [0, 1.2, 1],
                  y: [60, -12, 0],
                  rotateX: [-120, 8, 0],
                  scale: [0.5, 1.08, 1],
                  filter: ['blur(12px)', 'blur(0px)', 'blur(0px)'],
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={phase >= 1 ? { scaleX: 1, opacity: [0, 1, 0] } : {}}
                  transition={{ duration: 0.5, delay: i * 0.06 + 0.25 }}
                />
              </motion.span>
            ))}
          </div>

          {/* Tagline — BIG */}
          <motion.p
            className="mt-10 sm:mt-14 text-[1.1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] tracking-[0.3em] sm:tracking-[0.4em] uppercase font-light"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(90deg, #fff 0%, #C9A96E 50%, #fff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 25 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, backgroundPosition: '200% 50%' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Your wrist called.
          </motion.p>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#C9A96E] via-[#e8d5a3] to-[#C9A96E]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
