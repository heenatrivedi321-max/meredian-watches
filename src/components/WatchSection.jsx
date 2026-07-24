import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoCardRef = useRef(null);
  const watchCardRef = useRef(null);
  const titleRef = useRef(null);
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

    // ========================================================
    // CRAZY SCRUB-DRIVEN 3D DEPTH ZOOM — COMES INTO USER'S FACE
    // ========================================================
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "center center",
        scrub: 0.6,
      }
    });

    // Title pops down from top
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { y: -80, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, ease: "power3.out" },
        0
      );
    }

    // Video Reel zooms in from 3D space
    if (videoCardRef.current) {
      tl.fromTo(videoCardRef.current,
        { scale: 0.5, rotateY: index % 2 === 0 ? -45 : 45, rotateX: 20, opacity: 0, filter: "blur(20px)" },
        { scale: 1, rotateY: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", ease: "power4.out" },
        0
      );
    }

    // Watch Card explodes into the user's face
    if (watchCardRef.current) {
      tl.fromTo(watchCardRef.current,
        { scale: 0.4, rotateY: index % 2 === 0 ? 45 : -45, rotateX: -20, opacity: 0, z: -800 },
        { scale: 1, rotateY: 0, rotateX: 0, opacity: 1, z: 0, ease: "power4.out" },
        0.1
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

  // 3D Parallax Mouse Physics
  const handleMouseMove = (e) => {
    if (!sectionRef.current || !watchCardRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(watchCardRef.current, {
      rotateY: x * 25,
      rotateX: -y * 25,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!watchCardRef.current) return;
    gsap.to(watchCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-[#000000] text-white flex flex-col justify-center py-20 px-4 sm:px-8 lg:px-16 border-b border-white/10 overflow-hidden"
      style={{ perspective: '1600px' }}
    >
      {/* GLOWING OPTICAL LIGHT FLARE AURA */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* TOP MINIMALIST HEADER */}
      <div ref={titleRef} className="max-w-7xl mx-auto w-full mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
        <div>
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-2">
            EDITION 0{index + 1} // {watch.brand}
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

      {/* CRAZY 3D FLY-IN SHOWCASE GRID */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center z-20">
        
        {/* SIDE 1: 4K VIDEO STREAM REEL */}
        <div
          ref={videoCardRef}
          className={`relative h-[450px] sm:h-[550px] lg:h-[620px] rounded-[2.5rem] overflow-hidden bg-[#0d0d11] border border-white/10 shadow-2xl group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
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

          {/* GLASSMORPHISM AUDIO PILL */}
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
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FLAWLESS CERAMIC CONTAINER */}
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
          <div className="mt-6 space-y-6">
            
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
