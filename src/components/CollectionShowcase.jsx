import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReviewsMarquee from './ReviewsMarquee';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// PRODUCT DATA — ONLY YOUR BRANDS
// ============================================
import { WATCHES } from '../data/watches';

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
// SINGLE PRODUCT CARD
// ============================================
function ProductCard({ watch, index, onClick }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 100, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
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
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) videoRef.current.play();
        gsap.to(cardRef.current, {
          z: 50,
          scale: 1.02,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          duration: 0.4,
          ease: 'power2.out',
        });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
        gsap.to(cardRef.current, {
          z: 0,
          scale: 1,
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          duration: 0.5,
          ease: 'power2.out',
        });
      }}
    >
      {/* Background Video (plays on hover, subtle) */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        key={watch.id}
        src={`${watch.video}?t=${watch.id}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-[1.3]"
        style={{ opacity: isHovered ? 0.15 : 0 }}
      />

      {/* Gradients for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)`,
        }}
      />

      {/* Brand Name — Top */}
      <div className="absolute top-6 left-6 right-6 z-30">
        <h3
          className="text-[1.8rem] sm:text-[2.5rem] md:text-[3.5rem] font-light tracking-[-0.02em] leading-none text-white/90 uppercase"
        >
          {watch.brand}
        </h3>
        <p
          className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-white/40 mt-1"
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
          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.03]"
          style={{
            mixBlendMode: 'multiply',
            filter: 'contrast(1.05) saturate(1.1)',
            opacity: imgLoaded ? 1 : 0,
          }}
        />
      </div>

      {/* Tagline + Price + CTA — Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
        {/* Tagline */}
        {watch.tagline && (
          <p 
            className="text-xs md:text-sm text-white/30 mb-3 font-light"
          >
            "{watch.tagline}"
          </p>
        )}
        <div className="flex items-center justify-between">
          <span
            className="text-2xl md:text-3xl font-light text-white tracking-tight"
          >
            {watch.price}
          </span>
          {watch.outOfStock ? (
            <span className="px-4 py-2 bg-white/10 border border-white/20 text-white/60 text-xs tracking-[0.2em] uppercase rounded-full backdrop-blur-md">
              Out of Stock
            </span>
          ) : (
            <MagneticButton
              className="px-5 py-2.5 border border-white/30 text-white text-xs tracking-[0.25em] uppercase font-medium
                         hover:bg-white hover:text-black transition-all duration-300 rounded-full backdrop-blur-md"
            >
              View →
            </MagneticButton>
          )}
        </div>
      </div>

      {/* Subtle border on hover */}
      <div
        className="absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none"
        style={{
          borderColor: isHovered ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.06)',
        }}
      />
    </div>
  );
}

// ============================================
// MAIN EXPORT: CollectionShowcase
// ============================================
export default function CollectionShowcase({ onSelectWatch }) {
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const storyRef = useRef(null);
  const closerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // "Choose Your Legacy" — staggered reveal with scale
      const legacyEls = gsap.utils.toArray(".legacy-text");
      gsap.fromTo(legacyEls,
        { autoAlpha: 0, y: 50, scale: 0.96 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );

      // Closer section — staggered cinematic reveal
      const closerEls = gsap.utils.toArray(".closer-text");
      gsap.fromTo(closerEls,
        { autoAlpha: 0, y: 60, scale: 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".closer-btn",
        { autoAlpha: 0, y: 30, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1,
          delay: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        }
      );

      // Dedicated Story Section — dramatic zoom with blur + slight rotation
      gsap.fromTo(".story-text-container",
        { scale: 1, autoAlpha: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
        {
          scale: 5,
          autoAlpha: 0,
          y: -150,
          rotateX: 8,
          filter: "blur(4px)",
          ease: "none",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top top",
            end: "+=180%",
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
      <div className="product-reveal relative z-0 w-full bg-black">

        {/* Legacy Header Section */}
        <section
          ref={taglineRef}
          className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pointer-events-none"
        >
          <p
            className="legacy-text text-[10px] font-light tracking-[0.5em] uppercase text-white/30 mb-6"
          >
            The Collection
          </p>
          <h2
            className="legacy-text text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[7rem] font-extralight tracking-[-0.03em] text-white text-center leading-none pb-4"
          >
            Choose Your<br />Legacy.
          </h2>
        </section>

        {/* Dedicated Story Section - Pinned & Scaled */}
        <section
          ref={storyRef}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center bg-transparent pointer-events-none"
        >
          <div className="story-text-container text-center px-4">
            <p
              className="text-[10px] lg:text-xs font-light tracking-[0.5em] uppercase text-white/25 mb-8"
            >
              Meridian Archive
            </p>
            <h3
              className="text-[2rem] md:text-[3.5rem] font-light tracking-[-0.02em] text-white leading-tight"
            >
              Every piece tells a story.<br />
              <span className="text-white/30 font-light">Find yours.</span>
            </h3>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="relative z-20 w-full bg-transparent px-4 md:px-12 py-32 pointer-events-none">
          <div className="pointer-events-auto relative z-10">
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
            className="closer-text text-[10px] font-light tracking-[0.5em] uppercase text-white/30 mb-6"
          >
            Time is fleeting
          </p>
          <h2
            className="closer-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[6rem] font-light tracking-[-0.02em] text-white leading-none mb-4 gold-shimmer pb-2"
          >
            Time Waits<br />For No One.
          </h2>
          <p
            className="closer-text text-base md:text-lg text-white/25 max-w-md mt-4 mb-12 font-light"
          >
            Your legacy starts with what you wear. Make it count.
          </p>

          <MagneticButton
            onClick={() => {
              const grid = document.querySelector('.max-w-screen-2xl');
              if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="closer-btn px-12 py-5 bg-white text-black text-sm tracking-[0.35em] uppercase font-bold
                       rounded-full hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-[0_0_60px_rgba(201,169,110,0.15)] cursor-pointer"
          >
            Shop Now
          </MagneticButton>
        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full mt-32 pointer-events-auto">
          <div className="max-w-6xl mx-auto px-8 py-16">
            {/* Top: Logo + Newsletter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
              <img src="/logo.jpg" alt="Meridian" className="h-12 w-auto object-contain opacity-60" />
              <div className="flex flex-col items-center md:items-end gap-3">
                <p className="text-xs tracking-[0.3em] uppercase text-white/25 font-light">
                  Stay in the loop
                </p>
                <div className="flex items-center gap-2">
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/40 w-56 transition-colors"
                  />
                  <button className="px-5 py-2 bg-white/10 border border-white/10 text-white/60 text-xs tracking-[0.2em] uppercase rounded-full hover:bg-[#C9A96E] hover:text-black hover:border-[#C9A96E] transition-all duration-300">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Middle: Nav Links */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-16">
              {['Shop', 'Heritage', 'Instagram', 'Contact'].map((link) => (
                <button 
                  key={link}
                  className="text-xs tracking-[0.25em] uppercase text-white/20 hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer font-light"
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/5 mb-8" />

            {/* Bottom: Copyright + Social */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/15">
                © 2026 Meridian — All Rights Reserved
              </p>
              <div className="flex items-center gap-6">
                <a 
                  href="https://www.instagram.com/meri.dianwatches" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.3em] uppercase text-white/15 hover:text-[#C9A96E] transition-colors duration-300"
                >
                  Instagram
                </a>
                <a 
                  href="https://wa.me/918431724851" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.3em] uppercase text-white/15 hover:text-[#C9A96E] transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </footer>

      </section>
      </div>
    </div>
  );
}
