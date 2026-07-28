import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { createCheckout } from '../shopify';

export default function ProductOverlay({ watch, onClose }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  // When overlay opens: save scroll position, lock body, scroll to top
  // When overlay closes: unlock body, restore scroll position
  const savedScrollY = useRef(0);
  
  useEffect(() => {
    if (watch) {
      savedScrollY.current = window.scrollY;
      // Lock the page behind the overlay
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      // Scroll the window to top so the overlay starts at top
      window.scrollTo(0, 0);
    }
    return () => {
      if (watch) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, savedScrollY.current);
      }
    };
  }, [watch]);

  if (!watch) return null;

  // Create a portal div if it doesn't exist
  let portalRoot = document.getElementById('product-overlay-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'product-overlay-root';
    document.body.appendChild(portalRoot);
  }

  const handleClose = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY.current);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: '#fff',
        overflowY: 'scroll',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Close Button */}
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999999,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <X size={20} strokeWidth={2} color="#000" />
      </button>

      {/* ========================================= */}
      {/* SECTION 1: WATCH HERO + NARRATIVE         */}
      {/* ========================================= */}
      <div style={{ width: '100%', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column' }} className="lg:!flex-row">
          
          {/* Watch Image */}
          <div className="w-full lg:w-[50%]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#fff' }}>
            <img 
              src={activeImage} 
              alt={watch.model}
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', mixBlendMode: 'multiply' }}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-[50%]" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 24px', gap: '48px' }}>
            
            {/* Title & Quote */}
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.4em', fontFamily: 'monospace', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
                {watch.brand}
              </p>
              <h1 
                className="text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem]"
                style={{ lineHeight: 1.05, fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px', color: '#000', fontFamily: "'Inter', sans-serif" }}
              >
                {watch.model}
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'rgba(0,0,0,0.6)', fontWeight: 300, maxWidth: '600px', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
                "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
              </p>
            </div>

            {/* Quote & Description */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '48px' }}>
              <p 
                className="text-[1.5rem] sm:text-[2.2rem] lg:text-[3rem]"
                style={{ color: '#000', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}
              >
                "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
              </p>
              <p style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
                {watch?.description}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* SECTION 2: CINEMATIC VIDEO                */}
      {/* ========================================= */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', background: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video 
          autoPlay loop muted={isMuted} playsInline preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.35)' }}
        >
          <source src={watch.cinematicVideo} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, transparent, black)', opacity: 0.8, pointerEvents: 'none' }} />
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20, padding: '8px 16px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          {isMuted ? 'Sound Off' : 'Sound On'}
        </button>
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', letterSpacing: '0.5em', fontWeight: 300, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif" }}>
            Uncompromised
          </h2>
        </div>
      </div>

      {/* ========================================= */}
      {/* SECTION 3: TECHNICAL SPECS                */}
      {/* ========================================= */}
      <div style={{ position: 'relative', width: '100%', background: 'linear-gradient(to bottom, #1a1a1a, #050505, #000)', padding: '96px 32px' }}>
        
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px', position: 'relative', zIndex: 10 }} className="lg:!flex-row lg:!gap-32">
          
          {/* Features List */}
          <div className="w-full lg:w-1/3">
            <h3 style={{ fontSize: '12px', letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase', color: '#8B6914', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ width: '32px', height: '1px', background: '#8B6914' }}></span>
              Signature Details
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {watch.features && watch.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '1.125rem', color: '#F5F5F0', fontWeight: 300 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', flexShrink: 0 }}>
                    <span style={{ color: '#8B6914', fontSize: '12px' }}>⬦</span>
                  </div>
                  <span style={{ paddingTop: '4px' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spec Cards */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "⚙️", label: "Engine", value: watch.specs?.movement },
              { icon: "🛡️", label: "Architecture", value: watch.specs?.caseMaterial },
              { icon: "📐", label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
              { icon: "💎", label: "Shield", value: watch.specs?.glass },
              { icon: "💧", label: "Resistance", value: watch.specs?.waterResistance },
              { icon: "🔗", label: "Band", value: watch.specs?.strap }
            ].map((spec, idx) => (
              <div key={idx} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, color: '#8B6914' }}>{spec.label}</span>
                  <span style={{ fontSize: '1.125rem', opacity: 0.8 }}>{spec.icon}</span>
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif" }}>{spec.value}</span>
              </div>
            ))}

            {/* Anchor Story Card */}
            <div className="md:col-span-2" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(to right, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))', border: '1px solid rgba(139,105,20,0.4)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, color: '#C9A96E' }}>
                  📜 YOUR TIME ANCHOR NOTE (INCLUDED IN BOX)
                </span>
                <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '9999px' }}>
                  FREE GIFT CARD
                </span>
              </div>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.6 }}>
                "For the late nights nobody saw and the battles fought in silence. Your time starts now."
              </p>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                ✦ Reply to our WhatsApp concierge text after ordering to customize your note
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* ========================================= */}
      {/* SECTION 4: THE CLOSER & BUY               */}
      {/* ========================================= */}
      <div style={{ position: 'relative', width: '100%', background: '#fff', color: '#000', padding: '80px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        
        <h2 
          className="text-[2.5rem] sm:text-[4rem] lg:text-[7rem]"
          style={{ fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 0.9, color: '#000', fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          Own the moment.
        </h2>
        
        <p style={{ fontSize: '1.25rem', color: 'rgba(0,0,0,0.6)', marginBottom: '80px', maxWidth: '672px', fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
          Some wait for their time. You wear yours.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <span 
            className="text-[3rem] sm:text-[5rem] lg:text-[7rem]"
            style={{ lineHeight: 1, color: '#000', fontWeight: 300, letterSpacing: '-0.04em', fontFamily: "'Inter', sans-serif" }}
          >
            {watch.price}
          </span>
          
          {watch.outOfStock ? (
            <button 
              onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
              style={{ padding: '20px 56px', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', color: '#000', borderRadius: '9999px', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}
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
              className="btn-google-pill-gold"
              style={{ fontSize: '16px', padding: '20px 48px', cursor: 'pointer' }}
            >
              {isRedirecting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  REDIRECTING TO CHECKOUT...
                </span>
              ) : `BUY TIME — ${watch.price} →`}
            </button>
          )}
        </div>
      </div>

    </div>,
    portalRoot
  );
}
