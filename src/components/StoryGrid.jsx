import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const IMAGES = [
  "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
  "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
  "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg"
];

export default function StoryGrid() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]);

  return (
    <section ref={ref} className="relative w-full py-32 bg-[#020202] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-screen">
          
          {/* Left Column Text */}
          <div className="md:col-span-4 z-20">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-serif text-white leading-[0.9] mb-8"
            >
              Splendor<br/>of<br/><span className="italic text-[#888]">Mastery</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-[#8a8a8a] text-xs font-mono uppercase tracking-widest max-w-xs leading-loose"
            >
              Exclusive precision mechanics built for the extraordinary. We don't measure time, we engineer its flow.
            </motion.p>
          </div>

          {/* Right Column Masonry */}
          <div className="md:col-span-8 relative h-[120vh] w-full mt-24 md:mt-0">
            
            <motion.div 
              style={{ y: y1 }}
              className="absolute top-[10%] left-0 w-[50%] aspect-[3/4] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src={IMAGES[0]} alt="Lifestyle" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
            </motion.div>

            <motion.div 
              style={{ y: y2 }}
              className="absolute top-0 right-0 w-[45%] aspect-[4/3] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src={IMAGES[1]} alt="Lifestyle" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
            </motion.div>

            <motion.div 
              style={{ y: y3 }}
              className="absolute top-[50%] right-[10%] w-[60%] aspect-video overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src={IMAGES[2]} alt="Lifestyle" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
