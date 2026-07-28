import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import WebGLFluid from 'webgl-fluid';
import CollectionShowcase from './components/CollectionShowcase';
import ProductOverlay from './components/ProductOverlay';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import BrandStory from './components/BrandStory';
import ProductSchema from './components/ProductSchema';
import InstagramFeed from './components/InstagramFeed';
import BrandFilm from './components/BrandFilm';
import IntroSplash from './components/IntroSplash';
import CinemaIntermission from './components/CinemaIntermission';
import PolicyModal from './components/PolicyModal';
import CelestialCanvas from './components/CelestialCanvas';
import HorologySpecsCounter from './components/HorologySpecsCounter';
import RolexHeroPin from './components/RolexHeroPin';
import GoldStarDustCursor from './components/GoldStarDustCursor';
import { WATCHES } from './data/watches';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

// Split text into individual character spans for typewriter effect
function SplitChars({ text, className = '' }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// ============================================
// WEBGL FLUID SIMULATION — GLOBAL BACKGROUND
// ============================================
function FluidBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    WebGLFluid(canvas, {
      TRIGGER: 'hover',
      IMMEDIATE: true,
      AUTO: false,
      SIM_RESOLUTION: isMobile ? 32 : 48,
      DYE_RESOLUTION: isMobile ? 128 : 256,
      CAPTURE_RESOLUTION: isMobile ? 128 : 256,
      DENSITY_DISSIPATION: 1.5,
      VELOCITY_DISSIPATION: 0.5,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 8,
      CURL: 10,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 2500,
      SPLAT_COUNT: 2,
      SHADING: false,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: false,
      BLOOM_ITERATIONS: 0,
      BLOOM_RESOLUTION: 128,
      BLOOM_INTENSITY: 0.2,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: !isMobile,
      SUNRAYS_RESOLUTION: isMobile ? 128 : 196,
      SUNRAYS_WEIGHT: 1.0,
    });

    // Hide fluid initially, show at "Choose Your Legacy"
    gsap.fromTo(containerRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 0.25,
        scrollTrigger: {
          trigger: ".product-reveal",
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        }
      }
    );

  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none opacity-0" 
      style={{ zIndex: 1 }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ width: '100vw', height: '100vh' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  );
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[200] pointer-events-none">
      <div 
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

