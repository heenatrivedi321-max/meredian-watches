import React from 'react';
import { motion } from 'framer-motion';
import { WATCHES } from '../data/watches';

function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramFeed() {
  const INSTAGRAM_URL = 'https://www.instagram.com/meri.dianwatches/';

  return (
    <section className="w-full py-24 sm:py-32 bg-black text-white pointer-events-auto relative overflow-hidden">
      {/* Ambient Gemini Fluid Aurora Mesh Glow */}
      <div className="absolute inset-0 gemini-aurora-bg pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#9B51E0] via-[#FF007F] to-[#00FF88] flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(0,240,255,0.6)]">
              <InstagramIcon size={22} className="text-white" />
            </div>
          </div>
          <h2
            className="text-[2.2rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold tracking-tight mb-4 text-gemini-gradient uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
          >
            @meri.dianwatches
          </h2>
          <p className="text-white/70 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto gemini-rainbow-subtext">
            Behind the scenes, new drops, and wrist shots from the inner circle.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {WATCHES.map((watch, i) => (
            <motion.a
              key={watch.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-black/60 border border-white/10 hover:border-[#00F0FF]/60 shadow-2xl transition-all duration-500 backdrop-blur-xl"
            >
              <img
                src={watch.image}
                alt={`${watch.brand} ${watch.model}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ mixBlendMode: 'normal' }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <InstagramIcon size={24} className="text-white mx-auto mb-2" />
                  <p className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">
                    {watch.brand}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 border border-white/15 rounded-full text-xs tracking-[0.25em] uppercase font-bold text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
          >
            <InstagramIcon size={16} />
            Follow the journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
