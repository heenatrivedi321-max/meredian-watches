import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GlobalCSS = () => (
  <style>
    {`
      @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .rainbow-text {
        background: linear-gradient(270deg, #ff0055, #a200ff, #00eeff, #ff0055);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 4s ease infinite;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}
  </style>
);

export default function MeridianEngine() {
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  
  // Section Refs
  const preloaderRef = useRef(null);
  const spitfireRef = useRef(null);
  const rainbowRef = useRef(null);
  const porscheRef = useRef(null);
  const diveRef = useRef(null);
  const cyberRef = useRef(null);

  useEffect(() => {
    try {
      let ctx = gsap.context(() => {
        
        // 1. Preloader Zoom
        gsap.to(".meridian-text", {
          scrollTrigger: {
            trigger: preloaderRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
          },
          scale: 150, // Massive scale to fly through the letter
          opacity: 0,
          duration: 1,
          ease: "power2.in"
        });

        // 2. Spitfire Dive
        const spitfireTl = gsap.timeline({
          scrollTrigger: {
            trigger: spitfireRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
          }
        });
        spitfireTl.fromTo(".spitfire-video", { scale: 1 }, { scale: 3, filter: "blur(20px)", duration: 1 });

        // 3. Rainbow Dimension & Watch 1
        const rainbowTl = gsap.timeline({
          scrollTrigger: {
            trigger: rainbowRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
          }
        });
        rainbowTl.fromTo(".rainbow-watch", { y: -1000, rotation: -90, scale: 0.5 }, { y: 0, rotation: 0, scale: 1, duration: 1, ease: "bounce.out" }, 0)
                 .fromTo(".rainbow-title", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.5);

        // 4. Porsche Warp & Watch 2
        const porscheTl = gsap.timeline({
          scrollTrigger: {
            trigger: porscheRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
          }
        });
        porscheTl.fromTo(".porsche-video", { scale: 3, opacity: 0 }, { scale: 1, opacity: 0.8, duration: 1 }, 0)
                 .fromTo(".porsche-watch", { x: 1000, rotation: 360 }, { x: 0, rotation: 0, duration: 1, ease: "power3.out" }, 0.5);

        // 5. Deep Dive & Watch 3
        const diveTl = gsap.timeline({
          scrollTrigger: {
            trigger: diveRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
          }
        });
        diveTl.fromTo(".dive-video", { y: "-100%" }, { y: "0%", duration: 1 }, 0)
              .fromTo(".dive-watch", { y: -800, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.5);

        // 6. Cyber City & Watch 4
        const cyberTl = gsap.timeline({
          scrollTrigger: {
            trigger: cyberRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
          }
        });
        cyberTl.fromTo(".cyber-video", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, 0)
               .fromTo(".cyber-watch", { scale: 5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }, 0.5)
               .fromTo(".cyber-text", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1);

      }, containerRef);
      return () => ctx.revert();
    } catch (err) {
      setError(err.toString());
    }
  }, []);

  if (error) {
    return <div className="absolute inset-0 z-50 bg-white text-red-500 p-10 text-2xl font-bold">ERROR: {error}</div>;
  }

  return (
    <div ref={containerRef} className="w-full bg-black text-white font-sans hide-scrollbar">
      <GlobalCSS />

      {/* 1. Preloader */}
      <section ref={preloaderRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
        <h1 className="meridian-text text-[15vw] font-black text-white tracking-tighter cursor-crosshair mix-blend-difference z-50">
          MERIDIAN
        </h1>
        {/* Subtle hint to scroll */}
        <div className="absolute bottom-10 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* 2. Spitfire Dive */}
      <section ref={spitfireRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="spitfire-video absolute top-0 left-0 w-full h-full object-cover opacity-80">
          <source src="/Spitfire_cockpit_flying_storm_cl…_202606281328.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 3. Rainbow Dimension & Watch 1 (Gold Skeleton) */}
      <section ref={rainbowRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="rainbow-title text-[8vw] font-black tracking-tighter leading-none mb-12 rainbow-text uppercase z-0 absolute top-[15%]">
            Gravity is Optional.
          </h1>
          <img 
            src="/watches-nobg/fossil-gold-me3280.png" 
            className="rainbow-watch w-[60vh] h-[60vh] object-contain drop-shadow-[0_0_80px_rgba(255,200,0,0.5)] z-10" 
            alt="Watch 1" 
          />
        </div>
      </section>

      {/* 4. Porsche Warp & Watch 2 (Hexa) */}
      <section ref={porscheRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="porsche-video absolute top-0 left-0 w-full h-full object-cover opacity-70">
          <source src="/Porsche_driving_through_tunnel_202606281316.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <img 
            src="/watches-nobg/hx_watch.png" 
            className="porsche-watch w-[70vh] h-[70vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] filter contrast-125" 
            alt="Watch 2" 
          />
        </div>
      </section>

      {/* 5. Deep Dive & Watch 3 (Fossil Brown) */}
      <section ref={diveRef} className="relative w-full h-screen bg-[#02050A] overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="dive-video absolute top-0 left-0 w-full h-full object-cover opacity-60">
          <source src="/Diving_bell_underwater_illuminat…_202606281332.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full z-0 pointer-events-none" />
          <img 
            src="/watches-nobg/fossil-brown-me3270.png" 
            className="dive-watch w-[60vh] h-[60vh] object-contain drop-shadow-[0_0_50px_rgba(0,255,255,0.4)] z-10" 
            alt="Watch 3" 
          />
        </div>
      </section>

      {/* 6. Cyber City & Watch 4 (Classic Leather) */}
      <section ref={cyberRef} className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
        <video autoPlay loop muted playsInline className="cyber-video absolute top-0 left-0 w-full h-full object-cover opacity-80">
          <source src="/Futuristic_bridge_cyber-city_spa…_202607081714.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img 
            src="/watches-nobg/tx_watch.png" 
            className="cyber-watch w-[60vh] h-[60vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] mb-8" 
            alt="Watch 4" 
          />
          <h1 className="cyber-text text-[6vw] font-black text-white tracking-tighter rainbow-text uppercase drop-shadow-2xl">
            Time is not.
          </h1>
        </div>
      </section>

    </div>
  );
}
