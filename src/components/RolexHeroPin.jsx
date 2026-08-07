import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RolexHeroPin({ watch, videoSrc, onSelectWatch }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          document.addEventListener('touchstart', () => vid.play(), { once: true });
          document.addEventListener('click', () => vid.play(), { once: true });
        });
      }
    }

    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !vid || !textEl) return;

    const ctx = gsap.context(() => {
      // Create a cinematic "going inside" reveal
      // Video starts zoomed in and slightly blurred, then locks into place crystal clear
      gsap.fromTo(vid,
        { scale: 1.4, filter: "blur(12px)", opacity: 0.6 },
        {
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          }
        }
      );

      // Text gently floats up with parallax
      gsap.fromTo(textEl,
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "center center",
            scrub: 1,
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[85vh] sm:h-screen bg-black overflow-hidden flex items-center justify-center pointer-events-auto border-y border-white/10"
    >
      {/* 4K CRISP CRYSTAL CLEAR GOLD SKELETON ROLEX VIDEO */}
      <div
        className="relative z-0 w-full h-full overflow-hidden flex items-center justify-center cursor-pointer bg-black"
        onClick={() => onSelectWatch && onSelectWatch(watch)}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={videoSrc || "/Gold_skeleton_watch_showcase_202606290837_softbr_20260805.mp4"}
          className="w-full h-full object-cover origin-center"
          style={{ transform: 'translateZ(0)', willChange: 'transform, filter' }}
        />
        {/* Subtle Vignette — 100% Crisp Video Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* LUXURY EDITORIAL OVERLAY */}
      <div ref={textRef} className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-12 md:p-20 pointer-events-none text-center">
        <div className="max-w-5xl text-center font-sans">
          <span className="text-xs sm:text-sm font-mono tracking-[0.45em] text-[#C9A96E] uppercase block mb-6 font-extrabold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            ✦ BEYOND COMPROMISE ✦
          </span>
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[1.05] flex flex-col items-center justify-center gap-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['The', 'Ultimate', 'Statement.'].map((word, i) => (
                <span key={i} className="inline-block font-extrabold bg-gradient-to-r from-[#C9A96E] via-[#FCE8BD] to-[#C9A96E] bg-clip-text text-transparent">
                  {word}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-[0.25em]">
              {['Forged', 'in', 'Time.'].map((word, i) => (
                <span key={i + 3} className="inline-block font-extrabold text-white">
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
