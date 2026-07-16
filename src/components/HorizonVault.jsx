import React, { useState } from 'react';
import { motion, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';

const WATCHES = [
  { 
    id: 1, 
    brand: "FOSSIL", 
    model: "ME3270", 
    image: "/watches-nobg/fossil-brown-me3270.png", 
    tag: "AEROSPACE GRADE",
    video: "/Fossil_Brown_Master.mp4",
  },
  { 
    id: 2, 
    brand: "EMPORIO ARMANI", 
    model: "CERAMIC", 
    image: "/watches-nobg/ea_watch.png", 
    tag: "OBSIDIAN CORE",
    video: "/Armani_Rotating_Final.mp4",
  },
  { 
    id: 3, 
    brand: "HEXA", 
    model: "HUSTLER AUTO", 
    image: "/watches-nobg/hx_watch.png", 
    tag: "PRECISION ENGINE",
    video: "/Morpheus_Premiere.mp4",
  },
  { 
    id: 4, 
    brand: "GIORGIO", 
    model: "TOURBILLON", 
    image: "/watches-nobg/gi_watch.png", 
    tag: "APEX HORIZON",
    video: "/hero_video.mp4",
  }
];

const SEGMENT_ANGLE = 360 / WATCHES.length;

export default function HorizonVault() {
  const [activeIndex, setActiveIndex] = useState(0);
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    const currentRot = rotation.get();
    const velocity = info.velocity.x + info.velocity.y;
    
    let targetRot = currentRot + (velocity * 0.1);
    const snapRot = Math.round(targetRot / SEGMENT_ANGLE) * SEGMENT_ANGLE;
    
    controls.start({
      rotate: snapRot,
      transition: { type: "spring", stiffness: 100, damping: 30, mass: 1 }
    });
    
    let normalizedRot = snapRot % 360;
    if (normalizedRot < 0) normalizedRot += 360;
    
    const newIndex = (WATCHES.length - Math.round(normalizedRot / SEGMENT_ANGLE) % WATCHES.length) % WATCHES.length;
    setActiveIndex(newIndex);
  };

  return (
    <section className="relative w-full h-screen bg-[#000] overflow-hidden">
      
      {/* 1. Highly Optimized Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          key={WATCHES[activeIndex].id} // Changing key forces video to remount and play new source instantly without multiple tags
          src={WATCHES[activeIndex].video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Simple dark gradient overlay instead of expensive CSS blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      {/* 2. The Mechanical Vault Dial - Adjusted position so it's NOT hidden */}
      <div className="absolute -left-[10vw] top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] min-w-[600px] min-h-[600px] z-20">
        
        {/* Outer Steel Ring - Removed expensive shadows */}
        <div className="absolute inset-0 border border-[#333] rounded-full bg-black/50" />
        <div className="absolute inset-8 border border-[#222] rounded-full border-dashed" />
        
        {/* Drag Container */}
        <motion.div 
          className="absolute inset-0 rounded-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDrag={(e, info) => {
             rotation.set(rotation.get() + info.delta.x * 0.4 + info.delta.y * 0.4);
          }}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ rotate: rotation }}
        >
          {/* Dial Markers */}
          {WATCHES.map((watch, i) => {
            const angle = i * SEGMENT_ANGLE;
            return (
              <div 
                key={watch.id} 
                className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-[2px] h-[50%]"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="w-[4px] h-[30px] bg-white rounded-sm mt-4" />
                <div className="w-[1px] h-[60px] bg-white/20 mt-2" />
                
                {/* Text is bright and visible now */}
                <span className="text-white text-[12px] font-mono uppercase tracking-[0.2em] whitespace-nowrap -ml-16 mt-6 inline-block">
                  {watch.tag}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] bg-black rounded-full border border-[#444] flex items-center justify-center pointer-events-none z-30">
          <div className="w-[60%] h-[60%] rounded-full border border-white/20 flex items-center justify-center">
             <div className="w-1/2 h-[2px] bg-white absolute left-1/2 origin-left" />
          </div>
        </div>
      </div>

      {/* 3. The Product Showcase (Right Side) */}
      <div className="absolute right-[5vw] top-0 w-[45vw] h-full flex flex-col items-center justify-center z-10 pointer-events-none">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={WATCHES[activeIndex].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-full h-[80vh] flex items-center justify-center"
          >
            {/* The Transparent Product - Removed expensive drop-shadow filter */}
            <img 
              src={WATCHES[activeIndex].image} 
              alt={WATCHES[activeIndex].model}
              className="w-full h-full object-contain z-20"
            />
            
            {/* Typography - Made bright white and highly visible */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white text-2xl font-mono uppercase tracking-[0.5em] mb-4"
              >
                {WATCHES[activeIndex].brand}
              </motion.span>
              <motion.h2 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-7xl md:text-9xl font-serif font-bold tracking-tighter leading-none opacity-80"
              >
                {WATCHES[activeIndex].model}
              </motion.h2>
            </div>
            
          </motion.div>
        </AnimatePresence>

      </div>
      
      {/* 4. Header */}
      <header className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-center z-50 pointer-events-none text-white">
        <div className="font-mono text-xs uppercase tracking-[0.3em] font-bold">THE HORIZON VAULT</div>
        <div className="font-mono text-xs tracking-[0.3em] uppercase opacity-50">[ SCROLL & DRAG ]</div>
      </header>

    </section>
  );
}
