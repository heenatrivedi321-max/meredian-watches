import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createCheckout } from '../shopify';
import { createPaymentLink } from '../razorpay';

export default function ProductOverlay({ watch, onClose }) {
  const containerRef = useRef(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // State for Video Audio and Image Gallery
  const [isMuted, setIsMuted] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const allImages = watch?.gallery?.length ? watch.gallery : [watch?.image, watch?.image, watch?.image];
  const images = allImages.length >= 3 ? allImages.slice(0, 3) : [...allImages, ...Array(3 - allImages.length).fill(allImages[allImages.length - 1])];
  const activeImage = images[activeImageIndex] || watch?.image;

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
        className="fixed inset-0 z-50 bg-[#030303] text-white overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-10 lg:right-10 z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/10 bg-black/5 backdrop-blur-xl flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 shadow-xl text-black"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Master Scroll Container */}
        <div ref={containerRef} className="w-full h-screen overflow-y-auto overflow-x-hidden hide-scrollbar scroll-smooth bg-white">
          
          {/* ========================================= */}
          {/* SCROLL SECTION 1: THE NARRATIVE JOURNEY   */}
          {/* ========================================= */}
          <div className="relative w-full flex flex-col lg:flex-row text-black">
            
            {/* LEFT: Pinned Hovering Watch */}
            <div className="w-full lg:w-[50%] h-[50vh] lg:h-screen sticky top-0 flex items-center justify-center bg-white z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src={activeImage} 
                  alt={watch.model}
                  className="w-[90%] h-[90%] object-contain mix-blend-multiply drop-shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* RIGHT: Natural Scrolling Text Blocks */}
            <div className="w-full lg:w-[50%] flex flex-col z-20">
              
              {/* Block 1: Intro & Quote 1 */}
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ root: containerRef, amount: 0.5 }}
                onViewportEnter={() => setActiveImageIndex(0)}
                className="w-full min-h-[80vh] flex flex-col justify-center px-8 lg:px-24 py-24"
              >
                <p className="text-[10px] lg:text-xs tracking-[0.4em] font-semibold text-black/40 uppercase mb-4 flex items-center gap-4">
                  <span>{watch.brand}</span>
                  <span className="w-8 h-[1px] bg-black/20"></span>
                </p>
                <h1 
                  className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[6.5rem] leading-[1.1] font-bold tracking-normal uppercase mb-4 sm:mb-8 rainbow-shimmer"
                  style={{ fontFamily: "'Anton', 'Inter', sans-serif" }}
                >
                  {watch?.model}
                </h1>
                <p 
                  className="text-[1.2rem] sm:text-[1.75rem] lg:text-[3rem] text-black/80 leading-tight font-medium tracking-tighter"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
                </p>
              </motion.div>

              {/* Block 2: Description & Quote 2 */}
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ root: containerRef, amount: 0.5 }}
                onViewportEnter={() => setActiveImageIndex(1)}
                className="w-full min-h-[80vh] flex flex-col justify-center px-8 lg:px-24 py-24"
              >
                <p 
                  className="text-[1.5rem] sm:text-[2rem] lg:text-[3.5rem] text-black leading-tight font-medium tracking-tighter mb-8 sm:mb-12"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
                </p>
                <p className="text-lg lg:text-xl text-black/60 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {watch?.description}
                </p>
              </motion.div>

              {/* Block 3: Final Image Trigger */}
              <motion.div 
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                viewport={{ root: containerRef, amount: 0.5 }}
                onViewportEnter={() => setActiveImageIndex(2)}
                className="w-full h-[50vh]"
              />

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

              {/* Specs Grid */}
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-16">
                {[
                  { label: "Engine", value: watch.specs?.movement },
                  { label: "Architecture", value: watch.specs?.caseMaterial },
                  { label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
                  { label: "Shield", value: watch.specs?.glass },
                  { label: "Resistance", value: watch.specs?.waterResistance },
                  { label: "Band", value: watch.specs?.strap }
                ].map((spec, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: containerRef, amount: 0.3 }}
                    transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                    key={idx} 
                    className="flex flex-col border-b border-white/5 pb-6 group hover:border-[#8B6914]/50 transition-colors duration-500 cursor-default"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6914]/70 mb-3 group-hover:text-[#8B6914] transition-colors duration-300">{spec.label}</span>
                    <span className="text-xl lg:text-2xl font-light text-white/80 group-hover:text-white transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {spec.value}
                    </span>
                  </motion.div>
                ))}
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
              className="relative z-10 flex flex-col items-center gap-12"
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
                      const url = await createPaymentLink(watch);
                      window.location.href = url;
                    } catch (err) {
                      console.warn("Payment Link failed, trying Shopify:", err);
                      try {
                        const cart = await createCheckout(watch.shopifyVariantId);
                        window.location.href = cart.checkoutUrl;
                      } catch (err2) {
                        window.location.href = `https://shop.meredianwatches.store/cart/${watch.shopifyVariantId}:1`;
                      }
                    }
                  }}
                  disabled={isRedirecting}
                  className="px-8 sm:px-14 py-5 sm:py-7 bg-black text-white hover:bg-black/80 hover:scale-[1.01] active:scale-[0.99] rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isRedirecting ? (
                    <span className="flex items-center gap-3">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting...
                    </span>
                  ) : 'Buy Time'}
                </button>
              )}
            </motion.div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
