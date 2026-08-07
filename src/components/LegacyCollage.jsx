import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "/models/model_1.png",
    start: { x: "-100vw", y: "-50vh", rotation: -45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: -4, scale: 1, top: "5%", left: "5%" },
    className: "w-[40%] md:w-[25%] h-auto object-contain drop-shadow-2xl z-10",
  },
  {
    src: "/models/model_2.png",
    start: { x: "100vw", y: "-80vh", rotation: 45, scale: 1.5 },
    end: { x: 0, y: 0, rotation: 6, scale: 1, top: "5%", right: "5%" },
    className: "w-[40%] md:w-[30%] h-auto object-contain drop-shadow-2xl z-20",
  },
  {
    src: "/models/model_3.png",
    start: { x: "-50vw", y: "100vh", rotation: -60, scale: 1.2 },
    end: { x: 0, y: 0, rotation: -2, scale: 1, bottom: "5%", left: "20%" },
    className: "w-[45%] md:w-[35%] h-auto object-contain drop-shadow-2xl z-30",
  },
  {
    src: "/models/model_4.png",
    start: { x: "50vw", y: "150vh", rotation: 90, scale: 1.8 },
    end: { x: 0, y: 0, rotation: 8, scale: 1, bottom: "5%", right: "15%" },
    className: "w-[45%] md:w-[30%] h-auto object-contain drop-shadow-2xl z-10",
  },
  {
    src: "/models/model_5.png",
    start: { x: 0, y: "150vh", rotation: 180, scale: 2 },
    end: { x: 0, y: 0, rotation: 0, scale: 1, top: "35%", left: "35%" },
    className: "w-[50%] md:w-[40%] h-auto object-contain drop-shadow-2xl z-40 hidden sm:block",
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

      // Create the mesmerizing stagger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 75%", // Trigger as soon as a good portion enters the view
          toggleActions: "play none none none"
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
          duration: 1.5,
          ease: "expo.out",
        }, i * 0.15); // Stagger them
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
