import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductGrid() {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(textRef.current, 
      { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 50, opacity: 0 },
      { 
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
        y: 0, 
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] bg-black flex flex-col items-center justify-center px-6 md:px-20 py-32 z-30">
      
      {/* Dashed line matching screenshot */}
      <div className="w-full h-px border-t border-dashed border-white/20 mb-24 max-w-7xl"></div>

      {/* Shop Now Button centered */}
      <div className="flex flex-col items-center">
        <button className="mb-24 bg-[var(--text-color)] text-black font-anton px-12 py-4 text-xl tracking-wide uppercase hover:bg-white transition-colors rounded-sm shadow-xl">
          SHOP NOW
        </button>
      </div>

      {/* Massive Sans-Serif Attitude Text */}
      <p ref={textRef} className="text-3xl md:text-5xl lg:text-[4.5rem] font-sans text-center max-w-6xl leading-[1.2] tracking-tight font-medium text-[var(--text-color)]">
        Our timepieces use real, precision-engineered movements. 💥 Strap it to your wrist and act surprised when people think you're a 📈 millionaire.
      </p>

    </section>
  );
}
