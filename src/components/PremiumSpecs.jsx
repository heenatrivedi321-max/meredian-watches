import { motion, useScroll, useTransform } from 'framer-motion';
import { Droplet, FileText, Printer, Sun } from 'lucide-react';
import { useRef } from 'react';
import WebGLFluidBg from './WebGLFluidBg';

export default function PremiumSpecs() {
  const containerRef = useRef(null);
  
  // Scroll tracking for the quotes
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress into vertical movement for the quotes
  const leftQuoteY = useTransform(scrollYProgress, [0, 1], ["50%", "-150%"]);
  const rightQuoteY = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);

  const specs = [
    {
      title: "PRECISION MOVEMENTS",
      icon: <Droplet className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-color)]" strokeWidth={1} />,
      desc: "Because powering a watch with a cheap plastic movement is a crime. Our engineered calibers will outlive you.",
      stickyTop: "top-[10vh]", // Base top
      zIndex: 10
    },
    {
      title: "SAPPHIRE CRYSTAL",
      icon: <FileText className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-color)]" strokeWidth={1} />,
      desc: "If you want glass that scratches when you breathe on it, go to a gift shop. This is scratch-resistant crystal. It could probably stop a small bullet.",
      stickyTop: "top-[calc(10vh+70px)]", // 70px offset for the header tab
      zIndex: 20
    },
    {
      title: "NO MIDDLEMEN",
      icon: <Printer className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-color)]" strokeWidth={1} />,
      desc: "We cut out the middlemen entirely. We manufacture and ship directly to your door, allowing you to pay for the watch, not the boutique's rent.",
      stickyTop: "top-[calc(10vh+140px)]", // 140px offset
      zIndex: 30
    },
    {
      title: "316L STAINLESS STEEL",
      icon: <Sun className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-color)]" strokeWidth={1} />,
      desc: "Flimsy metal is for toys. We use 316L aerospace-grade stainless steel that feels heavy, cold, and permanent on the wrist.",
      stickyTop: "top-[calc(10vh+210px)]", // 210px offset
      zIndex: 40
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full bg-[#0a0a0a] py-32 px-4 md:px-12 overflow-visible">
      
      {/* Interactive WebGL Fluid Background */}
      <WebGLFluidBg />


      {/* 3. The Sliding Typography Quotes (Hidden on Mobile, Visible on Desktop) */}
      <motion.div 
        className="hidden lg:flex absolute left-8 top-[30%] w-[25vw] flex-col items-start z-10 pointer-events-none"
        style={{ y: leftQuoteY }}
      >
        <div className="font-anton text-[5vw] leading-[1] text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/10 tracking-tighter uppercase mb-6">
          "PEOPLE DON'T<br/>KNOW WHAT THEY<br/>WANT UNTIL YOU<br/>SHOW IT TO THEM."
        </div>
        <p className="font-sans text-sm tracking-[0.2em] text-[var(--text-color)]/50 uppercase border-l border-[var(--text-color)]/20 pl-4">
          — Steve Jobs <br/>
          <span className="text-[var(--text-color)]/90 font-bold mt-2 block">SO HERE IT IS. BUY IT.</span>
        </p>
      </motion.div>

      <motion.div 
        className="hidden lg:flex absolute right-8 top-[50%] w-[25vw] flex-col items-end text-right z-10 pointer-events-none"
        style={{ y: rightQuoteY }}
      >
        <div className="font-anton text-[5vw] leading-[1] text-transparent bg-clip-text bg-gradient-to-bl from-[var(--text-color)] to-[var(--text-color)]/10 tracking-tighter uppercase mb-6">
          "ART IS<br/>WHAT YOU CAN<br/>GET AWAY<br/>WITH."
        </div>
        <p className="font-sans text-sm tracking-[0.2em] text-[var(--text-color)]/50 uppercase border-r border-[var(--text-color)]/20 pr-4">
          — Andy Warhol <br/>
          <span className="text-[var(--text-color)]/90 font-bold mt-2 block">WE GOT AWAY WITH IT. NOW BUY IT.</span>
        </p>
      </motion.div>

      {/* 4. The Sticky Cards Container */}
      <div className="relative max-w-[500px] mx-auto flex flex-col pt-20 pb-[50vh] z-20">
        
        {specs.map((spec, idx) => (
          <div 
            key={idx} 
            className={`sticky ${spec.stickyTop} w-full flex flex-col mb-[10vh] drop-shadow-2xl`}
            style={{ zIndex: spec.zIndex }}
          >
            {/* The Cream Header Block */}
            <div className="w-full bg-[var(--text-color)] rounded-xl py-4 px-6 md:px-8 flex justify-between items-center shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 border border-black/10">
              <div className="w-3 h-3 bg-[#0a0a0a] rounded-full"></div>
              <h3 className="font-anton text-2xl md:text-3xl text-[#0a0a0a] tracking-widest uppercase m-0 pt-1">
                {spec.title}
              </h3>
              <div className="w-3 h-3 bg-[#0a0a0a] rounded-full"></div>
            </div>

            {/* The Black Content Block */}
            <div className="w-full bg-black border border-[var(--text-color)]/20 rounded-b-xl px-8 py-16 md:py-24 -mt-4 shadow-2xl flex flex-col items-center min-h-[55vh] md:min-h-[50vh] relative z-0 backdrop-blur-xl">
              
              {/* Icon Circle (Thin cream border) */}
              <div className="w-24 h-24 rounded-full border-[1.5px] border-[var(--text-color)]/60 flex items-center justify-center mb-8 bg-transparent">
                {spec.icon}
              </div>

              {/* Text */}
              <p className="text-[var(--text-color)]/90 text-center text-base md:text-lg font-sans tracking-wide leading-relaxed font-light">
                {spec.desc}
              </p>
              
            </div>
          </div>
        ))}
        
      </div>

    </section>
  );
}
