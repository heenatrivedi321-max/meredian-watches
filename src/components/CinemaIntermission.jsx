import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CinemaIntermission({ videoSrc, title, soundDefault = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textContainerRef = useRef(null);
  const beamRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(soundDefault);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = !soundDefault;
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // Letterbox bars retract
    tl.fromTo(topBarRef.current,
      { scaleY: 1 },
      { scaleY: 0, duration: 0.6, ease: "power4.out", transformOrigin: "top" }, 0
    );
    tl.fromTo(bottomBarRef.current,
      { scaleY: 1 },
      { scaleY: 0, duration: 0.6, ease: "power4.out", transformOrigin: "bottom" }, 0
    );

    // Text center-split reveal
    tl.fromTo(textContainerRef.current,
      { clipPath: 'inset(50% 0 50% 0)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: "power4.out" }, 0.15
    );

    // Beam sweep
    tl.fromTo(beamRef.current,
      { left: '-15%', opacity: 0 },
      { left: '115%', opacity: 1, duration: 1, ease: "power2.inOut" }, 0.3
    );
    tl.to(beamRef.current,
      { opacity: 0, duration: 0.3 }, 1.3
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

      {/* LETTERBOX BARS — RETRACT ON SCROLL */}
      <div ref={topBarRef} className="absolute top-0 left-0 right-0 h-[12vh] bg-black z-20 pointer-events-none" />
      <div ref={bottomBarRef} className="absolute bottom-0 left-0 right-0 h-[12vh] bg-black z-20 pointer-events-none" />

      {/* BEAM SWEEP */}
      <div
        ref={beamRef}
        className="absolute top-0 bottom-0 w-[40vw] z-20 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)',
        }}
      />

      {/* LIVE AUDIO WAVEFORM ANIMATION */}
      {isAudioEnabled && (
        <div className="absolute bottom-6 left-8 sm:bottom-8 sm:left-12 z-30 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1 bg-[#800020] rounded-full animate-pulse h-4" />
          <span className="w-1 bg-[#A52A2A] rounded-full animate-bounce h-7" />
          <span className="w-1 bg-[#C95A5A] rounded-full animate-pulse h-5" />
          <span className="w-1 bg-[#5C0018] rounded-full animate-bounce h-8" />
          <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase font-semibold ml-2">
            IMAX 2.39:1 AUDIO ACTIVE
          </span>
        </div>
      )}

      {/* GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-16 right-8 sm:top-20 sm:right-12 z-30">
        <button
          onClick={toggleAudio}
          className={`group relative px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-300 flex items-center gap-3 cursor-pointer min-h-[44px] ${
            isAudioEnabled
              ? 'bg-white/20 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]'
              : 'bg-black/60 border-white/20 hover:border-white/50 hover:bg-black/80'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioEnabled ? 'bg-green-400' : 'bg-white/40'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAudioEnabled ? 'bg-green-400' : 'bg-white/60'}`} />
          </span>
          
          <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <span className="text-xs font-mono tracking-[0.2em] uppercase font-semibold text-white">
            {isAudioEnabled ? 'AUDIO LIVE' : 'ENABLE SOUND'}
          </span>
        </button>
      </div>

      {/* ROLEX-STYLE CENTER-SPLIT TEXT REVEAL */}
      <div
        ref={textContainerRef}
        className="relative z-20 text-center px-6 max-w-6xl mx-auto flex flex-col items-center pointer-events-none"
        style={{ clipPath: 'inset(50% 0 50% 0)' }}
      >
        <h2 
          className="text-2xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-sans font-normal tracking-[-0.02em] text-rainbow-shimmer leading-[1.15]"
        >
          {title}
        </h2>
      </div>

      {/* GEMINI AURORA SCANLINE BORDERS */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#800020] via-[#A52A2A] to-transparent pointer-events-none z-20 opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A52A2A] via-[#800020] to-transparent pointer-events-none z-20 opacity-60" />
    </section>
  );
}
