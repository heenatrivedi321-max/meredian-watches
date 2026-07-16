import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import ShopShowcase from './ShopShowcase';

const collection = [
  { 
    name: "OLEVS ANALOG QUARTZ", 
    price: "4,499", 
    mrp: "14,999",
    image: "/watches/ea_watch.png",
    tagline: "The Everyday Masterpiece"
  },
  { 
    name: "HEXA HUSTLER AUTO", 
    price: "7,999", 
    mrp: "22,999",
    image: "/watches/hx_watch.png",
    tagline: "Exposed Mechanics"
  },
  { 
    name: "FOSSIL HERITAGE", 
    price: "9,499", 
    mrp: "29,999",
    image: "/watches/fossil-gold-me3280.png",
    tagline: "Timeless Prestige"
  }
];

export default function UltimateWatchStore() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Subtle parallax for the background video
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="w-full bg-[#050505] min-h-screen flex flex-col text-white overflow-hidden font-sans">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60"
            src="/Fossil_Gold_Master.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-9xl font-anton tracking-[0.1em] uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              MERIDIAN
            </h1>
            <p className="text-sm md:text-xl tracking-[0.4em] font-light text-white/70 uppercase">
              The Architecture of Time
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16"
          >
            <button className="flex items-center space-x-4 border border-white/30 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md bg-black/20">
              <span className="tracking-widest text-sm uppercase">Enter The Vault</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Engineering Excellence (Gears Video) */}
      <section className="relative py-32 w-full flex items-center justify-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              src="/Watch_gears_Clean.mp4"
            />
          </div>

          <div className="flex flex-col space-y-8">
            <h2 className="text-4xl md:text-6xl font-anton tracking-widest uppercase">
              Uncompromising <br/> Precision.
            </h2>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              We bypass the traditional markup channels to bring you tourbillon-grade movements, 316L aerospace steel, and domed sapphire crystal at a fraction of the legacy brand cost. 
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-anton mb-2">316L</div>
                <div className="text-xs tracking-widest text-white/50 uppercase">Surgical Steel</div>
              </div>
              <div>
                <div className="text-3xl font-anton mb-2">50M</div>
                <div className="text-xs tracking-widest text-white/50 uppercase">Water Resistance</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. The Collection */}
      <section className="py-32 w-full bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-anton tracking-widest uppercase mb-4">The Collection</h2>
            <p className="tracking-[0.3em] text-white/50 text-sm uppercase">Curated Masterpieces</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collection.map((watch, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center group cursor-pointer transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5"
              >
                <div className="w-full aspect-square mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img src={watch.image} alt={watch.name} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="text-xs tracking-[0.2em] text-white/40 uppercase mb-3">{watch.tagline}</div>
                <h3 className="text-2xl font-anton tracking-wider mb-6">{watch.name}</h3>
                
                <div className="flex items-end space-x-3 mb-8">
                  <span className="text-3xl font-light">₹{watch.price}</span>
                  <span className="text-sm text-white/30 line-through pb-1">₹{watch.mrp}</span>
                </div>
                
                <button className="w-full py-4 border border-white/20 rounded-full text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The 3D Finale */}
      <section className="py-32 w-full border-t border-white/5 relative bg-[#050505]">
        <div className="text-center mb-16 px-6">
          <h2 className="text-4xl md:text-6xl font-anton tracking-widest uppercase mb-4">Interact</h2>
          <p className="tracking-[0.2em] text-white/50 text-sm uppercase">Examine every angle.</p>
        </div>
        <ShopShowcase />
      </section>

    </div>
  );
}
