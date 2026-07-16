import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLFluid from 'webgl-fluid';
import ReviewsMarquee from './ReviewsMarquee';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// PRODUCT DATA — ONLY YOUR BRANDS
// ============================================
import { WATCHES } from '../data/watches';

// Cursor trail removed for performance

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({ children, className = '', onClick }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)"
    });
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ============================================
// SINGLE PRODUCT CARD (Bucks Sauce Style)
// ============================================
function ProductCard({ watch, index, onClick }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 120, opacity: 0, rotate: index % 2 === 0 ? -2 : 2 },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => onClick(watch)}
      style={{
        backgroundColor: '#ffffff',
        minHeight: 'min(520px, 70vh)',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) videoRef.current.play();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
      }}
    >
      {/* Background Video (plays on hover) */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-[1.3]"
        style={{ opacity: isHovered ? 0.25 : 0 }}
      >
        <source src={watch.video} type="video/mp4" />
      </video>

      {/* Gradients for text readability (sits above image) */}
      <div
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.8) 100%)`,
        }}
      />

      {/* Brand Name — Top */}
      <div className="absolute top-6 left-6 right-6 z-30">
        <h3
          className="text-[1.8rem] sm:text-[2.5rem] md:text-[3.5rem] font-bold tracking-tighter leading-none text-white/90 uppercase"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          {watch.brand}
        </h3>
        <p
          className="text-sm md:text-base font-light tracking-[0.3em] uppercase text-white/60 mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {watch.model}
        </p>
      </div>

      {/* Watch Image — Floating, no white BG */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-12">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse" />
          </div>
        )}
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.model}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
          style={{
            mixBlendMode: 'multiply',
            filter: 'contrast(1.05) saturate(1.1)',
            opacity: imgLoaded ? 1 : 0,
          }}
        />
      </div>

      {/* Price + CTA — Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 p-6 transition-all duration-500"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          opacity: isHovered ? 1 : 0.7,
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {watch.price}
          </span>
          {watch.outOfStock ? (
            <span className="px-4 py-2 bg-white/10 border border-white/20 text-white/70 text-xs tracking-[0.2em] uppercase rounded-full backdrop-blur-md">
              Out of Stock
            </span>
          ) : (
            <MagneticButton
              className="px-5 py-2.5 border border-white/40 text-white text-xs tracking-[0.25em] uppercase font-medium
                         hover:bg-white hover:text-black transition-all duration-300 rounded-full backdrop-blur-md"
            >
              View Product →
            </MagneticButton>
          )}
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none"
        style={{
          borderColor: isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
          boxShadow: isHovered ? `0 0 60px ${watch.color}80, inset 0 0 60px ${watch.color}20` : 'none',
        }}
      />
    </div>
  );
}

// ============================================
// WEBGL FLUID SIMULATION BACKGROUND
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

    // GSAP ScrollTrigger to show/hide the fluid background
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
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none opacity-0 invisible" 
      style={{ zIndex: 0 }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ width: '100vw', height: '100vh' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.85) 100%)',
        }}
      />
    </div>
  );
};

// ============================================
// MAIN EXPORT: CollectionShowcase
// ============================================
export default function CollectionShowcase({ onSelectWatch }) {
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const storyRef = useRef(null);
  const closerRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // "Choose Your Legacy" fade in
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

      // Closer section animations
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

      // Removed horizontal scroll logic

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

      // Dedicated Story Section Animation (Rolex zoom effect)
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
            end: "+=150%", // Pins for 1.5x screen height
            scrub: true,
            pin: true
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>

      {/* ======================================== */}
      {/* SECTION 4 & 5: LEGACY + PRODUCTS */}
      {/* ======================================== */}
      <div className="relative z-0 w-full bg-black">
        <FluidBackground sectionRef={sectionRef} />

        {/* Legacy Header Section */}
        <section
          ref={taglineRef}
          className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pointer-events-none"
        >
          <p
            className="legacy-text text-[10px] font-light tracking-[0.5em] uppercase text-white/50 mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The Collection
          </p>
          <h2
            className="legacy-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[6rem] font-bold tracking-tighter text-white text-center leading-none rainbow-shimmer pb-4"
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            }}
          >
            Choose Your<br />Legacy.
          </h2>
          <div className="legacy-text w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-10" />
        </section>

        {/* Dedicated Story Section - Pinned & Scaled */}
        <section
          ref={storyRef}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center bg-transparent pointer-events-none"
        >
          <div className="story-text-container text-center px-4">
            <p
              className="text-[10px] lg:text-xs font-light tracking-[0.5em] uppercase text-white/40 mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Meridian Archive
            </p>
            <h3
              className="text-[2rem] md:text-[3.5rem] font-medium tracking-tighter text-white leading-tight"
              style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
            >
              Every piece tells a story.<br />
              <span className="text-white/40 font-light">Find yours.</span>
            </h3>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="relative z-20 w-full bg-transparent px-4 md:px-12 py-32 pointer-events-none">
          <div className="pointer-events-auto">
            {/* Grid of Watches */}
            <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-20 pb-32">
              {WATCHES.map((watch, idx) => (
                <ProductCard key={watch.id} watch={watch} index={idx} onClick={onSelectWatch} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* SECTION 5.5: THE IRONIC REVIEWS MARQUEE */}
        {/* ======================================== */}
        <ReviewsMarquee />

      {/* ======================================== */}
      {/* SECTION 6: THE CLOSER / CTA */}
      {/* ======================================== */}
      <section
        ref={closerRef}
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden pointer-events-none"
      >

        {/* Cinematic Closer Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 scale-[1.3]"
          style={{ mixBlendMode: 'screen' }}
        >
          <source src="/Watch_gears_Clean.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 pointer-events-auto">
          <p
            className="closer-text text-[10px] font-light tracking-[0.5em] uppercase text-white/50 mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Time is fleeting
          </p>
          <h2
            className="closer-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[6rem] font-bold tracking-tighter text-white leading-none mb-4 rainbow-shimmer pb-2"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
          >
            Time Waits<br />For No One.
          </h2>
          <p
            className="closer-text text-base md:text-lg text-white/40 max-w-md mt-4 mb-12"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Your legacy starts with what you wear. Make it count.
          </p>

          <MagneticButton
            onClick={() => {
              const grid = document.querySelector('.max-w-screen-2xl');
              if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="closer-btn px-12 py-5 bg-white text-black text-sm tracking-[0.35em] uppercase font-bold
                       rounded-full hover:bg-white/90 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            Shop Now
          </MagneticButton>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-10">
          <p
            className="text-[9px] tracking-[0.4em] uppercase text-white/20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 Meridian — All Rights Reserved
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
