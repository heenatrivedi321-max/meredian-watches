import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yText1 = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacityText1 = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 1]);
  
  const yImage1 = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);
  const scaleImage1 = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1.1, 1, 1.1]);

  const yText2 = useTransform(scrollYProgress, [0.4, 0.8], [100, 0]);
  const opacityText2 = useTransform(scrollYProgress, [0.4, 0.6, 0.8], [0, 0, 1]);

  return (
    <section ref={ref} className="relative w-full py-32 md:py-64 bg-[#050505] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Thesis Statement */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center mb-32 overflow-hidden">
          <motion.h2 
            style={{ y: yText1, opacity: opacityText1 }}
            className="text-4xl md:text-7xl font-serif text-[#eaeaea] tracking-tight max-w-4xl leading-tight"
          >
            Time is not measured. <br/><span className="italic text-[#8a8a8a]">It is engineered.</span>
          </motion.h2>
          <motion.p
            style={{ opacity: opacityText1 }}
            className="mt-8 text-[#8a8a8a] max-w-lg font-mono text-xs uppercase tracking-widest leading-loose"
          >
            Every Meridian piece is a testament to the obsession with perfection. We do not build watches; we forge legacies.
          </motion.p>
        </div>

        {/* Parallax Image Block */}
        <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden rounded-sm">
          <motion.div 
            style={{ y: yImage1, scale: scaleImage1 }}
            className="w-full h-[120%] absolute -top-[10%]"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src="/9a2d3f68-88e2-4100-831e-054c539cafcc.__CR0,0,1500,928_PT0_SX970_V1___.jpeg" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
          
          <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-20 overflow-hidden">
             <motion.div style={{ y: yText2, opacity: opacityText2 }}>
                <p className="text-[#eaeaea] font-serif text-3xl md:text-5xl">The Mechanics of Power</p>
                <div className="h-[1px] w-12 bg-[#eaeaea] mt-6" />
             </motion.div>
          </div>
        </div>

      </div>
      
    </section>
  );
}
