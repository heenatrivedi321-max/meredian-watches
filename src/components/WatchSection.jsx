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
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const vid = videoRef.current;

      // Video plays when section enters viewport
      if (vid) {
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

      // Ironic line fades in
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

      // CTA button fades in after text
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

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
      onClick={() => !watch.outOfStock && onClick(watch)}
    >
      {/* Full-screen background video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{
          opacity: videoLoaded ? 0.4 : 0,
          willChange: 'transform',
        }}
      >
        <source src={watch.cinematicVideo} type="video/mp4" />
      </video>

      {/* Watch image — centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.model}`}
          loading="lazy"
          className="w-[55%] sm:w-[45%] md:w-[35%] lg:w-[30%] h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          style={{
            mixBlendMode: 'multiply',
            filter: 'contrast(1.1) saturate(1.15) drop-shadow(0 0 40px rgba(201,169,110,0.15))',
          }}
        />
      </div>

      {/* Brand + Model — top left */}
      <div className={`absolute top-12 sm:top-16 md:top-20 ${isEven ? 'left-6 sm:left-12 md:left-20' : 'right-6 sm:right-12 md:right-20'} z-20 pointer-events-none`}>
        <p className="text-[10px] sm:text-xs font-light tracking-[0.5em] uppercase text-white/25 mb-2">
          {watch.brand}
        </p>
        <h3 className="text-[1.8rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extralight tracking-[-0.02em] text-white leading-none">
          {watch.model}
        </h3>
        <p className="text-lg sm:text-xl md:text-2xl font-extralight text-white/40 mt-2 tracking-tight">
          {watch.price}
        </p>
      </div>

      {/* Ironic line + CTA — opposite side */}
      <div
        ref={textRef}
        className={`absolute bottom-24 sm:bottom-28 md:bottom-32 ${isEven ? 'right-6 sm:right-12 md:right-20 text-right' : 'left-6 sm:left-12 md:left-20 text-left'} z-20 pointer-events-none max-w-md`}
      >
        <p className="text-sm sm:text-base md:text-lg font-light text-white/40 italic leading-relaxed">
          "{IRONIC_LINES[index % IRONIC_LINES.length]}"
        </p>
      </div>

      <div
        ref={ctaRef}
        className={`absolute bottom-12 sm:bottom-16 md:bottom-20 ${isEven ? 'right-6 sm:right-12 md:right-20' : 'left-6 sm:left-12 md:left-20'} z-20 pointer-events-auto`}
      >
        {watch.outOfStock ? (
          <span className="px-6 py-3 border border-white/15 text-white/40 text-xs tracking-[0.25em] uppercase rounded-full">
            Sold Out (we see you sweating)
          </span>
        ) : (
          <button
            className="px-6 py-3 border border-[#C9A96E]/40 text-[#C9A96E] text-xs tracking-[0.25em] uppercase rounded-full
                       hover:bg-[#C9A96E] hover:text-black transition-all duration-500 backdrop-blur-sm
                       hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
            onClick={(e) => { e.stopPropagation(); onClick(watch); }}
          >
            {CTA_TEXTS[index % CTA_TEXTS.length]}
          </button>
        )}
      </div>

      {/* Subtle gold accent line */}
      <div className={`absolute ${isEven ? 'left-6 sm:left-12 md:left-20' : 'right-6 sm:right-12 md:right-20'} top-1/2 -translate-y-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-[#C9A96E]/20 to-transparent pointer-events-none z-10`} />
    </div>
  );
}
