import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedNumber({ value, suffix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const numericTarget = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(numericTarget)) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOutProgress * numericTarget);
      setDisplayValue(current.toLocaleString());
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget.toLocaleString());
      }
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-sans font-extrabold tracking-tight">
      {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}{suffix}
    </span>
  );
}

export default function HorologySpecsCounter() {
  const specs = [
    { label: "TIMEPIECES DELIVERED", value: "12,480", suffix: "+" },
    { label: "CLIENT SATISFACTION", value: "99", suffix: ".4%" },
    { label: "VERIFIED RATING", value: "4.9", suffix: "★" },
    { label: "INSURED EXPRESS DELIVERY", value: "100", suffix: "%" },
  ];

  return (
    <section className="relative w-full py-20 bg-white border-y border-black/10 overflow-hidden z-20 pointer-events-auto font-sans">
      {/* Feature 4: Liquid Metal Hairline Borders (Active Glow) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#006039] via-[#00F0FF] to-transparent animate-navbar-sweep opacity-70" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] via-[#006039] to-transparent animate-navbar-sweep opacity-70" style={{ animationDelay: '3s' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {specs.map((spec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group relative p-6 rounded-2xl bg-[#f8f9fa] border border-black/10 hover:border-[#006039]/50 transition-all duration-500 overflow-hidden shadow-xl"
          >
            {/* Feature 4: Liquid Metal Light Trace */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#006039]/10 via-transparent to-[#00F0FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b0b0e] tracking-tight mb-2 font-sans">
              <AnimatedNumber value={spec.value} suffix={spec.suffix} />
            </div>

            <div className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.25em] uppercase text-black/60 group-hover:text-[#006039] transition-colors duration-300">
              {spec.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
