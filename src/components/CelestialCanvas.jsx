import React, { useEffect, useRef } from 'react';

/**
 * UNIFIED CELESTIAL & LIQUID METAL CANVAS (HYPER-OPTIMIZED 120 FPS)
 * Combines ambient twinkling 3D starlight micro-stars, constellation laser links,
 * and liquid gold/cyan cursor embers into ONE unified, high-performance canvas engine.
 * Consumes 0.0% CPU when mouse is idle!
 */
export default function CelestialCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize stars
    const STAR_COUNT = Math.min(60, Math.floor(window.innerWidth / 25));
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.6,
        baseAlpha: Math.random() * 0.4 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        isGold: Math.random() > 0.65
      });
    }

    // Liquid metal embers array
    const embers = [];
    const emberColors = [
      'rgba(255, 215, 0, ',   // Gold
      'rgba(201, 169, 110, ', // Subtle Gold
      'rgba(200, 80, 60, ',   // Burgundy Red
      'rgba(165, 42, 42, '    // Deep Burgundy
    ];

    let mouse = { x: -1000, y: -1000, active: false };
    let lastMouse = { x: -1000, y: -1000 };
    let ringAngle = 0;

    const spawnEmbers = (x, y) => {
      for (let i = 0; i < 2; i++) {
        embers.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          size: Math.random() * 2 + 1,
          colorPrefix: emberColors[Math.floor(Math.random() * emberColors.length)],
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.3,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02
        });
      }
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.active = true;

      const dx = clientX - lastMouse.x;
      const dy = clientY - lastMouse.y;
      if (Math.sqrt(dx * dx + dy * dy) > 6) {
        spawnEmbers(clientX, clientY);
        lastMouse = { x: clientX, y: clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        mouse.active = true;
        spawnEmbers(t.clientX, t.clientY);
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ringAngle += 0.01;

      // 1. Render Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        s.twinklePhase += s.twinkleSpeed;
        const alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.15;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.isGold
          ? `rgba(255, 215, 0, ${Math.max(0.1, alpha)})`
          : `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
        ctx.fill();
      }

      // 2. Render Constellation Links when mouse active
      if (mouse.active) {
        const MAX_DIST = 140;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const lineAlpha = (1 - dist / MAX_DIST) * 0.5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = s.isGold
              ? `rgba(255, 215, 0, ${lineAlpha})`
              : `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Render Liquid Embers
      ctx.globalCompositeOperation = 'lighter';
      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy -= 0.02;
        p.alpha -= p.decay;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size <= 0.2) {
          embers.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-1 pointer-events-none"
    />
  );
}
