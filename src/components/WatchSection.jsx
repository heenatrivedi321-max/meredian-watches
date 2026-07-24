import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IRONIC_LINES = [
  "You scrolled this far. You clearly want it.",
  "Your phone already told you the time. But this looks better.",
  "No one asked. But here we are.",
  "This isn't a purchase. It's a personality upgrade.",
  "Your wrist is lonely. Fix that.",
  "You've been staring for 3 seconds. That's basically commitment.",
  "Your therapist said retail therapy works.",
  "You're not impulse buying. You're investing in yourself.",
];

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const watchImgRef = useRef(null);
  const cardRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    const watchImg = watchImgRef.current;
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
      { threshold: 0.2 }
    );
    observer.observe(section);

    // ============================================
    // 3D EXPLOSIVE FLY-IN GSAP ANIMATION
    // ============================================
    if (watchImg) {
      gsap.fromTo(watchImg,
        {
          scale: 0.4,
          rotateY: index % 2 === 0 ? 40 : -40,
          rotateX: 20,
          z: -500,
          opacity: 0,
          filter: 'drop-shadow(0 0 0px rgba(201,169,110,0))',
        },
        {
          scale: 1.15,
          rotateY: 0,
          rotateX: 0,
          z: 0,
          opacity: 1,
          filter: 'drop-shadow(0 30px 60px rgba(201,169,110,0.45))',
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Glassmorphic Card Entrance
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { autoAlpha: 0, y: 60, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => observer.disconnect();
  }, [index]);

  const toggleAudio = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !vid.muted;
    setIsAudioEnabled(!vid.muted);
  }, []);

  // 3D Parallax Mouse Tracking
  const handleMouseMove = (e) => {
    if (!sectionRef.current || !watchImgRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(watchImgRef.current, {
      rotateY: x * 30,
      rotateX: -y * 30,
      scale: 1.22,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!watchImgRef.current) return;
    gsap.to(watchImgRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1.15,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const isEven = index % 2 === 0;

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen overflow-hidden bg-[#030303] flex flex-col lg:flex-row items-center py-16 lg:py-0 border-b border-[#C9A96E]/20"
      style={{ perspective: '1400px' }}
    >
      {/* SIDEWAYS VIDEO STREAM — FULL HEIGHT 4K REEL */}
      <div className={`w-full lg:w-1/2 h-[55vh] lg:h-screen relative overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100 scale-105"
        >
          <source src={watch.cinematicVideo || watch.video} type="video/mp4" />
        </video>

        {/* GRADIENTS & SCANLINES */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-transparent to-black/80 z-10" />

        {/* GLASSMORPHISM ROLEX-STYLE SOUND BUTTON */}
        <div className="absolute bottom-8 left-8 z-30">
          <button
            onClick={toggleAudio}
            className={`group relative px-5 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-500 flex items-center gap-3 cursor-pointer ${
              isAudioEnabled
                ? 'bg-[#C9A96E]/20 border-[#C9A96E] shadow-[0_0_25px_rgba(201,169,110,0.5)]'
                : 'bg-black/60 border-white/20 hover:border-[#C9A96E]/50 hover:bg-black/80'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/40'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioEnabled ? 'bg-[#C9A96E]' : 'bg-white/60'}`} />
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-semibold text-white group-hover:text-[#C9A96E]">
              {isAudioEnabled ? 'AUDIO LIVE 🔊' : 'ENABLE SOUND 🔇'}
            </span>
          </button>
        </div>

        {/* STREAM BADGE */}
        <div className="absolute top-8 left-8 z-30 px-4 py-1.5 bg-black/60 border border-[#C9A96E]/30 rounded-full backdrop-blur-md flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A96E] uppercase">4K REEL // STREAM 0{index + 1}</span>
        </div>
      </div>

      {/* SIDEWAYS WATCH CARD — HYPER-LUXURY SPEC & PURCHASE PANEL */}
      <div className={`w-full lg:w-1/2 h-full relative flex flex-col justify-between px-6 sm:px-12 lg:px-16 z-20 py-10 lg:py-16 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        
        {/* BRAND & MODEL HEADER */}
        <div className="pt-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-[1px] w-10 bg-[#C9A96E]" />
            <p className="text-xs font-mono tracking-[0.4em] uppercase text-[#C9A96E]">
              {watch.brand} HOROLOGY // EDITION 0{index + 1}
            </p>
          </div>
          <h3 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-none">
            {watch.model}
          </h3>
          <p className="text-3xl sm:text-4xl font-light text-[#C9A96E] mt-3 tracking-tight">
            {watch.price}
          </p>
        </div>

        {/* 3D FLOATING WATCH IMAGE WITH GOLD GLOW AURA */}
        <div className="my-6 lg:my-10 flex items-center justify-center relative py-4">
          <div className="absolute w-72 h-72 bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <img
            ref={watchImgRef}
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            loading="lazy"
            className="w-[85%] sm:w-[70%] lg:w-[65%] max-h-[42vh] object-contain cursor-pointer transition-transform duration-300"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(201,169,110,0.45))',
              transformStyle: 'preserve-3d',
            }}
            onClick={() => onClick(watch)}
          />
        </div>

        {/* GLASSMORPHIC SPECIFICATIONS & CTA PANEL */}
        <div ref={cardRef} className="bg-white/[0.03] border border-[#C9A96E]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          
          {/* Specs Micro-Grid */}
          {watch.specs && (
            <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block mb-1">Movement</span>
                <span className="text-xs font-mono text-white/90 font-medium">{watch.specs.movement}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block mb-1">Water Resistance</span>
                <span className="text-xs font-mono text-[#C9A96E] font-medium">{watch.specs.waterResistance}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block mb-1">Case Material</span>
                <span className="text-xs font-mono text-white/90 font-medium">{watch.specs.caseMaterial}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block mb-1">Glass</span>
                <span className="text-xs font-mono text-white/90 font-medium">{watch.specs.glass}</span>
              </div>
            </div>
          )}

          {/* Quote */}
          <p className="text-xs sm:text-sm font-serif italic text-white/60 leading-relaxed">
            "{IRONIC_LINES[index % IRONIC_LINES.length]}"
          </p>

          {/* High-Impact Gold CTA Button */}
          <div className="pt-2">
            {watch.outOfStock ? (
              <span className="block text-center w-full py-4 border border-white/20 text-white/40 text-xs tracking-[0.3em] uppercase rounded-xl">
                Sold Out (Allocation Full)
              </span>
            ) : (
              <button
                className="w-full py-5 bg-gradient-to-r from-[#C9A96E] via-[#F3E5AB] to-[#C9A96E] text-black text-xs tracking-[0.3em] uppercase font-bold rounded-xl
                           hover:scale-[1.02] active:scale-[0.98] transition-all duration-300
                           shadow-[0_0_40px_rgba(201,169,110,0.5)] hover:shadow-[0_0_70px_rgba(201,169,110,0.8)] cursor-pointer flex items-center justify-center gap-3"
                onClick={(e) => { e.stopPropagation(); onClick(watch); }}
              >
                <span>SECURE ALLOCATION — {watch.price}</span>
                <span className="text-sm">→</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
