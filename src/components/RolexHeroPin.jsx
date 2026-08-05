import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNearPlay } from '../hooks/useNearPlay';

gsap.registerPlugin(ScrollTrigger);

export default function RolexHeroPin({ watch, onSelectWatch }) {
  const containerRef = useRef(null);
  const pinnedVideoRef = useRef(null);
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useNearPlay(pinnedVideoRef, videoRef);

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = pinnedVideoRef.current;
    const glowEl = glowRef.current;
    if (!container || !videoEl) return;

    const ctx = gsap.context(() => {
      // Entrance — cross-fade from dark section above
      const entranceTl = gsap.fromTo(".rolex-hero-pin",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0,
          duration: 1.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".rolex-hero-pin",
            start: "top 100%",
            toggleActions: "play none none none"
          }
        }
      );

      // 1. FULL-WIDTH CINEMATIC INSET-TO-FULLSCREEN EXPANSION TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 0.2,
        }
      });

      // Expand container from inset rounded frame to 100% full screen
      tl.fromTo(videoEl,
        { scale: 0.85, borderRadius: "28px", force3D: true },
        { scale: 1.0, borderRadius: "0px", force3D: true, duration: 1, ease: "power2.out" }
      );

      // Deep zoom into video content simultaneously
      if (videoRef.current) {
        tl.fromTo(videoRef.current,
          { scale: 1.0 },
          { scale: 1.45, duration: 1, ease: "power1.inOut" },
          0
        );
      }

      tl.to(glowEl,
        { scale: 1.8, opacity: 0.8, force3D: true, duration: 1, ease: "power2.out" },
        0
      );

      // 2. SCROLL-TIED TEXT REVEAL (MATCHING THE BLUR REVEAL ABOVE)
      gsap.fromTo(".hero-word",
        { autoAlpha: 0, y: 80, rotationX: -20, scale: 0.95, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center pointer-events-auto rolex-hero-pin"
    >
      {/* Ambient Gold Radial Glow */}
      <div
        ref={glowRef}
        className="absolute w-[800px] h-[800px] rounded-full bg-radial from-[#C9A96E]/20 via-transparent to-transparent blur-3xl pointer-events-none z-10"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* 100% CLEAN NO-WATERMARK CROPPED 4K VIDEO CONTAINER */}
      <div
        ref={pinnedVideoRef}
        className="relative z-0 w-full h-full overflow-hidden flex items-center justify-center cursor-pointer group shadow-2xl bg-black"
        onClick={() => onSelectWatch && onSelectWatch(watch)}
        style={{ willChange: 'transform, borderRadius' }}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          src={watch?.cinematicVideo || watch?.video || "/Gold_skeleton_watch_showcase_202606290837.mp4"}
          className="w-full h-full object-cover transition-transform duration-700 scale-100 origin-center"
        />
        {/* Subtle Gradient Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
      </div>

      {/* SHORT & PUNCHY ROLEX GOLD EDITORIAL OVERLAY */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-6 sm:p-12 md:p-20 pointer-events-none">
        <div className="max-w-5xl text-center font-sans">
          <span className="text-xs sm:text-sm font-mono tracking-[0.4em] text-[#C9A96E] uppercase block mb-6 font-bold">
            BEYOND COMPROMISE
          </span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[1.05] flex flex-col items-center justify-center gap-2">
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['The', 'Ultimate', 'Statement.'].map((word, i) => (
                <span key={i} className="hero-word inline-block font-extrabold text-[#C9A96E]">
                  {word}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['Forged', 'in', 'Time.'].map((word, i) => (
                <span key={i + 3} className="hero-word inline-block font-extrabold text-white">
                  {word}
                </span>
              ))}
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}
