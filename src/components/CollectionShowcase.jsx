import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import WebGLFluid from 'webgl-fluid';
import ReviewsMarquee from './ReviewsMarquee';

gsap.registerPlugin(ScrollTrigger);

import { WATCHES } from '../data/watches';

const INTERLUDES = [
  { afterIndex: 1, text: "Precision. Crafted. Eternity." },
  { afterIndex: 3, text: "Your legacy starts here." },
  { afterIndex: 5, text: "Built for the relentless." },
];

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({ children, className = '', onClick }) {
  const btnRef = useRef(null);
  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.35,
      y: (e.clientY - rect.top - rect.height / 2) * 0.35,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };
  return (
    <button ref={btnRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick}>
      {children}
    </button>
  );
}

// ============================================
// FULL-SCREEN WATCH SECTION (Rolex style)
// ============================================
function WatchSection({ watch, index, onClick }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(image, { y: 100 }, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      onClick={() => onClick(watch)}
      style={{ cursor: 'pointer' }}
    >
      <video
        data-watch-video={index}
        muted
        loop
        playsInline
        preload="none"
        src={watch.cinematicVideo}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.15)' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10 pointer-events-none" />

      <div ref={imageRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.model}`}
          className="w-[45%] sm:w-[40%] md:w-[35%] max-w-sm lg:max-w-md object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 sm:p-8 lg:p-16 xl:p-24 pb-16 sm:pb-20 pointer-events-none">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] sm:text-xs tracking-[0.4em] font-semibold text-white/50 uppercase mb-2 sm:mb-3"
          >
            {watch.brand}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[7rem] font-bold tracking-tighter leading-[0.9] text-white uppercase mb-3 sm:mb-4"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
          >
            {watch.model}
          </motion.h2>
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/70 font-light tracking-tight"
            >
              {watch.price}
            </motion.p>
            {!watch.outOfStock && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium rounded-full pointer-events-none"
              >
                Explore
              </motion.span>
            )}
            {watch.outOfStock && (
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="px-5 py-2 bg-white/5 border border-white/10 text-white/40 text-[10px] sm:text-xs tracking-[0.2em] uppercase rounded-full pointer-events-none"
              >
                Out of Stock
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/30" />
      </div>
    </section>
  );
}

// ============================================
// TEXT INTERLUDE
// ============================================
function TextInterlude({ text }) {
  return (
    <section className="relative w-full h-[40vh] sm:h-[50vh] flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
      <motion.p
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/50 font-light tracking-[0.15em] text-center px-8 z-20"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {text}
      </motion.p>
    </section>
  );
}

// ============================================
// WEBGL FLUID BACKGROUND
// ============================================
const FluidBackground = ({ sectionRef }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;

    WebGLFluid(canvas, {
      TRIGGER: 'hover',
      IMMEDIATE: true,
      AUTO: true,
      INTERVAL: isMobile ? 5000 : 3000,
      SIM_RESOLUTION: isMobile ? 32 : 64,
      DYE_RESOLUTION: isMobile ? 256 : 1024,
      CAPTURE_RESOLUTION: isMobile ? 256 : 512,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: isMobile ? 10 : 20,
      CURL: isMobile ? 15 : 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: isMobile ? 3000 : 6000,
      SPLAT_COUNT: isMobile ? 3 : 8,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: isMobile ? 3 : 8,
      BLOOM_RESOLUTION: isMobile ? 128 : 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: !isMobile,
      SUNRAYS_RESOLUTION: isMobile ? 128 : 196,
      SUNRAYS_WEIGHT: 1.0,
    });

    if (sectionRef && sectionRef.current) {
      gsap.to(containerRef.current, {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        }
      });
    }
  }, [sectionRef]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-screen pointer-events-none opacity-0 invisible" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100vw', height: '100vh' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.85) 100%)',
      }} />
    </div>
  );
};

// ============================================
// MAIN COLLECTION SHOWCASE
// ============================================
export default function CollectionShowcase({ onSelectWatch }) {
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const storyRef = useRef(null);
  const closerRef = useRef(null);

  // IntersectionObserver: play/pause videos based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video[data-watch-video]');
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.3, 0.7, 1] }
    );

    const sections = document.querySelectorAll('[data-watch-section]');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".legacy-text",
        { autoAlpha: 0, y: 40, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".story-text-container",
        { scale: 1, autoAlpha: 1, y: 0 },
        {
          scale: 4,
          autoAlpha: 0,
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top top",
            end: "+=150%",
            scrub: true,
            pin: true
          }
        }
      );

      gsap.fromTo(".closer-text",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1, y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".closer-btn",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const sections = [];
  WATCHES.forEach((watch, i) => {
    sections.push({ type: 'watch', watch, index: i });
    const interlude = INTERLUDES.find((inter) => inter.afterIndex === i);
    if (interlude) {
      sections.push({ type: 'interlude', text: interlude.text, key: `interlude-${i}` });
    }
  });

  return (
    <div ref={sectionRef}>
      <div className="relative z-0 w-full bg-black">
        <FluidBackground sectionRef={sectionRef} />

        {/* Legacy Header */}
        <section ref={taglineRef} className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pointer-events-none">
          <p className="legacy-text text-[10px] font-light tracking-[0.5em] uppercase text-white/50 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            The Collection
          </p>
          <h2 className="legacy-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[6rem] font-bold tracking-tighter text-white text-center leading-none rainbow-shimmer pb-4" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
            Choose Your<br />Legacy.
          </h2>
          <div className="legacy-text w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-10" />
        </section>

        {/* Story Zoom */}
        <section ref={storyRef} className="relative z-10 w-full h-screen flex flex-col items-center justify-center bg-transparent pointer-events-none">
          <div className="story-text-container text-center px-4">
            <p className="text-[10px] lg:text-xs font-light tracking-[0.5em] uppercase text-white/40 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Meridian Archive
            </p>
            <h3 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tighter text-white leading-tight" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
              Every piece tells a story.<br />
              <span className="text-white/40 font-light">Find yours.</span>
            </h3>
          </div>
        </section>

        {/* Watch Sections + Interludes */}
        {sections.map((section, i) => {
          if (section.type === 'watch') {
            return (
              <div key={section.watch.id} data-watch-section={section.index}>
                <WatchSection
                  watch={section.watch}
                  index={section.index}
                  onClick={onSelectWatch}
                />
              </div>
            );
          }
          return <TextInterlude key={section.key} text={section.text} />;
        })}

        {/* Reviews Marquee */}
        <ReviewsMarquee />

        {/* Closer */}
        <section ref={closerRef} className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden pointer-events-none">
          <video autoPlay loop muted playsInline preload="none" className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 scale-[1.3]" style={{ mixBlendMode: 'screen' }}>
            <source src="/Watch_gears_Clean.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 flex flex-col items-center text-center px-8 pointer-events-auto">
            <p className="closer-text text-[10px] font-light tracking-[0.5em] uppercase text-white/50 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Time is fleeting
            </p>
            <h2 className="closer-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[6rem] font-bold tracking-tighter text-white leading-none mb-4 rainbow-shimmer pb-2" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
              Time Waits<br />For No One.
            </h2>
            <p className="closer-text text-base md:text-lg text-white/40 max-w-md mt-4 mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your legacy starts with what you wear. Make it count.
            </p>
            <MagneticButton
              onClick={() => {
                const el = document.querySelector('[data-watch-section="0"]');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="closer-btn px-12 py-5 bg-white text-black text-sm tracking-[0.35em] uppercase font-bold rounded-full hover:bg-white/90 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              Shop Now
            </MagneticButton>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-10">
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/20" style={{ fontFamily: "'Inter', sans-serif" }}>
              &copy; 2026 Meridian — All Rights Reserved
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
