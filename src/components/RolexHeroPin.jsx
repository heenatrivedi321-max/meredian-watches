import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNearPlay } from '../hooks/useNearPlay';

gsap.registerPlugin(ScrollTrigger);

export default function RolexHeroPin({ watch, videoSrc, onSelectWatch }) {
  const containerRef = useRef(null);
  const pinnedVideoRef = useRef(null);
  const videoRef = useRef(null);

  useNearPlay(pinnedVideoRef, videoRef);

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = pinnedVideoRef.current;
    if (!container || !videoEl) return;

    const ctx = gsap.context(() => {
      // Ultra-smooth 60 FPS fade & scale entrance without lag
      gsap.fromTo(container,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[85vh] sm:h-screen bg-black overflow-hidden flex items-center justify-center pointer-events-auto border-y border-white/10"
    >
      {/* 4K ULTRA-SMOOTH NO-LAG LUXURY WATCH VIDEO */}
      <div
        ref={pinnedVideoRef}
        className="relative z-0 w-full h-full overflow-hidden flex items-center justify-center cursor-pointer bg-black"
        onClick={() => onSelectWatch && onSelectWatch(watch)}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          src={videoSrc || "/Rose_gold_mens_watch_clean_20260805_softbr_20260805.mp4"}
          className="w-full h-full object-cover transition-transform duration-700 scale-100 origin-center"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />
        {/* Sleek Dark Gradient Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />
      </div>

      {/* LUXURY EDITORIAL OVERLAY */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-12 md:p-20 pointer-events-none text-center">
        <div className="max-w-5xl text-center font-sans">
          <span className="text-xs sm:text-sm font-mono tracking-[0.45em] text-[#C9A96E] uppercase block mb-6 font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            ✦ BEYOND COMPROMISE ✦
          </span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[1.05] flex flex-col items-center justify-center gap-2 drop-shadow-2xl">
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['The', 'Ultimate', 'Statement.'].map((word, i) => (
                <span key={i} className="inline-block font-extrabold bg-gradient-to-r from-[#C9A96E] via-[#FCE8BD] to-[#C9A96E] bg-clip-text text-transparent">
                  {word}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['Forged', 'in', 'Time.'].map((word, i) => (
                <span key={i + 3} className="inline-block font-extrabold text-white">
                  {word}
                </span>
              ))}
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}
