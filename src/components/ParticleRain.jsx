import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParticleRain() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create 30 particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      
      // Randomly pick a spark or a mini crown emoji for the "eyebrows" effect
      particle.innerText = Math.random() > 0.5 ? '✨' : '👑';
      particle.style.position = 'absolute';
      particle.style.fontSize = Math.random() * 20 + 10 + 'px';
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = '-50px';
      particle.style.zIndex = '1';
      particle.style.filter = 'drop-shadow(0 0 10px rgba(216, 156, 68, 0.8))';
      particle.style.pointerEvents = 'none';
      
      container.appendChild(particle);
      particles.push(particle);

      // Animate falling
      gsap.to(particle, {
        y: '120vh',
        x: `+=${Math.random() * 100 - 50}`, // slight sway
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        ease: "none",
        repeat: -1,
        delay: Math.random() * 5
      });
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden"></div>
  );
}
