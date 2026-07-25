import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandFilm() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = true;

    // IntersectionObserver to auto-play video cleanly
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
      { threshold: 0.2 }
    );
    observer.observe(section);

    // Scale effect on scroll
    gsap.fromTo(vid,
      { scale: 1.1 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 0.8,
        }
      }
    );

    // Text Reveal Animation
    gsap.fromTo(textRef.current,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => observer.disconnect();
  }, []);

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
          setIsAudioEnabled(false);
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
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center border-y border-[#C9A96E]/20"
    >
      {/* 4K CINEMATIC TITANIC / BRAND FILM */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      >
        <source src="/brand-film.mp4" type="video/mp4" />
      </video>

      {/* LUXURY GRADIENT & GOLD GLOW OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black pointer-events-none z-10" />

      {/* ROLEX-STYLE GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 z-30">
        <button
          onClick={toggleAudio}
          className={`group relative px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-500 flex items-center gap-3 cursor-pointer ${
            isAudioEnabled
              ? 'bg-[#C9A96E]/20 border-[#C9A96E] shadow-[0_0_30px_rgba(201,169,110,0.5)]'
              : 'bg-black/60 border-white/20 hover:border-[#C9A96E]/50 hover:bg-black/80'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/40'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/60'}`} />
          </span>
          
          <span className="text-xs font-mono tracking-[0.2em] uppercase font-semibold text-white group-hover:text-[#C9A96E] transition-colors">
            {isAudioEnabled ? 'AUDIO LIVE 🔊' : 'ENABLE SOUND 🔇'}
          </span>
        </button>
      </div>

      {/* HERO OVERLAY TEXT — PURE MASSIVE ICONIC STATEMENT */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase drop-shadow-[0_20px_60px_rgba(0,0,0,1)]">
          I'M THE KING OF THE WORLD.
        </h2>
      </div>

      {/* BOTTOM GOLD SCANLINES */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent pointer-events-none z-20" />
    </div>
  );
}
