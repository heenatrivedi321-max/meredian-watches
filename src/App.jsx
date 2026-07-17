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
    <div className="fixed top-[7vh] left-0 w-full h-[2px] z-[220] pointer-events-none" style={{ zIndex: 220 }}>
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
  const [soundOn, setSoundOn] = useState(false);
  const [currentAct, setCurrentAct] = useState(1);
  const heroVideoRef = useRef(null);
  const soundtrackRef = useRef(null);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  // ---- Sound toggle ----
  const toggleSound = useCallback(async () => {
    if (!soundtrackRef.current) {
      soundtrackRef.current = new SoundtrackEngine();
      await soundtrackRef.current.init();
    }
    if (soundOn) {
      soundtrackRef.current.mute();
      if (heroVideoRef.current) heroVideoRef.current.muted = true;
    } else {
      soundtrackRef.current.play();
      soundtrackRef.current.setProgress(getScrollProgress());
      if (heroVideoRef.current) heroVideoRef.current.muted = true; // video stays muted, sound from engine
    }
    setSoundOn(prev => !prev);
  }, [soundOn]);

  // ---- Scroll progress helper ----
  function getScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? scrollTop / docHeight : 0;
  }

  // ============================================================
  // GSAP ANIMATIONS
  // ============================================================
  useEffect(() => {
    let ctx = gsap.context(() => {

      // ---- SCROLL-SNAP: Pin each act section ----
      const acts = gsap.utils.toArray('.act-section');
      acts.forEach((act, i) => {
        ScrollTrigger.create({
          trigger: act,
          start: "top top",
          end: "bottom top",
          pin: i < acts.length - 1, // Don't pin the last section (collection)
          snap: i < acts.length - 1 ? { snapTo: 1, duration: { min: 0.3, max: 0.6 }, delay: 0, ease: "power2.inOut" } : false,
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
      // ACT I — THE VOID (Hero)
      // ============================================================
      // Entrance animation (after intro splash)
      const heroTl = gsap.timeline({ delay: 0.3 });
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

      // Hero exit on scroll — camera pushes forward through the scene
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".act-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: "-40%",
        opacity: 0,
        scale: 0.85,
        filter: "blur(8px)",
        ease: "none",
      });

      // Hero explore indicator
      gsap.to(".hero-explore", {
        scrollTrigger: {
          trigger: ".act-hero",
          start: "top top",
          end: "20% top",
          scrub: true,
        },
        opacity: 0,
        y: -40,
        ease: "none",
      });

      // ============================================================
      // VIDEO CROSSFADES — Stars → Liquid → Porsche
      // ============================================================
      const crossfadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-manifesto",
          start: "top 80%",
          end: "top 10%",
          scrub: true,
        }
      });
      crossfadeTl.to(".bg-liquid", { opacity: 0.85, duration: 1, ease: "none" });

      const crossfade2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-porsche",
          start: "top 80%",
          end: "top 10%",
          scrub: true,
        }
      });
      crossfade2Tl.to(".bg-porsche", { opacity: 1, duration: 1, ease: "none" })
                   .to(".bg-liquid", { opacity: 0, duration: 1, ease: "none" }, 0);

      // ============================================================
      // ACT II — THE RECKONING (Manifesto)
      // ============================================================
      const manifestoTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-manifesto",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      const manifestoLines = gsap.utils.toArray(".manifesto-line");

      // Line 1 — enters from below with scale
      manifestoTl.fromTo(manifestoLines[0],
        { autoAlpha: 0, y: 80, scale: 0.94, rotateX: 6 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 2, ease: "power3.out" }, 0);

      // Line 2 — enters after line 1
      manifestoTl.fromTo(manifestoLines[1],
        { autoAlpha: 0, y: 80, scale: 0.94, rotateX: 6 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 2, ease: "power3.out" }, 0.8);

      // Line 3 — enters last, slightly different style
      manifestoTl.fromTo(manifestoLines[2],
        { autoAlpha: 0, y: 60, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.8, ease: "power2.out" }, 1.6);

      // All lines exit — fade + rise + blur
      manifestoTl.to(manifestoLines, {
        autoAlpha: 0, y: -40, filter: "blur(6px)",
        duration: 1, stagger: 0.1, ease: "power2.in"
      }, 3);

      // Video becomes visible as text exits
      manifestoTl.to(".manifesto-video", { autoAlpha: 1, duration: 0.8 }, 3.2);

      // ============================================================
      // ACT III — THE STATEMENT (Porsche)
      // ============================================================
      const porscheTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-porsche",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      const porscheLines = gsap.utils.toArray(".porsche-line");

      // Dimmer for text legibility
      porscheTl.to(".video-dimmer", { opacity: 0.65, duration: 1 }, 0);

      // Line 1 — enters from deep z-space (coming at you)
      porscheTl.fromTo(porscheLines[0],
        { autoAlpha: 0, y: 100, scale: 0.8, rotateX: 12 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 2.5, ease: "power3.out" }, 0.5);

      // Line 2
      porscheTl.fromTo(porscheLines[1],
        { autoAlpha: 0, y: 100, scale: 0.8, rotateX: 12 },
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 2.5, ease: "power3.out" }, 2);

      // Line 3 — the punchline, different entrance
      porscheTl.fromTo(porscheLines[2],
        { autoAlpha: 0, y: 60, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 2, ease: "power2.out" }, 3.5);

      // Everything exits with camera shake feel
      porscheTl.to(porscheLines, {
        autoAlpha: 0, y: -50, filter: "blur(10px)", scale: 1.1,
        duration: 1.2, stagger: 0.08, ease: "power2.in"
      }, 6);
      porscheTl.to(".video-dimmer", { opacity: 0, duration: 1 }, 6);

      // ============================================================
      // ACT IV — THE REVEAL (Iris wipe into collection intro)
      // ============================================================
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-reveal",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Iris wipe open
      revealTl.fromTo(".iris-circle",
        { attr: { r: 0 } },
        { attr: { r: 75 }, duration: 2, ease: "power2.inOut" }, 0);

      // Text enters
      revealTl.fromTo(".reveal-title",
        { autoAlpha: 0, scale: 0.9, y: 30 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out" }, 0.5);

      revealTl.fromTo(".reveal-subtitle",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 1.2);

      // Exit
      revealTl.to([".reveal-title", ".reveal-subtitle"],
        { autoAlpha: 0, y: -30, duration: 1, ease: "power2.in" }, 3);

      // ============================================================
      // COLLECTION ENTRANCE — cinematic reveal
      // ============================================================
      gsap.fromTo(".collection-wrapper",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out",
          scrollTrigger: {
            trigger: ".collection-wrapper",
            start: "top 90%",
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

      {/* Cinematic Overlay — letterbox, grain, vignette, scene counter, dots */}
      <CinematicOverlay currentAct={currentAct} totalActs={5} />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black">

        {/* ============================================================
            FIXED BACKGROUND MEDIA LAYER
            ============================================================ */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">

          {/* ACT I BG — Hero video (stars) */}
          <video
            ref={heroVideoRef}
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/stars.mp4" type="video/mp4" />
          </video>

          {/* ACT II BG — Liquid explosion */}
          <video
            autoPlay loop muted playsInline preload="none"
            className="manifesto-video bg-liquid absolute inset-0 w-full h-full object-cover z-10"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Watch_rotating_in_liquid_explosion_202607141039.mp4?v=4" type="video/mp4" />
          </video>

          {/* ACT III BG — Porsche tunnel */}
          <video
            autoPlay loop muted playsInline preload="none"
            className="bg-porsche absolute inset-0 w-full h-full object-cover z-20"
            style={{ opacity: 0, transform: 'scale(1.3) translateZ(0)', willChange: 'transform, opacity' }}
          >
            <source src="/Porsche_driving_through_tunnel_202606281316.mp4?v=4" type="video/mp4" />
          </video>

          {/* Dimmer for text legibility */}
          <div className="video-dimmer absolute inset-0 bg-black z-25 pointer-events-none" style={{ opacity: 0 }} />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-30 pointer-events-none" />
        </div>

        {/* ============================================================
            NAVIGATION
            ============================================================ */}
        <nav className="fixed top-[7vh] left-0 w-full h-14 sm:h-16 lg:h-20 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 pointer-events-auto mix-blend-difference" style={{ zIndex: 230 }}>
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
            MOBILE MENU OVERLAY — Cinematic full-screen
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
            5-ACT CINEMATIC CONTENT
            ============================================================ */}
        <div className="relative z-50 w-full pointer-events-none">

          {/* ---- ACT I: THE VOID (Hero) ---- */}
          <section className="act-section act-hero relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
            <div className="hero-content flex flex-col items-center text-center mt-12 pointer-events-auto px-4" style={{ perspective: '1200px' }}>
              <p className="hero-tagline cinema-subtitle mb-6 sm:mb-10">
                Logic Defied
              </p>
              <h1 className="hero-title cinema-title text-[3rem] sm:text-7xl md:text-[7rem] lg:text-[10rem] gold-shimmer"
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

            <div className="hero-explore absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto">
              <span className="text-[9px] font-light tracking-[0.4em] uppercase text-white/25 mb-4 group-hover:text-[#C9A96E] transition-colors duration-500">
                Scroll to Enter
              </span>
              <div className="w-[1px] h-14 bg-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[#C9A96E] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </div>
            </div>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="absolute bottom-[10vh] right-6 sm:right-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 backdrop-blur-sm hover:border-[#C9A96E]/40 transition-all duration-300 pointer-events-auto z-[240] cursor-pointer group"
              style={{ zIndex: 240 }}
              aria-label={soundOn ? "Mute soundtrack" : "Play soundtrack"}
            >
              {soundOn ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A96E]">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 group-hover:text-white/50">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.15" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </section>

          {/* ---- ACT II: THE RECKONING (Manifesto) ---- */}
          <section className="act-section act-manifesto relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center">
              <div className="w-full">
                <h2 className="manifesto-line cinema-title text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] text-white select-none w-full leading-tight">
                  Your smartwatch just told you to stand up.
                </h2>
              </div>
              <div className="w-full mt-2">
                <h2 className="manifesto-line cinema-title text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] text-white select-none w-full leading-tight">
                  Congrats on hitting 10,000 steps.
                </h2>
              </div>
              <div className="w-full mt-2">
                <h2 className="manifesto-line cinema-title text-[1.3rem] sm:text-[1.7rem] md:text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] text-white/50 select-none w-full leading-tight">
                  Too bad your wrist looks like a tiny iPad.
                </h2>
              </div>
            </div>
          </section>

          {/* ---- ACT III: THE STATEMENT (Porsche) ---- */}
          <section className="act-section act-porsche relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center">
              <div className="w-full">
                <h2 className="porsche-line cinema-title text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] text-white select-none w-full leading-tight">
                  You will inevitably perish.
                </h2>
              </div>
              <div className="w-full mt-2">
                <h2 className="porsche-line cinema-title text-[1.5rem] sm:text-[2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] text-white select-none w-full leading-tight">
                  Your legacy will be forgotten.
                </h2>
              </div>
              <div className="w-full mt-2">
                <h2 className="porsche-line cinema-title text-[1.3rem] sm:text-[1.7rem] md:text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] text-white/50 select-none w-full leading-tight">
                  But hey, at least your wrist looks expensive.
                </h2>
              </div>
            </div>
          </section>

          {/* ---- ACT IV: THE REVEAL (Transition) ---- */}
          <section className="act-section act-reveal relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-black">
            {/* Iris wipe SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
              <defs>
                <mask id="iris-mask">
                  <rect width="100" height="100" fill="white" />
                  <circle className="iris-circle" cx="50" cy="50" r="0" fill="black" />
                </mask>
              </defs>
              <rect width="100" height="100" fill="black" mask="url(#iris-mask)" />
            </svg>

            {/* Watch gears video inside the iris */}
            <video
              autoPlay loop muted playsInline preload="none"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              style={{ mask: 'url(#iris-mask)', WebkitMask: 'url(#iris-mask)' }}
            >
              <source src="/Watch_gears_Clean.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 text-center">
              <h2 className="reveal-title cinema-title text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl gold-shimmer">
                The Collection
              </h2>
              <p className="reveal-subtitle cinema-subtitle mt-6 sm:mt-8">
                Eight pieces. Zero apologies.
              </p>
            </div>
          </section>

          {/* ---- ACT V: PRODUCTS (Normal scroll) ---- */}
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
