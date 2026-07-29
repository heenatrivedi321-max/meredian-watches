import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function playIntroSound() {
  try {
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

  return (
    <AnimatePresence>
      {!started ? (
        <motion.div
          key="enter-screen"
          onClick={handleEnter}
          className="fixed inset-0 z-[99999] bg-[#030305] flex flex-col items-center justify-center space-y-8 px-4 cursor-pointer overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Dynamic Wavy Color Changing Rainbow Mesh Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 animate-rainbow-mesh"
            style={{
              background: 'radial-gradient(circle at 20% 30%, #ff007f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00f0ff 0%, transparent 50%), radial-gradient(circle at 50% 80%, #ffd700 0%, transparent 50%), radial-gradient(circle at 70% 70%, #00ff88 0%, transparent 50%), radial-gradient(circle at 30% 70%, #9b51e0 0%, transparent 50%)',
              filter: 'blur(85px)',
              transform: 'scale(1.2)',
            }}
          />

          {/* Liquid Wave Ripple Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 animate-wave-ripple"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(255,0,127,0.2) 25%, rgba(255,215,0,0.2) 50%, rgba(0,255,136,0.2) 75%, rgba(155,81,224,0.2) 100%)',
              backgroundSize: '400% 400%',
              filter: 'blur(40px)',
            }}
          />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Gemini Animated Spectrum Bar */}
          <div className="w-28 h-[2px] bg-gradient-to-r from-[#00F0FF] via-[#FFD700] via-[#FF007F] via-[#00FF88] to-[#9B51E0] rounded-full animate-spectrum-sweep shadow-[0_0_20px_#00F0FF]" />

          {/* Monolithic Meridian Headline with Vibrant Flowing Rainbow */}
          <h1 
            className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.12em] sm:tracking-[0.18em] text-gemini-gradient uppercase text-center max-w-[90vw] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Meridian
          </h1>

          {/* Glowing Rainbow Enter Button */}
          <button
            onClick={handleEnter}
            className="group relative px-10 py-4 sm:px-12 sm:py-5 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-2xl transition-all duration-300 flex items-center gap-4 cursor-pointer shadow-[0_0_60px_rgba(0,240,255,0.3)] active:scale-95 z-50 overflow-hidden"
          >
            {/* Rainbow Button Border Glow */}
            <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-[#00F0FF] via-[#FFD700] via-[#FF007F] to-[#00FF88] opacity-70 group-hover:opacity-100 transition-opacity" />
            
            <span className="relative z-10 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase font-bold text-white flex items-center gap-2">
              ENTER EXPERIENCE 🔊
            </span>
            
            <span className="relative z-10 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
            </span>
          </button>
        </motion.div>
      ) : phase < 3 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, filter: 'blur(16px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 4 HYPER-VIBRANT VOLUMETRIC RAINBOW AURAS */}
          <motion.div 
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.6) 0%, rgba(66, 133, 244, 0.3) 50%, transparent 70%)', filter: 'blur(80px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.9], scale: [0.5, 1.4, 1.1] } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(255, 0, 127, 0.6) 0%, rgba(155, 81, 224, 0.3) 50%, transparent 70%)', filter: 'blur(80px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.9], scale: [0.5, 1.4, 1.1] } : {}}
            transition={{ duration: 1.5, delay: 0.15, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(0, 255, 136, 0.55) 0%, rgba(0, 240, 255, 0.3) 50%, transparent 70%)', filter: 'blur(80px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.9], scale: [0.5, 1.4, 1.1] } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 0, 127, 0.3) 50%, transparent 70%)', filter: 'blur(80px)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.9], scale: [0.5, 1.4, 1.1] } : {}}
            transition={{ duration: 1.5, delay: 0.45, ease: "easeOut" }}
          />

          {/* Wavy Rainbow Mesh Background */}
          <div className="absolute inset-0 animate-rainbow-mesh opacity-70 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,0,127,0.3), rgba(0,240,255,0.3), rgba(255,215,0,0.3), transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Electrifying Gemini Live Laser Aura & Anamorphic Beam */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[3px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #00F0FF 20%, #FFD700 40%, #FF007F 60%, #00FF88 80%, transparent 100%)',
              boxShadow: '0 0 50px #00F0FF, 0 0 100px #FF007F, 0 0 160px #FFD700',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 1 ? ['0vw', '100vw', '90vw'] : 0,
              opacity: phase >= 1 ? [0, 1, 0.9] : 0,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Monolithic Meridian Typography */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-[95vw] mx-auto overflow-hidden">
            <motion.h1
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-[0.1em] sm:tracking-[0.18em] text-gemini-gradient gemini-laser-glow uppercase drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(20px)' }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              MERIDIAN
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-6 sm:mt-10 text-xs sm:text-lg md:text-xl tracking-[0.3em] sm:tracking-[0.4em] uppercase font-semibold text-white/90 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] max-w-full"
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
