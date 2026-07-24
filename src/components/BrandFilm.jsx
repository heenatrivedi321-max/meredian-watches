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

    // Dynamic Zoom Effect on Scroll — Rolex Style
    gsap.fromTo(vid,
      { scale: 1.25, filter: "brightness(0.6) blur(5px)" },
      {
        scale: 1,
        filter: "brightness(1) blur(0px)",
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
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !vid.muted;
    setIsAudioEnabled(!vid.muted);
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

      {/* HERO OVERLAY TEXT — ROLEX CINEMATIC STYLE */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-[#C9A96E]/30 bg-black/40 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#C9A96E]">THE CINEMATIC MANIFESTO</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-7xl font-extralight tracking-tight text-white leading-[1.1] mb-6">
          We don't follow legends.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A96E] via-[#F3E5AB] to-[#C9A96E] font-normal italic">
            We time them.
          </span>
        </h2>

        <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-white/40 max-w-lg">
          MERIDIAN // ARCHIVAL HOROLOGY IN MOTION
        </p>
      </div>

      {/* BOTTOM GOLD SCANLINES */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent pointer-events-none z-20" />
    </div>
  );
}
