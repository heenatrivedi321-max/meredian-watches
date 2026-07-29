import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { createCheckout } from '../shopify';

// Ultra-smooth reveal on scroll using native IntersectionObserver
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

  const transforms = { 
    up: 'translateY(40px)', 
    down: 'translateY(-40px)', 
    left: 'translateX(-40px)', 
    right: 'translateX(40px)', 
    scale: 'scale(0.95)' 
  };

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
  const [closing, setClosing] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const savedScrollY = useRef(0);
  const videoRef = useRef(null);

  const allImages = watch?.gallery?.length 
    ? watch.gallery.filter(Boolean) 
    : [watch?.image, watch?.image, watch?.image].filter(Boolean);
  const images = allImages.length >= 3 ? allImages.slice(0, 3) : [...allImages, ...Array(Math.max(1, 3 - allImages.length)).fill(allImages[0] || watch?.image)];
  const activeImage = images[activeImageIndex] || watch?.image || '/watches_new/MK9218_gold_auto_1.jpg';

  useEffect(() => { if (watch) { setActiveImageIndex(0); setClosing(false); } }, [watch]);

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
    setClosing(true);
    setTimeout(() => {
      const appRoot = document.getElementById('root');
      if (appRoot) appRoot.style.display = '';
      window.scrollTo(0, savedScrollY.current);
      onClose();
    }, 500);
  };

  return ReactDOM.createPortal(
    <div style={{
      minHeight: '100vh', background: '#fff', color: '#000',
      opacity: closing ? 0 : 1,
      transform: closing ? 'translateY(30px)' : 'translateY(0)',
      transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>

      {/* Injected CSS for animations & bold crisp typography */}
      <style>{`
        .fade-reveal.revealed { opacity: 1 !important; transform: none !important; }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(128,0,32,0.4); } 50% { box-shadow: 0 0 0 16px rgba(128,0,32,0); } }
        @keyframes floatBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideStagger { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>

      {/* ─── CLOSE BUTTON ─── */}
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 24, right: 24, zIndex: 50,
          width: 52, height: 52, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'scale(1.12) rotate(90deg)'; e.currentTarget.querySelector('svg').style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.querySelector('svg').style.color = '#000'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.92) rotate(90deg)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.12) rotate(90deg)'; }}
      >
        <X size={22} strokeWidth={2} color="#000" style={{ transition: 'color 0.3s ease' }} />
      </button>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1: THE OPENING — HERO IMAGE + TEXT  */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '100px 32px 60px' }} className="flex flex-col lg:flex-row items-center">
          
          {/* Watch Image */}
          <FadeIn className="w-full lg:w-[55%]" delay={0.05} direction="scale" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{ width: '100%', overflow: 'hidden', cursor: 'crosshair', borderRadius: 20, position: 'relative' }}
                onMouseEnter={() => setZoom(z => ({ ...z, active: true }))}
                onMouseLeave={() => setZoom(z => ({ ...z, active: false }))}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoom({ active: true, x, y });
                }}
              >
                <img 
                  src={activeImage} alt={watch.model}
                  loading="eager" decoding="async" fetchPriority="high"
                  style={{
                    width: '100%', maxHeight: '72vh', objectFit: 'contain',
                    filter: 'drop-shadow(0 35px 70px rgba(0,0,0,0.2))',
                    animation: 'floatBounce 6s ease-in-out infinite',
                    display: 'block',
                    transform: zoom.active ? `scale(2)` : 'translateZ(0)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transition: zoom.active ? 'none' : 'transform 0.3s ease',
                    willChange: 'transform',
                  }}
                />
              </div>
              {/* Image gallery dots */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28 }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImageIndex(i)}
                      style={{
                        width: i === activeImageIndex ? 32 : 10, height: 10, borderRadius: 9999,
                        background: i === activeImageIndex ? '#000' : 'rgba(0,0,0,0.2)',
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Text Content — Bold, Prominent, Clear */}
          <div className="w-full lg:w-[45%]" style={{ padding: '40px 24px 40px 48px', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 13, letterSpacing: '0.4em', fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
                {watch.brand} — {watch.specs?.movement?.split(' ')[0] || 'Swiss'}
              </p>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', lineHeight: 1.05, fontWeight: 800,
                letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 24,
                color: '#000', fontFamily: "'Inter', sans-serif",
              }}>
                {watch.model}
              </h1>
              <p style={{ fontSize: '1.35rem', color: 'rgba(0,0,0,0.75)', fontWeight: 500, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
              </p>
            </FadeIn>

            <FadeIn delay={0.25} style={{ borderTop: '2px solid rgba(0,0,0,0.08)', paddingTop: 36 }}>
              <p style={{
                fontSize: 'clamp(1.5rem, 2.8vw, 2.6rem)', color: '#000', lineHeight: 1.2,
                fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, fontFamily: "'Inter', sans-serif",
              }}>
                "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
              </p>
              <p style={{ fontSize: '1.15rem', color: 'rgba(0,0,0,0.7)', lineHeight: 1.75, fontWeight: 400, fontFamily: "'Inter', sans-serif" }}>
                {watch?.description}
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 800, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em', color: '#000' }}>
                  {watch.price}
                </span>
                <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, color: '#800020', padding: '6px 14px', border: '1.5px solid #800020', borderRadius: 9999, background: 'rgba(0,96,57,0.05)' }}>
                  Free Express Delivery
                </span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'breathe 2.5s ease infinite' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>Scroll Down</span>
          <ChevronDown size={20} color="rgba(0,0,0,0.5)" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 2: FULL-SCREEN CINEMATIC VIDEO (4K) */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', width: '100%', height: '100vh', background: '#000',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <video 
          ref={videoRef} autoPlay loop muted={isMuted} playsInline preload="metadata" poster={activeImage}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transform: 'scale(1.15) translateZ(0)',
          }}
        >
          <source src={watch.cinematicVideo} type="video/mp4" />
        </video>

        {/* Subtle vignette gradient — transparent focus on video */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
        
        {/* Sound toggle */}
        <button onClick={() => setIsMuted(!isMuted)}
          style={{
            position: 'absolute', bottom: 36, right: 36, zIndex: 20,
            padding: '14px 28px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
            fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform, background-color',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
        >
          {isMuted ? '🔇 Unmute Sound' : '🔊 Mute Sound'}
        </button>
        
        {/* Center overlay typography */}
        <FadeIn direction="scale" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 16, fontWeight: 700 }}>
            Cinematic Horology
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '0.2em', fontWeight: 800,
            textTransform: 'uppercase', color: '#fff', fontFamily: "'Inter', sans-serif",
            textShadow: '0 4px 50px rgba(0,0,0,0.8)',
          }}>
            Uncompromised
          </h2>
          <div style={{ width: 60, height: 2, background: 'rgba(255,255,255,0.6)', margin: '24px auto 0' }} />
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 3: SPECS — DARK LUXURY              */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ width: '100%', background: '#080808', padding: '120px 32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient backlight glow */}
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '70%', height: 500, background: 'radial-gradient(ellipse, rgba(139,105,20,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <FadeIn style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A96E', fontWeight: 700, marginBottom: 16 }}>Technical Specifications</p>
          <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff', fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}>
            Engineered for Eternity
          </h3>
        </FadeIn>

        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="flex flex-col lg:flex-row gap-16">
          
          {/* Features */}
          <FadeIn delay={0.1} className="w-full lg:w-1/3">
            <h4 style={{ fontSize: 12, letterSpacing: '0.4em', fontWeight: 800, textTransform: 'uppercase', color: '#C9A96E', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 24, height: 2, background: '#C9A96E', display: 'inline-block' }} />
              Signature Details
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {watch.features?.map((f, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500,
                  animation: `slideStagger 0.6s ease ${0.08 * i}s both`,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A96E', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Spec Cards — Large & Readable */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  padding: 28, borderRadius: 20, height: '100%',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', cursor: 'default',
                  transform: 'translateZ(0)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0) translateZ(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', fontWeight: 800, color: '#C9A96E' }}>{s.label}</span>
                    <span style={{ fontSize: '1.3rem', opacity: 0.8 }}>{s.icon}</span>
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{s.value}</span>
                </div>
              </FadeIn>
            ))}

            {/* Anchor Note */}
            <FadeIn delay={0.35} className="sm:col-span-2">
              <div style={{
                padding: 28, borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(255,255,255,0.04) 100%)',
                border: '1px solid rgba(201,169,110,0.3)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 800, color: '#C9A96E' }}>📜 Your Time Anchor Note</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em', color: '#fff', background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)', padding: '4px 12px', borderRadius: 9999, textTransform: 'uppercase', fontWeight: 700 }}>Included Free</span>
                </div>
                <p style={{ fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', fontWeight: 400, lineHeight: 1.7 }}>
                  "For the late nights nobody saw and the battles fought in silence. Your time starts now."
                </p>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', textTransform: 'uppercase', marginTop: 8, display: 'block' }}>
                  ✦ Customize via WhatsApp after ordering
                </span>
              </div>
            </FadeIn>

            {/* Size Guide */}
            <FadeIn delay={0.4} className="sm:col-span-2" style={{ textAlign: 'center' }}>
              <button onClick={() => setShowSizeGuide(!showSizeGuide)}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#C9A96E',
                  padding: '12px 32px', borderRadius: 9999, cursor: 'pointer',
                  fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 800,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; e.currentTarget.style.borderColor = '#C9A96E'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                📐 Size Guide
              </button>

              {showSizeGuide && (
                <div style={{
                  marginTop: 24, padding: 32, borderRadius: 20,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'left',
                }}>
                  <h4 style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: 20, fontWeight: 800 }}>
                    Case Dimensions
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Diameter', value: watch.specs?.diameter },
                      { label: 'Thickness', value: watch.specs?.thickness },
                      { label: 'Movement', value: watch.specs?.movement },
                      { label: 'Case Material', value: watch.specs?.caseMaterial },
                      { label: 'Glass', value: watch.specs?.glass },
                      { label: 'Water Resistance', value: watch.specs?.waterResistance },
                      { label: 'Strap', value: watch.specs?.strap },
                    ].map((s, i) => (
                      <div key={i} style={{
                        padding: '12px 16px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 700 }}>{s.label}</div>
                        <div style={{ fontSize: 15, color: '#fff', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 20, fontStyle: 'italic', textAlign: 'center' }}>
                    Fits standard wrists (adjustable link bracelet included)
                  </p>
                </div>
              )}
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
        padding: '120px 24px', textAlign: 'center', position: 'relative',
      }}>
        <FadeIn direction="scale">
          <p style={{ fontSize: 12, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 24, fontWeight: 800 }}>
            The Final Word
          </p>
          <h2 style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)', fontWeight: 900,
            letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 0.95,
            fontFamily: "'Inter', sans-serif", color: '#000',
          }}>
            Own the moment.
          </h2>
          <p style={{ fontSize: '1.35rem', color: 'rgba(0,0,0,0.65)', marginBottom: 48, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            Some wait for their time. You wear yours.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 48, fontFamily: "'Inter', sans-serif", color: '#000' }}>
            {watch.price}
          </div>
        </FadeIn>

        {/* Trust Badges */}
        <FadeIn delay={0.25}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 48 }}>
            {[
              { icon: "🚚", label: "Free Express Shipping" },
              { icon: "↩️", label: "7-Day Returns" },
              { icon: "✓", label: "100% Authentic" },
              { icon: "🛡️", label: "Insured Delivery" }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 9999,
                background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(0,0,0,0.7)',
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        
        <FadeIn delay={0.35}>
          {watch.outOfStock ? (
            <button 
              onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
              style={{
                padding: '22px 64px', background: 'transparent', color: '#000',
                border: '2.5px solid #000', borderRadius: 9999,
                fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase',
                fontWeight: 800, cursor: 'pointer', transition: 'all 0.4s ease',
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
                padding: '24px 72px', borderRadius: 9999,
                background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', color: '#fff',
                fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 800, cursor: 'pointer', border: 'none',
                transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                animation: 'pulseGlow 3s ease infinite',
                willChange: 'transform, box-shadow',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
              onMouseDown={e => { e.currentTarget.style.transform = 'translateY(-1px) scale(0.96)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; }}
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
