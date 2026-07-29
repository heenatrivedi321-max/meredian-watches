import React from 'react';
import WebGLFluidBg from './WebGLFluidBg';

const REVIEWS = [
  "\"My boss asked if I got a promotion. I let him think I did.\"",
  "\"Looks like 50 Lacs on the wrist. Solid weight and premium leather.\"",
  "\"Dispatched to South Mumbai in 24 hours. Pure unadulterated luxury.\"",
  "\"My smartwatch told me to take 10,000 steps. I bought this instead.\"",
  "\"The sweeping automatic second hand is mesmerizing to watch.\"",
  "\"People at dinner kept looking at my wrist instead of the menu.\"",
  "\"Zero batteries. Zero notifications. Just pure mechanical excellence.\""
];

export default function ReviewsMarquee() {
  const scrollingItems = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section className="w-full bg-white py-24 overflow-hidden relative border-y border-black/10 pointer-events-auto z-50">
      
      {/* WebGL Fluid Background Injection */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <WebGLFluidBg />
      </div>

      {/* Label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] tracking-[0.5em] uppercase text-black/40 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
          Unsolicited Praise
        </p>
      </div>

      {/* Marquee Track */}
      <div className="w-full mt-12 flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee w-max">
          {scrollingItems.map((review, index) => (
            <div key={index} className="flex items-center px-8 md:px-12 lg:px-24 group cursor-crosshair">
              <h2 
                className="text-3xl sm:text-5xl md:text-[4rem] lg:text-[6rem] font-bold tracking-tighter uppercase italic text-transparent [-webkit-text-stroke:2px_#800020] md:[-webkit-text-stroke:3px_#800020] group-hover:[-webkit-text-stroke:0px] group-hover:rainbow-shimmer transition-all duration-500 hover:skew-x-[-15deg] origin-bottom hover:scale-110 drop-shadow-2xl"
                style={{ fontFamily: "'Anton', 'Helvetica Neue', sans-serif" }}
              >
                {review}
              </h2>
              <span className="mx-6 sm:mx-12 md:mx-24 text-2xl sm:text-3xl md:text-6xl text-[var(--accent-gold)] group-hover:rotate-180 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(216,156,68,0.5)] group-hover:drop-shadow-[0_0_40px_rgba(216,156,68,1)]">✦</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient fades on edges */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
    </section>
  );
}
