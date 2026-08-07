import React, { useEffect, useRef } from 'react';

export default function RolexHeroPin({ watch, videoSrc, onSelectWatch }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry playback on user interaction if blocked
          document.addEventListener('touchstart', () => vid.play(), { once: true });
          document.addEventListener('click', () => vid.play(), { once: true });
        });
      }
    }
  }, []);

  return (
    <section
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
          className="w-full h-full object-cover transition-transform duration-700 scale-105 origin-center"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />
        {/* Subtle Vignette — 100% Crisp Video Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 pointer-events-none" />
      </div>

      {/* LUXURY EDITORIAL OVERLAY */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-12 md:p-20 pointer-events-none text-center">
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
