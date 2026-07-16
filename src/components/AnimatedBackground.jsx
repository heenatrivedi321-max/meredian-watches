import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Use framer-motion springs for buttery smooth, slightly delayed trailing
  const springConfig = { damping: 25, stiffness: 50, mass: 1 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to center of screen for the initial calculation
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 250); // Offset by half the orb size
      cursorY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      
      {/* The Interactive Apple Glow (Tracks Mouse) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-60 mix-blend-screen pointer-events-none bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      
      {/* Static deep abyssal base glow to ensure the site isn't totally pitch black when mouse leaves */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Noise overlay for premium texture (Armani grittiness) */}
      <div className="absolute inset-0 bg-[url('/images/texture.jpg')] bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none filter contrast-150 grayscale"></div>
    </div>
  );
}
