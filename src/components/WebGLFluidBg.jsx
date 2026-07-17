import React, { useEffect, useRef } from 'react';
import webGLFluid from 'webgl-fluid';

export default function WebGLFluidBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let simulation = null;
    if (canvasRef.current && window.innerWidth >= 768) {
      const isMobile = window.innerWidth < 768;
      simulation = webGLFluid(canvasRef.current, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: isMobile ? 32 : 64,
        DYE_RESOLUTION: isMobile ? 256 : 512,
        CAPTURE_RESOLUTION: isMobile ? 256 : 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: isMobile ? 10 : 20,
        CURL: isMobile ? 15 : 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: isMobile ? 3000 : 6000,
        SPLAT_COUNT: isMobile ? 3 : 6,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 10, g: 10, b: 10 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: isMobile ? 3 : 6,
        BLOOM_RESOLUTION: isMobile ? 128 : 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: !isMobile,
        SUNRAYS_RESOLUTION: isMobile ? 128 : 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    }
    
    // Cleanup is tricky with this package, but it shouldn't crash if unmounted
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover z-0" 
      style={{ 
        width: '100vw', 
        height: '100%',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
      }} 
    />
  );
}
