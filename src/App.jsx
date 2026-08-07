import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import WebGLFluid from 'webgl-fluid';
import CollectionShowcase from './components/CollectionShowcase';
import ScrollToTop from './components/ScrollToTop';
import FloatingShopButton from './components/FloatingShopButton';
import ProductSchema from './components/ProductSchema';
import IntroSplash from './components/IntroSplash';
import RolexHeroPin from './components/RolexHeroPin';
import GoldStarDustCursor from './components/GoldStarDustCursor';
import AnnouncementBar from './components/AnnouncementBar';
import WhatsAppButton from './components/WhatsAppButton';
import { isLowEndDevice } from './utils/device';
import { useNearPlay } from './hooks/useNearPlay';
import { WATCHES } from './data/watches';

const ProductOverlay = React.lazy(() => import('./components/ProductOverlay'));
const BrandStory = React.lazy(() => import('./components/BrandStory'));
const InstagramFeed = React.lazy(() => import('./components/InstagramFeed'));
const BrandFilm = React.lazy(() => import('./components/BrandFilm'));
const CinemaIntermission = React.lazy(() => import('./components/CinemaIntermission'));
const PolicyModal = React.lazy(() => import('./components/PolicyModal'));
const HorologySpecsCounter = React.lazy(() => import('./components/HorologySpecsCounter'));

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

