import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingShopButton({ onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });

    const grid = document.getElementById('watch-collection-grid');
    let observer;
    if (grid && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(false);
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0 }
      );
      observer.observe(grid);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClick}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[210] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5A3] to-[#C9A96E] text-black text-[10px] sm:text-[11px] tracking-[0.3em] font-bold uppercase cursor-pointer shadow-[0_8px_32px_rgba(201,169,110,0.45)] hover:shadow-[0_8px_48px_rgba(201,169,110,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
        >
          Shop
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
