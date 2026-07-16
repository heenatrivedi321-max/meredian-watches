import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GlobalCSS = () => (
  <style>
    {`
      .serif-text {
        font-family: 'Playfair Display', serif;
      }
      .sans-text {
        font-family: 'Inter', sans-serif;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .rolex-green {
        color: #006039;
      }
      .bg-rolex-green {
        background-color: #006039;
      }
    `}
  </style>
);

export default function RolexEngine() {
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  
  // Section Refs
  const heroRef = useRef(null);
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);

  useEffect(() => {
    try {
      let ctx = gsap.context(() => {
        
        // 1. Hero Parallax
        gsap.to(".hero-video-container", {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          y: "30%",
          opacity: 0.2,
          ease: "none"
        });

        // 2. Slide 1: Porsche + Hexa (Horizontal wipe)
        const slide1Tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide1Ref.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          }
        });
        slide1Tl.fromTo(".slide1-video", { x: "-20%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1 })
                .fromTo(".slide1-content", { x: "20%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1 }, 0);

        // 3. Slide 2: Dive + Fossil Brown (Vertical fade)
        const slide2Tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide2Ref.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          }
        });
        slide2Tl.fromTo(".slide2-video", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 })
                .fromTo(".slide2-watch", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
                .fromTo(".slide2-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.4);

        // 4. Slide 3: Cyber + Olevs (Soft reveal)
        const slide3Tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide3Ref.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          }
        });
        slide3Tl.fromTo(".slide3-bg", { opacity: 0 }, { opacity: 1, duration: 1 })
                .fromTo(".slide3-watch", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0.2)
                .fromTo(".slide3-text", { opacity: 0 }, { opacity: 1, duration: 1 }, 0.5);

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
    <div ref={containerRef} className="w-full bg-[#f4f4f2] text-[#222] font-sans hide-scrollbar">
      <GlobalCSS />

      {/* Global Navigation - Quiet Luxury */}
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-[#f4f4f2]/90 backdrop-blur-md z-50 flex items-center justify-between px-8 md:px-16 border-b border-[#e0e0e0]">
        <div className="text-sm tracking-[0.2em] uppercase font-light">Menu</div>
        <div className="serif-text text-2xl tracking-widest font-bold">MERIDIAN</div>
        <div className="text-sm tracking-[0.2em] uppercase font-light">Boutiques</div>
      </nav>

      {/* 1. Heritage Opening (Spitfire) */}
      <section ref={heroRef} className="relative w-full h-[100vh] overflow-hidden bg-black flex items-center justify-center pt-[80px]">
        <div className="hero-video-container absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
            <source src="/Spitfire_cockpit_flying_storm_cl…_202606281328.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h2 className="sans-text text-white text-xs md:text-sm font-light tracking-[0.4em] mb-6 uppercase">Aviation Heritage</h2>
          <h1 className="serif-text text-white text-5xl md:text-7xl font-bold tracking-tight mb-8 drop-shadow-2xl">
            Mastery of the Skies
          </h1>
          <div className="w-[1px] h-[80px] bg-white/50 mt-8"></div>
        </div>
      </section>

      {/* 2. Slide 1: Hexa + Porsche */}
      <section ref={slide1Ref} className="relative w-full min-h-[90vh] bg-black text-white flex flex-col md:flex-row overflow-hidden">
        <div className="slide1-video w-full md:w-1/2 h-[50vh] md:h-[90vh] relative">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
            <source src="/Porsche_driving_through_tunnel_202606281316.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="slide1-content w-full md:w-1/2 h-[50vh] md:h-[90vh] flex flex-col items-center justify-center p-12 bg-[#111]">
          <img 
            src="/watches-nobg/hx_watch.png" 
            className="w-[300px] h-[300px] object-contain mb-12 drop-shadow-2xl" 
            alt="Hexa Chronograph" 
          />
          <h2 className="serif-text text-4xl font-bold mb-4">Hexa Chronograph</h2>
          <p className="sans-text text-gray-400 font-light mb-8 max-w-sm text-center text-sm leading-relaxed">
            Engineered for high-speed endurance. A testament to uncompromising performance on and off the track.
          </p>
          <div className="flex flex-col items-center">
            <span className="serif-text text-xl text-gray-300 mb-6">₹6,999</span>
            <button className="px-10 py-3 border border-white/30 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
              Discover
            </button>
          </div>
        </div>
      </section>

      {/* 3. Slide 2: Fossil Brown + Deep Dive */}
      <section ref={slide2Ref} className="relative w-full h-[100vh] bg-[#f4f4f2] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-[#e8e8e5]"></div>
          <div className="w-2/3 slide2-video relative">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-90">
              <source src="/Diving_bell_underwater_illuminat…_202606281332.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="slide2-text pr-12">
            <h3 className="sans-text text-xs font-bold tracking-[0.3em] text-[#006039] mb-4 uppercase">Submariner</h3>
            <h2 className="serif-text text-5xl font-bold text-[#222] mb-6 leading-tight">Fossil Brown<br/>Heritage</h2>
            <p className="sans-text text-[#555] font-light mb-10 max-w-sm text-sm leading-relaxed">
              Illuminated by the abyss. Crafted for the absolute extremes of pressure, maintaining perfect precision in the deep.
            </p>
            <div className="flex items-center space-x-8">
              <button className="px-10 py-3 bg-[#006039] text-white text-xs tracking-widest uppercase hover:bg-[#004d2e] transition-colors shadow-lg">
                Discover
              </button>
              <span className="serif-text text-xl text-[#222] font-semibold">₹3,420</span>
            </div>
          </div>
          
          <div className="slide2-watch flex justify-center">
            <img 
              src="/watches-nobg/fossil-brown-me3270.png" 
              className="w-[400px] h-[400px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]" 
              alt="Fossil Brown" 
            />
          </div>
        </div>
      </section>

      {/* 4. Slide 3: Olevs Diamond Blue + Cyber City */}
      <section ref={slide3Ref} className="relative w-full h-[90vh] bg-black text-white flex items-center justify-center overflow-hidden">
        <div className="slide3-bg absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src="/Futuristic_bridge_cyber-city_spa…_202607081714.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="slide3-watch mb-12 relative">
             <img 
              src="/61q5zGgUMkL._SX679_.jpg" 
              className="w-[350px] h-[350px] object-cover rounded-full drop-shadow-2xl border-4 border-[#333]" 
              alt="Olevs Diamond Blue" 
            />
          </div>
          
          <div className="slide3-text max-w-lg px-6">
            <h2 className="serif-text text-4xl font-bold mb-4">Olevs Diamond Blue</h2>
            <p className="sans-text text-gray-400 font-light mb-8 text-sm leading-relaxed">
              The future of classic watchmaking. A striking blue dial set with brilliant-cut diamonds.
            </p>
            <div className="flex flex-col items-center">
              <span className="serif-text text-xl text-white mb-6">₹3,420</span>
              <button className="px-10 py-3 border border-white/30 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full bg-[#111] text-white py-12 text-center text-xs tracking-widest font-light uppercase">
        © 2026 Meridian Watchmakers
      </footer>

    </div>
  );
}
