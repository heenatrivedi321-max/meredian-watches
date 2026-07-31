import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchSection({ watch, index, onClick, isActive }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [showUI, setShowUI] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const uiTimerRef = useRef(null);
  const releaseTimerRef = useRef(null);
  const blockerRef = useRef(null);
  const savedScrollRef = useRef(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    clearTimeout(uiTimerRef.current);
    clearTimeout(releaseTimerRef.current);
    if (blockerRef.current) {
      window.removeEventListener('wheel', blockerRef.current, { capture: true });
      window.removeEventListener('touchmove', blockerRef.current, { capture: true });
      blockerRef.current = null;
    }

    if (isActive) {
      if (vid) vid.play().catch(() => {});
      savedScrollRef.current = window.scrollY;

      if (window.lenis) window.lenis.stop();

      const blockInput = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      blockerRef.current = blockInput;
      window.addEventListener('wheel', blockInput, { capture: true, passive: false });
      window.addEventListener('touchmove', blockInput, { capture: true, passive: false });

      uiTimerRef.current = setTimeout(() => {
        setShowUI(true);
      }, 2000);

      releaseTimerRef.current = setTimeout(() => {
        if (blockerRef.current) {
          window.removeEventListener('wheel', blockerRef.current, { capture: true });
          window.removeEventListener('touchmove', blockerRef.current, { capture: true });
          blockerRef.current = null;
        }
        if (window.lenis) {
          window.lenis.scrollTo(savedScrollRef.current, { immediate: true });
          window.lenis.start();
        }
      }, 3000);
    } else {
      setShowUI(false);
      if (vid) vid.pause();
      if (window.lenis) window.lenis.start();
    }
    return () => {
      clearTimeout(uiTimerRef.current);
      clearTimeout(releaseTimerRef.current);
      if (blockerRef.current) {
        window.removeEventListener('wheel', blockerRef.current, { capture: true });
        window.removeEventListener('touchmove', blockerRef.current, { capture: true });
        blockerRef.current = null;
      }
      if (window.lenis) window.lenis.start();
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
          muted
          loop
          playsInline
          preload="none"
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
              className="pointer-events-auto"
            >
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.5em] text-[#800020] uppercase block font-bold mb-2">
                EDITION 0{index + 1}
              </span>
              <h2
                className="text-5xl sm:text-7xl lg:text-8xl font-light text-rainbow-shimmer leading-none mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
              >
                {watch.model.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </h2>
              <span 
                className="text-[11px] font-mono tracking-[0.35em] text-white/50 uppercase block"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {watch.brand}
              </span>
              <span 
                className="text-lg sm:text-xl font-light text-white/70 tracking-tight block"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {watch.price}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOUND CONTROL — glassmorphism */}
        <button
          onClick={toggleAudio}
          className="pointer-events-auto relative px-5 py-3 rounded-full backdrop-blur-2xl bg-white/5 border border-white/20 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E]/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 flex items-center gap-3 cursor-pointer shadow-xl shadow-black/30 min-h-[44px] group text-white"
        >
          <span className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-[#C9A96E] animate-ping' : 'bg-white/40'}`} />
          <svg className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isAudioEnabled ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            )}
          </svg>
          <span className="text-[10px] font-sans tracking-[0.2em] font-semibold text-white/80 group-hover:text-white uppercase transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {isAudioEnabled ? 'AUDIO LIVE' : 'SOUND OFF'}
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

              {/* CTA BUTTON — glassmorphism */}
              <button
                onClick={() => onClick(watch)}
                className="group relative overflow-hidden px-10 py-4 rounded-full backdrop-blur-2xl bg-white/5 border border-white/20 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E]/50 hover:scale-[1.02] active:scale-[0.97] transition-all duration-500 flex items-center gap-4 cursor-pointer shadow-xl shadow-black/30 z-30 text-white"
              >
                <span className="text-xs sm:text-sm tracking-[0.3em] uppercase font-sans font-semibold text-white/90 group-hover:text-white group-hover:tracking-[0.35em] transition-all duration-500 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
                  CHECK IT OUT
                </span>
                <svg className="w-4 h-4 text-white/70 group-hover:text-[#C9A96E] group-hover:translate-x-1.5 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

