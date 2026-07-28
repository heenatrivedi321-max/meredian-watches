import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { createCheckout } from '../shopify';

export default function ProductOverlay({ watch, onClose }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const savedScrollY = useRef(0);

  const allImages = watch?.gallery?.length 
    ? watch.gallery.filter(Boolean) 
    : [watch?.image, watch?.image, watch?.image].filter(Boolean);
  const images = allImages.length >= 3 ? allImages.slice(0, 3) : [...allImages, ...Array(Math.max(1, 3 - allImages.length)).fill(allImages[0] || watch?.image)];
  const activeImage = images[activeImageIndex] || watch?.image || '/watches_new/MK9218_gold_auto_1.jpg';

  useEffect(() => {
    if (watch) setActiveImageIndex(0);
  }, [watch]);

  useEffect(() => {
    if (!watch) return;

    // Save scroll position
    savedScrollY.current = window.scrollY;

    // Hide the entire app so only this overlay is visible as a normal page
    const appRoot = document.getElementById('root');
    if (appRoot) appRoot.style.display = 'none';

    // Kill ALL scroll locks that might exist
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.documentElement.style.overflow = '';

    // Scroll to top of the new page
    window.scrollTo(0, 0);

    return () => {
      // Show app again
      if (appRoot) appRoot.style.display = '';
      // Restore scroll
      window.scrollTo(0, savedScrollY.current);
    };
  }, [watch]);

  if (!watch) return null;

  // Get or create portal root
  let portalRoot = document.getElementById('product-overlay-portal');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'product-overlay-portal';
    document.body.appendChild(portalRoot);
  }

  const handleClose = () => {
    const appRoot = document.getElementById('root');
    if (appRoot) appRoot.style.display = '';
    window.scrollTo(0, savedScrollY.current);
    onClose();
  };

  // This renders as a NORMAL page element (no fixed, no absolute, no overflow tricks)
  // The browser's native window scroll handles everything
  return ReactDOM.createPortal(
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>

      {/* Close Button - this one is fixed */}
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <X size={20} strokeWidth={2} color="#000" />
      </button>

      {/* ======== SECTION 1: WATCH + NARRATIVE ======== */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px' }} className="flex flex-col lg:flex-row">
        
        {/* Watch Image */}
        <div className="w-full lg:w-1/2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img 
            src={activeImage} 
            alt={watch.model}
            style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 20px 20px 40px', gap: 40 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', fontFamily: 'monospace', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
              {watch.brand}
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', lineHeight: 1.05, fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24, color: '#000', fontFamily: "'Inter', sans-serif" }}>
              {watch.model}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(0,0,0,0.6)', fontWeight: 300, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
              "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 40 }}>
            <p style={{ fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', color: '#000', lineHeight: 1.15, fontWeight: 700, marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
              "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
            </p>
            <p style={{ fontSize: '1.1rem', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
              {watch?.description}
            </p>
          </div>
        </div>
      </div>

      {/* ======== SECTION 2: CINEMATIC VIDEO ======== */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', background: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video autoPlay loop muted={isMuted} playsInline preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.35)' }}
        >
          <source src={watch.cinematicVideo} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, transparent, black)', opacity: 0.8, pointerEvents: 'none' }} />
        <button onClick={() => setIsMuted(!isMuted)}
          style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 20, padding: '8px 16px', borderRadius: 9999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', backdropFilter: 'blur(12px)' }}
        >
          {isMuted ? 'Sound Off' : 'Sound On'}
        </button>
        <h2 style={{ position: 'relative', zIndex: 10, fontSize: '2rem', letterSpacing: '0.5em', fontWeight: 300, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif" }}>
          Uncompromised
        </h2>
      </div>

      {/* ======== SECTION 3: SPECS ======== */}
      <div style={{ width: '100%', background: '#0a0a0a', padding: '80px 24px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="flex flex-col lg:flex-row gap-16">
          
          <div className="w-full lg:w-1/3">
            <h3 style={{ fontSize: 12, letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase', color: '#8B6914', marginBottom: 48 }}>
              — Signature Details
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {watch.features?.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem', color: '#eee', fontWeight: 300 }}>
                  <span style={{ color: '#8B6914' }}>⬦</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "⚙️", label: "Engine", value: watch.specs?.movement },
              { icon: "🛡️", label: "Architecture", value: watch.specs?.caseMaterial },
              { icon: "📐", label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
              { icon: "💎", label: "Shield", value: watch.specs?.glass },
              { icon: "💧", label: "Resistance", value: watch.specs?.waterResistance },
              { icon: "🔗", label: "Band", value: watch.specs?.strap }
            ].map((s, i) => (
              <div key={i} style={{ padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, color: '#8B6914' }}>{s.label}</span>
                  <span>{s.icon}</span>
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======== SECTION 4: BUY ======== */}
      <div style={{ width: '100%', background: '#fff', color: '#000', padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 0.9, fontFamily: "'Inter', sans-serif" }}>
          Own the moment.
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'rgba(0,0,0,0.6)', marginBottom: 60, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
          Some wait for their time. You wear yours.
        </p>
        <div style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 300, letterSpacing: '-0.04em', marginBottom: 40, fontFamily: "'Inter', sans-serif" }}>
          {watch.price}
        </div>
        
        {watch.outOfStock ? (
          <button 
            onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
            style={{ padding: '18px 48px', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 9999, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}
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
            style={{ fontSize: 16, padding: '18px 48px', cursor: 'pointer' }}
          >
            {isRedirecting ? 'REDIRECTING TO CHECKOUT...' : `BUY TIME — ${watch.price} →`}
          </button>
        )}
      </div>

    </div>,
    portalRoot
  );
}
