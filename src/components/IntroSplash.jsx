import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MERIDIAN".split('');

function playIntroSound() {
  try {
    // Attempt DOM element first if present
    const domAudio = document.getElementById('ta-dum-audio');
    if (domAudio) {
      domAudio.volume = 1.0;
      domAudio.currentTime = 0;
      const p = domAudio.play();
      if (p !== undefined) {
        p.catch(() => playFallbackAudio());
      }
      return;
    }
    playFallbackAudio();
  } catch (e) {
    playFallbackAudio();
  }
}

function playFallbackAudio() {
  try {
    const audio = new Audio('/ta-dum.wav');
    audio.volume = 1.0;
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch(() => {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          if (ctx.state === 'suspended') ctx.resume();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(120, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 1.8);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(60, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.8);

          gain.gain.setValueAtTime(0.9, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 2.1);
          osc2.stop(ctx.currentTime + 2.1);
        } catch (err) {}
      });
    }
  } catch (err) {}
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
      style={{ width: '40vw', height: '40vw' }}
      initial={{ scale: 0.1, opacity: 0 }}
      animate={active ? { scale: [0.1, 2.5], opacity: [0.8, 0] } : {}}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);

  const handleEnter = () => {
    if (started) return;
    setStarted(true);
    playIntroSound();
    
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 1200);
    setTimeout(() => setPhase(3), 3200);
    setTimeout(() => onComplete(), 3600);
  };

  useEffect(() => {
    // Component mounted, sound is played strictly once on user interaction
  }, []);

  return (
    <AnimatePresence>
      {!started ? (
        <motion.div
          key="enter-screen"
          onClick={handleEnter}
          className="fixed inset-0 z-[99999] bg-[#020202] flex flex-col items-center justify-center space-y-8 px-4 cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle Obsidian Film Grain */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Fluid Wavy Rainbow Ambient Backlight Glow */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 animate-rainbow-mesh"
            style={{
              background: 'radial-gradient(circle at 30% 40%, rgba(0,240,255,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,0,127,0.35) 0%, transparent 60%), radial-gradient(circle at 50% 30%, rgba(255,215,0,0.3) 0%, transparent 50%)',
              filter: 'blur(90px)',
            }}
          />

          {/* Gemini Live Accent Hairline */}
          <div className="w-20 h-[1.5px] bg-gradient-to-r from-[#4285F4] via-[#9B51E0] via-[#FF4081] to-[#00F0FF] rounded-full animate-pulse z-10" />

          {/* Monolithic Meridian Headline — Original Clean Typography */}
          <h1 
            className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.1em] sm:tracking-[0.15em] text-gemini-gradient uppercase text-center max-w-[90vw] drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Meridian
          </h1>

          {/* Luxury Enter Button */}
          <button
            onClick={handleEnter}
            className="group relative px-9 py-4 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/60 backdrop-blur-2xl transition-all duration-300 flex items-center gap-3.5 cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 z-50"
          >
            <span className="text-xs font-mono tracking-[0.25em] uppercase font-semibold text-gemini-gradient">
              ENTER EXPERIENCE 🔊
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF]" />
            </span>
          </button>
        </motion.div>
      ) : phase < 3 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 4 VOLUMETRIC CORNER AMBIENT GLOW AURAS */}
          <motion.div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(66, 133, 244, 0.45) 0%, rgba(0, 240, 255, 0.2) 50%, transparent 70%)', filter: 'blur(70px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.85], scale: [0.5, 1.25, 1] } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(155, 81, 224, 0.45) 0%, rgba(255, 64, 129, 0.2) 50%, transparent 70%)', filter: 'blur(70px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.85], scale: [0.5, 1.25, 1] } : {}}
            transition={{ duration: 1.5, delay: 0.15, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(0, 230, 118, 0.4) 0%, rgba(0, 240, 255, 0.2) 50%, transparent 70%)', filter: 'blur(70px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.85], scale: [0.5, 1.25, 1] } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(255, 64, 129, 0.45) 0%, rgba(155, 81, 224, 0.2) 50%, transparent 70%)', filter: 'blur(70px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.85], scale: [0.5, 1.25, 1] } : {}}
            transition={{ duration: 1.5, delay: 0.45, ease: "easeOut" }}
          />

          {/* Ambient Gemini Live Mesh Background */}
          <div className="absolute inset-0 gemini-aurora-bg pointer-events-none opacity-60 z-0" />

          {/* Electrifying Gemini Live Laser Aura & Anamorphic Beam */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #4285F4 20%, #9B51E0 50%, #FF4081 80%, #00F0FF 90%, transparent 100%)',
              boxShadow: '0 0 40px #9B51E0, 0 0 90px #00F0FF, 0 0 140px #FF4081',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 1 ? ['0vw', '95vw', '85vw'] : 0,
              opacity: phase >= 1 ? [0, 1, 0.8] : 0,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Monolithic Meridian Typography */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-[95vw] mx-auto overflow-hidden">
            <motion.h1
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-[0.08em] sm:tracking-[0.15em] text-gemini-gradient gemini-laser-glow uppercase drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(16px)' }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              MERIDIAN
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-6 sm:mt-10 text-xs sm:text-lg md:text-xl tracking-[0.25em] sm:tracking-[0.35em] uppercase font-light text-white/80 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] max-w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Time flies. Look expensive while it perishes.
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
