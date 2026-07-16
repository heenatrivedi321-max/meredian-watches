import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProcess() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        x: "-200vw", // Translate exactly 2 viewport widths to the left to show panel 3
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=3000", // Increased scroll distance for smoother experience
          scrub: 1, // Softer scrub for premium feel
          pin: true,
          snap: 1 / 2, // Snap exactly to panels (0, 0.5, 1)
          anticipatePin: 1
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden bg-black w-full text-[var(--text-color)] font-sans">
      <div ref={triggerRef}>
        {/* The horizontal scrolling container */}
        <div ref={sectionRef} className="h-screen w-[300vw] flex relative">
          
          {/* Continuous dashed line through the center of everything */}
          <div className="absolute top-[35%] left-0 w-[300vw] h-[2px] border-t-4 border-dashed border-[var(--text-color)]/20 -translate-y-1/2 z-0"></div>

          {/* Panel 1 */}
          <div className="h-screen w-screen flex flex-col items-center pt-[15vh] relative z-10">
            <h2 className="font-anton text-[45vh] leading-[0.8] text-outline-thick drop-shadow-2xl select-none mb-12">
              01
            </h2>
            <div className="bg-[var(--text-color)] text-black px-8 py-3 rounded-full font-anton text-2xl tracking-widest flex items-center gap-4 mb-12 shadow-2xl">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              NOT AMAZON
              <span className="w-2 h-2 bg-black rounded-full"></span>
            </div>
            <p className="max-w-xl text-center text-xl md:text-3xl tracking-wide leading-relaxed font-light px-6">
              We don't have a giant warehouse filled with robots. We have an angry guy named Frank who hand-pulls every print. Shipping takes a week. Deal with it.
            </p>
          </div>

          {/* Panel 2 */}
          <div className="h-screen w-screen flex flex-col items-center pt-[15vh] relative z-10">
            <h2 className="font-anton text-[45vh] leading-[0.8] text-outline-thick drop-shadow-2xl select-none mb-12">
              02
            </h2>
            <div className="bg-[var(--text-color)] text-black px-8 py-3 rounded-full font-anton text-2xl tracking-widest flex items-center gap-4 mb-12 shadow-2xl">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              REAL HEAVYWEIGHT
              <span className="w-2 h-2 bg-black rounded-full"></span>
            </div>
            <p className="max-w-xl text-center text-xl md:text-3xl tracking-wide leading-relaxed font-light px-6">
              We use 250gsm archival paper. If you try to roll this up tight, it will snap back and hit you in the face. It's serious paper for serious walls.
            </p>
          </div>

          {/* Panel 3 */}
          <div className="h-screen w-screen flex flex-col items-center pt-[15vh] relative z-10">
            <h2 className="font-anton text-[45vh] leading-[0.8] text-outline-thick drop-shadow-2xl select-none mb-12">
              03
            </h2>
            <div className="bg-[var(--text-color)] text-black px-8 py-3 rounded-full font-anton text-2xl tracking-widest flex items-center gap-4 mb-12 shadow-2xl">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              EXCLUSIVE AF
              <span className="w-2 h-2 bg-black rounded-full"></span>
            </div>
            <p className="max-w-xl text-center text-xl md:text-3xl tracking-wide leading-relaxed font-light px-6">
              We only print 500 copies of anything. When they're gone, they're gone. Don't email us crying that you missed out. You have been warned.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
