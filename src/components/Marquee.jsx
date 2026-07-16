import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Marquee() {
  const textRef = useRef(null);

  useEffect(() => {
    // Infinite horizontal scroll
    gsap.to(textRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[var(--text-color)] py-4 my-32 rotate-[-2deg] scale-[1.05]">
      <div 
        ref={textRef} 
        className="flex whitespace-nowrap text-[var(--bg-color)] font-anton text-4xl md:text-5xl uppercase tracking-widest"
      >
        <span className="px-8">🔥 THE GRIND NEVER STOPS</span>
        <span className="px-8">100% UNCOMPROMISING</span>
        <span className="px-8">NO EXCUSES</span>
        <span className="px-8">🔥 THE GRIND NEVER STOPS</span>
        <span className="px-8">100% UNCOMPROMISING</span>
        <span className="px-8">NO EXCUSES</span>
        <span className="px-8">🔥 THE GRIND NEVER STOPS</span>
        <span className="px-8">100% UNCOMPROMISING</span>
        <span className="px-8">NO EXCUSES</span>
        <span className="px-8">🔥 THE GRIND NEVER STOPS</span>
        <span className="px-8">100% UNCOMPROMISING</span>
        <span className="px-8">NO EXCUSES</span>
      </div>
    </div>
  );
}
