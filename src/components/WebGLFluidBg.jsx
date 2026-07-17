import React, { useEffect, useRef } from 'react';
import webGLFluid from 'webgl-fluid';

export default function WebGLFluidBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const isMobile = window.innerWidth < 768;

    const simulation = webGLFluid(canvasRef.current, {
      TRIGGER: 'hover',
      IMMEDIATE: true,
      AUTO: true,
      INTERVAL: isMobile ? 4000 : 2500,
      SIM_RESOLUTION: isMobile ? 32 : 64,
      DYE_RESOLUTION: isMobile ? 512 : 1024,
      CAPTURE_RESOLUTION: isMobile ? 256 : 512,
      DENSITY_DISSIPATION: 1.2,
      VELOCITY_DISSIPATION: 0.3,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: isMobile ? 10 : 20,
      CURL: isMobile ? 20 : 40,
      SPLAT_RADIUS: 0.3,
      SPLAT_FORCE: isMobile ? 4000 : 8000,
      SPLAT_COUNT: isMobile ? 3 : 6,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 8,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: isMobile ? 3 : 6,
      BLOOM_RESOLUTION: isMobile ? 128 : 256,
      BLOOM_INTENSITY: 0.6,
      BLOOM_THRESHOLD: 0.5,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: !isMobile,
      SUNRAYS_RESOLUTION: isMobile ? 128 : 196,
      SUNRAYS_WEIGHT: 0.8,
    });

    // Touch support — splat on touch move
    if (isMobile) {
      const canvas = canvasRef.current;
      const handleTouch = (e) => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        if (simulation && simulation.splat) {
          simulation.splat(x, y, 0.3, 0.3);
        }
      };
      canvas.addEventListener('touchmove', handleTouch, { passive: true });
      return () => canvas.removeEventListener('touchmove', handleTouch);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    />
  );
}
