import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../hooks/useIsMobile';
import ReviewsMarquee from './ReviewsMarquee';
import WatchSection from './WatchSection';

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
  const isMobile = useIsMobile();

  const handleMouseMove = (e) => {
    if (isMobile) return;
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
    if (isMobile) return;
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
  const isMobile = useIsMobile();

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
        if (isMobile) return;
        gsap.to(cardRef.current, {
          z: 120,
          scale: 1.08,
          rotateX: -6,
          boxShadow: '0 40px 90px rgba(0,0,0,0.85), 0 0 50px rgba(128,0,32,0.3)',
          duration: 0.4,
          ease: 'power3.out',
        });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
        if (isMobile) return;
        gsap.to(cardRef.current, {
          z: 0,
          scale: 1,
          rotateX: 0,
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
        <div className="flex items-start justify-between">
          <div>
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
          {watch.badge && (
            <span className="shrink-0 ml-4 px-3 py-1.5 bg-[#800020] text-white text-[9px] font-mono tracking-[0.15em] uppercase font-bold rounded-full shadow-lg shadow-[#800020]/40">
              {watch.badge}
            </span>
          )}
        </div>
      </div>

      {/* Watch Image — 3D POP-OUT FLY TO FACE EFFECT */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10 p-12 transition-transform duration-500 ease-out"
        style={{
          transform: isHovered ? 'translateZ(90px) scale(1.22)' : 'translateZ(0px) scale(1)',
          willChange: 'transform'
        }}
      >
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
          className="w-full h-full object-contain transition-all duration-700 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
          style={{
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.8))',
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
              className="px-5 py-2.5 border border-white/30 text-white text-xs tracking-[0.25em] uppercase font-medium min-h-[44px] flex items-center
                         hover:bg-white hover:text-black transition-all duration-300 rounded-full backdrop-blur-md"
            >
              View{' '}
              <svg className="w-3.5 h-3.5 inline-block ml-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
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
  const [joinedMessage, setJoinedMessage] = useState(false);
  const [activeWatchIndex, setActiveWatchIndex] = useState(-1);

  useEffect(() => {
    const sections = document.querySelectorAll('#watch-collection-grid > section');
    const triggers = [];
    sections.forEach((section, idx) => {
      const t = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onEnter: () => setActiveWatchIndex(idx),
        onEnterBack: () => setActiveWatchIndex(idx),
      });
      triggers.push(t);
    });
    return () => triggers.forEach(t => t.kill());
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // "Choose Your Legacy" — staggered reveal with scale
      const legacyEls = gsap.utils.toArray(".legacy-text");
      gsap.fromTo(legacyEls,
        { autoAlpha: 0, y: 40, scale: 0.97, filter: "blur(4px)" },
        {
          autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      // Closer section — staggered cinematic reveal
      const closerEls = gsap.utils.toArray(".closer-text");
      gsap.fromTo(closerEls,
        { autoAlpha: 0, y: 40, scale: 0.97, filter: "blur(4px)" },
        {
          autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".closer-btn",
        { autoAlpha: 0, y: 20, scale: 0.95 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.7,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 65%",
            toggleActions: "play none none none"
          }
        }
      );

      // Story text — simple fade-in, stays visible
      gsap.fromTo(".story-text-container",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
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

        {/* Legacy Header Section with 4K Gold Skeleton Watch Video Background */}
        <section
          ref={taglineRef}
          className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pointer-events-none overflow-hidden bg-black"
        >
          {/* Scoped 4K Gold Skeleton Watch Video */}
          <video
            autoPlay loop muted playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          >
            <source src="/Gold_skeleton_watch_showcase_202606290837.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none z-10" />

          <div className="relative z-10 text-center px-4">
            <h2
              className="legacy-text text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-normal tracking-[0.08em] text-rainbow-shimmer text-center leading-[1.1] uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Choose Your<br />Legacy.
            </h2>
          </div>
        </section>

        {/* Dedicated Story Section - Animated Gemini Aurora Mesh & Iridescent Gradient Typography */}
        <section
          ref={storyRef}
          className="relative z-10 w-full h-screen flex flex-col items-center justify-center bg-black pointer-events-none overflow-hidden"
        >
          {/* Animated Gemini Aurora Fluid Backdrop */}
          <div className="absolute inset-0 burgundy-aurora-bg pointer-events-none" />

          <div 
            className="story-text-container relative z-10 text-center px-6 max-w-6xl mx-auto"
            style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
          >
            <h3
              className="text-[2.2rem] sm:text-[3.8rem] md:text-[4.8rem] lg:text-[5.5rem] font-normal tracking-[0.06em] leading-[1.15] uppercase text-rainbow-shimmer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Every timepiece tells a story.<br />
              <span className="text-white/50 font-normal">Find yours.</span>
            </h3>
          </div>
        </section>

        {/* Product Grid Section — Full-Screen Watch Sections */}
        <div id="watch-collection-grid" className="relative z-20 pointer-events-auto">
          {WATCHES.map((watch, idx) => (
            <WatchSection key={watch.id} watch={watch} index={idx} onClick={onSelectWatch} isActive={idx === activeWatchIndex} />
          ))}
        </div>

        {/* ======================================== */}
        {/* SECTION 5.5: THE IRONIC REVIEWS MARQUEE */}
        {/* ======================================== */}
        <ReviewsMarquee />

      {/* ======================================== */}
      {/* SECTION 6: THE CLOSER / CTA */}
      {/* ======================================== */}
      <section
        ref={closerRef}
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pointer-events-none"
      >

        {/* Cinematic Closer Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="none"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 scale-[1.3]"
          style={{ mixBlendMode: 'multiply' }}
        >
          <source src="/Watch_gears_Clean.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 pointer-events-auto">
          <p
            className="closer-text text-[10px] font-light tracking-[0.5em] uppercase text-black/30 mb-6"
          >
            Time is fleeting
          </p>
          <h2
            className="closer-text text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[8rem] font-light tracking-[-0.02em] text-black leading-none mb-4 gold-shimmer pb-2"
          >
            Time Waits<br />For No One.
          </h2>
          <p
            className="closer-text text-base md:text-lg text-black/40 max-w-md mt-4 mb-12 font-light"
          >
            Your legacy starts with what you wear. Make it count.
          </p>

          <MagneticButton
            onClick={() => {
              const watchGrid = document.getElementById('watch-collection-grid');
              if (watchGrid) watchGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="closer-btn px-12 py-5 bg-black text-white text-xs font-mono tracking-[0.3em] uppercase font-extrabold
                       rounded-full hover:bg-black/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            EXPLORE ARCHIVE{' '}
            <svg className="w-4 h-4 inline-block ml-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </MagneticButton>
        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full mt-32 pointer-events-auto">
          <div className="max-w-6xl mx-auto px-8 py-16">
            {/* Top: Logo + Newsletter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
              <img src="/logo.jpg" alt="Meridian" className="h-12 w-auto object-contain opacity-40" />
              <div className="flex flex-col items-center md:items-end gap-3">
                <p className="text-xs tracking-[0.3em] uppercase text-black/40 font-light">
                  Stay in the loop
                </p>
                <div className="flex flex-col items-end gap-2">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const email = e.target.email.value;
                      setJoinedMessage(true);
                      if (typeof fbq === 'function') {
                        fbq('track', 'Lead', { value: 1, currency: 'INR' });
                      }
                      setTimeout(() => setJoinedMessage(false), 4000);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="px-4 py-2 bg-black/5 border border-black/10 rounded-full text-xs text-black placeholder:text-black/30 focus:outline-none focus:border-[#800020] w-56 transition-colors"
                    />
                    <button 
                      type="submit"
                      className="px-5 py-3 bg-[#800020] text-white text-xs font-mono font-bold tracking-[0.2em] uppercase rounded-full min-h-[44px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer shadow-lg shadow-[#800020]/20"
                    >
                      Join
                    </button>
                  </form>
                  {joinedMessage && (
                    <span className="text-[10px] font-mono tracking-widest text-[#800020] uppercase animate-pulse">
                      ✨ VIP Access Granted. Check your inbox.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Nav Links */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-16">
              <button 
                onClick={() => {
                  const watchGrid = document.getElementById('watch-collection-grid');
                  if (watchGrid) watchGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs tracking-[0.25em] uppercase text-black/60 hover:text-[#800020] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
              >
                Shop
              </button>
              <button 
                onClick={() => {
                  const firstSec = document.querySelector('section');
                  if (firstSec) firstSec.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs tracking-[0.25em] uppercase text-black/60 hover:text-[#800020] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
              >
                Heritage
              </button>
              <a 
                href="https://www.instagram.com/meri.dianwatches"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.25em] uppercase text-black/60 hover:text-[#800020] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
              >
                Instagram
              </a>
              <a 
                href="https://wa.me/918431724851"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.25em] uppercase text-black/60 hover:text-[#800020] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
              >
                Contact
              </a>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-black/10 mb-8" />

            {/* Bottom: Copyright + Social */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/30">
                © 2026 Meridian — All Rights Reserved
              </p>
              <div className="flex items-center gap-6">
                <a 
                  href="https://www.instagram.com/meri.dianwatches" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.3em] uppercase text-black/40 hover:text-[#800020] transition-colors duration-300 py-3 min-h-[44px] flex items-center"
                >
                  Instagram
                </a>
                <a 
                  href="https://wa.me/918431724851" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.3em] uppercase text-black/40 hover:text-[#800020] transition-colors duration-300 py-3 min-h-[44px] flex items-center"
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
