import React, { useEffect, useRef, useCallback } from 'react';
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

const CTA_TEXTS = [
  "Add to Cart (no regrets)",
  "Buy This One (treat yourself)",
  "Add to Cart (your wallet won't notice)",
  "Buy Now (the moon approves)",
  "Add to Cart (no takebacks)",
  "Buy This (make an entrance)",
  "Add to Cart (she'd approve)",
  "Buy Now (you know you want to)",
];

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const watchImgRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const soundIconRef = useRef(null);

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
    // IN-YOUR-FACE FLY-IN GSAP ANIMATION
    // Watch image explodes into the user's face
    // ============================================
    if (watchImg) {
      gsap.fromTo(watchImg,
        {
          scale: 0.3,
          rotateY: index % 2 === 0 ? 35 : -35,
          rotateX: 15,
          z: -400,
          opacity: 0,
          filter: 'drop-shadow(0 0 0px rgba(201,169,110,0))',
        },
        {
          scale: 1.15,
          rotateY: 0,
          rotateX: 0,
          z: 0,
          opacity: 1,
          filter: 'drop-shadow(0 25px 50px rgba(201,169,110,0.4))',
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

    // Text fly-in
    gsap.fromTo(textRef.current,
      { autoAlpha: 0, y: 50, scale: 0.9 },
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

    // CTA button bounce entrance
    gsap.fromTo(ctaRef.current,
      { autoAlpha: 0, y: 30, scale: 0.8 },
      {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 1,
        delay: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => observer.disconnect();
  }, [index]);

  const handleSoundToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    if (soundIconRef.current) {
      soundIconRef.current.innerHTML = vid.muted
        ? '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="white" opacity="0.4" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />'
        : '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="#C9A96E" opacity="0.8" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />';
      soundIconRef.current.setAttribute('stroke', vid.muted ? 'white' : '#C9A96E');
    }
  }, []);

  // 3D Parallax Mouse Move Effect
  const handleMouseMove = (e) => {
    if (!sectionRef.current || !watchImgRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(watchImgRef.current, {
      rotateY: x * 25,
      rotateX: -y * 25,
      scale: 1.2,
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
      className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex flex-col md:flex-row items-center py-12 md:py-0 border-b border-white/5"
      style={{ perspective: '1200px' }}
    >
      {/* VIDEO SIDE — HIGH-DEF BACKGROUND VIDEO */}
      <div className={`w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'}`}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-700 hover:opacity-100"
        >
          <source src={watch.cinematicVideo || watch.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />

        {/* Sound Toggle */}
        <button
          onMouseDown={handleSoundToggle}
          className="absolute bottom-6 left-6 z-30 w-12 h-12 flex items-center justify-center rounded-full border border-[#C9A96E]/40 bg-black/60 backdrop-blur-md cursor-pointer hover:scale-110 transition-transform"
          aria-label="Toggle Watch Audio"
        >
          <svg ref={soundIconRef} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="white" opacity="0.4" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        </button>

        {/* Live Video Tag Badge */}
        <div className="absolute top-6 left-6 z-30 px-4 py-1.5 bg-black/50 border border-[#C9A96E]/30 rounded-full backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-ping" />
          <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase">4K CINEMATIC STREAM</span>
        </div>
      </div>

      {/* CONTENT SIDE — EXPLODING WATCH & DETAILS */}
      <div className={`w-full md:w-1/2 h-full relative flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-20 z-20 py-8 md:py-16 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
        
        {/* Watch Title & Model */}
        <div ref={textRef} className="pt-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-[1px] w-8 bg-[#C9A96E]/60" />
            <p className="text-xs font-mono tracking-[0.4em] uppercase text-[#C9A96E]">
              {watch.brand} — NO. 0{index + 1}
            </p>
          </div>
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-white leading-none">
            {watch.model}
          </h3>
          <p className="text-2xl sm:text-3xl font-light text-[#C9A96E] mt-3 tracking-tight">
            {watch.price}
          </p>
        </div>

        {/* Watch Image — EXPLODING 3D FLY-IN */}
        <div className="my-8 md:my-12 flex items-center justify-center relative py-6">
          <div className="absolute w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <img
            ref={watchImgRef}
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            loading="lazy"
            className="w-[80%] sm:w-[65%] md:w-[60%] max-h-[45vh] object-contain cursor-pointer transition-transform duration-300"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(201,169,110,0.35))',
              transformStyle: 'preserve-3d',
            }}
            onClick={() => onClick(watch)}
          />
        </div>

        {/* Ironic Copy & High-Impact CTA */}
        <div className="pb-4">
          <p className="text-sm sm:text-base font-serif italic text-white/50 leading-relaxed mb-6">
            "{IRONIC_LINES[index % IRONIC_LINES.length]}"
          </p>
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            {watch.outOfStock ? (
              <span className="px-8 py-4 border border-white/15 text-white/40 text-xs tracking-[0.25em] uppercase rounded-full">
                Sold Out (we see you sweating)
              </span>
            ) : (
              <button
                className="px-8 py-4 bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] text-black text-xs tracking-[0.25em] uppercase font-bold rounded-full
                           hover:scale-105 active:scale-95 transition-all duration-300
                           shadow-[0_0_40px_rgba(201,169,110,0.4)] hover:shadow-[0_0_60px_rgba(201,169,110,0.7)] cursor-pointer flex items-center gap-3"
                onClick={(e) => { e.stopPropagation(); onClick(watch); }}
              >
                <span>{CTA_TEXTS[index % CTA_TEXTS.length]}</span>
                <span className="text-base">→</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
