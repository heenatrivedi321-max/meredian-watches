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

    // 1. FULL-WIDTH ROLEX CINEMATIC PINNED ZOOM TIMELINE (GPU HARDWARE ACCELERATED)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=70%",
        pin: true,
        scrub: 0.05,
        anticipatePin: 1,
      }
    });

    // Scale from clean inset to full edge-to-edge
    tl.fromTo(videoEl,
      { scale: 0.88, borderRadius: "24px", force3D: true },
      { scale: 1.0, borderRadius: "0px", force3D: true, duration: 1, ease: "power2.out" }
    );

    tl.fromTo(glowEl,
      { scale: 0.5, opacity: 0.2, force3D: true },
      { scale: 1.4, opacity: 0.6, force3D: true, duration: 1, ease: "power2.out" },
      0
    );

    // 2. ULTRA-FAST 120 FPS GPU HARDWARE ACCELERATED TEXT REVEALS
    if (text1Ref.current) {
      tl.fromTo(text1Ref.current,
        { y: 80, opacity: 0, force3D: true },
        { y: 0, opacity: 1, force3D: true, duration: 0.4, ease: "power3.out" },
        0.08
      ).to(text1Ref.current, { y: -80, opacity: 0, force3D: true, duration: 0.3 }, 0.42);
    }

    if (text2Ref.current) {
      tl.fromTo(text2Ref.current,
        { y: 80, opacity: 0, force3D: true },
        { y: 0, opacity: 1, force3D: true, duration: 0.4, ease: "power3.out" },
        0.42
      ).to(text2Ref.current, { y: -80, opacity: 0, force3D: true, duration: 0.3 }, 0.78);
    }

    if (text3Ref.current) {
      tl.fromTo(text3Ref.current,
        { y: 80, opacity: 0, force3D: true },
        { y: 0, opacity: 1, force3D: true, duration: 0.4, ease: "power3.out" },
        0.78
      );
    }

    return () => {
      tl.kill();
      entranceTl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center pointer-events-auto rolex-hero-pin"
    >
      {/* Ambient Gold Radial Glow */}
      <div
        ref={glowRef}
        className="absolute w-[800px] h-[800px] rounded-full bg-radial from-[#800020]/25 via-[#A52A2A]/10 to-transparent blur-3xl pointer-events-none z-10"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* 100% CLEAN NO-WATERMARK CROPPED 4K VIDEO CONTAINER */}
      <div
        ref={pinnedVideoRef}
        className="relative z-0 w-full h-full overflow-hidden flex items-center justify-center cursor-pointer group shadow-2xl bg-white"
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
          className="w-full h-full object-cover transition-transform duration-700 scale-125 origin-center"
        />
        {/* Subtle Gradient Vignette for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Text Reveal 1: Top Left */}
      <div className="absolute left-8 sm:left-20 right-8 top-1/3 z-30 overflow-hidden pointer-events-none">
        <div
          ref={text1Ref}
          className="transform transition-transform"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="text-xs font-mono tracking-[0.4em] text-[#800020] uppercase block mb-2">
            316L SURGICAL STEEL
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-normal tracking-[-0.02em] text-rainbow-shimmer">
            Looks like 50 Lacs. Costs less than your weekend tab.
          </h2>
        </div>
      </div>

      {/* Text Reveal 2: Bottom Right */}
      <div className="absolute left-8 sm:left-auto right-8 sm:right-20 bottom-1/3 z-30 overflow-hidden pointer-events-none sm:text-right text-left">
        <div
          ref={text2Ref}
          className="transform transition-transform"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="text-xs font-mono tracking-[0.4em] text-[#800020] uppercase block mb-2">
            SAPPHIRE CRYSTAL GLASS
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-normal tracking-[-0.02em] text-rainbow-shimmer">
            No notifications. No software updates. Just pure unadulterated steel.
          </h2>
        </div>
      </div>

      {/* Text Reveal 3: Center Climax */}
      <div className="absolute inset-x-6 bottom-24 z-30 overflow-hidden text-center pointer-events-none">
        <div
          ref={text3Ref}
          className="transform transition-transform max-w-5xl mx-auto"
        >
          <h2 className="text-xl sm:text-5xl lg:text-6xl font-sans font-normal tracking-[-0.02em] text-rainbow-shimmer mb-3 leading-tight">
            Your smartwatch tells you to stand up. Ours tells people you own the building.
          </h2>
          <span className="text-xs font-mono tracking-[0.4em] text-[#800020] uppercase">
            MERIDIAN HOROLOGY — ATELIER EDITION
          </span>
        </div>
      </div>
    </section>
  );
}
