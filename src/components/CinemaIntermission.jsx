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

    // CLEAN FADE IN ON ENTRY, THEN DISSOLVE OUT ON SCROLL FOR 100% UNCOVERED 4K VIDEO
    if (textRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 20%",
          scrub: 0.5,
        }
      });

      tl.fromTo(textRef.current,
        { autoAlpha: 0, y: 60, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" }
      );

      tl.to(textRef.current,
        { autoAlpha: 0, y: -60, scale: 1.05, ease: "power2.in" },
        "+=0.5"
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

      {/* LUXURY GRADIENT OVERLAY */}
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

      {/* PURE STEVE JOBS APPLE LUXURY TYPOGRAPHY */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] text-white leading-[1.1] drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {title}
        </h2>
      </div>

      {/* SCANLINE BORDERS */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
    </section>
  );
}