// ============================================
// WEBGL FLUID SIMULATION — GLOBAL BACKGROUND
// ============================================
function FluidBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isLowEndDevice()) return;

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
  const [fastIntro, setFastIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('fbclid') || window.location.search.includes('utm');
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const heroCharsRef = useRef([]);
  const svgRef = useRef(null);
  const constellationTl = useRef(null);
  const manifestoRef = useRef(null);
  const manifestoVideoRef = useRef(null);
  const porscheRef = useRef(null);
  const porscheVideoRef = useRef(null);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  const scrollToCollection = useCallback(() => {
    const grid = document.getElementById('watch-collection-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const [activePolicy, setActivePolicy] = useState(null);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const isLow = isLowEndDevice();

  useNearPlay(manifestoRef, manifestoVideoRef);
  useNearPlay(porscheRef, porscheVideoRef);

  // 120 FPS High-Velocity Lenis Momentum Engine
  // Native smooth scrolling & 60 FPS Lenis scroll engine
  useEffect(() => {
    if (isLow) return;

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

    window.lenis = lenis;

    return () => {
      delete window.lenis;
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
    // ============================================================
    // HERO — Constellation entrance (outside context, direct DOM)
    // ============================================================
    const chars = document.querySelectorAll('.hero-char');
    if (chars.length) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      const titleEl = document.querySelector('.hero-title');
      if (titleEl) titleEl.style.opacity = '0';

      chars.forEach((c, i) => {
        const x = (Math.random() - 0.5) * vw * 1.2;
        const y = (Math.random() - 0.5) * vh * 1.2;
        const rot = (Math.random() - 0.5) * 360;
        c.style.cssText = `opacity:0.3;transform:translate(${x}px,${y}px) scale(0.08) rotate(${rot}deg);display:inline-block;will-change:transform,opacity`;
      });

      if (titleEl) titleEl.style.opacity = '1';

      const tl = gsap.timeline();

      // Quick twinkle — opacity only (single pass, no yoyo)
      tl.to(chars, {
        opacity: 0.6,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power1.out',
      });

      // Fly to center — smooth power2 easing, tighter stagger
      tl.to(chars, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: 'power2.out',
      }, '+=0.05');

      // Settle with shimmer
      tl.call(() => {
        chars.forEach(c => {
          c.style.transform = '';
          c.style.textShadow = '0 0 30px rgba(201,169,110,0.4)';
          c.classList.add('text-rainbow-shimmer');
        });
      });

      tl.to(".accent-line-hero", { width: '6rem', opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
      tl.to(".shop-cta-hero", { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.15');
      tl.to(".scroll-indicator-hero", { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

      constellationTl.current = tl;

      const heroSound = new Audio('/space-riser.mp3');
      heroSound.volume = 0.4;
      heroSound.play().catch(() => {});
    }

    // ============================================================
    // Other effects — use gsap.context for proper cleanup
    // ============================================================
    let ctx = gsap.context(() => {

      // Logo + nav entrance
      gsap.fromTo(".logo-entrance",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(".nav-link",
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );

      // Hero zoom on scroll (entering the watch) — no filter (GPU-light)
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 2.5,
        opacity: 0,
        ease: "none"
      });

      // Stars video zooms in on scroll — transform only (kills GPU with filter)
      gsap.to(".bg-stars", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 3,
        ease: "none"
      });

      // 2. MANIFESTO — Scroll-tied Cinematic Reveal (Mobile Performant)
      gsap.fromTo(".manifesto-word",
        { opacity: 0.1, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".manifesto-spacer",
            start: "top 80%",
            end: "bottom 60%",
            scrub: 1
          }
        }
      );



      // Footer reveal
      gsap.fromTo(".site-footer",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".site-footer",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Intro Splash */}
      {!introDone && <IntroSplash onComplete={handleIntroComplete} fast={fastIntro} />}

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Floating sticky Shop button — appears after scrolling past hero */}
      <FloatingShopButton onClick={scrollToCollection} />

      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-[#050507] min-h-screen text-white font-sans overflow-clip selection:bg-[#800020] selection:text-white">
        
        {/* GLOBAL PREMIUM FILM GRAIN NOISE */}
        <div className="bg-noise" />

        {/* FIXED BACKGROUND MEDIA LAYER */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">
          
          <video 
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="bg-stars absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/hero-4k_softbr_20260805.mp4" type="video/mp4" />
          </video>

          {/* Ambient audio for hero video */}
          <audio ref={audioRef} loop preload="none">
            <source src="/ambient.mp3" type="audio/mpeg" />
          </audio>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-30 pointer-events-none" />
        </div>

        {/* NAVIGATION */}
        <nav className={`sticky top-0 flex items-center justify-between px-6 sm:px-12 md:px-20 py-4 sm:py-6 overflow-hidden pointer-events-auto text-white z-[100] transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#800020] to-transparent animate-burgundy-sweep opacity-70" />
          <button 
            onClick={() => setShowBrand(true)} 
            className="hidden md:block flex-1 text-left text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-semibold uppercase hover:text-[#800020] transition-all duration-300 cursor-pointer text-white/70 nav-link"
          >
            <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#800020] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">
              Heritage
            </span>
          </button>

          <div className="flex-1 flex justify-center">
            <img 
              src="/logo-mark.png" 
              alt="Meridian" 
              className="h-10 sm:h-12 lg:h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(201,169,110,0.3)] hover:scale-105 transition-transform duration-500 cursor-pointer logo-entrance" 
            />
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={scrollToCollection}
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#C9A96E]/60 text-[10px] tracking-[0.25em] font-bold uppercase text-[#C9A96E] hover:bg-[#C9A96E] hover:text-black hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] transition-all duration-300 cursor-pointer nav-link"
            >
              Shop
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Mobile: Hamburger */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-[5px] cursor-pointer p-3 min-w-[44px] min-h-[44px]"
            aria-label="Open menu"
          >
            <span className="block w-6 h-[1.5px] bg-white/80" />
            <span className="block w-6 h-[1.5px] bg-white/80" />
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
                className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1">
                  <line x1="2" y1="2" x2="18" y2="18" />
                  <line x1="18" y1="2" x2="2" y2="18" />
                </svg>
              </button>

              <div className="flex flex-col items-center gap-10">
                <button 
                  onClick={() => { scrollToCollection(); setMenuOpen(false); }}
                  className="px-10 py-3.5 rounded-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] text-black text-sm tracking-[0.3em] font-bold uppercase cursor-pointer shadow-[0_0_40px_rgba(201,169,110,0.35)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Shop
                </button>
                <button 
                  onClick={() => { setShowBrand(true); setMenuOpen(false); }}
                  className="text-2xl tracking-[0.15em] uppercase text-white/80 hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
                >
                  Heritage
                </button>
                <button 
                  onClick={() => {
                    const grid = document.getElementById('watch-collection-grid');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setMenuOpen(false);
                  }}
                  className="text-2xl tracking-[0.15em] uppercase text-white/80 hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer font-light py-3 min-h-[44px] flex items-center"
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
        <div className="relative z-[100] w-full pointer-events-none">

          {/* HERO — 3D Tilt-Shift Parallax & Gemini Iridescent Typography */}
          <section 
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="hero-spacer relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto bg-black text-white"
            style={{ perspective: "1000px" }}
          >
            {/* Background media wrapper — clips only video + overlays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-80 scale-[1.05] md:object-center object-[center_30%]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
              >
                <source src="/hero-4k_softbr_20260805.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 burgundy-wave opacity-30 mix-blend-color-dodge pointer-events-none max-md:opacity-0" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
              {/* Film grain overlay for cinematic texture */}
              <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMCIgLz48L3N2Zz4=')] bg-repeat bg-[length:128px_128px] block md:hidden" />
              {/* Cinematic letterbox bars on mobile */}
              <div className="absolute top-0 left-0 w-full h-[8vh] bg-black z-20 pointer-events-none block md:hidden" />
              <div className="absolute bottom-0 left-0 w-full h-[8vh] bg-black z-20 pointer-events-none block md:hidden" />
            </div>

            <div 
              className="hero-content relative z-10 flex flex-col items-center text-center pointer-events-auto px-4 space-y-3"
              style={{
                transform: `rotateX(${heroTilt.y}deg) rotateY(${heroTilt.x}deg) translateZ(40px)`
              }}
            >
              <h1 
                className="hero-title text-[13vw] sm:text-7xl md:text-[7.5rem] lg:text-[9.5rem] font-normal tracking-[0.1em] leading-none uppercase select-none" 
                style={{ fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 1 }}
              >
                {"MERIDIAN".split('').map((c, i) => (
                  <span key={i} className="hero-char" style={{ display: 'inline-block' }}>{c}</span>
                ))}
              </h1>

              {/* Gemini Iridescent Accent Hairline */}
              <div className="accent-line-hero w-0 h-[1.5px] bg-gradient-to-r from-[#800020] via-[#A52A2A] to-[#C95A5A] rounded-full opacity-0" style={{ transition: 'none' }} />

              <button
                onClick={scrollToCollection}
                className="shop-cta-hero group relative overflow-hidden px-8 py-4 mt-6 rounded-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] text-black text-[11px] sm:text-xs tracking-[0.3em] uppercase font-bold cursor-pointer transition-all duration-500 hover:scale-[1.04] active:scale-[0.97] shadow-[0_0_40px_rgba(201,169,110,0.35)] hover:shadow-[0_0_60px_rgba(201,169,110,0.55)] opacity-0"
                style={{ opacity: 0 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Shop the Collection
                  <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>

              {/* Price hook — visible immediately under hero CTA */}
              <p className="shop-cta-hero text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-white/50 uppercase mt-3 opacity-0" style={{ opacity: 0 }}>
                From <span className="text-[#C9A96E] font-bold">$44.99</span> · 256-Bit Encrypted
              </p>
            </div>

            {/* Scroll Indicator with Gemini Gradient Line */}
            <div className="scroll-indicator-hero absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-0 z-20">
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white/70 font-bold">SCROLL</span>
              <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#800020] to-transparent" />
            </div>

            {/* Sound toggle — glassmorphism */}
            <button 
              onClick={toggleSound}
              className="absolute bottom-8 right-6 sm:right-10 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-2xl bg-white/5 border border-white/20 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E]/50 hover:scale-105 active:scale-95 transition-all duration-500 pointer-events-auto z-[60] cursor-pointer shadow-xl shadow-black/30 text-white"
              aria-label={soundOn ? "Mute sound" : "Play sound"}
            >
              {soundOn ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.4" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </section>

          {/* MANIFESTO — QUICK PUNCHY HOOK */}
          <section ref={manifestoRef} className="manifesto-spacer relative w-full py-16 sm:py-20 flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-white text-black">
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 text-center">
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#800020] uppercase block mb-4 font-bold">
                BEYOND DISPOSABLE TECH
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] font-sans flex flex-wrap justify-center gap-x-[0.25em] gap-y-1">
                {[
                  { text: 'A', highlight: false },
                  { text: 'smartwatch', highlight: false },
                  { text: 'tells', highlight: false },
                  { text: 'time.', highlight: false },
                  { text: 'A', highlight: false },
                  { text: 'Meridian', highlight: true },
                  { text: 'tells', highlight: true },
                  { text: 'your', highlight: true },
                  { text: 'story.', highlight: true }
                ].map((word, i) => (
                  <span key={i} className={`manifesto-word inline-block ${word.highlight ? 'font-extrabold text-[#800020]' : 'font-light text-black'}`}>
                    {word.text}
                  </span>
                ))}
              </h2>
            </div>
          </section>

          {/* STANDARD REMOVED — now shows after products */}

          {/* 100% EXACT ROLEX PINNED 3D CENTERPIECE ZOOM ENGINE */}
          <RolexHeroPin watch={WATCHES[0]} onSelectWatch={setSelectedWatch} />
        </div>

        {/* ============================================ */}
        {/* PRODUCTS — CHOOSE YOUR LEGACY               */}
        {/* ============================================ */}
        <CollectionShowcase onSelectWatch={setSelectedWatch} />
        <Suspense fallback={null}>
          <ProductOverlay watch={selectedWatch} onClose={() => setSelectedWatch(null)} />
        </Suspense>

        {/* ============================================ */}
        {/* BRAND STORY — for those who scroll further  */}
        {/* ============================================ */}

        <Suspense fallback={null}>
          <InstagramFeed />
          <HorologySpecsCounter />
          <BrandFilm />
          
          {/* CINEMA TAKEOVER 2: PEAKY BLINDERS SHELBY BROTHERS (FULL UNUNCUT SCENE) */}
          <CinemaIntermission 
            videoSrc="/peaky_extended_full_44s_softbr_20260805.mp4" 
            title='"Power doesn’t ask for permission. It counts every second."' 
          />

          {/* CINEMA TAKEOVER 3: THE DARK KNIGHT */}
          <CinemaIntermission 
            videoSrc="/dark-knight_softbr_20260805.mp4" 
            title='"0.001s for glory. Still late for your 9 AM."' 
          />
        </Suspense>



        {/* LUXURY COMPLIANCE FOOTER */}
        <footer className="site-footer w-full bg-[#050507] border-t border-white/10 py-12 px-6 text-center text-white/50 z-20 relative pointer-events-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#800020] uppercase block mb-1">
                MERIDIAN HOROLOGY © 2026
              </span>
              <p className="text-[11px] font-mono text-white/40">
                ALL RIGHTS RESERVED // WHITE GLOVE INSURED DELIVERY
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono tracking-widest uppercase relative z-[100] pointer-events-auto">
              <button onClick={() => setActivePolicy('terms')} className="hover:text-white transition-colors cursor-pointer relative z-[100] pointer-events-auto py-3 px-2 min-h-[44px] flex items-center">Terms</button>
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-white transition-colors cursor-pointer relative z-[100] pointer-events-auto py-3 px-2 min-h-[44px] flex items-center">Privacy</button>
              <button onClick={() => setActivePolicy('refund')} className="hover:text-white transition-colors cursor-pointer relative z-[100] pointer-events-auto py-3 px-2 min-h-[44px] flex items-center">Refund & Cancellation</button>
              <button onClick={() => setActivePolicy('shipping')} className="hover:text-white transition-colors cursor-pointer relative z-[100] pointer-events-auto py-3 px-2 min-h-[44px] flex items-center">Shipping</button>
              <button onClick={() => setActivePolicy('contact')} className="hover:text-white transition-colors cursor-pointer relative z-[100] pointer-events-auto py-3 px-2 min-h-[44px] flex items-center">Contact</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating UI — above everything */}
      <AnnouncementBar />
      <WhatsAppButton />
      {!isLow && <GoldStarDustCursor />}
      <ScrollToTop />

      {/* Brand Story Overlay */}
      {showBrand && <Suspense fallback={null}><BrandStory onClose={() => setShowBrand(false)} /></Suspense>}

      {/* Official Policy Overlay Modal */}
      {activePolicy && <Suspense fallback={null}><PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} /></Suspense>}
    </>
  );
}
