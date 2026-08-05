import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandFilm() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const beamRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const textContainerRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = true;

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
      { threshold: 0.2, rootMargin: '1500px 0px' }
    );
    observer.observe(section);

    gsap.fromTo(vid,
      { yPercent: -15, scale: 1.15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        toggleActions: "play none none reverse"
      }
    });

    // Letterbox bars retract
    tl.fromTo(topBarRef.current,
      { scaleY: 1 },
      { scaleY: 0, duration: 0.8, ease: "power4.out", transformOrigin: "top" }, 0
    );
    tl.fromTo(bottomBarRef.current,
      { scaleY: 1 },
      { scaleY: 0, duration: 0.8, ease: "power4.out", transformOrigin: "bottom" }, 0
    );

    // Text center-split reveal
    tl.fromTo(textContainerRef.current,
      { clipPath: 'inset(50% 0 50% 0)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: "power4.out" }, 0.2
    );

    // Beam sweep
    tl.fromTo(beamRef.current,
      { left: '-15%', opacity: 0 },
      { left: '115%', opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0.4
    );
    tl.to(beamRef.current,
      { opacity: 0, duration: 0.4 }, 1.6
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
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center border-y border-white/10"
    >
      {/* 4K CINEMATIC TITANIC / BRAND FILM */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <source src="/brand-film.mp4" type="video/mp4" />
      </video>

      {/* LUXURY GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none z-10" />

      {/* LETTERBOX BARS — RETRACT ON SCROLL */}
      <div ref={topBarRef} className="absolute top-0 left-0 right-0 h-[15vh] bg-black z-20 pointer-events-none" />
      <div ref={bottomBarRef} className="absolute bottom-0 left-0 right-0 h-[15vh] bg-black z-20 pointer-events-none" />

      {/* BEAM SWEEP */}
      <div
        ref={beamRef}
        className="absolute top-0 bottom-0 w-[40vw] z-20 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)',
        }}
      />

      {/* GLASSMORPHISM AUDIO CONTROL PILL */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 z-30">
        <button
          onClick={toggleAudio}
          className={`group relative px-6 py-3 rounded-full border backdrop-blur-2xl transition-all duration-500 flex items-center gap-3 cursor-pointer min-h-[44px] shadow-xl shadow-black/30 ${
            isAudioEnabled
              ? 'bg-[#C9A96E]/15 border-[#C9A96E]/50 text-white'
              : 'bg-white/5 border-white/20 text-white/80 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E]/50 hover:scale-[1.03]'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/40'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/60'}`} />
          </span>
          
          <svg className="w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <span className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {isAudioEnabled ? 'AUDIO LIVE' : 'ENABLE SOUND'}
          </span>
        </button>
      </div>

      {/* HERO OVERLAY TEXT — CENTER-SPLIT ROLEX REVEAL */}
      <div
        ref={textContainerRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none"
        style={{ clipPath: 'inset(50% 0 50% 0)' }}
      >
        <h2 
          ref={textRef}
          className="text-3xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[0.06em] uppercase text-rainbow-shimmer leading-[1.1]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          "I'm the king of the world."
        </h2>
      </div>
    </div>
  );
}
