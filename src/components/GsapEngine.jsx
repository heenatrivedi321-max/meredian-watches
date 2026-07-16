import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RainbowStyles = () => (
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

export default function GsapEngine() {
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const shatterTextRef = useRef(null);
  const flyingWatchRef = useRef(null);
  const porscheRef = useRef(null);
  const deepDiveRef = useRef(null);

  useEffect(() => {
    try {
      let ctx = gsap.context(() => {
      
      // 1. Hero Shatter & Zoom
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        }
      });
      
      heroTl.to(shatterTextRef.current, {
        scale: 5,
        opacity: 0,
        filter: "blur(30px)",
        rotation: 15,
        duration: 1
      }, 0)
      .to(".hero-gears", {
        scale: 3,
        opacity: 0,
        filter: "contrast(2) blur(10px)",
        duration: 1.5
      }, 0.5);

      // 2. Flying Watch Assembly (Transparent PNGs)
      const assemblyTl = gsap.timeline({
        scrollTrigger: {
          trigger: flyingWatchRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
        }
      });

      // Fly pieces in from completely off-screen
      gsap.set(".part-1", { x: -1000, y: -500, rotation: -90, scale: 0.1, opacity: 0 });
      gsap.set(".part-2", { x: 1000, y: 500, rotation: 180, scale: 0.5, opacity: 0 });
      gsap.set(".part-3", { y: -800, rotation: 45, scale: 2, opacity: 0 });
      gsap.set(".core-watch", { scale: 0, opacity: 0, rotation: -360 });

      // Smash them together
      assemblyTl.to(".core-watch", { scale: 1, opacity: 1, rotation: 0, duration: 2, ease: "elastic.out(1, 0.5)" }, 0)
                .to(".part-1", { x: -150, y: -100, rotation: 0, scale: 1, opacity: 0.8, duration: 1.5, ease: "power4.out" }, 0.2)
                .to(".part-2", { x: 150, y: 100, rotation: 0, scale: 1, opacity: 0.8, duration: 1.5, ease: "power4.out" }, 0.4)
                .to(".part-3", { y: 0, rotation: 0, scale: 1, opacity: 0.6, duration: 1.5, ease: "power4.out" }, 0.6)
                .fromTo(".assembly-text", { opacity: 0, scale: 5, filter: "blur(20px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, 1.5)
                // Add a floating hover effect at the end of the scroll
                .to(".core-watch", { y: -30, rotation: 2, duration: 1, yoyo: true, repeat: 1 }, 2.5);

      // 3. Porsche Warp Speed
      const porscheTl = gsap.timeline({
        scrollTrigger: {
          trigger: porscheRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        }
      });

      porscheTl.fromTo(".porsche-video", { scale: 3, filter: "blur(50px) contrast(3)" }, { scale: 1, filter: "blur(0px) contrast(1)", duration: 1.5 }, 0)
               .fromTo(".porsche-watch", { y: -1500, rotation: 360, scale: 0.2 }, { y: 0, rotation: 0, scale: 1.2, duration: 1.5, ease: "bounce.out" }, 1)
               .fromTo(".porsche-text", { opacity: 0, x: -500, skewX: 45 }, { opacity: 1, x: 0, skewX: 0, duration: 1, ease: "power4.out" }, 1.5);

      // 4. Deep Dive
      const deepDiveTl = gsap.timeline({
        scrollTrigger: {
          trigger: deepDiveRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        }
      });

      deepDiveTl.fromTo(".dive-video", { y: "-100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.5 }, 0)
                .fromTo(".dive-watch", { y: -1000, opacity: 0, rotation: -45 }, { y: 0, opacity: 1, rotation: 0, duration: 1.5, ease: "power3.out" }, 1)
                .fromTo(".dive-text", { opacity: 0, scale: 0, rotation: 90 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }, 1.5);

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
    <div ref={containerRef} className="w-full bg-black text-white font-sans selection:bg-fuchsia-500 selection:text-white">
      <RainbowStyles />
      
      {/* 1. Hero Section: Gears */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
        <video 
          autoPlay loop muted playsInline 
          className="hero-gears absolute top-0 left-0 w-full h-full object-cover opacity-80"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        
        {/* Intense Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div ref={shatterTextRef} className="relative z-10 flex flex-col items-center text-center px-4">
          <h2 className="text-white text-xs md:text-sm font-bold tracking-[0.5em] mb-6 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">The Absurd</h2>
          <h1 className="text-[4rem] md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-8 rainbow-text uppercase">
            Gravity is Optional.<br/>Time is not.
          </h1>
          <p className="font-mono text-xs tracking-[0.4em] opacity-80 uppercase mt-8 animate-pulse text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
            Scroll to Initiate Sequence
          </p>
        </div>
      </section>

      {/* 2. Flying Watch Assembly */}
      <section ref={flyingWatchRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center">
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* The Transparent PNG Watches Flying In */}
            
            {/* Core Watch */}
            <img 
              src="/watches-nobg/fossil-gold-me3280.png" 
              className="core-watch absolute z-30 w-[450px] h-[450px] object-contain drop-shadow-[0_0_80px_rgba(255,200,0,0.4)]" 
              alt="Core" 
            />
            
            {/* Fake parts using other angles of the watch to create a 3D shattered effect */}
            <img 
              src="/watches-nobg/fossil-gold-me3280-2.png" 
              className="part-1 absolute z-20 w-[300px] h-[300px] object-contain drop-shadow-[0_0_40px_rgba(0,255,255,0.3)]" 
              alt="Part 1" 
            />
            <img 
              src="/watches-nobg/fossil-gold-me3280-3.png" 
              className="part-2 absolute z-10 w-[250px] h-[250px] object-contain drop-shadow-[0_0_40px_rgba(255,0,255,0.3)]" 
              alt="Part 2" 
            />
            {/* A massive blurred gear floating behind */}
            <img 
              src="/watches-nobg/fossil-gold-me3280-4.png" 
              className="part-3 absolute z-0 w-[600px] h-[600px] object-contain blur-[15px] opacity-30" 
              alt="Part 3" 
            />
          </div>

          <div className="assembly-text flex flex-col justify-center space-y-6 z-40">
            <h1 className="text-6xl md:text-[5rem] font-black text-white leading-[0.9] tracking-tighter uppercase">
              Precision<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 drop-shadow-[0_0_20px_rgba(255,150,0,0.5)]">
                Reassembled.
              </span>
            </h1>
            <p className="text-2xl text-gray-400 font-light leading-relaxed">
              Crafted in the void. Assembled by sheer force of will. The Skeleton Gold defies the known physics of watchmaking.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Porsche Warp Speed Section */}
      <section ref={porscheRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
        <video 
          autoPlay loop muted playsInline 
          className="porsche-video absolute top-0 left-0 w-full h-full object-cover opacity-80"
        >
          <source src="/Porsche_driving_through_tunnel_202606281316.mp4" type="video/mp4" />
        </video>
        
        {/* Speed lines overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none mix-blend-overlay" />
        
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
          
          <div className="porsche-text flex flex-col justify-center">
            <h1 className="text-[5rem] md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-4 italic text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-600 drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] uppercase">
              Velocity
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase">
              The Speed of Time.
            </h2>
          </div>

          <div className="flex items-center justify-center relative w-full h-[600px]">
             {/* Using transparent PNGs for the drop effect */}
             <img 
               src="/watches-nobg/tx_watch.png" 
               className="porsche-watch absolute z-20 w-[500px] h-[500px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] filter contrast-125" 
               alt="Speed Watch" 
             />
             <div className="absolute w-[400px] h-[400px] bg-red-600/20 blur-[100px] rounded-full z-10 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 4. Deep Dive Section */}
      <section ref={deepDiveRef} className="relative w-full h-screen bg-[#02050A] overflow-hidden flex items-center justify-center">
        <video 
          autoPlay loop muted playsInline 
          className="dive-video absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        >
          <source src="/Diving_bell_underwater_illuminat…_202606281332.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="dive-text flex flex-col justify-center space-y-6 order-2 md:order-1">
            <h1 className="text-6xl md:text-[6rem] font-black text-white leading-[0.85] tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,255,0.6)] uppercase">
              Depths<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600">Unknown</span>
            </h1>
            <p className="text-2xl text-cyan-100 font-light drop-shadow-lg">
              Pressure is a privilege. Illuminated by the abyss, built for the absolute extreme.
            </p>
          </div>

          <div className="relative w-full h-[600px] flex items-center justify-center order-1 md:order-2">
            <div className="absolute w-[300px] h-[300px] bg-cyan-500/30 blur-[120px] rounded-full z-0 pointer-events-none" />
            <img 
              src="/watches-nobg/ea_watch.png" 
              className="dive-watch relative z-10 w-[450px] h-[450px] object-contain drop-shadow-[0_0_50px_rgba(0,255,255,0.5)]" 
              alt="Dive Watch" 
            />
          </div>

        </div>
      </section>

    </div>
  );
}
