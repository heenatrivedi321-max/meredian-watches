import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const watchCardRef = useRef(null);
  const contentRef = useRef(null);
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
      { threshold: 0.2 }
    );
    observer.observe(section);

    // APPLE-STYLE SMOOTH SPRING KINETIC ENTRANCE
    if (watchCardRef.current) {
      gsap.fromTo(watchCardRef.current,
        { scale: 0.85, opacity: 0, y: 60, rotateX: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
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
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !vid.muted;
    setIsAudioEnabled(!vid.muted);
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#000000] text-white flex flex-col justify-center py-20 px-4 sm:px-8 lg:px-16 border-b border-white/10 overflow-hidden"
    >
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* TOP HEADER — APPLE MINIMALIST STYLE */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-2">
            0{index + 1} // {watch.brand}
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
            {watch.model}
          </h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            {watch.price}
          </span>
        </div>
      </div>

      {/* MAIN SIDE-BY-SIDE APPLE PRODUCT SHOWCASE */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* SIDE 1: 4K VIDEO STREAM REEL */}
        <div className={`relative h-[450px] sm:h-[550px] lg:h-[620px] rounded-[2.5rem] overflow-hidden bg-[#0d0d11] border border-white/10 shadow-2xl group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          >
            <source src={watch.cinematicVideo || watch.video} type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* APPLE GLASSMORPHISM AUDIO PILL */}
          <button
            onClick={toggleAudio}
            className="absolute bottom-6 left-6 z-30 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl transition-all duration-300 flex items-center gap-3 cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-green-400 animate-pulse' : 'bg-white/50'}`} />
            <span className="text-xs font-medium tracking-wider text-white uppercase">
              {isAudioEnabled ? 'Sound On 🔊' : 'Enable Sound 🔇'}
            </span>
          </button>
        </div>

        {/* SIDE 2: APPLE PRO PRODUCT PEDESTAL CARD */}
        <div
          ref={watchCardRef}
          className={`relative h-[450px] sm:h-[550px] lg:h-[620px] rounded-[2.5rem] bg-[#0d0d11] border border-white/10 p-8 sm:p-12 flex flex-col justify-between shadow-2xl overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
        >
          {/* FLAWLESS CERAMIC CONTAINER TO ELIMINATE WHITE JPEG BOX */}
          <div className="relative w-full flex-1 flex items-center justify-center rounded-2xl bg-white p-6 overflow-hidden shadow-inner group">
            <img
              src={watch.image}
              alt={`${watch.brand} ${watch.model}`}
              loading="lazy"
              className="max-h-[280px] sm:max-h-[340px] w-auto object-contain transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              onClick={() => onClick(watch)}
            />
          </div>

          {/* PRODUCT SPECS & APPLE BUY BUTTON */}
          <div ref={contentRef} className="mt-6 space-y-6">
            
            {/* Minimal Spec Badges */}
            {watch.specs && (
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                  {watch.specs.movement}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                  {watch.specs.waterResistance}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                  {watch.specs.glass}
                </span>
              </div>
            )}

            {/* Apple Clean CTA Button */}
            <div>
              {watch.outOfStock ? (
                <span className="block text-center w-full py-4 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-semibold tracking-wider uppercase">
                  Sold Out
                </span>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onClick(watch); }}
                  className="w-full py-4 rounded-full bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  <span>Buy Now — {watch.price}</span>
                  <span className="text-base">→</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
