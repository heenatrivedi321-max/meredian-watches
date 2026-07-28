import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { createCheckout } from '../shopify';

// Smooth reveal on scroll — lightweight IntersectionObserver
function FadeIn({ children, delay = 0, className = '', style = {}, direction = 'up' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          io.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const transforms = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.95)' };

  return (
    <div
      ref={ref}
      className={`fade-reveal ${className}`}
      style={{
        opacity: 0,
        transform: transforms[direction] || transforms.up,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function ProductOverlay({ watch, onClose }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const savedScrollY = useRef(0);
  const videoRef = useRef(null);

  const allImages = watch?.gallery?.length 
    ? watch.gallery.filter(Boolean) 
    : [watch?.image, watch?.image, watch?.image].filter(Boolean);
  const images = allImages.length >= 3 ? allImages.slice(0, 3) : [...allImages, ...Array(Math.max(1, 3 - allImages.length)).fill(allImages[0] || watch?.image)];
  const activeImage = images[activeImageIndex] || watch?.image || '/watches_new/MK9218_gold_auto_1.jpg';

  useEffect(() => { if (watch) setActiveImageIndex(0); }, [watch]);

  // Hide app, show overlay as normal page
  useEffect(() => {
    if (!watch) return;
    savedScrollY.current = window.scrollY;
    const appRoot = document.getElementById('root');
    if (appRoot) appRoot.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, 0);
    return () => {
      if (appRoot) appRoot.style.display = '';
      window.scrollTo(0, savedScrollY.current);
    };
  }, [watch]);

  // Auto play/pause video on visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !watch) return;
    const io = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? vid.play().catch(() => {}) : vid.pause(); },
      { threshold: 0.15 }
    );
    io.observe(vid);
    return () => io.disconnect();
  }, [watch]);

  if (!watch) return null;

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

  return ReactDOM.createPortal(
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>

      {/* Injected CSS for animations */}
      <style>{`
        .fade-reveal.revealed { opacity: 1 !important; transform: none !important; }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(139,105,20,0.4); } 50% { box-shadow: 0 0 0 16px rgba(139,105,20,0); } }
        @keyframes floatBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideStagger { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* ─── CLOSE BUTTON ─── */}
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 20, right: 20, zIndex: 50,
          width: 48, height: 48, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'; e.currentTarget.querySelector('svg').style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.querySelector('svg').style.color = '#000'; }}
      >
        <X size={18} strokeWidth={1.5} color="#000" style={{ transition: 'color 0.3s ease' }} />
      </button>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1: THE OPENING — HERO IMAGE + TEXT  */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '80px 28px 40px' }} className="flex flex-col lg:flex-row items-center">
          
          {/* Watch Image */}
          <FadeIn className="w-full lg:w-[55%]" delay={0.05} direction="scale" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={activeImage} alt={watch.model}
                loading="eager" decoding="async" fetchPriority="high"
                style={{
                  width: '100%', maxHeight: '70vh', objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.18))',
                  transform: 'translateZ(0)',
                  animation: 'floatBounce 6s ease-in-out infinite',
                }}
              />
              {/* Image gallery dots */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImageIndex(i)}
                      style={{
                        width: i === activeImageIndex ? 28 : 8, height: 8, borderRadius: 9999,
                        background: i === activeImageIndex ? '#000' : 'rgba(0,0,0,0.15)',
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Text Content */}
          <div className="w-full lg:w-[45%]" style={{ padding: '40px 20px 40px 48px', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 10, letterSpacing: '0.5em', fontFamily: 'monospace', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>
                {watch.brand} — {watch.specs?.movement?.split(' ')[0] || 'Swiss'}
              </p>
              <h1 style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)', lineHeight: 1.0, fontWeight: 300,
                letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 28,
                color: '#000', fontFamily: "'Inter', sans-serif",
                background: 'linear-gradient(135deg, #000 0%, #333 50%, #000 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {watch.model}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(0,0,0,0.5)', fontWeight: 300, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", fontStyle: 'italic' }}>
                "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
              </p>
            </FadeIn>

            <FadeIn delay={0.25} style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 36 }}>
              <p style={{
                fontSize: 'clamp(1.4rem, 2.8vw, 2.8rem)', color: '#000', lineHeight: 1.12,
                fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, fontFamily: "'Inter', sans-serif",
              }}>
                "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
              </p>
              <p style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.55)', lineHeight: 1.8, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
                {watch?.description}
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
                  {watch.price}
                </span>
                <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(0,0,0,0.35)', padding: '4px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 9999 }}>
                  Free Shipping
                </span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'breathe 2.5s ease infinite' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontWeight: 600 }}>Scroll</span>
          <ChevronDown size={16} color="rgba(0,0,0,0.3)" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 2: FULL-SCREEN CINEMATIC VIDEO      */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', width: '100%', height: '100vh', background: '#000',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <video 
          ref={videoRef} autoPlay loop muted={isMuted} playsInline preload="metadata" poster={activeImage}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transform: 'scale(1.35) translateZ(0)',
          }}
        >
          <source src={watch.cinematicVideo} type="video/mp4" />
        </video>

        {/* Cinematic overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
        
        {/* Sound toggle */}
        <button onClick={() => setIsMuted(!isMuted)}
          style={{
            position: 'absolute', bottom: 32, right: 32, zIndex: 20,
            padding: '12px 24px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)',
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.4s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        
        {/* Center text */}
        <FadeIn direction="scale" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontWeight: 500 }}>
            The Film
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '0.3em', fontWeight: 200,
            textTransform: 'uppercase', color: '#fff', fontFamily: "'Inter', sans-serif",
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}>
            Uncompromised
          </h2>
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)', margin: '20px auto 0' }} />
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 3: SPECS — DARK LUXURY              */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ width: '100%', background: '#080808', padding: '100px 28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '60%', height: 500, background: 'radial-gradient(ellipse, rgba(139,105,20,0.08), transparent 70%)', pointerEvents: 'none' }} />

        <FadeIn style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#8B6914', fontWeight: 600, marginBottom: 12 }}>Technical Specifications</p>
          <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, color: '#fff', fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em' }}>
            Engineered for Eternity
          </h3>
        </FadeIn>

        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="flex flex-col lg:flex-row gap-16">
          
          {/* Features */}
          <FadeIn delay={0.1} className="w-full lg:w-1/3">
            <h4 style={{ fontSize: 10, letterSpacing: '0.5em', fontWeight: 700, textTransform: 'uppercase', color: '#8B6914', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 20, height: 1, background: '#8B6914', display: 'inline-block' }} />
              Signature Details
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {watch.features?.map((f, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  fontSize: '1rem', color: 'rgba(255,255,255,0.75)', fontWeight: 300,
                  animation: `slideStagger 0.6s ease ${0.08 * i}s both`,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B6914', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Spec Cards */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "⚙️", label: "Engine", value: watch.specs?.movement },
              { icon: "🛡️", label: "Architecture", value: watch.specs?.caseMaterial },
              { icon: "📐", label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
              { icon: "💎", label: "Crystal", value: watch.specs?.glass },
              { icon: "💧", label: "Resistance", value: watch.specs?.waterResistance },
              { icon: "🔗", label: "Band", value: watch.specs?.strap }
            ].map((s, i) => (
              <FadeIn key={i} delay={0.05 * i} direction="scale">
                <div style={{
                  padding: 24, borderRadius: 16, height: '100%',
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', cursor: 'default',
                  transform: 'translateZ(0)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(139,105,20,0.3)'; e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0) translateZ(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.35em', fontWeight: 700, color: '#8B6914' }}>{s.label}</span>
                    <span style={{ fontSize: '1.1rem', opacity: 0.6 }}>{s.icon}</span>
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{s.value}</span>
                </div>
              </FadeIn>
            ))}

            {/* Anchor Note */}
            <FadeIn delay={0.35} className="sm:col-span-2">
              <div style={{
                padding: 24, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(139,105,20,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(139,105,20,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, color: '#C9A96E' }}>📜 Your Time Anchor Note</span>
                  <span style={{ fontSize: 8, fontFamily: 'monospace', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase' }}>Included Free</span>
                </div>
                <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 300, lineHeight: 1.7 }}>
                  "For the late nights nobody saw and the battles fought in silence. Your time starts now."
                </p>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  ✦ Customize via WhatsApp after ordering
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4: THE CLOSER — BUY                 */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{
        width: '100%', minHeight: '80vh', background: '#fff', color: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px', textAlign: 'center', position: 'relative',
      }}>
        <FadeIn direction="scale">
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 24, fontWeight: 600 }}>
            The Final Word
          </p>
          <h2 style={{
            fontSize: 'clamp(2.8rem, 7vw, 7rem)', fontWeight: 700,
            letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 0.9,
            fontFamily: "'Inter', sans-serif",
            background: 'linear-gradient(135deg, #000 0%, #222 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Own the moment.
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(0,0,0,0.45)', marginBottom: 48, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
            Some wait for their time. You wear yours.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)', fontWeight: 200, letterSpacing: '-0.04em', marginBottom: 48, fontFamily: "'Inter', sans-serif" }}>
            {watch.price}
          </div>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          {watch.outOfStock ? (
            <button 
              onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
              style={{
                padding: '20px 56px', background: 'transparent', color: '#000',
                border: '2px solid #000', borderRadius: 9999,
                fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
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
              style={{
                padding: '22px 64px', borderRadius: 9999,
                background: '#000', color: '#fff',
                fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 600, cursor: 'pointer', border: 'none',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                animation: 'pulseGlow 3s ease infinite',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
            >
              {isRedirecting ? 'REDIRECTING...' : `BUY TIME — ${watch.price} →`}
            </button>
          )}
        </FadeIn>
      </div>

    </div>,
    portalRoot
  );
}
