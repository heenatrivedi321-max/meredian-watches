import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const watchCardRef = useRef(null);
  const textRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!section) return;

    if (vid) {
      vid.muted = true;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && vid) {
            vid.play().catch(() => {});
          } else if (vid) {
            vid.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    // ROLEX-STYLE 3D DEPTH KINETIC ENTRANCE
    if (watchCardRef.current) {
      gsap.fromTo(watchCardRef.current,
        { scale: 0.85, opacity: 0, y: 80, rotateX: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => observer.disconnect();
  }, [index]);

  const toggleAudio = useCallback((e) => {
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
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050507] text-white flex flex-col justify-center py-24 px-4 sm:px-8 lg:px-16 border-b border-white/10 overflow-hidden"
    >
      {/* ROLEX DEEP EMERALD & OBSIDIAN AMBIENT LIGHTING */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(10,40,25,0.3)_0%,_rgba(5,5,7,1)_80%)] pointer-events-none" />

      {/* TOP HEADER BAR */}
      <div ref={textRef} className="max-w-7xl mx-auto w-full mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8 z-20">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono tracking-[0.35em] text-[#10B981] uppercase font-bold">
              SUPERLATIVE SPEC // EDITION 0{index + 1}
            </span>
          </div>
          <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            {watch.model}
          </h2>
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-white/50 mt-2">
            {watch.brand} — PRECISION HOROLOGY
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-3xl sm:text-5xl font-light text-white tracking-tight block">
            {watch.price}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#10B981] uppercase block mt-1">
            ✓ TAXES & WHITE GLOVE DELIVERY INCLUDED
          </span>
        </div>
      </div>

      {/* 2-COLUMN DISPLAY: 4K REEL + DARK CERAMIC WATCH PEDESTAL */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center z-20">
        
        {/* COLUMN 1: 4K VIDEO STREAM REEL */}
        <div className={`relative h-[480px] sm:h-[580px] lg:h-[650px] rounded-[3rem] overflow-hidden bg-[#0a0a0d] border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.9)] group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
          >
            <source src={watch.cinematicVideo || watch.video} type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

          {/* SOUND CONTROL PILL */}
          <button
            onClick={toggleAudio}
            className="absolute bottom-8 left-8 z-30 px-6 py-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/30 backdrop-blur-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-2xl"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAudioEnabled ? 'bg-[#10B981] animate-ping' : 'bg-white/50'}`} />
            <span className="text-xs font-mono tracking-[0.2em] font-semibold text-white uppercase">
              {isAudioEnabled ? 'AUDIO LIVE 🔊' : 'ENABLE SOUND 🔇'}
            </span>
          </button>
        </div>

        {/* COLUMN 2: DARK SEAMLESS OBSIDIAN PEDESTAL CARD (NO WHITE BOX) */}
        <div
          ref={watchCardRef}
          className={`relative h-[480px] sm:h-[580px] lg:h-[650px] rounded-[3rem] bg-[#0c0c11] border border-white/15 p-8 sm:p-12 flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
        >
          {/* SEAMLESS DARK PEDESTAL CONTAINER */}
          <div className="relative w-full flex-1 flex items-center justify-center rounded-3xl bg-[#14141c] border border-white/10 p-8 overflow-hidden shadow-2xl group">
            <div className="absolute w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <img
              src={watch.image}
              alt={`${watch.brand} ${watch.model}`}
              loading="lazy"
              className="max-h-[300px] sm:max-h-[360px] w-auto object-contain transition-transform duration-700 group-hover:scale-105 cursor-pointer relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.9))',
              }}
              onClick={() => onClick(watch)}
            />
          </div>

          {/* TECHNICAL SPECIFICATIONS GRID & BUY ACTION */}
          <div className="mt-8 space-y-6">
            
            {/* Tech Badges */}
            {watch.specs && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block">MOVEMENT</span>
                  <span className="text-[11px] font-mono text-white font-bold block mt-0.5">{watch.specs.movement}</span>
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block">RATING</span>
                  <span className="text-[11px] font-mono text-[#10B981] font-bold block mt-0.5">{watch.specs.waterResistance}</span>
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block">CRYSTAL</span>
                  <span className="text-[11px] font-mono text-white font-bold block mt-0.5">{watch.specs.glass}</span>
                </div>
              </div>
            )}

            {/* Apple Style Order Button */}
            <div>
              {watch.outOfStock ? (
                <span className="block text-center w-full py-5 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-mono tracking-[0.25em] uppercase">
                  OUT OF STOCK // ALLOCATION FULL
                </span>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onClick(watch); }}
                  className="w-full py-5 rounded-full bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 text-sm font-extrabold tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  <span>ORDER TIMEPIECE — {watch.price}</span>
                  <span className="text-lg">→</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
