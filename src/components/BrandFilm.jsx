import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandFilm() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const soundIconRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    vid.muted = true;

    // IntersectionObserver for reliable video playback
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    gsap.fromTo(textRef.current,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "center 60%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => observer.disconnect();
  }, []);

  const handleSoundToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    if (soundIconRef.current) {
      if (vid.muted) {
        soundIconRef.current.innerHTML = '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="white" opacity="0.4" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />';
        soundIconRef.current.setAttribute('stroke', 'white');
      } else {
        soundIconRef.current.innerHTML = '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="#C9A96E" opacity="0.6" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />';
        soundIconRef.current.setAttribute('stroke', '#C9A96E');
      }
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/brand-film.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      <button
        onMouseDown={handleSoundToggle}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 w-10 h-10 flex items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm cursor-pointer"
        style={{ touchAction: 'manipulation' }}
      >
        <svg ref={soundIconRef} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="white" opacity="0.4" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      </button>

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

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent pointer-events-none" />
    </div>
  );
}
