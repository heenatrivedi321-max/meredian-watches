import React from 'react';
import WebGLFluidBg from './WebGLFluidBg';

const REVIEWS = [
  "\"I bought this to tell time. Now time tells me what to do.\"",
  "\"My wrist has more net worth than my car.\"",
  "\"I didn't need it. I just wanted you to know I could afford it.\"",
  "\"It’s practically useless. I love it.\"",
  "\"Five stars. It outlived my marriage.\"",
  "\"I wear this to the grocery store just to disrespect people.\"",
  "\"It doesn't even have a battery. I have to wind it like a peasant. 10/10.\""
];

export default function ReviewsMarquee() {
  // Duplicate the array so it can scroll infinitely without a seam
  const scrollingItems = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section className="w-full bg-transparent py-24 overflow-hidden relative border-y border-white/10 pointer-events-auto z-50">
      
      {/* WebGL Fluid Background Injection */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <WebGLFluidBg />
      </div>

      {/* Label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
          Unsolicited Praise
        </p>
      </div>

      {/* Marquee Track */}
      <div className="w-full mt-12 flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee w-max">
          {scrollingItems.map((review, index) => (
            <div key={index} className="flex items-center px-8 md:px-12 lg:px-24 group cursor-crosshair">
              <h2 
                className="text-3xl sm:text-5xl md:text-[4rem] lg:text-[6rem] font-bold tracking-tighter uppercase italic text-transparent [-webkit-text-stroke:2px_#fff] md:[-webkit-text-stroke:3px_#fff] group-hover:[-webkit-text-stroke:0px] group-hover:rainbow-shimmer transition-all duration-500 hover:skew-x-[-15deg] origin-bottom hover:scale-110 drop-shadow-2xl"
                style={{ fontFamily: "'Anton', 'Helvetica Neue', sans-serif" }}
              >
                {review}
              </h2>
              <span className="mx-6 sm:mx-12 md:mx-24 text-2xl sm:text-3xl md:text-6xl text-[var(--accent-gold)] group-hover:rotate-180 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(216,156,68,0.5)] group-hover:drop-shadow-[0_0_40px_rgba(216,156,68,1)]">✦</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient fades on edges so it doesn't pop in/out harshly */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
    </section>
  );
}
