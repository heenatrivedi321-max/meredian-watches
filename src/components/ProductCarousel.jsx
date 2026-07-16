import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { shopifyClient } from '../shopify';

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hardcoded Meridian Watches with Sub-10k Pricing Strategy
    const meridianWatches = [
      {
        id: "w1",
        title: "OLEVS ANALOG QUARTZ",
        desc: "Classic Stainless Steel / Luminous Hands",
        price: "₹4,499",
        image: "/watches/ea_watch.png",
        variantId: "gid://shopify/ProductVariant/111"
      },
      {
        id: "w2",
        title: "HEXA HUSTLER AUTOMATIC",
        desc: "Mechanical Skeleton / Mineral Glass",
        price: "₹7,999",
        image: "/watches/hx_watch.png",
        variantId: "gid://shopify/ProductVariant/222"
      },
      {
        id: "w3",
        title: "FOSSIL HERITAGE",
        desc: "Gold Finish / Exposed Gearbox",
        price: "₹9,499",
        image: "/watches/fossil-gold-me3280.png",
        variantId: "gid://shopify/ProductVariant/333"
      },
      {
        id: "w4",
        title: "GIORGIO CHRONOGRAPH",
        desc: "Business Moon Phase / Water Resistant",
        price: "₹6,499",
        image: "/watches/gi_watch.png",
        variantId: "gid://shopify/ProductVariant/444"
      },
      {
        id: "w5",
        title: "FORSINING TOURBILLON",
        desc: "Retro Skeleton Hollow / Self Winding",
        price: "₹9,499",
        image: "/watches/tx_watch.png",
        variantId: "gid://shopify/ProductVariant/555"
      }
    ];

    setProducts(meridianWatches);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-black py-12 md:py-24 overflow-hidden pl-4 md:pl-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-[var(--text-color)] font-anton text-2xl tracking-widest uppercase animate-pulse">
          LOADING ARCHIVE...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-black py-12 md:py-24 overflow-hidden pl-4 md:pl-12">
      
      {/* Horizontal Scroll Container */}
      <div className="w-full flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 pr-12 hide-scrollbar">
        
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group flex-none w-[85vw] md:w-[400px] lg:w-[450px] h-[70vh] md:h-[75vh] rounded-[2rem] snap-center relative overflow-hidden flex flex-col justify-between pt-10 pb-8 px-8 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-[#ffffff10] bg-gradient-to-b from-[#111] to-[#050505] transition-all duration-700 hover:shadow-[0_0_60px_rgba(212,175,55,0.15)] hover:border-[#d4af37]/30"
          >
            {/* The Image Container with a trick to blend JPGs into dark themes: 
                We use a radial gradient glow behind the watch, and apply mix-blend-screen if it has a dark bg, 
                or if it's a PNG it just looks great. For white background JPGs, we can use an internal light card.
                Let's use a beautiful floating container. */}
            <div className="absolute inset-0 bg-[#e0e0e0] z-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] group-hover:opacity-0 transition-opacity duration-700" />
            
            <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
               {/* We render the image with a subtle floating animation. 
                   mix-blend-multiply works perfectly when the background turns light (#e0e0e0) on hover, 
                   making the white background of the image disappear. When not hovered, it's a dark card. 
                   Actually, let's just make the card a premium silver/light grey by default so the multiply blend ALWAYS works beautifully. */}
            </div>

            {/* Let's redefine the base to be light-themed cards inside the dark carousel for extreme contrast and premium feel */}
            <div className="absolute inset-0 bg-[#f5f5f5] z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,rgba(220,220,220,1)_100%)] z-0" />
            
            {/* Watch Image */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-12 mt-12 mb-20 pointer-events-none">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-contain mix-blend-multiply filter contrast-[1.1] saturate-[1.1] transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl" 
              />
            </div>

            {/* Top Content */}
            <div className="relative z-20 flex flex-col items-center">
              {/* Massive Faded Typography Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none -top-16">
                <span className="font-anton text-[12rem] text-black/5 leading-none tracking-tighter">
                  0{index + 1}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-anton text-3xl md:text-4xl text-black text-center leading-[1.1] tracking-wide uppercase mt-4">
                {product.title}
              </h3>

              {/* Description */}
              <p className="text-black/50 text-xs md:text-sm font-sans text-center mt-2 tracking-widest uppercase">
                {product.desc}
              </p>
            </div>

            {/* Bottom Buttons Container */}
            <div className="w-full flex flex-col gap-3 z-20 mt-auto">
              <button 
                onClick={() => {
                  window.open(`https://meridianwatches.store/cart/${product.variantId.split('/').pop()}:1`, '_blank');
                }}
                className="hover-target flex-1 bg-black text-white font-anton text-lg tracking-widest py-4 rounded shadow-xl hover:bg-[#d4af37] active:scale-95 transition-all duration-300 flex justify-between px-6 items-center border border-transparent"
              >
                <span>ADD TO CART</span>
                <span>{product.price}</span>
              </button>
              
              <button className="hover-target relative overflow-hidden bg-transparent border border-black/20 text-black font-anton text-lg tracking-widest px-6 py-4 rounded shadow-xl hover:bg-black hover:text-white hover:border-black active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group">
                <span className="hidden md:inline relative z-10">VIEW</span>
                <div className="relative w-6 h-6 overflow-hidden">
                  <ArrowUpRight className="absolute inset-0 transform group-hover:translate-x-full group-hover:-translate-y-full transition-transform duration-300 ease-in-out" size={24} />
                  <ArrowUpRight className="absolute inset-0 transform -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-in-out" size={24} />
                </div>
              </button>
            </div>
          </motion.div>
        ))}

      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </section>
  );
}
