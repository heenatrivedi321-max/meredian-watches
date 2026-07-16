import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import WebGLFluid from 'webgl-fluid';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const glitchRef = useRef(null);
  
  // Keep a ref to the config so we can modify it later to kill the physics loop
  const fluidConfig = useRef({
    IMMEDIATE: true,
    TRIGGER: 'hover',
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 3.5, 
    VELOCITY_DISSIPATION: 2.0,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 50, 
    SPLAT_RADIUS: 0.5, 
    SPLAT_FORCE: 10000, 
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 1.5,
    BLOOM_THRESHOLD: 0.2,
    SUNRAYS: true,
    SUNRAYS_WEIGHT: 2.0,
    PAUSED: false // We will set this to true when finished!
  });

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';

    // 1. Initialize Crazy WebGL Fluid
    if (canvasRef.current) {
      WebGLFluid(canvasRef.current, fluidConfig.current);

      // Force a few massive random splats to guarantee screen fills with chaos immediately
      const simulateSplat = () => {
        const event = new MouseEvent('mousemove', {
          clientX: Math.random() * window.innerWidth,
          clientY: Math.random() * window.innerHeight,
        });
        canvasRef.current.dispatchEvent(event);
      };
      
      const interval = setInterval(simulateSplat, 100);
      setTimeout(() => clearInterval(interval), 1500); // Stop splashing after 1.5s
    }

    // 2. Aggressive Text Glitch & Reveal
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // EXTREMELY IMPORTANT PERFORMANCE FIX:
          // Kill the massive 3D fluid physics engine before letting the user scroll the site!
          fluidConfig.current.PAUSED = true;
          document.body.style.overflow = 'auto'; // Unlock scroll
          if (onComplete) onComplete();
        }
      });

      // Slam the text in
      tl.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.2)",
        delay: 0.5
      });

      // Insane Glitch Effect
      tl.to(glitchRef.current, {
        x: () => Math.random() * 40 - 20,
        y: () => Math.random() * 40 - 20,
        skewX: () => Math.random() * 20 - 10,
        duration: 0.05,
        repeat: 20,
        yoyo: true,
        ease: "none"
      });

      // Reset glitch and hold
      tl.to(glitchRef.current, { x: 0, y: 0, skewX: 0, duration: 0.1 });

      // Violent Zoom out to reveal site
      tl.to(textRef.current, {
        scale: 10,
        opacity: 0,
        duration: 0.6,
        ease: "power4.in"
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut"
      }, "-=0.4");

    }, containerRef);

    return () => {
      ctx.revert();
      fluidConfig.current.PAUSED = true; // Safety cleanup
    };

  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none overflow-hidden"
    >
      {/* Crazy Interactive Fluid Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
      ></canvas>

      {/* Cinematic Noise Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay z-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjAwIDIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZUZpbHRlcic+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuNjUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2VGaWx0ZXIpJy8+PC9zdmc+")' }}></div>

      {/* Glitching Text Container */}
      <div 
        ref={textRef}
        className="text-white font-anton text-[15vw] md:text-[12rem] tracking-widest uppercase opacity-0 scale-0 z-20 flex flex-col items-center mix-blend-difference"
      >
        <div ref={glitchRef} className="leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]">MERIDIAN</div>
      </div>

    </div>
  );
}
