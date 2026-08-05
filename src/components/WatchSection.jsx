import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const cardInnerRef = useRef(null);
  const videoRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Distinct Luxury Card Backdrops for sharp card boundaries (#2)
  const cardBackdrops = [
    'bg-[#14120E]', // Card 1: Obsidian Gold
    'bg-[#1A0A0E]', // Card 2: Deep Crimson Gold
    'bg-[#080F1B]', // Card 3: Midnight Navy Gold
    'bg-[#071610]', // Card 4: Dark Emerald Gold
  ];

  const currentBg = cardBackdrops[index % cardBackdrops.length];

  // 3D Push back scale effect when the next card scrolls over this one
  useEffect(() => {
    const ctx = gsap.context(() => {
      // The section is 100vh tall. When its top hits the viewport top, it sticks.
      // Over the next 100vh of scrolling, the next card slides up to cover it.
      // During that exact window (top top to bottom top in natural flow), we scale it down.
      gsap.to(cardInnerRef.current, {
        scale: 0.92,
        y: -30,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  // Reliable video autoplay using IntersectionObserver
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            vid.play().catch((e) => console.log('Autoplay blocked:', e));
          } else {
            setIsVisible(false);
            vid.pause();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      className="sticky top-0 w-full h-screen bg-white flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 10 + index }}
    >
      {/* INSET ROUNDED CARD CONTAINER WITH DISTINCT LUXURY BACKDROP */}
      <div 
        ref={cardInnerRef}
        className={`relative w-full max-w-none sm:max-w-[95vw] md:max-w-7xl h-[100vh] sm:h-[92vh] sm:rounded-[32px] overflow-hidden ${currentBg} border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between p-6 sm:p-10 md:p-12 group`}
      >
        {/* 1. INLINE WATCH VIDEO BACKGROUND (AUTOPLAY) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={true}
            loop
            playsInline
            preload="auto"
            src={watch.cinematicVideo || watch.video}
            className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-1000 origin-center"
          />
          {/* Strong text protection gradient at the absolute top and bottom, but transparent in the middle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/80 pointer-events-none" />
        </div>

        {/* 2. GIANT KINETIC BACKGROUND TYPOGRAPHY */}
        <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none overflow-hidden select-none">
          <span 
            className="text-[12vw] sm:text-[14vw] font-black uppercase text-white/5 tracking-tighter whitespace-nowrap leading-none transition-transform duration-700 group-hover:scale-105"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {watch.brand}
          </span>
        </div>

        {/* 3. CARD TOP BAR: TITLE & EDITION (TOP LEFT) + INDEX (TOP RIGHT) */}
        <div className="relative z-20 flex justify-between items-start w-full pointer-events-auto">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] text-[#C9A96E] uppercase font-bold block mb-1 drop-shadow-md">
              2026 EDITION
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight drop-shadow-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {watch.model}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono tracking-[0.2em] text-white/80 font-bold uppercase drop-shadow-md">
              № 0{index + 1}/04
            </span>
            {/* SOUND TOGGLE */}
            <button
              onClick={toggleAudio}
              className="px-3.5 py-2 rounded-full backdrop-blur-xl bg-black/50 border border-white/20 hover:bg-[#C9A96E]/20 hover:border-[#C9A96E]/50 transition-all duration-300 flex items-center gap-2 text-white cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-[#C9A96E] animate-ping' : 'bg-white/40'}`} />
              <span className="text-[9px] font-mono tracking-[0.15em] font-bold text-white/90 uppercase">
                {isAudioEnabled ? 'AUDIO' : 'MUTED'}
              </span>
            </button>
          </div>
        </div>

        {/* 4. CARD BOTTOM BAR: PRICE (BOTTOM LEFT) + BUY NOW BUTTON (BOTTOM CENTER/RIGHT) */}
        <div className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto pt-6 border-t border-white/10 group-hover:border-white/30 transition-colors duration-700 mt-auto">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase block mb-1">
              SPECIAL PRICE
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C9A96E] tracking-tight drop-shadow-md">
              {watch.price}
            </span>
          </div>

          <button
            onClick={() => onClick(watch)}
            className="group/btn relative overflow-hidden px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-[#C9A96E] hover:text-black hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(201,169,110,0.5)] w-full sm:w-auto"
          >
            <span className="group-hover/btn:-translate-x-1 transition-transform duration-300">BUY NOW</span>
            <svg className="w-4 h-4 text-black group-hover/btn:translate-x-2 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

