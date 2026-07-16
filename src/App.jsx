import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CollectionShowcase from './components/CollectionShowcase';
import ProductOverlay from './components/ProductOverlay';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import BrandStory from './components/BrandStory';
import ProductSchema from './components/ProductSchema';
import InstagramFeed from './components/InstagramFeed';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef(null);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Hero Text Parallax
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: "-50%",
        opacity: 0,
        ease: "none"
      });

      // 2. Crossfade: Stars -> Liquid Video
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
      // 3. MANIFESTO — pure opacity reveal, zero GPU cost
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

      manifestoTl.fromTo(manifestoLines[0], 
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 0);

      manifestoTl.fromTo(manifestoLines[1], 
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 0.4);

      manifestoTl.fromTo(manifestoLines[2], 
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 0.8);

      manifestoTl.to(manifestoLines, { autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power2.in" });
      manifestoTl.to(".manifesto-video", { autoAlpha: 1, duration: 0.5 }, "<");

      // ============================================================
      // 4. PORSCHE — pure opacity reveal, zero GPU cost
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
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, ease: "power2.out" }, 0.5);

      porscheTl.fromTo(porscheLines[1], 
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8, ease: "power2.out" }, 1.5);

      porscheTl.fromTo(porscheLines[2], 
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 2.5);

      porscheTl.to(".video-dimmer", { autoAlpha: 0.7, duration: 1.5 }, 0.5);

      porscheTl.to(porscheLines, { autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power2.in" }, 6);
      porscheTl.to(".video-dimmer", { autoAlpha: 0, duration: 1 }, 6);
                 
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Product Schema for SEO */}
      <ProductSchema watch={selectedWatch} />

      <div ref={mainRef} className="w-full bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
        
        {/* FIXED BACKGROUND MEDIA LAYER */}
        <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black overflow-hidden">
          
          <video 
            autoPlay loop muted playsInline preload="auto"
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

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-30 pointer-events-none" />
        </div>

        {/* NAVIGATION */}
        <nav className="fixed top-0 left-0 w-full h-16 sm:h-20 lg:h-24 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 pointer-events-auto mix-blend-difference">
          <button onClick={() => setShowBrand(true)} className="flex-1 text-left text-[9px] sm:text-[10px] tracking-[0.3em] font-light uppercase hover:opacity-50 transition-opacity cursor-pointer">Heritage</button>
          <div className="flex-1 flex justify-center">
            <img src="/logo.jpg" alt="Meridian Logo" className="h-10 sm:h-14 lg:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:scale-105 transition-transform cursor-pointer" />
          </div>
          <div 
            onClick={() => {
              const grid = document.querySelector('.max-w-screen-2xl');
              if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex-1 text-right text-[9px] sm:text-[10px] tracking-[0.3em] font-light uppercase hover:opacity-50 transition-opacity cursor-pointer"
          >
            Collection
          </div>
        </nav>

        {/* SCROLLING CONTENT LAYER */}
        <div className="relative z-50 w-full pointer-events-none">

          {/* HERO */}
          <section className="hero-spacer relative w-full h-screen flex flex-col items-center justify-center pointer-events-auto">
            <style>
              {`
                @keyframes shimmer {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .premium-shimmer {
                  background: linear-gradient(to right, #ffffff 10%, #cbb2ff 30%, #ffffff 50%, #cbb2ff 70%, #ffffff 90%);
                  background-size: 200% auto;
                  color: #000;
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  animation: shimmer 3s linear infinite;
                  filter: drop-shadow(0 0 40px rgba(203, 178, 255, 0.4));
                }
              `}
            </style>
            
            <div className="hero-content flex flex-col items-center text-center mt-12 pointer-events-auto px-4">
              <h2 className="text-[8px] sm:text-[9px] font-light tracking-[0.5em] uppercase text-white/70 mb-4 sm:mb-8">
                Logic Defied
              </h2>
              <h1 
                className="text-[3.5rem] sm:text-6xl md:text-[6rem] lg:text-[8rem] font-bold tracking-tighter leading-none drop-shadow-2xl premium-shimmer" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                MERIDIAN
              </h1>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto">
              <span className="text-[9px] font-light tracking-[0.3em] uppercase text-white/60 mb-4 group-hover:text-white transition-colors duration-500">
                Explore
              </span>
              <div className="w-[1px] h-12 bg-white/30 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
          </section>

          {/* MANIFESTO */}
          <section className="manifesto-spacer relative w-full h-[200vh] pointer-events-auto">
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6" style={{ perspective: "1000px" }}>
                <div className="w-full">
                  <h2 
                    className="manifesto-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-medium tracking-tighter text-white select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
                    Your smartwatch just told you to stand up.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 
                    className="manifesto-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-medium tracking-tighter text-white select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
                    Congrats on hitting 10,000 steps.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 
                    className="manifesto-line text-[1.4rem] sm:text-[1.8rem] md:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-medium tracking-tighter text-white/80 select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
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
                  <h2 
                    className="porsche-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-medium tracking-tighter text-white select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
                    You will inevitably perish.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 
                    className="porsche-line text-[1.6rem] sm:text-[2.2rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-medium tracking-tighter text-white select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
                    Your legacy will be forgotten.
                  </h2>
                </div>
                <div className="w-full">
                  <h2 
                    className="porsche-line text-[1.4rem] sm:text-[1.8rem] md:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-medium tracking-tighter text-white/80 select-none w-full leading-tight"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                  >
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
