import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WATCHES = [
  {
    id: 1,
    brand: "OLEVS",
    model: "BROWN LEATHER",
    price: "₹3,420",
    image: "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    specs: "Quartz Movement / 3ATM / Mineral Glass"
  },
  {
    id: 2,
    brand: "OLEVS",
    model: "MOON PHASE",
    price: "₹3,419",
    image: "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    specs: "Chronograph / Luminous / Steel Band"
  },
  {
    id: 3,
    brand: "HEXA",
    model: "HUSTLER AUTO",
    price: "₹6,999",
    image: "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    specs: "Mechanical Auto / 45mm Case / Leather"
  },
  {
    id: 4,
    brand: "FORSINING",
    model: "TOURBILLON",
    price: "₹8,106",
    image: "/47ce201d-8d9c-4196-9b22-9bb0c5aaf6a8.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    specs: "Skeleton Dial / Moon Phase / Self-Winding"
  },
  {
    id: 5,
    brand: "OLEVS",
    model: "DIAMOND DRESS",
    price: "₹3,420",
    image: "/1fac9e41-dea2-4b7d-9f0b-0e52c4aa0464.__CR0,2,1500,928_PT0_SX970_V1___.jpeg",
    specs: "Diamond Bezel / Date Window / Waterproof"
  },
  {
    id: 6,
    brand: "OLEVS",
    model: "PREMIUM CHRONO",
    price: "₹3,420",
    image: "/9a2d3f68-88e2-4100-831e-054c539cafcc.__CR0,0,1500,928_PT0_SX970_V1___.jpeg",
    specs: "Luxury Business / Chrono / Luminous Hands"
  }
];

const ProductRow = ({ watch, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -50 : 50, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, x }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 py-24 border-b border-[#1a1a1a] group`}
    >
      <div className="w-full md:w-1/2 overflow-hidden bg-[#0a0a0a] relative aspect-video cursor-crosshair">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
        <img 
          src={watch.image} 
          alt={watch.model}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8">
        <span className="text-[#8a8a8a] font-mono text-xs tracking-widest uppercase mb-4">No. 0{index + 1} — {watch.brand}</span>
        <h3 className="text-4xl md:text-5xl font-serif text-[#eaeaea] mb-6">{watch.model}</h3>
        <p className="text-[#8a8a8a] text-sm uppercase tracking-widest font-mono mb-8">{watch.specs}</p>
        
        <div className="flex items-center gap-8">
          <span className="text-2xl font-serif italic text-[#eaeaea]">{watch.price}</span>
          <button className="px-8 py-3 border border-[#333] text-[#eaeaea] text-xs uppercase tracking-widest hover:bg-[#eaeaea] hover:text-black transition-colors duration-500">
            Acquire
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductProof() {
  return (
    <section className="w-full bg-[#050505] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="mb-24">
          <h2 className="text-[#eaeaea] font-serif text-3xl mb-4">The Collection</h2>
          <div className="w-12 h-[1px] bg-[#333]" />
        </div>

        <div className="flex flex-col">
          {WATCHES.map((watch, index) => (
            <ProductRow key={watch.id} watch={watch} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
