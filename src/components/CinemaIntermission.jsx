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

    // Dynamic Zoom Effect on Scroll
    gsap.fromTo(vid,
      { scale: 1.2, filter: "brightness(0.5) blur(6px)" },
      {
        scale: 1,
        filter: "brightness(1) blur(0px)",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
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
          start: "top 55%",
          toggleActions: "play none none reverse"
        }
      }
    );

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
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center border-y border-white/10"
    >
      {/* 4K FULL-SCREEN CINEMATIC VIDEO INTERMISSION */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* LUXURY GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black pointer-events-none z-10" />

      {/* GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 z-30">
        <button
          onClick={toggleAudio}
          className={`group relative px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-500 flex items-center gap-3 cursor-pointer ${
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

      {/* HERO OVERLAY TEXT — APPLE/CINEMA STYLE */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-white/30 bg-black/60 backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-white font-semibold">{tag}</span>
        </div>

        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tighter text-white leading-none uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] mb-6">
          {title}
        </h2>

        {subtitle && (
          <p className="text-xs sm:text-base font-mono tracking-[0.35em] uppercase text-white/70 max-w-2xl bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
            {subtitle}
          </p>
        )}
      </div>

      {/* TOP/BOTTOM SCANLINES */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
    </section>
  );
}
