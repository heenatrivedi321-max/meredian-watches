import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Truck, RotateCcw } from 'lucide-react';

export default function BrandStory({ onClose }) {
  const values = [
    { icon: Shield, label: "Authenticity Guaranteed", desc: "Every timepiece is verified. No replicas. No compromises." },
    { icon: Award, label: "Curated Selection", desc: "We don't stock everything. We stock what matters." },
    { icon: Truck, label: "Insured Shipping", desc: "Fully insured door-to-door delivery across India." },
    { icon: RotateCcw, label: "7-Day Returns", desc: "Changed your mind? Send it back. No questions asked." },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#0a0a0a] text-white overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[200] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors text-[10px] tracking-[0.3em] uppercase font-bold"
      >
        ✕
      </button>

      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src="/Porsche_driving_through_tunnel_202606281316.mp4"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center px-4"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Est. 2024</p>
          <h1
            className="text-[3rem] sm:text-[5rem] lg:text-[7rem] font-bold tracking-tighter leading-none mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MERIDIAN
          </h1>
          <p className="text-white/60 text-lg sm:text-xl font-light max-w-xl mx-auto tracking-wide">
            We believe time is the ultimate luxury. Every watch we curate is a declaration that you refuse to waste it.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-bold tracking-tighter mb-12">
            The Anti-Smartwatch.
          </h2>
          <div className="space-y-6 text-white/60 text-base sm:text-lg leading-relaxed font-light">
            <p>
              Somewhere between the fourth notification and the second screen time alert, we realized something: smartwatches don't make us smarter. They make us more distracted.
            </p>
            <p>
              Meridian was born from a simple conviction — that the most powerful statement you can make on your wrist is <span className="text-white font-medium">quiet confidence</span>. No buzzing. No tracking your steps. Just precision engineering that looks like it costs more than your car.
            </p>
            <p>
              We don't sell everything. We sell the eight watches that actually matter — the ones that make people ask, <span className="text-white font-medium">"What is that?"</span> instead of <span className="text-white/40">"Nice Apple Watch."</span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[1.5rem] sm:text-[2rem] font-bold tracking-tighter mb-16 text-center"
        >
          What We Stand Behind
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <v.icon size={22} className="text-white/70" />
              </div>
              <h3 className="text-sm font-bold tracking-wide uppercase mb-3">{v.label}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4 border-t border-white/5">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-8"
        >
          Ready to stop telling time and start wearing it?
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={onClose}
          className="px-12 py-5 bg-white text-black hover:bg-white/90 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          View Collection
        </motion.button>
      </section>
    </div>
  );
}
