import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createCheckout } from '../shopify';

export default function ProductOverlay({ watch, onClose }) {
  const containerRef = useRef(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // State for Video Audio and Image Gallery
  const [isMuted, setIsMuted] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const allImages = watch?.gallery?.length 
    ? watch.gallery.filter(Boolean) 
    : [watch?.image, watch?.image, watch?.image].filter(Boolean);
  const images = allImages.length >= 3 ? allImages.slice(0, 3) : [...allImages, ...Array(Math.max(1, 3 - allImages.length)).fill(allImages[0] || watch?.image)];
  const activeImage = images[activeImageIndex] || watch?.image || '/watches_new/MK9218_gold_auto_1.jpg';

  useEffect(() => {
    if (watch) setActiveImageIndex(0);
  }, [watch]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (watch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [watch]);

  if (!watch) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 bg-white text-black overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-10 lg:right-10 z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/10 bg-black/5 backdrop-blur-xl flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 shadow-xl text-black"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Master Scroll Container */}
        <div ref={containerRef} className="w-full bg-white">
          
          {/* ========================================= */}
          {/* SCROLL SECTION 1: THE NARRATIVE JOURNEY   */}
          {/* ========================================= */}
          <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row text-black min-h-screen">
            
            {/* LEFT: Watch Showcase Image */}
            <div className="w-full lg:w-[50%] h-[400px] sm:h-[500px] lg:h-auto flex items-center justify-center bg-white p-6 sm:p-12 lg:sticky lg:top-0">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src={activeImage} 
                  alt={watch.model}
                  className="w-full max-h-[75vh] object-contain mix-blend-multiply drop-shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* RIGHT: Natural Scrolling Text Blocks */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-24 space-y-16">
              
              {/* Block 1: Intro & Quote 1 */}
              <div 
                onMouseEnter={() => setActiveImageIndex(0)}
                className="w-full flex flex-col justify-center"
              >
                <p className="text-[10px] lg:text-xs tracking-[0.4em] font-mono text-black/40 uppercase mb-4 flex items-center gap-4">
                  <span>{watch.brand}</span>
                </p>
                <h1 
                  className="text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] font-normal tracking-[0.06em] uppercase mb-4 sm:mb-8 text-black drop-shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {watch.model}
                </h1>
                <p 
                  className="text-base sm:text-xl lg:text-2xl text-black/60 font-light max-w-xl leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
                </p>
              </div>

              {/* Block 2: Description & Quote 2 */}
              <div 
                onMouseEnter={() => setActiveImageIndex(1)}
                className="w-full flex flex-col justify-center border-t border-black/10 pt-12"
              >
                <p 
                  className="text-[1.5rem] sm:text-[2.2rem] lg:text-[3rem] text-black leading-[1.15] font-bold tracking-tight mb-6 sm:mb-8"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-black/70 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {watch?.description}
                </p>
              </div>

            </div>
          </div>

          {/* ========================================= */}
          {/* SCROLL SECTION 2: CINEMATIC VIDEO         */}
          {/* ========================================= */}
          <div className="relative w-full h-[80vh] lg:h-screen bg-black overflow-hidden flex items-center justify-center group">
            {/* The video plays automatically. Scaled aggressively to 135% to crop out Gemini watermark in all aspect ratios */}
            <video 
              autoPlay 
              loop 
              muted={isMuted}
              playsInline 
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover scale-[1.35]"
            >
              <source src={watch.cinematicVideo} type="video/mp4" />
            </video>
            {/* Subtle vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none" />
            
            {/* Sound Toggle Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
            >
              {isMuted ? 'Sound Off' : 'Sound On'}
            </button>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ root: containerRef, once: false, amount: 0.5 }}
              transition={{ duration: 1 }}
              className="relative z-10 text-center"
            >
              <h2 className="text-2xl lg:text-4xl tracking-[0.5em] font-light uppercase text-white/90" style={{ fontFamily: "'Inter', sans-serif" }}>
                Uncompromised
              </h2>
            </motion.div>
          </div>

          {/* ========================================= */}
          {/* SCROLL SECTION 3: TECHNICAL SPECS         */}
          {/* ========================================= */}
          <div className="relative w-full bg-black bg-gradient-to-b from-[#1a1a1a] via-[#050505] to-black py-24 lg:py-40 px-8 lg:px-24 overflow-hidden">
            
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[#8B6914] opacity-5 blur-[120px] pointer-events-none rounded-full" />
            
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 relative z-10">
              
              {/* Features List */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ root: containerRef, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/3"
              >
                <h3 className="text-xs tracking-[0.4em] font-bold uppercase text-[#8B6914] mb-12 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-[#8B6914]"></span>
                  Signature Details
                </h3>
                <ul className="space-y-10">
                  {watch.features && watch.features.map((feature, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ root: containerRef, amount: 0.8 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      key={idx} 
                      className="flex items-start text-lg lg:text-xl text-[#F5F5F0] font-light group cursor-default"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-4 shrink-0 group-hover:bg-[#8B6914]/20 group-hover:border-[#8B6914]/50 transition-colors duration-500">
                        <span className="text-[#8B6914] text-xs">⬦</span> 
                      </div>
                      <span className="pt-1 group-hover:text-white transition-colors duration-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Tactile 3D Sapphire Spec Sheet Cards */}
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: "⚙️", label: "Engine", value: watch.specs?.movement },
                  { icon: "🛡️", label: "Architecture", value: watch.specs?.caseMaterial },
                  { icon: "📐", label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
                  { icon: "💎", label: "Shield", value: watch.specs?.glass },
                  { icon: "💧", label: "Resistance", value: watch.specs?.waterResistance },
                  { icon: "🔗", label: "Band", value: watch.specs?.strap }
                ].map((spec, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: containerRef, amount: 0.3 }}
                    transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    key={idx} 
                    className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.5)] group cursor-default"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6914] group-hover:text-white transition-colors">
                        {spec.label}
                      </span>
                      <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">
                        {spec.icon}
                      </span>
                    </div>
                    <span className="text-lg lg:text-xl font-light text-white/90 group-hover:text-white transition-colors text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {spec.value}
                    </span>
                  </motion.div>
                ))}

                {/* Anchor Story Preview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ root: containerRef, amount: 0.3 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] border border-[#8B6914]/40 backdrop-blur-2xl flex flex-col gap-3 shadow-[0_20px_45px_rgba(0,0,0,0.6)] text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gemini-gradient flex items-center gap-2">
                      <span>📜</span> YOUR TIME ANCHOR NOTE (INCLUDED IN BOX)
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase border border-white/20 px-2.5 py-0.5 rounded-full">
                      FREE GIFT CARD
                    </span>
                  </div>
                  <p className="text-sm italic text-white/80 font-light leading-relaxed">
                    "For the late nights nobody saw and the battles fought in silence. Your time starts now."
                  </p>
                  <span className="text-[10px] text-white/40 tracking-wider font-mono uppercase">
                    ✦ Reply to our WhatsApp concierge text after ordering to customize your note
                  </span>
                </motion.div>
              </div>
              
            </div>
          </div>

          {/* ========================================= */}
          {/* SCROLL SECTION 4: THE CLOSER & BUY        */}
          {/* ========================================= */}
          <div className="relative w-full bg-white text-black py-20 sm:py-32 lg:py-56 flex flex-col items-center justify-center text-center px-4 sm:px-8 overflow-hidden">
            
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: containerRef, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-[2.5rem] sm:text-[4rem] lg:text-[7rem] font-bold tracking-tighter mb-6 sm:mb-8 leading-[0.9] text-black"
              style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
            >
              Own the moment.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: containerRef, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-xl lg:text-2xl text-black/60 mb-20 max-w-2xl mx-auto font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Some wait for their time. You wear yours.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ root: containerRef, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-8"
            >
              <div className="flex flex-col items-center">
                <span className="text-[3rem] sm:text-[5rem] lg:text-[7rem] leading-none text-black font-light tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {watch.price}
                </span>
              </div>
              
              {watch.outOfStock ? (
                <button 
                  onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
                  className="px-8 sm:px-14 py-5 sm:py-7 bg-black/5 border border-black/10 text-black hover:bg-black hover:text-white hover:scale-[1.01] active:scale-[0.99] rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4"
                >
                  Notify Me — WhatsApp
                </button>
              ) : (
                <button 
                  onClick={async () => {
                    if (isRedirecting) return;
                    setIsRedirecting(true);
                    try {
                      const cart = await createCheckout(watch.shopifyVariantId);
                      window.location.href = cart.checkoutUrl;
                    } catch (err) {
                      console.warn("Checkout failed:", err);
                      window.location.href = `https://smgnhj-dr.myshopify.com/cart/${watch.shopifyVariantId}:1`;
                    }
                  }}
                  disabled={isRedirecting}
                  className="btn-google-pill-gold text-base py-5 px-12 sm:px-16 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isRedirecting ? (
                    <span className="flex items-center gap-3">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      REDIRECTING TO CHECKOUT...
                    </span>
                  ) : `BUY TIME — ${watch.price} →`}
                </button>
              )}
            </motion.div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
