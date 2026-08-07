import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "/watches_new/americanviber_1.jpg",
    start: { x: "-150vw", y: "-50vh", rotation: -45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: -6, scale: 1, top: "10%", left: "5%" },
    className: "w-40 sm:w-64 h-auto aspect-[4/5] object-cover rounded-xl shadow-2xl",
    delay: 0
  },
  {
    src: "/watches_new/forsining_square_2.jpg",
    start: { x: "150vw", y: "-80vh", rotation: 45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: 8, scale: 1, top: "5%", right: "8%" },
    className: "w-48 sm:w-72 h-auto aspect-square object-cover rounded-xl shadow-2xl",
    delay: 0.1
  },
  {
    src: "/watches_new/americanviber_5.jpg",
    start: { x: "-100vw", y: "100vh", rotation: -60, scale: 1.2 },
    end: { x: 0, y: 0, rotation: -12, scale: 1, bottom: "10%", left: "10%" },
    className: "w-36 sm:w-56 h-auto aspect-square object-cover rounded-xl shadow-2xl",
    delay: 0.2
  },
  {
    src: "/watches_new/MK9189_black_1.jpg",
    start: { x: "100vw", y: "150vh", rotation: 90, scale: 1.8 },
    end: { x: 0, y: 0, rotation: 15, scale: 1, bottom: "5%", right: "5%" },
    className: "w-44 sm:w-60 h-auto aspect-[3/4] object-cover rounded-xl shadow-2xl",
    delay: 0.15
  },
  {
    src: "/watches_new/forsining_square_4.jpg",
    start: { x: 0, y: "150vh", rotation: 180, scale: 2 },
    end: { x: 0, y: 0, rotation: -5, scale: 1, bottom: "-5%", left: "40%" },
    className: "w-40 sm:w-52 h-auto aspect-video object-cover rounded-xl shadow-2xl hidden md:block",
    delay: 0.3
  }
];

export default function LegacyCollage({ children }) {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Set initial state
      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        const config = images[i];
        gsap.set(img, {
          x: config.start.x,
          y: config.start.y,
          rotation: config.start.rotation,
          scale: config.start.scale,
          opacity: 0,
        });
      });

      // Create the scatter-to-center scrub animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "center center",
          scrub: 1.5, // buttery smooth scrub
        }
      });

      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        const config = images[i];
        tl.to(img, {
          x: config.end.x,
          y: config.end.y,
          rotation: config.end.rotation,
          scale: config.end.scale,
          opacity: 0.9, // slightly transparent to not overpower the text if they overlap
          duration: 1,
          ease: "power2.out",
        }, config.delay); // slight stagger using the timeline position
      });
      
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-32 sm:py-48 flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-white text-black min-h-[80vh]">
      
      {/* Absolute positioned scatter images */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {images.map((imgConfig, i) => (
          <img
            key={i}
            ref={el => imageRefs.current[i] = el}
            src={imgConfig.src}
            alt={`Lifestyle Watch ${i + 1}`}
            className={`absolute ${imgConfig.className} grayscale hover:grayscale-0 transition-all duration-700`}
            style={{ 
              top: imgConfig.end.top, 
              bottom: imgConfig.end.bottom, 
              left: imgConfig.end.left, 
              right: imgConfig.end.right,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>

      {/* Children Content (The Text) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 text-center drop-shadow-[0_10px_30px_rgba(255,255,255,0.8)]">
        {children}
      </div>

    </section>
  );
}
