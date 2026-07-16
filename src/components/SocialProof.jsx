import React from 'react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    text: "The weight and precision of the movement is unmatched at this price point. A true collector's piece.",
    author: "James H.",
    role: "Horology Enthusiast"
  },
  {
    text: "Minimalist, striking, and built with absolute obsession. It commands attention without saying a word.",
    author: "David L.",
    role: "Creative Director"
  },
  {
    text: "I own watches that cost 10x as much, but this is the one that stays on my wrist.",
    author: "Michael T.",
    role: "Verified Owner"
  }
];

export default function SocialProof() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a1a1a] rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-24">
          <h2 className="text-[#eaeaea] font-serif text-4xl md:text-5xl mb-6">The Legacy</h2>
          <p className="text-[#8a8a8a] font-mono text-xs uppercase tracking-[0.2em]">Forged for the exceptional</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-white/5 border border-white/10 p-10 rounded-sm backdrop-blur-md flex flex-col justify-between h-full hover:bg-white/10 transition-colors duration-500"
            >
              <div className="mb-8">
                <svg className="w-8 h-8 text-[#333] mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[#eaeaea] font-serif text-lg leading-relaxed">"{review.text}"</p>
              </div>
              
              <div>
                <div className="h-[1px] w-full bg-gradient-to-r from-white/20 to-transparent mb-4" />
                <p className="text-[#eaeaea] font-mono text-xs uppercase tracking-widest">{review.author}</p>
                <p className="text-[#8a8a8a] text-xs italic font-serif mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
