import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLFluid from 'webgl-fluid';
import CollectionShowcase from './components/CollectionShowcase';
import ProductOverlay from './components/ProductOverlay';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import BrandStory from './components/BrandStory';
import ProductSchema from './components/ProductSchema';
import InstagramFeed from './components/InstagramFeed';
import IntroSplash from './components/IntroSplash';

gsap.registerPlugin(ScrollTrigger);

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

    // Hide fluid when scrolling past hero
    gsap.to(containerRef.current, {
      autoAlpha: 0,
      scrollTrigger: {
        trigger: ".hero-spacer",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none opacity-60" 
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
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl.fromTo(".hero-title",
        { autoAlpha: 0, y: 30, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.8, ease: "power3.out" }
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
      // 2. MANIFESTO — typewriter reveal, compressed to 120vh
      // ============================================================
      // Crossfade: Stars → Liquid Video
      const crossfadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".manifesto-spacer",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        }
      });
      crossfadeTl.to(".bg-liquid", { opacity: 0.9, duration: 1, ease: "none" });

      // Typewriter reveal for each manifesto line
      const manifestoLines = gsap.utils.toArray(".manifesto-line");
      manifestoLines.forEach((line, i) => {
        const chars = line.querySelectorAll(".char");
        if (chars.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".manifesto-spacer",
            start: `top ${60 - i * 15}%`,
            end: `top ${30 - i * 15}%`,
            scrub: 0.5,
          }
        });

        // Reveal characters one by one
        tl.fromTo(chars,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.02, stagger: 0.01, ease: "none" }
        );

        // Hold, then fade entire line up and out
        tl.to(line, {
          autoAlpha: 0,
          y: -40,
          duration: 0.3,
          ease: "power2.in"
        }, "+=0.3");
      });

      // Show liquid video when manifesto ends
      gsap.to(".manifesto-video", {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: ".manifesto-spacer",
          start: "bottom 60%",
          end: "bottom 20%",
          scrub: true,
        }
      });

      // ============================================================
      // 3. PORSCHE — typewriter reveal, compressed to 120vh
      // ============================================================
      const porscheTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".porsche-spacer",
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        }
      });
      porscheTl.to(".bg-porsche", { autoAlpha: 1, duration: 1, ease: "none" }, 0);
      porscheTl.to(".bg-liquid", { autoAlpha: 0, duration: 1, ease: "none" }, 0);

      // Typewriter for porsche lines
      const porscheLines = gsap.utils.toArray(".porsche-line");
      porscheLines.forEach((line, i) => {
        const chars = line.querySelectorAll(".char");
        if (chars.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".porsche-spacer",
            start: `top ${60 - i * 15}%`,
            end: `top ${30 - i * 15}%`,
            scrub: 0.5,
          }
        });

        tl.fromTo(chars,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.02, stagger: 0.01, ease: "none" }
        );

        tl.to(line, {
          autoAlpha: 0,
          y: -40,
          duration: 0.3,
          ease: "power2.in"
        }, "+=0.3");
      });

      // Dimmer for porsche section
      gsap.to(".video-dimmer", {
        autoAlpha: 0.7,
        scrollTrigger: {
          trigger: ".porsche-spacer",
          start: "top 60%",
          end: "top 20%",
          scrub: true,
        }
      });
      gsap.to(".video-dimmer", {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: ".porsche-spacer",
          start: "bottom 60%",
          end: "bottom 20%",
          scrub: true,
        }
      });

      // ============================================================
      // 4. PRODUCTS — circular clip-path reveal
      // ============================================================
      gsap.fromTo(".product-reveal",
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(100% at 50% 50%)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-reveal",
            start: "top 85%",
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

      {/* Global WebGL Fluid Background */}
      {introDone && <FluidBackground />}

      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black">
        
        {/* FIXED BACKGROUND MEDIA LAYER */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">
          
          <video 
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="bg-stars absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/stars.mp4" type="video/mp4" />
          </video>

          {/* Ambient audio for hero video */}
          <audio ref={audioRef} loop preload="auto">
            <source src="/ambient.mp3" type="audio/mpeg" />
          </audio>

          <video 
            autoPlay loop muted playsInline preload="none"
            className="manifesto-video bg-liquid absolute inset-0 w-full h-full object-cover z-10"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Watch_rotating_in_liquid_explosion_202607141039.mp4?v=3" type="video/mp4" />
          </video>

          <video 
            autoPlay loop muted playsInline preload="none"
            className="bg-porsche absolute inset-0 w-full h-full object-cover z-20"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Porsche_driving_through_tunnel_202606281316.mp4?v=3" type="video/mp4" />
          </video>

          <div className="video-dimmer absolute inset-0 bg-black z-25 pointer-events-none" style={{ opacity: 0 }} />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-30 pointer-events-none" />
        </div>

        {/* NAVIGATION */}
        <nav className="fixed top-0 left-0 w-full h-16 sm:h-20 lg:h-24 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 pointer-events-auto mix-blend-difference">
          <button 
            onClick={() => setShowBrand(true)} 
            className="hidden md:block flex-1 text-left text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-light uppercase hover:opacity-50 transition-opacity cursor-pointer"
          >
            Heritage
          </button>

          <div className="flex-1 flex justify-center">
            <img src="/logo.jpg" alt="Meridian Logo" className="h-10 sm:h-14 lg:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(201,169,110,0.4)] hover:scale-105 transition-transform cursor-pointer" />
          </div>

          <div 
            onClick={() => {
              const grid = document.querySelector('.max-w-screen-2xl');
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

          {/* HERO — clean: just title on video */}
          <section className="hero-spacer relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
            <div className="hero-content flex flex-col items-center text-center pointer-events-auto px-4">
              <h1 
                className="hero-title text-[3rem] sm:text-7xl md:text-[7rem] lg:text-[9rem] font-extralight tracking-[-0.03em] leading-none text-white" 
              >
                Meridian
              </h1>
            </div>

            {/* Sound toggle — minimal */}
            <button 
              onClick={toggleSound}
              className="absolute bottom-8 right-6 sm:right-10 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 transition-all duration-300 pointer-events-auto z-[60] cursor-pointer"
              aria-label={soundOn ? "Mute sound" : "Play sound"}
            >
              {soundOn ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.2" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </section>

          {/* MANIFESTO — compressed, typewriter reveal */}
          <section className="manifesto-spacer relative w-full h-[120vh] pointer-events-auto">
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8" style={{ perspective: "1000px" }}>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                    <SplitChars text="Your smartwatch just told you to stand up." />
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                    <SplitChars text="Congrats on hitting 10,000 steps." />
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-extralight tracking-[-0.02em] text-white/50 select-none w-full leading-tight">
                    <SplitChars text="Too bad your wrist looks like a tiny iPad." />
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* PORSCHE — compressed, typewriter reveal */}
          <section className="porsche-spacer relative w-full h-[120vh] pointer-events-auto">
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="w-full">
                  <h2 className="porsche-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                    <SplitChars text="You will inevitably perish." />
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.8rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extralight tracking-[-0.02em] text-white select-none w-full leading-tight">
                    <SplitChars text="Your legacy will be forgotten." />
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-extralight tracking-[-0.02em] text-white/50 select-none w-full leading-tight">
                    <SplitChars text="But hey, at least your wrist looks expensive." />
                  </h2>
                </div>
              </div>
            </div>
          </section>

        </div>

        <InstagramFeed />
        <CollectionShowcase onSelectWatch={setSelectedWatch} />
        <ProductOverlay watch={selectedWatch} onClose={() => setSelectedWatch(null)} />
      </div>

      {/* Floating UI — above everything */}
      <WhatsAppButton />
      <ScrollToTop />

      {/* Brand Story Overlay */}
      {showBrand && <BrandStory onClose={() => setShowBrand(false)} />}
    </>
  );
}