export default function App() {
  const mainRef = useRef(null);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [showBrand, setShowBrand] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  const [activePolicy, setActivePolicy] = useState(null);
  const [showAi, setShowAi] = useState(false);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  // 120 FPS High-Velocity Lenis Momentum Engine
  // Native smooth scrolling & 60 FPS Lenis scroll engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function update(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  const handleHeroMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) - 0.5) * 16;
    const y = ((clientY / innerHeight) - 0.5) * -16;
    setHeroTilt({ x, y });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setHeroTilt({ x: 0, y: 0 });
  }, []);

  const toggleSound = useCallback(() => {
    if (!audioRef.current) return;
    if (soundOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setSoundOn(prev => !prev);
  }, [soundOn]);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // ============================================================
      // 1. HERO — entrance + scroll zoom into darkness
      // ============================================================
      const heroTl = gsap.timeline();
      heroTl.fromTo(".hero-title",
        { autoAlpha: 1, y: 15, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      // Hero zoom + blur on scroll (entering the watch)
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 2.5,
        opacity: 0,
        filter: "blur(20px)",
        ease: "none"
      });

      // Stars video zooms in + blurs on scroll
      gsap.to(".bg-stars", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 3,
        filter: "blur(30px)",
        ease: "none"
      });

      // ============================================================
      // 2. MANIFESTO — Butter-Smooth 120 FPS Reveal
      // ============================================================
      const manifestoLines = gsap.utils.toArray(".manifesto-line");
      manifestoLines.forEach((line, i) => {
        gsap.fromTo(line,
          { autoAlpha: 0, y: 50, scale: 0.98 },
          {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".manifesto-spacer",
              start: `top ${75 - i * 15}%`,
              end: `top ${40 - i * 15}%`,
              scrub: 0.5,
            }
          }
        );
      });

      // ============================================================
      // 3. PORSCHE — Butter-Smooth 120 FPS Reveal
      // ============================================================
      const porscheLines = gsap.utils.toArray(".porsche-line");
      porscheLines.forEach((line, i) => {
        gsap.fromTo(line,
          { autoAlpha: 0, y: 50, scale: 0.98 },
          {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".porsche-spacer",
              start: `top ${75 - i * 15}%`,
              end: `top ${40 - i * 15}%`,
              scrub: 0.5,
            }
          }
        );
      });

      // Fade out Porsche video smoothly before products
      gsap.to(".bg-porsche", {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: ".product-reveal",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        }
      });

      // Product Reveal Section
      gsap.fromTo(".product-reveal",
        { opacity: 0.95 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-reveal",
            start: "top 95%",
            end: "top 40%",
            scrub: true,
          }
        }
      );

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Intro Splash */}
      {!introDone && <IntroSplash onComplete={handleIntroComplete} />}

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-white min-h-screen text-[#0b0b0e] font-sans overflow-x-hidden selection:bg-[#006039] selection:text-white">
        
        {/* UNIFIED HYPER-OPTIMIZED 120 FPS CELESTIAL & LIQUID EMBER CANVAS */}
        <CelestialCanvas />
        
        {/* FIXED BACKGROUND MEDIA LAYER */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">
          
          <video 
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="bg-stars absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/hero-4k.mp4" type="video/mp4" />
          </video>

          {/* Ambient audio for hero video */}
          <audio ref={audioRef} loop preload="auto">
            <source src="/ambient.mp3" type="audio/mpeg" />
          </audio>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-30 pointer-events-none" />
        </div>

        {/* NAVIGATION */}
        <nav className="relative flex items-center justify-between px-6 sm:px-12 md:px-20 py-4 sm:py-6 overflow-hidden pointer-events-auto mix-blend-difference">
          {/* Magnetic Specular Sweep Hairline */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-navbar-sweep opacity-70" />
          <button 
            onClick={() => setShowBrand(true)} 
            className="hidden md:block flex-1 text-left text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-semibold uppercase hover:opacity-80 transition-opacity cursor-pointer gemini-rainbow-subtext"
          >
            Heritage
          </button>

          <div className="flex-1 flex justify-center">
            <img src="/logo.jpg" alt="Meridian Logo" className="h-10 sm:h-14 lg:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(155,81,224,0.5)] hover:scale-105 transition-transform cursor-pointer" />
          </div>

          <div 
            onClick={() => {
              const grid = document.querySelector('.max-w-screen-2xl');
              if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="hidden md:block flex-1 text-right text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-semibold uppercase hover:opacity-80 transition-opacity cursor-pointer gemini-rainbow-subtext"
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

        {/* MOBILE MENU OVERLAY */}
        {menuOpen && (
          <div className="fixed inset-0 z-[100] pointer-events-auto">
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/95">
              <button 
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center cursor-pointer"
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
                    const grid = document.querySelector('.max-w-screen-2xl');
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

        {/* SCROLLING CONTENT LAYER */}
        <div className="relative z-50 w-full pointer-events-none">

          {/* HERO — 3D Tilt-Shift Parallax & Gemini Iridescent Typography */}
          <section 
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="hero-spacer relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
            style={{ perspective: "1000px" }}
          >
            {/* Ambient Gemini Aurora Fluid Glow */}
            <div className="absolute inset-0 gemini-aurora-bg pointer-events-none" />

            <div 
              className="hero-content relative z-10 flex flex-col items-center text-center pointer-events-auto px-4 space-y-3 transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg) translateZ(40px)`
              }}
            >
              {/* Gemini Iridescent Accent Hairline */}
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-[#4285F4] via-[#9B51E0] via-[#E91E63] to-[#00F0FF] rounded-full opacity-80 animate-pulse mb-1" />

              <h1 
                className="hero-title text-[3.5rem] sm:text-7xl md:text-[7.5rem] lg:text-[9.5rem] font-normal tracking-[0.1em] leading-none text-gemini-gradient uppercase drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)] select-none" 
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Meridian
              </h1>
            </div>

            {/* Scroll Indicator with Gemini Gradient Line */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/40">SCROLL</span>
              <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#9B51E0] via-[#00F0FF] to-transparent animate-pulse" />
            </div>

            {/* Sound toggle — minimal */}
            <button 
              onClick={toggleSound}
              className="absolute bottom-8 right-6 sm:right-10 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 pointer-events-auto z-[60] cursor-pointer"
              aria-label={soundOn ? "Mute sound" : "Play sound"}
            >
              {soundOn ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/70">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.2" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </section>

          {/* MANIFESTO — GASP 4K WATCH GEARS FORMING DIAL VIDEO */}
          <section className="manifesto-spacer relative w-full h-screen pointer-events-auto overflow-hidden bg-black">
            {/* Scoped 4K Watch Gears Video Background */}
            <video
              autoPlay loop muted playsInline preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
            >
              <source src="/Watch_gears_forming_watch_dial_202606291025.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none z-5" />

            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-10">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-normal tracking-[-0.02em] select-none w-full leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    Your smartwatch just told you to stand up.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-normal tracking-[-0.02em] select-none w-full leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    Congrats on hitting 10,000 steps.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-normal tracking-[-0.02em] select-none w-full leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    Too bad your wrist looks like a tiny iPad.
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* PORSCHE — GASP 4K PORSCHE TUNNEL VIDEO */}
          <section className="porsche-spacer relative w-full h-screen pointer-events-auto overflow-hidden bg-black">
            {/* Scoped 4K Porsche Video Background */}
            <video
              autoPlay loop muted playsInline preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none z-0"
            >
              <source src="/Porsche_driving_through_tunnel_202606281316.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none z-5" />

            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden z-10">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="w-full">
                  <h2 className="porsche-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-sans font-normal tracking-[-0.02em] select-none w-full leading-tight text-gradient-cyan-lime">
                    You will inevitably perish.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-sans font-normal tracking-[-0.02em] select-none w-full leading-tight text-gradient-cyan-lime">
                    Your legacy will be forgotten.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-sans font-normal tracking-[-0.02em] select-none w-full leading-tight text-gradient-cyan-lime">
                    But hey, at least your wrist looks expensive.
                  </h2>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* 100% EXACT ROLEX PINNED 3D CENTERPIECE ZOOM ENGINE */}
        <RolexHeroPin watch={WATCHES[0]} onSelectWatch={setSelectedWatch} />

        <InstagramFeed />
        <HorologySpecsCounter />
        <BrandFilm />
        
        {/* CINEMA TAKEOVER 2: OSCAR WINNER (MICHAEL B. JORDAN) */}
        <CinemaIntermission 
          videoSrc="/wolf-of-wall-street.mp4" 
          title='"Everyone applauded. The watch kept ticking."' 
        />

        {/* CINEMA TAKEOVER 3: PINNACLE SPORTS (F1 / TENNIS / EQUESTRIAN) */}
        <CinemaIntermission 
          videoSrc="/dark-knight.mp4" 
          title='"0.001s for glory. Still late for your 9 AM."' 
        />

        <CollectionShowcase onSelectWatch={setSelectedWatch} />
        <ProductOverlay watch={selectedWatch} onClose={() => setSelectedWatch(null)} />

        {/* LUXURY COMPLIANCE FOOTER */}
        <footer className="w-full bg-[#050507] border-t border-white/10 py-12 px-6 text-center text-white/50 z-20 relative pointer-events-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#10B981] uppercase block mb-1">
                MERIDIAN HOROLOGY © 2026
              </span>
              <p className="text-[11px] font-mono text-white/40">
                ALL RIGHTS RESERVED // WHITE GLOVE INSURED DELIVERY
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono tracking-widest uppercase relative z-50 pointer-events-auto">
              <button onClick={() => setActivePolicy('terms')} className="hover:text-white transition-colors cursor-pointer relative z-50 pointer-events-auto py-2 px-1">Terms</button>
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-white transition-colors cursor-pointer relative z-50 pointer-events-auto py-2 px-1">Privacy</button>
              <button onClick={() => setActivePolicy('refund')} className="hover:text-[#10B981] transition-colors cursor-pointer relative z-50 pointer-events-auto py-2 px-1">Refund & Cancellation</button>
              <button onClick={() => setActivePolicy('shipping')} className="hover:text-white transition-colors cursor-pointer relative z-50 pointer-events-auto py-2 px-1">Shipping</button>
              <button onClick={() => setActivePolicy('contact')} className="hover:text-white transition-colors cursor-pointer relative z-50 pointer-events-auto py-2 px-1">Contact</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating UI — above everything */}
      <WhatsAppButton />
      <GoldStarDustCursor />
      <ScrollToTop />

      {/* Brand Story Overlay */}
      {showBrand && <BrandStory onClose={() => setShowBrand(false)} />}

      {/* Official Policy Overlay Modal */}
      {activePolicy && <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />}
    </>
  );
}
