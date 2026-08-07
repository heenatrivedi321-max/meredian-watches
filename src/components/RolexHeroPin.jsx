import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNearPlay } from '../hooks/useNearPlay';

gsap.registerPlugin(ScrollTrigger);

export default function RolexHeroPin({ watch, videoSrc, onSelectWatch }) {
  const containerRef = useRef(null);
  const pinnedVideoRef = useRef(null);
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const curtainTopRef = useRef(null);
  const curtainBottomRef = useRef(null);
  const beamRef = useRef(null);
  const textContainerRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useNearPlay(pinnedVideoRef, videoRef);

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = pinnedVideoRef.current;
    const glowEl = glowRef.current;
    if (!container || !videoEl) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // 1. CINEMATIC SHUTTER CURTAIN SPLIT + INSET-TO-FULLSCREEN UNROLL
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "top 10%",
          scrub: 0.4,
        }
      });

      // Retract upper & lower cinematic curtains
      masterTl.fromTo(curtainTopRef.current,
        { height: "50%" },
        { height: "0%", ease: "power3.inOut" },
        0
      );
      masterTl.fromTo(curtainBottomRef.current,
        { height: "50%" },
        { height: "0%", ease: "power3.inOut" },
        0
      );

      // Unroll inset video container to full screen with 3D scale
      if (!isMobile) {
        masterTl.fromTo(videoEl,
          { scale: 0.82, borderRadius: "36px", rotationX: 12, force3D: true },
          { scale: 1.0, borderRadius: "0px", rotationX: 0, force3D: true, ease: "power2.out" },
          0
        );

        if (videoRef.current) {
          masterTl.fromTo(videoRef.current,
            { scale: 1.25 },
            { scale: 1.0, ease: "power1.out" },
            0
          );
        }

        masterTl.fromTo(glowEl,
          { scale: 0.5, opacity: 0.2 },
          { scale: 1.6, opacity: 0.8, ease: "power2.out" },
          0
        );
      }

      // 2. GOLDEN LASER BEAM SWEEP ACROSS FRAME
      gsap.fromTo(beamRef.current,
        { left: '-30%', opacity: 0 },
        {
          left: '130%', opacity: 0.9,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top 50%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3. ROLEX 3D TEXT SPLIT & GLOW REVEAL
      gsap.fromTo(textContainerRef.current,
        { clipPath: 'inset(50% 0 50% 0)', autoAlpha: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".rolex-word",
        { autoAlpha: 0, y: 70, rotationX: -35, scale: 0.9 },
        {
          autoAlpha: 1, y: 0, rotationX: 0, scale: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: container,
            start: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, container);

    return () => ctx.revert();
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
      vid.play().then(() => setIsAudioEnabled(true)).catch(() => setIsAudioEnabled(false));
    } else {
      vid.muted = true;
      setIsAudioEnabled(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center pointer-events-auto rolex-hero-pin border-y border-white/10"
      style={{ perspective: '1200px' }}
    >
      {/* SHUTTER CURTAIN TOP */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 right-0 bg-[#050507] z-40 pointer-events-none border-b border-[#C9A96E]/30"
        style={{ height: '50%' }}
      />
      {/* SHUTTER CURTAIN BOTTOM */}
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 right-0 bg-[#050507] z-40 pointer-events-none border-t border-[#C9A96E]/30"
        style={{ height: '50%' }}
      />

      {/* Ambient Gold Radial Glow */}
      <div
        ref={glowRef}
        className="absolute w-[900px] h-[900px] rounded-full bg-radial from-[#C9A96E]/25 via-[#800020]/15 to-transparent blur-3xl pointer-events-none z-10"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* GOLDEN LASER LIGHT BEAM SWEEP */}
      <div
        ref={beamRef}
        className="absolute top-0 bottom-0 w-[35vw] z-30 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.12) 30%, rgba(255,232,189,0.35) 50%, rgba(201,169,110,0.12) 70%, transparent 100%)',
          transform: 'skewX(-20deg)',
        }}
      />

      {/* AUDIO TOGGLE BUTTON PILL */}
      <div className="absolute top-12 right-8 sm:top-16 sm:right-12 z-45">
        <button
          onClick={toggleAudio}
          className={`group relative px-5 py-2.5 rounded-full border backdrop-blur-2xl transition-all duration-500 flex items-center gap-3 cursor-pointer shadow-2xl ${
            isAudioEnabled
              ? 'bg-[#C9A96E]/20 border-[#C9A96E] text-white'
              : 'bg-white/5 border-white/20 text-white/80 hover:bg-[#C9A96E]/20 hover:border-[#C9A96E]'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/40'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/70'}`} />
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-white">
            {isAudioEnabled ? 'AUDIO ON' : 'ENABLE SOUND'}
          </span>
        </button>
      </div>

      {/* 4K CROPPED GOLD SKELETON ROLEX VIDEO CONTAINER */}
      <div
        ref={pinnedVideoRef}
        className="relative z-0 w-full h-full overflow-hidden flex items-center justify-center cursor-pointer group shadow-2xl bg-black border border-white/10"
        onClick={() => onSelectWatch && onSelectWatch(watch)}
        style={{ willChange: 'transform, borderRadius, rotationX' }}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          src={videoSrc || "/Gold_skeleton_watch_showcase_202606290837_softbr_20260805.mp4"}
          className="w-full h-full object-cover transition-transform duration-700 scale-100 origin-center"
        />
        {/* Subtle Gradient Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/65 pointer-events-none" />
      </div>

      {/* ROLEX GOLD EDITORIAL OVERLAY WITH 3D MOTION REVEAL */}
      <div
        ref={textContainerRef}
        className="absolute inset-0 z-35 flex items-center justify-center p-6 sm:p-12 md:p-20 pointer-events-none text-center"
      >
        <div className="max-w-5xl text-center font-sans">
          <span className="text-xs sm:text-sm font-mono tracking-[0.45em] text-[#C9A96E] uppercase block mb-6 font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            ✦ BEYOND COMPROMISE ✦
          </span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[1.05] flex flex-col items-center justify-center gap-2 drop-shadow-2xl">
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['The', 'Ultimate', 'Statement.'].map((word, i) => (
                <span key={i} className="rolex-word inline-block font-extrabold bg-gradient-to-r from-[#C9A96E] via-[#FCE8BD] to-[#C9A96E] bg-clip-text text-transparent">
                  {word}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['Forged', 'in', 'Time.'].map((word, i) => (
                <span key={i + 3} className="rolex-word inline-block font-extrabold text-white">
                  {word}
                </span>
              ))}
            </div>
          </h1>
        </div>
      </div>

      {/* GEMINI AURORA SCANLINE BORDERS */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent pointer-events-none z-45 opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent pointer-events-none z-45 opacity-70" />
    </section>
  );
}
