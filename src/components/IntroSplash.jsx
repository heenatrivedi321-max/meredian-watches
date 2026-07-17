import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MERIDIAN".split('');

function GoldParticles({ active }) {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 200,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #C9A96E 0%, #d4a84380 50%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 4}px #C9A96E60`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={active ? {
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            y: [0, -100 - Math.random() * 200],
            x: [0, p.drift],
          } : {}}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function ShockRing({ active, delay = 0 }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A96E]/40"
      initial={{ width: 0, height: 0, opacity: 0 }}
      animate={active ? {
        width: [0, '120vw'],
        height: [0, '120vw'],
        opacity: [0.8, 0],
        borderWidth: [2, 0.5],
      } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3800),
      setTimeout(() => onComplete(), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Radial gold glow — pulses when letters appear */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.08) 30%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={phase >= 1 ? { width: '90vw', height: '60vh', opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Shockwave rings */}
          <ShockRing active={phase >= 1} delay={0} />
          <ShockRing active={phase >= 1} delay={0.15} />
          <ShockRing active={phase >= 2} delay={0} />

          {/* Gold floating particles */}
          <GoldParticles active={phase >= 1} />

          {/* Horizontal gold line — draws fast */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #C9A96E 20%, #e8d5a3 50%, #C9A96E 80%, transparent 100%)',
              boxShadow: '0 0 20px #C9A96E60, 0 0 60px #C9A96E30',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 0 ? '50vw' : 0,
              opacity: phase >= 0 ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* MERIDIAN letters — dramatic reveal */}
          <div className="relative flex items-center justify-center" style={{ perspective: '800px' }}>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="relative text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-bold tracking-tighter"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#fff',
                  textShadow: '0 0 60px rgba(201,169,110,0.6), 0 0 120px rgba(201,169,110,0.3), 0 0 200px rgba(201,169,110,0.15)',
                }}
                initial={{ opacity: 0, y: 60, rotateX: -120, scale: 0.5, filter: 'blur(12px)' }}
                animate={phase >= 1 ? {
                  opacity: [0, 1.2, 1],
                  y: [60, -15, 0],
                  rotateX: [-120, 10, 0],
                  scale: [0.5, 1.1, 1],
                  filter: ['blur(12px)', 'blur(0px)', 'blur(0px)'],
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.6, delay: i * 0.07 },
                }}
              >
                {letter}
                {/* Gold underline flash on each letter */}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={phase >= 1 ? { scaleX: 1, opacity: [0, 1, 0] } : {}}
                  transition={{ duration: 0.6, delay: i * 0.07 + 0.3 }}
                />
              </motion.span>
            ))}
          </div>

          {/* Tagline — slides up with color */}
          <motion.p
            className="mt-8 sm:mt-10 text-[9px] sm:text-[10px] md:text-xs tracking-[0.5em] sm:tracking-[0.6em] uppercase font-light"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(90deg, #fff 0%, #C9A96E 50%, #fff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 20, backgroundPosition: '0% 50%' }}
            animate={phase >= 2 ? { opacity: 1, y: 0, backgroundPosition: '200% 50%' } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Your wrist called. It wants a raise.
          </motion.p>

          {/* Corner accents — gold, animate in */}
          {[
            'top-6 left-6 sm:top-8 sm:left-8 border-t border-l',
            'top-6 right-6 sm:top-8 sm:right-8 border-t border-r',
            'bottom-6 left-6 sm:bottom-8 sm:left-8 border-b border-l',
            'bottom-6 right-6 sm:bottom-8 sm:right-8 border-b border-r',
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-6 h-6 sm:w-10 sm:h-10 border-[#C9A96E]/50 ${cls}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#C9A96E] via-[#e8d5a3] to-[#C9A96E]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.2, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
