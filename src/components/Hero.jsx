import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[120vh] flex flex-col items-center pt-40 pb-12 overflow-hidden bg-black">
      
      {/* Massive Full-Bleed Background Banner */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/watches/fossil-brown-me3270-lifestyle.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[var(--bg-color)] pointer-events-none z-0"></div>
      {/* Massive Bucks-Style Tagline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full flex flex-col items-center justify-center z-10 pointer-events-none mt-10 md:mt-4"
      >
        <div className="flex flex-col items-center leading-[0.95] font-anton text-[12vw] md:text-[9vw] lg:text-[10vw] uppercase tracking-wide text-[var(--text-color)]">
          <div className="flex gap-4 md:gap-6">
            <span className="text-outline-thick">THE TIMEPIECE</span>
            <span>THAT</span>
          </div>
          <span>MAKES OTHER WATCHES</span>
          <span>INSECURE</span>
        </div>
      </motion.div>

      {/* The Horizontal Dashed Line (Background) */}
      <div className="absolute top-[65%] w-full flex items-center justify-between z-0 font-sans text-[10px] md:text-xs tracking-widest text-[var(--text-color)] opacity-40">
        <div className="w-12 md:w-32 border-t border-dashed border-[var(--text-color)]/30 mr-4"></div>
        <span className="whitespace-nowrap">CALIBER NO.01</span>
        <div className="flex-1 border-t border-dashed border-[var(--text-color)]/30 mx-4"></div>
        <span className="whitespace-nowrap">SAPPHIRE CRYSTAL & TOURBILLON</span>
        <div className="w-12 md:w-32 border-t border-dashed border-[var(--text-color)]/30 ml-4"></div>
      </div>

      {/* The lifestyle background is doing the heavy lifting now! */}

      {/* Side Navigation Arrows (Half hidden in corners exactly like Bucks Sauce) */}
      <div className="absolute bottom-0 w-full flex justify-between z-40 pointer-events-none">
        <button className="pointer-events-auto w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--text-color)] flex items-center justify-center text-[var(--bg-color)] hover:bg-white transition-colors transform -translate-x-1/2 translate-y-1/2">
          <ArrowLeft size={32} className="ml-8 md:ml-12" strokeWidth={1.5} />
        </button>
        <button className="pointer-events-auto w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--text-color)] flex items-center justify-center text-[var(--bg-color)] hover:bg-white transition-colors transform translate-x-1/2 translate-y-1/2">
          <ArrowRight size={32} className="mr-8 md:mr-12" strokeWidth={1.5} />
        </button>
      </div>

    </section>
  );
}
