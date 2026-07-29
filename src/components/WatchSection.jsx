import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchSection({ watch, index, onClick, isActive }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [showUI, setShowUI] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    clearTimeout(timerRef.current);
    if (isActive) {
      if (vid) vid.play().catch(() => {});
      // Slow scroll to near-lock for 2.2s while UI delays
      if (window.lenis) window.lenis.options.duration = 3.5;
      timerRef.current = setTimeout(() => {
        setShowUI(true);
        if (window.lenis) window.lenis.options.duration = 1.0;
      }, 2200);
    } else {
      setShowUI(false);
      if (vid) vid.pause();
      if (window.lenis) window.lenis.options.duration = 1.0;
    }
    return () => {
      clearTimeout(timerRef.current);
      if (window.lenis) window.lenis.options.duration = 1.0;
    };
  }, [isActive]);

  const toggleAudio = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.muted) {
      vid.muted = false;
      vid.volume = 1.0;
      vid.play().then(() => setIsAudioEnabled(true)).catch(() => setIsAudioEnabled(true));
    } else {
      vid.muted = true;
      setIsAudioEnabled(false);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black text-white flex flex-col justify-between overflow-hidden pointer-events-auto"
    >
      {/* 100% FULL-SCREEN EDGE-TO-EDGE 4K VIDEO STREAM WITH ROLEX ZOOM ANIMATION */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="watch-section-video w-full h-full object-cover transition-transform duration-1000 scale-125 origin-center"
          style={{ transform: 'scale(1.25) translateZ(0)', willChange: 'transform' }}
        >
          <source src={watch.cinematicVideo || watch.video} type="video/mp4" />
        </video>

        {/* Cinematic Radial & Vertical Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* TOP LEFT REVEAL: TITLE & BRAND (SLIDES DOWN AFTER VIDEO PLAYS) */}
      <div className="relative z-20 p-8 sm:p-14 md:p-20 flex justify-between items-start pointer-events-none">
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ y: -60, opacity: 0, filter: "blur(12px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 pointer-events-auto"
            >
              <span className="text-xs font-mono tracking-[0.4em] text-[#800020] uppercase block font-semibold">
                EDITION 0{index + 1} // {watch.brand}
              </span>
              <h2
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.05em] text-white uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
              >
                {watch.model}
              </h2>
              <span 
                className="text-lg sm:text-2xl font-light text-white/90 tracking-tight block"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {watch.price}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOUND CONTROL PILL */}
        <button
          onClick={toggleAudio}
          className="pointer-events-auto px-5 py-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 backdrop-blur-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-2xl min-h-[44px]"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isAudioEnabled ? 'bg-[#10B981] animate-ping' : 'bg-white/50'}`} />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] font-semibold text-white uppercase">
            {isAudioEnabled ? 'AUDIO LIVE 🔊' : 'ENABLE SOUND 🔇'}
          </span>
        </button>
      </div>

      {/* BOTTOM CENTER REVEAL: SEXY GLASSMORPHISM BUTTON WITH GOOGLE TYPOGRAPHY (PLUS JAKARTA SANS / INTER) */}
      <div className="relative z-20 pb-16 sm:pb-24 px-6 flex flex-col items-center text-center pointer-events-none">
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.9, filter: "blur(16px)" }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ y: 70, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 pointer-events-auto"
            >
              {watch.tagline && (
                <p 
                  className="text-xs sm:text-sm font-light tracking-[0.25em] text-white/80 uppercase max-w-md drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  "{watch.tagline}"
                </p>
              )}

              {/* SEXY GLASSMORPHISM BUTTON WITH GOOGLE TYPOGRAPHY (PLUS JAKARTA SANS / INTER) */}
              <button
                onClick={() => onClick(watch)}
                style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                className="group relative px-10 py-5 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 hover:border-[#800020] backdrop-blur-3xl transition-all duration-500 flex items-center gap-4 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(128,0,32,0.4)] active:scale-95 z-30"
              >
                <span className="text-xs sm:text-sm tracking-[0.3em] uppercase font-bold text-white group-hover:text-[#800020] transition-colors">
                  CHECK IT OUT
                </span>
                <span className="text-lg text-white group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

