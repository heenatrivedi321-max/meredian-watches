import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MERIDIAN".split('');

export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=line, 1=letters, 2=tagline, 3=fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => onComplete(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Gold line draw */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 0 ? '40vw' : 0,
              opacity: phase >= 0 ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* MERIDIAN letters */}
          <div className="relative flex items-center justify-center gap-[0.05em] sm:gap-[0.08em]">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-bold tracking-tighter text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 0 80px rgba(201,169,110,0.3), 0 0 120px rgba(201,169,110,0.1)',
                }}
                initial={{ opacity: 0, y: 40, rotateX: -90, filter: 'blur(10px)' }}
                animate={
                  phase >= 1
                    ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }
                    : {}
                }
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] md:text-xs tracking-[0.5em] sm:tracking-[0.6em] uppercase text-white/40 font-light"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Your wrist called. It wants a raise.
          </motion.p>

          {/* Subtle corner accents */}
          <motion.div
            className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[#C9A96E]/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          <motion.div
            className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[#C9A96E]/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[#C9A96E]/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.0 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[#C9A96E]/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
