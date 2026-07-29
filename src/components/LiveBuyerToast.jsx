import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = [
  { city: "Mumbai", watch: "OLEVS Black Diamond Edition", time: "2 mins ago" },
  { city: "Delhi", watch: "Fossil Gold ME3280 Automatic", time: "just now" },
  { city: "Bengaluru", watch: "Armani Exchange Chronograph", time: "5 mins ago" },
  { city: "Hyderabad", watch: "Meridian Master Tourbillon", time: "just now" },
  { city: "Chennai", watch: "OLEVS Rose Gold Automatic", time: "1 min ago" },
  { city: "Pune", watch: "Fossil Gold ME3280 Automatic", time: "7 mins ago" },
];

export default function LiveBuyerToast() {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    // Trigger initial toast after 4s, then repeat every 16s
    const initialTimer = setTimeout(() => {
      triggerRandomToast();
    }, 4000);

    const interval = setInterval(() => {
      triggerRandomToast();
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const triggerRandomToast = () => {
    const random = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
    setCurrent(random);
    // Auto hide after 5 seconds
    setTimeout(() => {
      setCurrent(null);
    }, 5000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[220] pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-4 p-4 rounded-2xl bg-black/85 border border-[#FFD700]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-sm"
          >
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]" />
            </div>

            <div className="text-left">
              <p className="text-[11px] font-sans font-semibold text-white tracking-wide">
                Reserved in {current.city}
              </p>
              <p className="text-[10px] font-mono text-[#FFD700] tracking-wider uppercase mt-0.5">
                {current.watch}
              </p>
              <span className="text-[9px] font-mono text-white/40 block mt-0.5">
                {current.time} • Verified Allocation
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
