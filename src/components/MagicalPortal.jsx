import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import '@google/model-viewer';

const products = [
  {
    title: "OLEVS Watches for Men Original Analog Quartz Stylish Brown Leather Luxury Business Chronograph",
    price: "3,420",
    mrp: "3,900",
    image: "/616VL9Lw5eL._SX679_.jpg"
  },
  {
    title: "OLEVS Watches for Men Chronograph Business Wrist Watches Analog Quartz Moon Phase Stainless Steel",
    price: "3,419",
    mrp: "14,999",
    image: "/61aosvrrvNL._SX679_.jpg"
  },
  {
    title: "HEXA Hustler Automatic Mechanical Watch for Men | Multifunction Analog Dial",
    price: "6,999",
    mrp: "19,999",
    image: "/714YTmfbWsL._SX679_.jpg"
  }
];

export default function MagicalPortal() {
  const [entered, setEntered] = useState(false);
  const containerRef = useRef(null);

  if (!entered) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <button 
          onClick={() => setEntered(true)}
          className="text-white/50 hover:text-white font-sans tracking-[0.4em] uppercase text-xs md:text-sm transition-all duration-500 pb-2 border-b border-transparent hover:border-white"
        >
          Enter The Meridian
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-black relative">
      
      {/* The 3D Centerpiece (Fixed to viewport) */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <model-viewer
          src="/golden_watch.glb"
          auto-rotate
          rotation-per-second="20deg"
          camera-controls
          disable-zoom
          style={{ width: '60%', height: '60%' }}
          className="pointer-events-auto filter drop-shadow-[0_0_30px_rgba(255,215,0,0.15)] mix-blend-screen opacity-90"
        ></model-viewer>
      </div>

      {/* Cinematic World 1: The Tunnel (Speed & Status) */}
      <section className="h-[120vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <video 
            src="/Porsche_driving_through_tunnel_202606281316.mp4" 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          
          <div className="relative z-10 w-full px-8 md:px-20 pt-32 flex justify-between items-start pointer-events-none">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-lg max-w-sm">
              <h2 className="text-white font-anton text-2xl tracking-widest uppercase mb-2">Aerospace Velocity</h2>
              <p className="text-white/60 font-sans text-xs tracking-widest uppercase leading-relaxed">
                Precision calibrated for extreme g-forces. The timepiece of choice for apex performers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic World 2: The Core (Engineering) */}
      <section className="h-[120vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
          <video 
            src="/Watch_gears_Clean.mp4" 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-color-dodge"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 w-full px-8 md:px-20 pb-32 flex justify-end items-end h-full pointer-events-none">
            <div className="backdrop-blur-xl bg-black/40 border border-[#d09e53]/30 p-8 rounded-lg max-w-sm text-right">
              <h2 className="text-[#d09e53] font-anton text-3xl tracking-widest uppercase mb-2">The Engine Room</h2>
              <p className="text-white/70 font-sans text-xs tracking-widest uppercase leading-relaxed">
                Tourbillon-grade mechanics. 316L Surgical Steel. Flawless execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic World 3: The Depths (Durability) */}
      <section className="h-[120vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#000510]">
          <video 
            src="/Diving_bell_underwater_illuminat…_202606281332.mp4" 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
          
          <div className="relative z-10 w-full px-8 md:px-20 pt-32 flex justify-start items-start pointer-events-none">
            <div className="backdrop-blur-md bg-[#001530]/40 border border-[#00aaff]/30 p-6 rounded-lg max-w-sm">
              <h2 className="text-[#00aaff] font-anton text-2xl tracking-widest uppercase mb-2">Pressure Tested</h2>
              <p className="text-[#00aaff]/60 font-sans text-xs tracking-widest uppercase leading-relaxed">
                50M Water Resistance. Built to survive the crush of the abyss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Gallery (Product Selection) */}
      <section className="min-h-screen relative bg-black py-32 z-50">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-anton text-white tracking-widest uppercase mb-4">The Collection</h2>
            <p className="text-white/50 tracking-[0.3em] font-sans text-xs uppercase">Acquire The Masterpiece</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-[#d09e53]/50 transition-colors duration-500">
                <div className="w-full aspect-square mb-8 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <img src={product.image} alt="Watch" className="w-full h-full object-contain filter drop-shadow-2xl mix-blend-screen" />
                </div>
                
                <h3 className="text-white font-sans text-sm md:text-base leading-snug mb-6 text-center font-light">
                  {product.title}
                </h3>
                
                <div className="flex items-center space-x-3 mb-8 mt-auto">
                  <span className="text-3xl font-anton text-[#d09e53] tracking-wider">₹{product.price}</span>
                  {product.mrp && (
                    <span className="text-sm font-sans text-white/30 line-through">₹{product.mrp}</span>
                  )}
                </div>
                
                <button className="w-full py-4 bg-white text-black font-anton tracking-widest uppercase text-lg hover:bg-[#d09e53] transition-colors duration-300">
                  Add To Vault
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
