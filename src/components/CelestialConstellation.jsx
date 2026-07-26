import React, { useEffect, useRef } from 'react';

/**
 * CELESTIAL STARLIGHT CONSTELLATION MESH
 * Renders ambient twinkling 3D starlight micro-stars that form dynamic golden laser constellation lines 
 * and an astronomical horological ring orbit around the user's cursor.
 * Uses hardware-accelerated HTML5 Canvas with zero performance impact.
 */
export default function CelestialConstellation() {
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

    // Initialize 80 ambient celestial stars
    const STAR_COUNT = Math.min(80, Math.floor(window.innerWidth / 20));
    const stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        isGold: Math.random() > 0.6
      });
    }

    let mouse = { x: -1000, y: -1000, active: false };
    let ringAngle = 0;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ringAngle += 0.01;

      // 1. Update and draw micro-stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        // Wrap boundaries
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.isGold 
          ? `rgba(255, 215, 0, ${Math.max(0.1, currentAlpha)})`
          : `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
        ctx.fill();
      }

      // 2. Connect constellation lines if mouse active
      if (mouse.active) {
        const MAX_DIST = 150;

        // Connect stars to mouse cursor & nearby stars
        for (let i = 0; i < stars.length; i++) {
          const s1 = stars[i];
          const dxMouse = s1.x - mouse.x;
          const dyMouse = s1.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < MAX_DIST) {
            const alpha = (1 - distMouse / MAX_DIST) * 0.6;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = s1.isGold
              ? `rgba(255, 215, 0, ${alpha})`
              : `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // Inter-star constellation links near mouse
          for (let j = i + 1; j < stars.length; j++) {
            const s2 = stars[j];
            const dxStar = s1.x - s2.x;
            const dyStar = s1.y - s2.y;
            const distStar = Math.sqrt(dxStar * dxStar + dyStar * dyStar);

            if (distStar < 90 && distMouse < MAX_DIST + 40) {
              const alpha = (1 - distStar / 90) * 0.25;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // 3. Astronomical Horological Ring Orbit around Cursor
        ctx.save();
        ctx.translate(mouse.x, mouse.y);
        ctx.rotate(ringAngle);

        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 32, ringAngle, ringAngle + Math.PI / 3);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[110] pointer-events-none"
    />
  );
}
