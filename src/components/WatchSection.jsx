import React, { useEffect, useRef, useState } from 'react';
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
  const textRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const vid = videoRef.current;

      if (vid) {
        vid.muted = false;
        vid.volume = 1;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => vid.play().catch(() => {}),
          onLeave: () => vid.pause(),
          onEnterBack: () => vid.play().catch(() => {}),
          onLeaveBack: () => vid.pause(),
        });
      }

      gsap.fromTo(textRef.current,
        { autoAlpha: 0, x: 40 },
        {
          autoAlpha: 1, x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center 65%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(ctaRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isEven = index % 2 === 0;

  // Even index: video LEFT, content RIGHT
  // Odd index: content LEFT, video RIGHT
  const videoSide = isEven ? 'left' : 'right';
  const contentSide = isEven ? 'right' : 'left';

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black flex"
    >
      {/* VIDEO SIDE — half width, full height */}
      <div className={`w-1/2 h-full relative overflow-hidden ${videoSide === 'right' ? 'order-2' : 'order-1'}`}>
        <video
          ref={videoRef}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={watch.cinematicVideo} type="video/mp4" />
        </video>
        {/* Subtle vignette over video */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" style={videoSide === 'right' ? { background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)' } : {}} />
      </div>

      {/* CONTENT SIDE — half width, full height */}
      <div className={`w-1/2 h-full relative flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 ${contentSide === 'right' ? 'order-2' : 'order-1'}`}>

        {/* Brand + Model */}
        <div className="mb-auto pt-20 sm:pt-24 md:pt-28">
          <p className="text-[10px] sm:text-xs font-light tracking-[0.5em] uppercase text-[#C9A96E]/50 mb-3">
            {watch.brand}
          </p>
          <h3 className="text-[1.8rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-extralight tracking-[-0.02em] text-white leading-none">
            {watch.model}
          </h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-extralight text-white/30 mt-3 tracking-tight">
            {watch.price}
          </p>
        </div>

        {/* Watch image — centered vertically */}
        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <img
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            loading="lazy"
            className="w-[70%] sm:w-[60%] md:w-[55%] h-auto object-contain"
            style={{
              mixBlendMode: 'multiply',
              filter: 'contrast(1.1) saturate(1.15)',
            }}
          />
        </div>

        {/* Ironic line + CTA — bottom */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <div ref={textRef}>
            <p className="text-sm sm:text-base md:text-lg font-light text-white/35 italic leading-relaxed mb-6">
              "{IRONIC_LINES[index % IRONIC_LINES.length]}"
            </p>
          </div>
          <div ref={ctaRef}>
            {watch.outOfStock ? (
              <span className="inline-block px-6 py-3 border border-white/15 text-white/40 text-xs tracking-[0.25em] uppercase rounded-full">
                Sold Out (we see you sweating)
              </span>
            ) : (
              <button
                className="inline-block px-6 py-3 border border-[#C9A96E]/40 text-[#C9A96E] text-xs tracking-[0.25em] uppercase rounded-full
                           hover:bg-[#C9A96E] hover:text-black transition-all duration-500
                           hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onClick(watch); }}
              >
                {CTA_TEXTS[index % CTA_TEXTS.length]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gold divider between halves */}
      <div className="absolute top-[15%] bottom-[15%] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#C9A96E]/15 to-transparent pointer-events-none z-10" />
    </div>
  );
}
