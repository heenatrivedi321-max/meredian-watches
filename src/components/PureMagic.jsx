import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const products = [
  {
    title: "OLEVS Original Analog Quartz Stylish Brown Leather",
    price: "3,420",
    mrp: "3,900",
    image: "/616VL9Lw5eL._SX679_.jpg"
  },
  {
    title: "OLEVS Chronograph Moon Phase Stainless Steel",
    price: "3,419",
    mrp: "14,999",
    image: "/61aosvrrvNL._SX679_.jpg"
  },
  {
    title: "HEXA Hustler Automatic Mechanical Multifunction",
    price: "6,999",
    mrp: "19,999",
    image: "/714YTmfbWsL._SX679_.jpg"
  }
];

const sections = [
  {
    image: "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "AEROSPACE VELOCITY",
    subtitle: "Engineered for extreme performance."
  },
  {
    image: "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "THE ENGINE ROOM",
    subtitle: "Precision tourbillon-grade mechanics."
  },
  {
    image: "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "SAPPHIRE RESERVE",
    subtitle: "Built to survive the crush of the abyss."
  }
];

function CurtainSection({ data, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Extremely subtle scale effect for the image to make it feel alive without lagging
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={ref} className="h-screen w-full sticky top-0 overflow-hidden bg-black flex items-center justify-center">
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 w-full h-full"
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${data.image}')` }}
        />
        {/* Subtle vignette to help text readability at edges */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Difference Blend Mode Typography - The 'Magic' Effect */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-difference w-full px-4">
        <h2 className="text-white font-anton text-5xl md:text-8xl tracking-widest uppercase mb-4 text-center">
          {data.title}
        </h2>
        <p className="text-white font-sans text-sm md:text-xl tracking-[0.3em] uppercase text-center font-light">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}

export default function PureMagic() {
  return (
    <div className="w-full bg-black relative">
      
      {/* Intro Overlay */}
      <div className="h-screen sticky top-0 w-full bg-[#0a0a0a] flex items-center justify-center z-0">
        <h1 className="text-white font-anton text-4xl tracking-widest uppercase mix-blend-difference">
          ENTER THE MERIDIAN
        </h1>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>

      {/* The Curtain Reveals */}
      <div className="relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {sections.map((section, idx) => (
          <CurtainSection key={idx} data={section} index={idx} />
        ))}
      </div>

      {/* The Gallery */}
      <section className="min-h-screen relative z-20 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 mix-blend-difference">
            <h2 className="text-4xl md:text-6xl font-anton text-white tracking-widest uppercase mb-4">The Collection</h2>
            <p className="text-white tracking-[0.3em] font-sans text-xs uppercase">Acquire The Masterpiece</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer">
                
                <div className="w-full aspect-square mb-8 overflow-hidden bg-white/5 rounded-sm flex items-center justify-center p-8 transition-all duration-500 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={product.image} 
                    alt="Watch" 
                    className="w-full h-full object-contain filter drop-shadow-2xl mix-blend-screen" 
                  />
                </div>
                
                <div className="w-full text-center px-4">
                  <h3 className="text-white/80 font-sans text-sm leading-snug mb-4 font-light tracking-wide h-10 overflow-hidden text-ellipsis">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-3 mb-8">
                    <span className="text-2xl font-anton text-white tracking-wider">₹{product.price}</span>
                    {product.mrp && (
                      <span className="text-xs font-sans text-white/30 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  
                  <button className="w-full py-4 border border-white/20 text-white font-anton tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all duration-300">
                    Acquire
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
