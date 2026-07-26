import React, { useEffect, useRef } from 'react';

/**
 * OBSIDIAN LIQUID METAL EMBER TRAIL CANVAS
 * Emits glowing rose-gold, electric cyan & hot coral metallic embers following mouse cursor.
 * Uses hardware-accelerated HTML5 Canvas with fluid physics & zero CPU overhead.
 */
export default function LiquidMetalTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const colors = [
      'rgba(255, 215, 0, ',   // Gold
      'rgba(0, 240, 255, ',   // Electric Cyan
      'rgba(255, 0, 127, ',   // Hot Coral
      'rgba(232, 213, 163, ', // Champagne Gold
      'rgba(0, 255, 136, '    // Emerald
    ];

    let lastMousePos = { x: -100, y: -100 };

    const createParticles = (x, y) => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          size: Math.random() * 2.5 + 1.2,
          colorPrefix: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 2.2,
          vy: (Math.random() - 0.5) * 2.2 - 0.5,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          life: 0
        });
      }
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastMousePos.x;
      const dy = clientY - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        createParticles(clientX, clientY);
        lastMousePos = { x: clientX, y: clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        createParticles(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy -= 0.03; // Gentle upward buoyancy drift
        p.alpha -= p.decay;
        p.size *= 0.98;

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
        ctx.shadowColor = p.colorPrefix + '0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[120] pointer-events-none"
    />
  );
}
