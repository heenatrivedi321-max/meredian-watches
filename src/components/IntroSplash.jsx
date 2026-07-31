import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isLowEndDevice } from '../utils/device';

function playIntroSound() {
  try {
    const audio = new Audio('/ta-dum.mp3');
    audio.volume = 0.8;
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch(() => playFallbackAudio());
    }
  } catch (e) {
    playFallbackAudio();
  }
}

function playFallbackAudio() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(80, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.9);
    osc2.stop(ctx.currentTime + 0.9);
  } catch (err) {}
}

function GoldParticles({ active, count = 30 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 20,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 1.5,
      duration: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 300,
      rise: -80 - Math.random() * 300,
    })), [count]);

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
            y: [0, p.rise],
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
      style={{ width: '40vw', height: '40vw' }}
      initial={{ scale: 0.1, opacity: 0 }}
      animate={active ? { scale: [0.1, 2.5], opacity: [0.8, 0] } : {}}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function GoldBurst({ active, count = 20 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / count * 2 + (Math.random() - 0.5) * 0.3,
      dist: 60 + Math.random() * 200,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.3,
      dur: 0.6 + Math.random() * 0.6,
    })), [count]);
  return (
    <div className="absolute inset-0 pointer-events-none z-30" style={{ perspective: '800px' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: '50%', top: '50%',
            width: p.size, height: p.size,
            background: `radial-gradient(circle, #C9A96E 0%, #d4a843 60%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 8}px #C9A96E`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={active ? {
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          } : {}}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isLow = isLowEndDevice();

  useEffect(() => {
    playIntroSound();
    const t1 = setTimeout(() => setPhase(1), 1740);
    const t2 = setTimeout(() => setPhase(2), 2640);
    const t3 = setTimeout(() => setReady(true), 3540);
    const t4 = setTimeout(() => {
      setPhase(3);
      setTimeout(onComplete, 800);
    }, 5240);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleEnter = () => {
    if (!ready) return;
    setPhase(3);
    setTimeout(onComplete, 800);
  };

  return (
    <AnimatePresence>
      {phase < 3 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          exit={{ opacity: 0, scale: 1.8, rotate: 15, filter: 'blur(40px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          onClick={handleEnter}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
          tabIndex={0}
          role="button"
          aria-label="Enter site"
          animate={phase >= 1 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* White Flash Overlay */}
          {phase >= 1 && (
            <motion.div
              className="absolute inset-0 z-50 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{ background: 'white' }}
            />
          )}

          {/* Shock Rings — skip on low-end devices */}
          {!isLow && (
            <>
              <ShockRing active={phase >= 1} delay={0} />
              <ShockRing active={phase >= 1} delay={0.2} />
              <ShockRing active={phase >= 1} delay={0.4} />
            </>
          )}

          {/* Gold Particle Burst */}
          {!isLow && <GoldBurst active={phase >= 1} count={isMobile ? 8 : 20} />}
          {/* 4 VOLUMETRIC CORNER AMBIENT GLOW AURAS — skip on low-end */}
          {!isLow && (<>
          <motion.div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(128, 0, 32, 0.5) 0%, rgba(165, 42, 42, 0.2) 50%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={phase >= 1 ? { opacity: [0, 0.9, 0.75], scale: [0.3, 1.3, 1] } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div 
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(165, 42, 42, 0.5) 0%, rgba(128, 0, 32, 0.2) 50%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={phase >= 1 ? { opacity: [0, 0.9, 0.75], scale: [0.3, 1.3, 1] } : {}}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(92, 0, 24, 0.5) 0%, rgba(128, 0, 32, 0.2) 50%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={phase >= 1 ? { opacity: [0, 0.9, 0.75], scale: [0.3, 1.3, 1] } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div 
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(201, 169, 110, 0.4) 0%, rgba(128, 0, 32, 0.2) 50%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={phase >= 1 ? { opacity: [0, 0.9, 0.75], scale: [0.3, 1.3, 1] } : {}}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          </>)}
          {/* Ambient Gemini Live Mesh Background */}
          <div className="absolute inset-0 burgundy-aurora-bg pointer-events-none opacity-60 z-0" />

          {/* Burgundy Anamorphic Beam */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #800020 20%, #A52A2A 50%, #C95A5A 80%, #800020 90%, transparent 100%)',
              boxShadow: '0 0 40px #800020, 0 0 90px #800020, 0 0 50px #A52A2A',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 1 ? ['0vw', '90vw', '82vw'] : 0,
              opacity: phase >= 1 ? [0, 1, 0.85] : 0,
            }}
            transition={{ duration: 0.8, ease: [0.08, 0.8, 0.2, 1] }}
          />

          {/* Monolithic Meridian Typography — Staggered Letters */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-[95vw] mx-auto overflow-hidden">
            <motion.h1
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-[0.08em] sm:tracking-[0.15em] uppercase max-w-full"
              style={{
                fontFamily: "'Inter', sans-serif",
                textShadow: phase >= 1 ? '0 0 40px rgba(201,169,110,0.6), 0 0 80px rgba(201,169,110,0.3)' : 'none',
              }}
              animate={phase >= 1 ? {
                textShadow: [
                  '0 0 40px rgba(201,169,110,0.6), 0 0 80px rgba(201,169,110,0.3)',
                  '0 0 60px rgba(201,169,110,0.8), 0 0 120px rgba(201,169,110,0.4)',
                  '0 0 40px rgba(201,169,110,0.6), 0 0 80px rgba(201,169,110,0.3)',
                ],
              } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.2 }}
            >
              {"MERIDIAN".split('').map((char, i) => (
                <motion.span
                  key={i}
                  className={`inline-block ${isLow ? 'text-gold-static' : 'text-rainbow-shimmer'}`}
                  initial={{ opacity: 0, y: 80, rotate: -12, filter: 'blur(12px)' }}
                  animate={phase >= 1 ? { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-16 sm:mt-24 text-xs sm:text-lg md:text-xl tracking-[0.25em] sm:tracking-[0.35em] uppercase font-light text-white/80 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] max-w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Time flies. Look expensive while it perishes.
            </motion.p>

            {/* Tap to Enter */}
            <motion.div
              className="mt-16 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: [0.4, 1, 0.4], y: 0 } : {}}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
            >
              <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/40">
                Tap to Enter
              </span>
              <div className="w-[1px] h-8 bg-gradient-to-b from-[#800020] to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
