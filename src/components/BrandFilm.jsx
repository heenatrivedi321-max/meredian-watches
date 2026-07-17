import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandFilm() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const unmutedRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const vid = videoRef.current;
      if (!vid) return;

      // Start muted so browser allows autoplay
      vid.muted = true;
      vid.volume = 1;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          vid.play().catch(() => {});
          // Try to unmute after play starts (browsers may allow it after scroll gesture)
          if (!unmutedRef.current) {
            setTimeout(() => {
              vid.muted = false;
              unmutedRef.current = true;
            }, 500);
          }
        },
        onLeave: () => vid.pause(),
        onEnterBack: () => vid.play().catch(() => {}),
        onLeaveBack: () => vid.pause(),
      });

      // Text overlay fades in near the end
      gsap.fromTo(textRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Full-screen video */}
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      >
        <source src="/brand-film.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {/* Text overlay — appears as video plays */}
      <div
        ref={textRef}
        className="absolute bottom-16 sm:bottom-20 md:bottom-24 right-6 sm:right-12 md:right-20 z-10 pointer-events-none"
      >
        <p className="text-[10px] sm:text-xs font-light tracking-[0.5em] uppercase text-white/30 mb-3">
          Meridian
        </p>
        <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.8rem] lg:text-[3.5rem] font-extralight tracking-[-0.02em] text-white leading-tight text-right">
          We don't follow legends.<br />
          <span className="text-white/50">We time them.</span>
        </h2>
      </div>

      {/* Cinematic letterbox lines */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent pointer-events-none" />
    </div>
  );
}
