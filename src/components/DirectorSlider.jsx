import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WATCHES = [
  {
    id: 1,
    brand: "OLEVS",
    model: "BROWN LEATHER",
    price: "₹3,420",
    image: "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    color: "#1a1614"
  },
  {
    id: 2,
    brand: "OLEVS",
    model: "MOON PHASE",
    price: "₹3,419",
    image: "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    color: "#11141a"
  },
  {
    id: 3,
    brand: "HEXA",
    model: "HUSTLER AUTO",
    price: "₹6,999",
    image: "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    color: "#1a1a1a"
  },
  {
    id: 4,
    brand: "FORSINING",
    model: "TOURBILLON",
    price: "₹8,106",
    image: "/47ce201d-8d9c-4196-9b22-9bb0c5aaf6a8.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    color: "#1f1a14"
  },
  {
    id: 5,
    brand: "OLEVS",
    model: "DIAMOND DRESS",
    price: "₹3,420",
    image: "/1fac9e41-dea2-4b7d-9f0b-0e52c4aa0464.__CR0,2,1500,928_PT0_SX970_V1___.jpeg",
    color: "#0a0a0a"
  },
  {
    id: 6,
    brand: "OLEVS",
    model: "PREMIUM CHRONO",
    price: "₹3,420",
    image: "/9a2d3f68-88e2-4100-831e-054c539cafcc.__CR0,0,1500,928_PT0_SX970_V1___.jpeg",
    color: "#141414"
  }
];

const WatchSection = ({ watch, index }) => {
  const ref = useRef(null);
  
  // Track scroll progress for this specific section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax calculations
  const yImage = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const yTextLeft = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  const yTextRight = useTransform(scrollYProgress, [0, 1], ["40%", "-20%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section 
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: watch.color }}
    >
      {/* Background Noise/Grain Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}
      />

      {/* Massive Split Typography */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-between px-[4vw] z-10 pointer-events-none">
        
        {/* Left Brand Text */}
        <motion.div 
          style={{ y: yTextLeft, opacity: opacityText }}
          className="flex flex-col items-start w-[30vw]"
        >
          <h1 className="text-[10vw] leading-none font-serif text-[#e5e1d8] tracking-tighter mix-blend-difference break-words w-full">
            {watch.brand}
          </h1>
          <span className="text-sm font-mono text-[#a39d91] tracking-widest mt-4 uppercase">
            No. 0{index + 1}
          </span>
        </motion.div>

        {/* Right Model Text */}
        <motion.div 
          style={{ y: yTextRight, opacity: opacityText }}
          className="flex flex-col items-end w-[30vw]"
        >
          <h1 className="text-[9vw] leading-none font-serif text-[#e5e1d8] tracking-tighter mix-blend-difference text-right break-words w-full">
            {watch.model}
          </h1>
          
          <div className="mt-8 flex items-center gap-6 pointer-events-auto">
            <span className="text-lg font-serif italic text-[#a39d91]">
              {watch.price}
            </span>
            <button className="px-6 py-3 border border-[#e5e1d8]/30 rounded-full text-xs font-mono text-[#e5e1d8] uppercase tracking-widest hover:bg-[#e5e1d8] hover:text-black transition-colors duration-500">
              Acquire
            </button>
          </div>
        </motion.div>

      </div>

      {/* Central Film Strip Image */}
      <motion.div 
        style={{ y: yImage, scale: scaleImage }}
        className="relative z-20 w-[35vw] h-[65vh] max-w-[600px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
        <img 
          src={watch.image} 
          alt={`${watch.brand} ${watch.model}`}
          className="w-full h-full object-cover filter contrast-125 saturate-50 opacity-90"
        />
        
        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/50 z-20" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/50 z-20" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/50 z-20" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/50 z-20" />
      </motion.div>

    </section>
  );
};

export default function DirectorSlider() {
  return (
    <div className="w-full bg-black min-h-screen">
      {WATCHES.map((watch, index) => (
        <WatchSection key={watch.id} watch={watch} index={index} />
      ))}
    </div>
  );
}
