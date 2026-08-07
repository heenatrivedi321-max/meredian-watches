import React, { useState, useEffect } from 'react';

// ============================================================
// ANNOUNCEMENT BAR — "Starting ₹999 · Free Delivery · Secure"
// Sticky top bar. Scrolls away after 300px so it doesn't block.
// ============================================================

const MESSAGES = [
  '✦ Watches Starting $44.99',
  '✦ 256-Bit Encrypted Secure Checkout',
  '✦ 30-Day Risk-Free Guarantee',
  '✦ Apple Pay · PayPal · Credit Cards Accepted',
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hide after 300px of scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] transition-transform duration-500 ease-in-out pointer-events-none"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <div className="w-full bg-[#800020] flex items-center justify-center py-2 px-4 gap-6 select-none">
        {/* Left fill messages on desktop */}
        <div className="hidden sm:flex items-center gap-6 text-white/60 text-[10px] font-mono tracking-[0.25em] uppercase">
          {MESSAGES.filter((_, i) => i !== msgIndex).slice(0, 2).map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>

        {/* Center — highlighted rotating message */}
        <span
          className="text-white text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase font-bold transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {MESSAGES[msgIndex]}
        </span>

        <div className="hidden sm:flex items-center gap-6 text-white/60 text-[10px] font-mono tracking-[0.25em] uppercase">
          {MESSAGES.filter((_, i) => i !== msgIndex).slice(2).map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
