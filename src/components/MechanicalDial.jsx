import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

const WATCHES = [
  { id: 1, brand: "FOSSIL", model: "ME3270", image: "/watches-nobg/fossil-brown-me3270.png", tag: "CREATOR PRODUCT" },
  { id: 2, brand: "EMPORIO ARMANI", model: "CERAMIC", image: "/watches-nobg/ea_watch.png", tag: "CREATOR TECHNOLOGY" },
  { id: 3, brand: "HEXA", model: "HUSTLER AUTO", image: "/watches-nobg/hx_watch.png", tag: "CREATOR MEDIA" },
  { id: 4, brand: "GIORGIO", model: "TOURBILLON", image: "/watches-nobg/gi_watch.png", tag: "CREATOR COMMUNITY" }
];

const SEGMENT_ANGLE = 360 / WATCHES.length;

export default function MechanicalDial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    // Calculate nearest segment to snap to
    const currentRot = rotation.get();
    const velocity = info.velocity.x + info.velocity.y; // approximate velocity
    
    // Add momentum based on velocity
    let targetRot = currentRot + (velocity * 0.2);
    
    // Snap to nearest SEGMENT_ANGLE
    const snapRot = Math.round(targetRot / SEGMENT_ANGLE) * SEGMENT_ANGLE;
    
    controls.start({
      rotate: snapRot,
      transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 }
    });
    
    // Update active index based on rotation
    let normalizedRot = snapRot % 360;
    if (normalizedRot < 0) normalizedRot += 360;
    
    // The active index is calculated backward because spinning right decreases the index conceptually if we map clockwise
    const newIndex = (WATCHES.length - Math.round(normalizedRot / SEGMENT_ANGLE) % WATCHES.length) % WATCHES.length;
    setActiveIndex(newIndex);
  };

  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center">
      
      {/* Left side: The Mechanical Dial */}
      <div className="absolute left-[-20vw] top-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] z-20">
        
        {/* Outer Ring */}
        <div className="absolute inset-0 border border-[#333] rounded-full" />
        
        {/* Drag Container */}
        <motion.div 
          className="absolute inset-0 rounded-full cursor-grab active:cursor-grabbing border-4 border-[#1a1a1a]"
          drag="x" // Simple drag constraint mapping to rotation
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDrag={(e, info) => {
             rotation.set(rotation.get() + info.delta.x * 0.5 + info.delta.y * 0.5);
          }}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ rotate: rotation }}
        >
          {/* Dial Markers & Text */}
          {WATCHES.map((watch, i) => {
            const angle = i * SEGMENT_ANGLE;
            return (
              <div 
                key={watch.id} 
                className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-[2px] h-[50%]"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="w-full h-12 bg-[#333] mb-4" />
                <span className="text-[#8a8a8a] text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap -ml-16 mt-4 inline-block">
                  {watch.tag}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] bg-[#1a1a1a] rounded-full border border-[#333] flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-none">
          <div className="w-1/2 h-1/2 rounded-full border border-[#444] animate-pulse" />
        </div>

      </div>

      {/* Right side: The Watch Display */}
      <div className="absolute right-0 top-0 w-[50vw] h-full flex flex-col items-center justify-center z-10 p-12">
        <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
          {WATCHES.map((watch, i) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ 
                opacity: i === activeIndex ? 1 : 0, 
                scale: i === activeIndex ? 1 : 0.9,
                x: i === activeIndex ? 0 : 100,
                pointerEvents: i === activeIndex ? 'auto' : 'none'
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute inset-0 flex flex-col items-center justify-center mix-blend-screen"
            >
              <img 
                src={watch.image} 
                alt={watch.model}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
              />
              <div className="absolute bottom-12 right-12 text-right">
                <span className="text-[#8a8a8a] text-xs font-mono uppercase tracking-widest block mb-2">{watch.brand}</span>
                <h3 className="text-white text-5xl font-serif">{watch.model}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
