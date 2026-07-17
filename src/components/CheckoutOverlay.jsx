import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { X, Lock, CheckCircle2, ShieldCheck, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

export default function CheckoutOverlay() {
  const { isCheckoutOpen, checkoutItem, closeCheckout } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State (Expanded for Amazon)
  const [formData, setFormData] = useState({
    email: '', phone: '', firstName: '', lastName: '', 
    pincode: '', flat: '', area: '', landmark: '', city: '', state: ''
  });

  // Ola Maps Autocomplete State
  const [olaQuery, setOlaQuery] = useState('');
  const [olaPredictions, setOlaPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen) {
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        if (!v.paused) {
          v.dataset.wasPlaying = "true";
          v.pause();
        }
      });
    } else {
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        if (v.dataset.wasPlaying === "true") {
          v.play().catch(() => {});
          v.dataset.wasPlaying = "false";
        }
      });
    }
  }, [isCheckoutOpen]);

  // Mouse Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const imageRotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const imageRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const textTranslateX = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const textTranslateY = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const formRotateX = useTransform(smoothY, [-0.5, 0.5], [2, -2]);
  const formRotateY = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      if (olaQuery.length < 3) {
        setOlaPredictions([]);
        return;
      }
      setIsSearching(true);
      try {
        const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
        const res = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(olaQuery)}&api_key=${apiKey}`);
        const data = await res.json();
        if (data.predictions) {
          setOlaPredictions(data.predictions);
        } else {
          setOlaPredictions([]);
        }
      } catch (error) {
        console.error("Ola Maps API Error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchPlaces, 400);
    return () => clearTimeout(debounce);
  }, [olaQuery]);

  const handleSelectPrediction = (prediction) => {
    setOlaQuery(prediction.description);
    setFormData({ ...formData, area: prediction.description });
    setOlaPredictions([]);
  };
  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const sendTelegramNotification = (watch, form) => {
    // Hardcoded to bypass Vite .env caching issues
    const botToken = "8868870547:AAHBcfNqIt0hNXMysC--wJtwn91jNE0Gc4g";
    const chatId = "8056887610";
    
    if (!botToken || !chatId) return;

    const message = `🚨 NEW MERIDIAN ORDER 🚨\n\n` +
      `⌚️ ${watch.model}\n` +
      `💰 ${watch.price}\n\n` +
      `🔗 Order on Amazon:\n` +
      `${watch.amazonLink || "No link provided"}\n\n` +
      `📦 Copy-Paste Address:\n` +
      `${form.firstName} ${form.lastName}\n` +
      `📞 ${form.phone}\n` +
      `✉️ ${form.email}\n` +
      `🏠 ${form.flat}, ${form.area}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state}\n${form.pincode}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    }).catch(err => console.error("Telegram notification failed", err));
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Send Telegram notification before redirecting
    sendTelegramNotification(checkoutItem, formData);

    // Redirect to Shopify checkout with the watch variant pre-loaded in cart
    const variantId = checkoutItem.shopifyVariantId;
    if (variantId) {
      const shopifyCheckoutUrl = `https://shop.meredianwatches.store/cart/${variantId}:1`;
      window.location.href = shopifyCheckoutUrl;
    } else {
      alert("This product is not yet available for checkout.");
      setIsProcessing(false);
    }
  };

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const letterVars = { hidden: { opacity: 0, y: 50, rotateX: -90 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 12 } } };
  const stepVariants = {
    initial: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0, transition: { duration: 0.2 } })
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && checkoutItem && (
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] w-full h-screen bg-[#0a0a0a] flex flex-col md:flex-row pointer-events-auto overflow-hidden text-white"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", perspective: '1000px' }}
        >
          {isSuccess ? (
            <div className="fixed inset-0 z-[200] text-center bg-black overflow-y-auto overflow-x-hidden perspective-[2000px]">
              {/* Massive Cinematic Background Video */}
              <motion.video 
                initial={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1.1, opacity: 0.6, filter: "blur(0px)" }}
                transition={{ duration: 2, ease: "easeOut" }}
                autoPlay 
                loop 
                muted 
                playsInline
                className="fixed inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
                src="/Watch_gears_forming_watch_dial_202606291025.mp4"
              />
              
              {/* Dark vignette to ensure text readability */}
              <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-0 pointer-events-none" />
              <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-0 pointer-events-none" />
              
              <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 py-20">
              {!showConcierge ? (
                <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 20 }}
                   className="flex flex-col items-center relative z-10"
                >
                  <div className="relative flex items-center justify-center w-64 h-64 mb-12">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-[#d4af37] rounded-full blur-md"
                    />
                    
                    <motion.div
                      initial={{ backgroundColor: "rgba(34,197,94,0)", boxShadow: "0 0 0px rgba(34,197,94,0)" }}
                      animate={{ backgroundColor: "rgba(34,197,94,1)", boxShadow: "0 0 200px rgba(34,197,94,0.6)" }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="absolute inset-0 rounded-full border-4 border-green-400 z-10"
                    />
                    
                    <svg viewBox="0 0 50 50" className="w-32 h-32 text-white z-20 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      <motion.path 
                        d="M14 26 L22 33 L36 16"
                        fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <motion.h4 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-green-200 drop-shadow-[0_0_50px_rgba(34,197,94,0.8)]"
                  >
                    PAYMENT SUCCESSFUL
                  </motion.h4>
                </motion.div>
              ) : (
                <motion.div 
                   initial={{ opacity: 0, scale: 3, z: 1000, filter: "blur(30px)" }}
                   animate={{ opacity: 1, scale: 1, z: 0, filter: "blur(0px)" }}
                   transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                   className="flex flex-col items-center w-full max-w-4xl px-12 py-20 relative z-10 text-center bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.2)] overflow-hidden"
                >
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(212,175,55,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(212,175,55,0.1)_360deg)] z-0 pointer-events-none"
                   />
                   
                   <div className="relative z-10 flex flex-col items-center w-full">
                     <ShieldCheck size={64} className="text-[#d4af37] mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]" />
                     <h4 className="text-7xl font-black tracking-tighter mb-6 uppercase bg-clip-text text-transparent bg-gradient-to-br from-white via-[#f3e5ab] to-[#d4af37] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">
                       ALLOCATION SECURED
                     </h4>
                     <p className="text-[#d4af37] text-xl tracking-[0.4em] uppercase mb-12 border-b border-[#d4af37]/20 pb-6 w-full max-w-lg">
                       The Ordinary Ends Here.
                     </p>
                     
                     <p className="text-white/90 text-3xl leading-relaxed font-light mb-16 max-w-4xl drop-shadow-md">
                       Your order is confirmed. We don't believe in automated emails or generic tracking links. A personal executive has been assigned to oversee the preparation of your <span className="text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">{checkoutItem.brand} {checkoutItem.model}</span>. You will be updated at every significant milestone until the moment it rests on your wrist.
                     </p>

                     <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                       <a href="https://www.instagram.com/meri.dianwatches/" target="_blank" rel="noreferrer" className="relative group px-12 py-6 bg-transparent text-white rounded-full text-sm tracking-[0.3em] uppercase font-bold transition-all overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                         <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 opacity-50 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>
                         <span className="relative z-10 flex items-center justify-center gap-4">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> 
                           Join The Inner Circle
                         </span>
                       </a>
                       <button onClick={() => { setIsSuccess(false); setShowConcierge(false); setStep(1); closeCheckout(); }} className="px-12 py-6 bg-white/5 backdrop-blur-md border border-[#d4af37]/50 text-white hover:bg-[#d4af37] hover:text-black rounded-full text-sm tracking-[0.3em] uppercase font-bold transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-1">
                         Close Terminal
                       </button>
                     </div>
                   </div>
                </motion.div>
              )}
              </div>
            </div>
          ) : (
            <>
          <button 
            onClick={closeCheckout}
            className="absolute top-8 left-8 z-50 flex items-center gap-2 px-6 py-3 bg-black/5 hover:bg-black/10 rounded-full transition-all duration-300 text-xs tracking-[0.2em] uppercase font-bold text-black border border-black/10 mix-blend-difference hover:mix-blend-normal hover:text-black hover:bg-white/80"
            style={{ mixBlendMode: 'difference', color: 'white' }}
          >
            <X size={16} /> ABORT
          </button>

          <div className="w-full md:w-[45%] h-[40vh] md:h-screen p-8 md:p-24 flex flex-col justify-center items-center relative z-10 border-r border-white/10 bg-white hidden md:flex">
            <motion.div 
              style={{ rotateX: imageRotateX, rotateY: imageRotateY }}
              className="relative z-10 w-full max-w-[500px]"
            >
              <motion.img 
                initial={{ scale: 0.8, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: [-10, 10, -10] }}
                transition={{ 
                  scale: { delay: 0.3, duration: 1.2, type: "spring", damping: 15 },
                  opacity: { delay: 0.3, duration: 1.2 },
                  y: { repeat: Infinity, repeatType: "mirror", duration: 6, ease: "easeInOut" }
                }}
                src={checkoutItem.image} 
                alt={`${checkoutItem.brand} ${checkoutItem.model}`}
                className="w-full object-contain relative z-20"
                style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 flex flex-col items-center z-20 w-full max-w-[400px]"
            >
              <div className="flex gap-8 justify-center mb-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck size={20} className="text-black/40" />
                  <span className="text-[9px] uppercase tracking-widest text-black/60 font-bold">Authenticity<br/>Guaranteed</span>
                </div>
                <div className="w-[1px] h-10 bg-black/10" />
                <div className="flex flex-col items-center text-center gap-2">
                  <CheckCircle2 size={20} className="text-black/40" />
                  <span className="text-[9px] uppercase tracking-widest text-black/60 font-bold">5-Year<br/>Warranty</span>
                </div>
                <div className="w-[1px] h-10 bg-black/10" />
                <div className="flex flex-col items-center text-center gap-2">
                  <Lock size={20} className="text-black/40" />
                  <span className="text-[9px] uppercase tracking-widest text-black/60 font-bold">Insured<br/>Shipping</span>
                </div>
              </div>

              <div className="text-center px-4 relative">
                {/* Ethereal background glow behind the text */}
                <motion.div 
                  animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-black/5 blur-xl rounded-full" 
                />
                
                <motion.p 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  style={{
                    backgroundImage: "linear-gradient(270deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.1) 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent"
                  }}
                  className="text-[11px] leading-[1.8] tracking-[0.3em] uppercase font-bold relative z-10"
                >
                  {"You are not just acquiring a timepiece. You are securing a legacy. A definitive statement of intent, crafted for the few who dictate their own time.".split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      animate={{ 
                        y: [0, -3, 0], 
                        filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        delay: i * 0.15, 
                        ease: "easeInOut" 
                      }}
                      className="inline-block mr-[0.4em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </div>
            </motion.div>

            <motion.div 
              variants={containerVars} 
              initial="hidden" 
              animate="show" 
              style={{ x: textTranslateX, y: textTranslateY }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-12 right-12 z-10 pointer-events-none"
            >
              <div className="text-5xl md:text-[6rem] lg:text-[7rem] font-medium tracking-tighter leading-[0.8] text-black/5">
                {checkoutItem.brand.split('').map((char, i) => (<motion.span key={i} variants={letterVars} className="inline-block">{char}</motion.span>))}
                <br/>
                {checkoutItem.model.split('').map((char, i) => (<motion.span key={i} variants={letterVars} className="inline-block">{char === ' ' ? '\u00A0' : char}</motion.span>))}
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-[55%] h-[60vh] md:h-screen bg-[#0a0a0a] p-6 md:p-16 flex flex-col relative overflow-y-auto hide-scrollbar z-10">
            {/* Ambient Animated Blobs for "Alive" feel */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0],
                y: [0, -50, 0]
              }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -30, 0],
                y: [0, 60, 0]
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 2 }}
              className="absolute bottom-1/4 -left-20 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
            />

            <motion.div 
              style={{ rotateX: formRotateX, rotateY: formRotateY }} 
              className="max-w-xl w-full mx-auto h-full flex flex-col pt-4 md:pt-0 relative z-10"
            >
              
              <div className="mb-10">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-3 flex items-center gap-2"
                >
                  <ShieldCheck size={14} className="text-[#ffca3a]" /> Official Allocation • Step {step} of 3
                </motion.span>
                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                  <p className="text-white/60 text-sm tracking-wide font-medium">{checkoutItem.specs?.color} / {checkoutItem.specs?.strap}</p>
                  <span className="text-3xl font-medium tracking-tighter text-white">{checkoutItem.price}</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <AnimatePresence mode="wait" custom={1}>
                  
                  {step === 1 ? (
                    
                    /* STEP 1: IDENTITY */
                    <motion.form key="step1" custom={1} variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handleNext} className="absolute inset-0 flex flex-col overflow-y-auto hide-scrollbar pb-10">
                      <div className="space-y-6 flex-1">
                        <h4 className="text-xl font-medium tracking-tight text-white mb-6">Identity</h4>
                        <div className="holographic-border rounded-xl">
                          <input required type="email" placeholder="VIP Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="relative z-10 w-full px-6 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                        </div>
                        <div className="holographic-border rounded-xl">
                          <input required type="tel" placeholder="Mobile Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="relative z-10 w-full px-6 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                        </div>
                      </div>
                      <button type="submit" className="mt-8 w-full py-5 bg-white text-black hover:bg-white/90 rounded-xl text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-lg flex items-center justify-center gap-2 flex-shrink-0">
                        Continue to Shipping <ChevronRight size={16} />
                      </button>
                    </motion.form>

                  ) : step === 2 ? (

                    /* STEP 2: COORDINATES (AMAZON STYLE) */
                    <motion.form key="step2" custom={1} variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handleNext} className="absolute inset-0 flex flex-col overflow-y-auto hide-scrollbar pb-10">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <button type="button" onClick={handleBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"><ChevronLeft size={16} /></button>
                          <h4 className="text-xl font-medium tracking-tight text-white">Amazon Shipping Coordinates</h4>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="holographic-border rounded-xl w-1/2">
                            <input required type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                          </div>
                          <div className="holographic-border rounded-xl w-1/2">
                            <input required type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                          </div>
                        </div>

                        <div className="holographic-border rounded-xl">
                          <input required type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                        </div>

                        <div className="holographic-border rounded-xl">
                          <input required type="text" placeholder="Flat, House no., Building, Company, Apartment" value={formData.flat} onChange={(e) => setFormData({...formData, flat: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                        </div>

                        {/* OLA MAPS AUTOCOMPLETE FIELD */}
                        <div className="relative">
                          <div className="holographic-border rounded-xl">
                            <div className="relative z-10 flex items-center bg-[#111] rounded-xl overflow-hidden border border-white/5 focus-within:border-transparent">
                              <div className="pl-5 text-white/40"><MapPin size={16}/></div>
                              <input required type="text" placeholder="Area, Street, Sector, Village (Ola Maps)" value={olaQuery} onChange={(e) => { setOlaQuery(e.target.value); setFormData({...formData, area: e.target.value}) }} className="w-full px-4 py-4 bg-transparent focus:outline-none text-sm transition-all text-white placeholder-white/30" />
                              {isSearching && <div className="pr-5 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            </div>
                          </div>
                          
                          {olaPredictions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                              {olaPredictions.map((pred, i) => (
                                <button key={i} type="button" onClick={() => handleSelectPrediction(pred)} className="w-full text-left px-5 py-3 hover:bg-white/5 text-sm text-white/80 transition-colors border-b border-white/5 last:border-0 flex items-start gap-3">
                                  <MapPin size={14} className="mt-0.5 opacity-50 flex-shrink-0" />
                                  <span>{pred.description}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="holographic-border rounded-xl">
                          <input type="text" placeholder="Landmark (Optional)" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                        </div>

                        <div className="flex gap-4">
                          <div className="holographic-border rounded-xl w-1/2">
                            <input required type="text" placeholder="Town/City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                          </div>
                          <div className="holographic-border rounded-xl w-1/2">
                            <input required type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="relative z-10 w-full px-5 py-4 bg-[#111] border border-white/5 focus:border-transparent focus:outline-none rounded-xl text-sm transition-all text-white placeholder-white/30" />
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="mt-8 w-full py-5 bg-white text-black hover:bg-white/90 rounded-xl text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-lg flex items-center justify-center gap-2 flex-shrink-0">
                        Review Allocation <ChevronRight size={16} />
                      </button>
                    </motion.form>

                  ) : (

                    /* STEP 3: REVIEW & RAZORPAY */
                    <motion.form key="step3" custom={1} variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handlePay} className="absolute inset-0 flex flex-col overflow-y-auto hide-scrollbar pb-10">
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <button type="button" onClick={handleBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"><ChevronLeft size={16} /></button>
                          <h4 className="text-xl font-medium tracking-tight text-white">Review Allocation</h4>
                        </div>
                        
                        <div className="p-6 bg-[#111] border border-white/5 rounded-xl space-y-4">
                          <div>
                            <span className="text-[10px] tracking-widest uppercase text-white/40 block mb-1">Identity</span>
                            <p className="text-sm text-white/80">{formData.email}</p>
                            <p className="text-sm text-white/80">{formData.phone}</p>
                          </div>
                          <div className="w-full h-[1px] bg-white/5" />
                          <div>
                            <span className="text-[10px] tracking-widest uppercase text-white/40 block mb-2">Coordinates</span>
                            <p className="text-sm text-white/80 font-medium mb-1">{formData.firstName} {formData.lastName}</p>
                            <p className="text-sm text-white/70">{formData.flat}, {formData.area}</p>
                            {formData.landmark && <p className="text-sm text-white/70">Landmark: {formData.landmark}</p>}
                            <p className="text-sm text-white/70">{formData.city}, {formData.state} - {formData.pincode}</p>
                          </div>
                        </div>
                      </div>

                      <button type="submit" disabled={isProcessing} className="mt-8 flex-shrink-0 w-full py-6 holographic-bg text-white hover:scale-[1.02] active:scale-[0.98] rounded-xl text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100 border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center">
                          {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `SECURE CHECKOUT`}
                        </span>
                      </button>
                      <p className="text-center text-[10px] tracking-wide text-white/30 mt-4 font-medium flex items-center justify-center gap-2 flex-shrink-0">
                        <Lock size={10} /> SECURED BY SHOPIFY
                      </p>
                    </motion.form>

                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
