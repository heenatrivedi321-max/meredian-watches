import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CinemaIntermission({ videoSrc, title, soundDefault = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(soundDefault);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = !soundDefault;

    // Instant video play on load
    vid.play().catch(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(section);

    // ULTRA FAST 120 FPS HARDWARE ACCELERATED TEXT FADE IN
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => observer.disconnect();
  }, [soundDefault]);

  const toggleAudio = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.muted) {
      vid.muted = false;
      vid.volume = 1.0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsAudioEnabled(true);
        }).catch(() => {
          setIsAudioEnabled(true);
        });
      } else {
        setIsAudioEnabled(true);
      }
    } else {
      vid.muted = true;
      setIsAudioEnabled(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center border-y border-white/10"
    >
      {/* 4K CRISP FULL-SCREEN CINEMATIC VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.02) translateZ(0)', willChange: 'transform' }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* IMAX 2.39:1 CINEMATIC TOP & BOTTOM LETTERBOX BARS */}
      <div className="absolute top-0 left-0 w-full h-12 sm:h-16 lg:h-20 bg-black z-25 pointer-events-none border-b border-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 lg:h-20 bg-black z-25 pointer-events-none border-t border-white/10" />

      {/* LIVE AUDIO WAVEFORM ANIMATION */}
      {isAudioEnabled && (
        <div className="absolute bottom-6 left-8 sm:bottom-8 sm:left-12 z-30 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1 bg-[#00F0FF] rounded-full animate-pulse h-4" />
          <span className="w-1 bg-[#9B51E0] rounded-full animate-bounce h-7" />
          <span className="w-1 bg-[#FF4081] rounded-full animate-pulse h-5" />
          <span className="w-1 bg-[#4285F4] rounded-full animate-bounce h-8" />
          <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase font-semibold ml-2">
            IMAX 2.39:1 AUDIO ACTIVE
          </span>
        </div>
      )}

      {/* GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-16 right-8 sm:top-20 sm:right-12 z-30">
        <button
          onClick={toggleAudio}
          className={`group relative px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-300 flex items-center gap-3 cursor-pointer ${
            isAudioEnabled
              ? 'bg-white/20 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]'
              : 'bg-black/60 border-white/20 hover:border-white/50 hover:bg-black/80'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioEnabled ? 'bg-green-400' : 'bg-white/40'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAudioEnabled ? 'bg-green-400' : 'bg-white/60'}`} />
          </span>
          
          <span className="text-xs font-mono tracking-[0.2em] uppercase font-semibold text-white">
            {isAudioEnabled ? 'AUDIO LIVE 🔊' : 'ENABLE SOUND 🔇'}
          </span>
        </button>
      </div>

      {/* GEMINI IRIDESCENT TYPOGRAPHY — SLOW DISSOLVE FADE OUT */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-6xl mx-auto flex flex-col items-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <h2 
          className="text-2xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-sans font-normal tracking-[-0.02em] text-gradient-cyan-lime leading-[1.15] drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
        >
          {title}
        </h2>
      </div>

      {/* GEMINI AURORA SCANLINE BORDERS */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#4285F4] via-[#9B51E0] to-transparent pointer-events-none z-20 opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#9B51E0] via-[#00F0FF] to-transparent pointer-events-none z-20 opacity-60" />
    </section>
  );
}
