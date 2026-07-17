import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CollectionShowcase from './components/CollectionShowcase';
import ProductOverlay from './components/ProductOverlay';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import BrandStory from './components/BrandStory';
import ProductSchema from './components/ProductSchema';
import InstagramFeed from './components/InstagramFeed';
import IntroSplash from './components/IntroSplash';
import CinematicOverlay from './components/CinematicOverlay';
import SoundtrackEngine from './audio/SoundtrackEngine';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[220] pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const mainRef = useRef(null);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [showBrand, setShowBrand] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentAct, setCurrentAct] = useState(1);
  const heroVideoRef = useRef(null);
  const soundtrackRef = useRef(null);

  // ---- Intro complete → auto-play soundtrack ----
  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
    // Auto-play soundtrack — intro splash already unlocked AudioContext
    if (!soundtrackRef.current) {
      soundtrackRef.current = new SoundtrackEngine();
      soundtrackRef.current.init().then(() => {
        soundtrackRef.current.play();
      });
    }
  }, []);

  // ============================================================
  // GSAP ANIMATIONS
  // ============================================================
  useEffect(() => {
    let ctx = gsap.context(() => {

      // ---- NO PINNING — free scroll with scroll-triggered animations ----
      // Track which section is in view
      const sections = gsap.utils.toArray('.cinema-section');
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setCurrentAct(i + 1),
          onEnterBack: () => setCurrentAct(i + 1),
        });
      });

      // ---- GLOBAL SCROLL PROGRESS for soundtrack ----
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (soundtrackRef.current && soundtrackRef.current.isPlaying) {
            soundtrackRef.current.setProgress(self.progress);
          }
        },
      });

      // ============================================================
      // HERO — entrance + scroll parallax
      // ============================================================
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.fromTo(".hero-tagline",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1.4, ease: "power3.out" }
      );
      heroTl.fromTo(".hero-title",
        { autoAlpha: 0, y: 60, scale: 0.92, rotateX: 8 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 2, ease: "power3.out" },
        "-=1"
      );
      heroTl.fromTo(".hero-explore",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );
      heroTl.fromTo(".hero-subtitle",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1, ease: "power2.out" },
        "-=1.5"
      );

      // Hero parallax on scroll — smooth fade + depth
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".section-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: "-35%",
        opacity: 0,
        scale: 0.88,
        filter: "blur(6px)",
        ease: "none",
      });

      gsap.to(".hero-explore", {
        scrollTrigger: {
          trigger: ".section-hero",
          start: "top top",
          end: "25% top",
          scrub: true,
        },
        opacity: 0,
        y: -40,
        ease: "none",
      });

      // ============================================================
      // VIDEO CROSSFADES — Stars → Liquid → Porsche
      // ============================================================
      gsap.to(".bg-liquid", {
        opacity: 0.85,
        scrollTrigger: {
          trigger: ".section-manifesto",
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });

      gsap.to(".bg-porsche", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".section-porsche",
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });
      gsap.to(".bg-liquid", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-porsche",
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });

      // ============================================================
      // MANIFESTO — text reveals on scroll
      // ============================================================
      const manifestoLines = gsap.utils.toArray(".manifesto-line");
      manifestoLines.forEach((line, i) => {
        gsap.fromTo(line,
          { autoAlpha: 0, y: 60, scale: 0.95, rotateX: 4 },
          {
            autoAlpha: 1, y: 0, scale: 1, rotateX: 0,
            duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            }
          }
        );
      });

      // ============================================================
      // PORSCHE — text reveals on scroll
      // ============================================================
      const porscheLines = gsap.utils.toArray(".porsche-line");
      porscheLines.forEach((line, i) => {
        gsap.fromTo(line,
          { autoAlpha: 0, y: 80, scale: 0.88, rotateX: 8 },
          {
            autoAlpha: 1, y: 0, scale: 1, rotateX: 0,
            duration: 1.5, ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            }
          }
        );
      });

      // Porsche dimmer
      gsap.to(".video-dimmer", {
        opacity: 0.6,
        scrollTrigger: {
          trigger: ".section-porsche",
          start: "top 60%",
          end: "bottom 20%",
          scrub: true,
        }
      });

      // ============================================================
      // COLLECTION — cinematic entrance
      // ============================================================
      gsap.fromTo(".collection-wrapper",
        { autoAlpha: 0, y: 80 },
        {
          autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out",
          scrollTrigger: {
            trigger: ".collection-wrapper",
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  // ---- Cleanup soundtrack on unmount ----
  useEffect(() => {
    return () => {
      if (soundtrackRef.current) {
        soundtrackRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      {/* Intro Splash */}
      {!introDone && <IntroSplash onComplete={handleIntroComplete} />}

      {/* Cinematic Overlay — vignette + scene counter + dots only */}
      <CinematicOverlay currentAct={currentAct} totalActs={4} />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black">

        {/* ============================================================
            FIXED BACKGROUND MEDIA LAYER
            ============================================================ */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">

          {/* Hero video (stars) */}
          <video
            ref={heroVideoRef}
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/stars.mp4" type="video/mp4" />
          </video>

          {/* Liquid explosion */}
          <video
            autoPlay loop muted playsInline preload="none"
            className="bg-liquid absolute inset-0 w-full h-full object-cover z-10"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Watch_rotating_in_liquid_explosion_202607141039.mp4?v=5" type="video/mp4" />
          </video>

          {/* Porsche tunnel */}
          <video
            autoPlay loop muted playsInline preload="none"
            className="bg-porsche absolute inset-0 w-full h-full object-cover z-20"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Porsche_driving_through_tunnel_202606281316.mp4?v=5" type="video/mp4" />
          </video>

          {/* Dimmer for text legibility */}
          <div className="video-dimmer absolute inset-0 bg-black z-25 pointer-events-none" style={{ opacity: 0 }} />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-30 pointer-events-none" />
        </div>

        {/* ============================================================
            NAVIGATION
            ============================================================ */}
        <nav className="fixed top-0 left-0 w-full h-16 sm:h-20 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 pointer-events-auto mix-blend-difference" style={{ zIndex: 230 }}>
          <button
            onClick={() => setShowBrand(true)}
            className="hidden md:block flex-1 text-left text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-light uppercase hover:opacity-50 transition-opacity cursor-pointer"
          >
            Heritage
          </button>

          <div className="flex-1 flex justify-center">
            <img src="/logo.jpg" alt="Meridian Logo" className="h-8 sm:h-10 lg:h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(201,169,110,0.4)] hover:scale-105 transition-transform cursor-pointer" />
          </div>

          <div
            onClick={() => {
              const grid = document.querySelector('.collection-wrapper');
              if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="hidden md:block flex-1 text-right text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-light uppercase hover:opacity-50 transition-opacity cursor-pointer"
          >
            Collection
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-[5px] cursor-pointer p-2"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1px] bg-white" />
            <span className="block w-5 h-[1px] bg-white" />
          </button>
        </nav>

        {/* ============================================================
            MOBILE MENU OVERLAY
            ============================================================ */}
        {menuOpen && (
          <div className="fixed inset-0 z-[300] pointer-events-auto">
            <div className="absolute inset-0 bg-black/92 backdrop-blur-md" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/95">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1">
                  <line x1="2" y1="2" x2="18" y2="18" />
                  <line x1="18" y1="2" x2="2" y2="18" />
                </svg>
              </button>

              <div className="flex flex-col items-center gap-10">
                <button
                  onClick={() => { setShowBrand(true); setMenuOpen(false); }}
                  className="text-2xl tracking-[0.15em] uppercase text-white/80 hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer font-light"
                >
                  Heritage
                </button>
                <button
                  onClick={() => {
                    const grid = document.querySelector('.collection-wrapper');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setMenuOpen(false);
                  }}
                  className="text-2xl tracking-[0.15em] uppercase text-white/80 hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer font-light"
                >
                  Collection
                </button>
                <a
                  href="https://www.instagram.com/meri.dianwatches"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm tracking-[0.3em] uppercase text-white/40 hover:text-[#C9A96E] transition-colors duration-300 mt-8"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SCROLLING CONTENT — flows freely, no pinning
            ============================================================ */}
        <div className="relative z-50 w-full pointer-events-none">

          {/* ---- HERO ---- */}
          <section className="cinema-section section-hero relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
            <div className="hero-content flex flex-col items-center text-center mt-12 pointer-events-auto px-4" style={{ perspective: '1200px' }}>
              <p className="hero-tagline text-[10px] sm:text-[11px] font-light tracking-[0.4em] uppercase text-white/40 mb-6 sm:mb-10">
                Logic Defied
              </p>
              <h1 className="hero-title text-[3rem] sm:text-7xl md:text-[7rem] lg:text-[10rem] font-extralight tracking-[-0.02em] leading-none gold-shimmer"
                style={{ textShadow: '0 0 80px rgba(201,169,110,0.3)' }}
              >
                Meridian
              </h1>
              <p className="hero-subtitle mt-4 sm:mt-6 text-[10px] sm:text-xs tracking-[0.5em] uppercase text-white/20 font-light"
                style={{ opacity: 0 }}
              >
                Curated Luxury Timepieces
              </p>
            </div>

            <div className="hero-explore absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto">
              <span className="text-[9px] font-light tracking-[0.4em] uppercase text-white/25 mb-4 group-hover:text-[#C9A96E] transition-colors duration-500">
                Scroll to Enter
              </span>
              <div className="w-[1px] h-14 bg-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[#C9A96E] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
          </section>

          {/* ---- MANIFESTO ---- */}
          <section className="cinema-section section-manifesto relative w-full min-h-screen flex flex-col items-center justify-center py-32 pointer-events-auto" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-[80rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-8 md:space-y-12">
              <h2 className="manifesto-line text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                Your smartwatch just told you to stand up.
              </h2>
              <h2 className="manifesto-line text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                Congrats on hitting 10,000 steps.
              </h2>
              <h2 className="manifesto-line text-[1.3rem] sm:text-[1.7rem] md:text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] font-extralight tracking-[-0.02em] text-white/50 select-none w-full leading-tight">
                Too bad your wrist looks like a tiny iPad.
              </h2>
            </div>
          </section>

          {/* ---- PORSCHE ---- */}
          <section className="cinema-section section-porsche relative w-full min-h-screen flex flex-col items-center justify-center py-32 pointer-events-auto" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-[80rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-8 md:space-y-12">
              <h2 className="porsche-line text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                You will inevitably perish.
              </h2>
              <h2 className="porsche-line text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                Your legacy will be forgotten.
              </h2>
              <h2 className="porsche-line text-[1.3rem] sm:text-[1.7rem] md:text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] font-extralight tracking-[-0.02em] text-white/50 select-none w-full leading-tight">
                But hey, at least your wrist looks expensive.
              </h2>
            </div>
          </section>

          {/* ---- COLLECTION — direct transition, no gap ---- */}
          <div className="collection-wrapper relative z-50 pointer-events-auto">
            <CollectionShowcase onSelectWatch={setSelectedWatch} />
          </div>

        </div>

        <InstagramFeed />
        <ProductOverlay watch={selectedWatch} onClose={() => setSelectedWatch(null)} />
      </div>

      {/* Floating UI */}
      <WhatsAppButton />
      <ScrollToTop />

      {/* Brand Story Overlay */}
      {showBrand && <BrandStory onClose={() => setShowBrand(false)} />}
    </>
  );
}
