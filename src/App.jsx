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

gsap.registerPlugin(ScrollTrigger);

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
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // ============================================================
      // 1. HERO — entrance animation + scroll parallax
      // ============================================================
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.fromTo(".hero-tagline", 
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      heroTl.fromTo(".hero-title", 
        { autoAlpha: 0, y: 40, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" },
        "-=0.8"
      );
      heroTl.fromTo(".hero-explore", 
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Hero parallax on scroll
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: "-30%",
        opacity: 0,
        scale: 0.9,
        ease: "none"
      });

      // Hero explore indicator fades out
      gsap.to(".hero-explore", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "30% top",
          scrub: true,
        },
        opacity: 0,
        y: -30,
        ease: "none"
      });

      // ============================================================
      // 2. CROSSFADE: Stars → Liquid Video
      // ============================================================
      const crossfadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".manifesto-spacer",
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });
      crossfadeTl.to(".bg-liquid", { opacity: 0.8, duration: 1, ease: "none" });

      // ============================================================
      // 3. MANIFESTO — staggered reveal with scale
      // ============================================================
      const manifestoTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".manifesto-spacer",
          start: "top 50%",
          end: "bottom bottom",
          scrub: 0.5,
        }
      });

      const manifestoLines = gsap.utils.toArray(".manifesto-line");

      // Each line: fade in + slight rise + subtle scale from 0.96
      manifestoTl.fromTo(manifestoLines[0], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 0);

      manifestoTl.fromTo(manifestoLines[1], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 0.4);

      manifestoTl.fromTo(manifestoLines[2], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 0.8);

      // All lines exit with stagger + slight rise
      manifestoTl.to(manifestoLines, { 
        autoAlpha: 0, y: -30, duration: 1, stagger: 0.15, ease: "power2.in" 
      });
      manifestoTl.to(".manifesto-video", { autoAlpha: 1, duration: 0.5 }, "<");

      // ============================================================
      // 4. PORSCHE — staggered reveal with depth
      // ============================================================
      const porscheTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".porsche-spacer",
          start: "top 10%",
          end: "bottom bottom",
          scrub: 0.5,
        }
      });

      const porscheLines = gsap.utils.toArray(".porsche-line");

      porscheTl.to(".bg-porsche", { autoAlpha: 1, duration: 1, ease: "none" }, 0)
               .to(".bg-liquid", { autoAlpha: 0, duration: 1, ease: "none" }, 0);

      porscheTl.fromTo(porscheLines[0], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 2, ease: "power2.out" }, 0.5);

      porscheTl.fromTo(porscheLines[1], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.8, ease: "power2.out" }, 1.5);

      porscheTl.fromTo(porscheLines[2], 
        { autoAlpha: 0, y: 50, scale: 0.96 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 2.5);

      porscheTl.to(".video-dimmer", { autoAlpha: 0.7, duration: 1.5 }, 0.5);

      porscheTl.to(porscheLines, { 
        autoAlpha: 0, y: -30, duration: 1, stagger: 0.15, ease: "power2.in" 
      }, 6);
      porscheTl.to(".video-dimmer", { autoAlpha: 0, duration: 1 }, 6);

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

      <div ref={mainRef} className="w-full bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black">
        
        {/* FIXED BACKGROUND MEDIA LAYER */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">
          
          <video 
            autoPlay loop muted playsInline preload="auto" fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.3) translateZ(0)', willChange: 'transform' }}
          >
            <source src="/stars.mp4" type="video/mp4" />
          </video>

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

          {/* HERO */}
          <section className="hero-spacer relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
            <div className="hero-content flex flex-col items-center text-center mt-12 pointer-events-auto px-4">
              <h2 className="hero-tagline text-[10px] sm:text-[11px] font-light tracking-[0.4em] uppercase text-white/40 mb-6 sm:mb-10">
                Logic Defied
              </h2>
              <h1 
                className="hero-title text-[2.2rem] sm:text-6xl md:text-[6rem] lg:text-[8rem] font-light tracking-[-0.02em] leading-none gold-shimmer" 
              >
                Meridian
              </h1>
            </div>

            <div className="hero-explore absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto">
              <span className="text-[10px] font-light tracking-[0.3em] uppercase text-white/30 mb-4 group-hover:text-[#C9A96E] transition-colors duration-500">
                Explore
              </span>
              <div className="w-[1px] h-12 bg-white/15 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[#C9A96E] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
          </section>

          {/* MANIFESTO */}
          <section className="manifesto-spacer relative w-full h-[200vh] pointer-events-auto">
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6" style={{ perspective: "1000px" }}>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-light tracking-[-0.02em] text-white select-none w-full leading-tight">
                    Your smartwatch just told you to stand up.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-light tracking-[-0.02em] text-white select-none w-full leading-tight">
                    Congrats on hitting 10,000 steps.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="manifesto-line text-[1.4rem] sm:text-[1.8rem] md:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-light tracking-[-0.02em] text-white/60 select-none w-full leading-tight">
                    Too bad your wrist looks like a tiny iPad.
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* PORSCHE */}
          <section className="porsche-spacer relative w-full h-[200vh] pointer-events-auto">
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6">
                <div className="w-full">
                  <h2 className="porsche-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-light tracking-[-0.02em] text-white select-none w-full leading-tight">
                    You will inevitably perish.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-light tracking-[-0.02em] text-white select-none w-full leading-tight">
                    Your legacy will be forgotten.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 className="porsche-line text-[1.4rem] sm:text-[1.8rem] md:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-light tracking-[-0.02em] text-white/60 select-none w-full leading-tight">
                    But hey, at least your wrist looks expensive.
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
