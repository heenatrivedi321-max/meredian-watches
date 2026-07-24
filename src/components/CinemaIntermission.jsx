import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CinemaIntermission({ videoSrc, tag, title, subtitle, soundDefault = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(soundDefault);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = !soundDefault;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    // CLEAN, SMOOTH, NON-BLURRED FADE-IN (NO SCROLL PINNING, NO BLUR FILTERS)
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
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
      {/* 100% CRISP, NON-BLURRED FULL-SCREEN VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* DYNAMIC DARK LUXURY GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/70 pointer-events-none z-10" />

      {/* GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 z-30">
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

      {/* HERO OVERLAY TEXT — CLEAN & SHARP */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-white/30 bg-black/60 backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-white font-semibold">{tag}</span>
        </div>

        <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase drop-shadow-[0_20px_60px_rgba(0,0,0,1)] mb-6">
          {title}
        </h2>

        {subtitle && (
          <p className="text-xs sm:text-base font-mono tracking-[0.35em] uppercase text-white/80 max-w-2xl bg-black/50 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
            {subtitle}
          </p>
        )}
      </div>

      {/* SCANLINE BORDERS */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
    </section>
  );
}
