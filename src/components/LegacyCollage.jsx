import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "/watches_new/americanviber_1.jpg",
    start: { x: "-100vw", y: "-50vh", rotation: -45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: -4, scale: 1, top: "5%", left: "5%" },
    className: "w-[40%] md:w-[25%] h-auto object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-10 will-change-transform",
  },
  {
    src: "/watches_new/forsining_square_2.jpg",
    start: { x: "100vw", y: "-80vh", rotation: 45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: 6, scale: 1, top: "5%", right: "5%" },
    className: "w-[40%] md:w-[30%] h-auto object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-20 will-change-transform",
  },
  {
    src: "/watches_new/americanviber_5.jpg",
    start: { x: "-50vw", y: "100vh", rotation: -60, scale: 1.2 },
    end: { x: 0, y: 0, rotation: -2, scale: 1, bottom: "5%", left: "20%" },
    className: "w-[45%] md:w-[35%] h-auto object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-30 will-change-transform",
  },
  {
    src: "/watches_new/MK9189_black_1.jpg",
    start: { x: "50vw", y: "150vh", rotation: 90, scale: 1.8 },
    end: { x: 0, y: 0, rotation: 8, scale: 1, bottom: "5%", right: "15%" },
    className: "w-[45%] md:w-[30%] h-auto object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-10 will-change-transform",
  },
  {
    src: "/watches_new/forsining_square_4.jpg",
    start: { x: 0, y: "150vh", rotation: 180, scale: 2 },
    end: { x: 0, y: 0, rotation: 0, scale: 1, top: "35%", left: "35%" },
    className: "w-[50%] md:w-[40%] h-auto object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-40 hidden sm:block will-change-transform",
  }
];

export default function LegacyCollage() {
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

      // Ultra-fast, perfectly fluid animation that triggers when visible
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 65%", // Triggers right as the user has scrolled well into it
          toggleActions: "play none none reverse" // Reverses if they scroll back up
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
          opacity: 1, 
          duration: 0.8, // Faster, snappier duration
          ease: "power3.out", // Beautifully smooth but fast ease
        }, i * 0.08); // Slight stagger for a beautiful cascade effect
      });
      
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[60vh] md:h-[80vh] flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-white text-black my-12">
      
      {/* Absolute positioned scatter images */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
        {images.map((imgConfig, i) => (
          <img
            key={i}
            ref={el => imageRefs.current[i] = el}
            src={imgConfig.src}
            alt={`Model Showcase ${i + 1}`}
            className={`absolute ${imgConfig.className} hover:scale-105 transition-transform duration-500`}
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

    </section>
  );
}
