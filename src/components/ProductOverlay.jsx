import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { createCheckout } from '../shopify';

// Lightweight fade-in observer — no GSAP, pure IntersectionObserver
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, delay = 0, className = '', style = {} }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
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

  useEffect(() => {
    if (watch) setActiveImageIndex(0);
  }, [watch]);

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

  // Instant video play when visible
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !watch) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.2 }
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
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000', scrollBehavior: 'smooth' }}>

      {/* Close Button */}
      <button 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 10,
          width: 48, height: 48, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.querySelector('svg').style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; e.currentTarget.querySelector('svg').style.color = '#000'; }}
      >
        <X size={20} strokeWidth={1.5} color="#000" style={{ transition: 'color 0.3s ease' }} />
      </button>

      {/* ======== SECTION 1: HERO ======== */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 40px' }} className="flex flex-col lg:flex-row">
        
        {/* Watch Image — GPU-accelerated */}
        <FadeIn className="w-full lg:w-1/2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <img 
            src={activeImage} 
            alt={watch.model}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{
              width: '100%', maxHeight: '65vh', objectFit: 'contain',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
              transform: 'translateZ(0)', // force GPU layer
            }}
          />
        </FadeIn>

        {/* Text */}
        <div className="w-full lg:w-1/2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 20px 20px 40px', gap: 48 }}>
          <FadeIn delay={0.1}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', fontFamily: 'monospace', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>
              {watch.brand}
            </p>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 5rem)', lineHeight: 1.05, fontWeight: 400,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24,
              color: '#000', fontFamily: "'Inter', sans-serif",
            }}>
              {watch.model}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'rgba(0,0,0,0.55)', fontWeight: 300, lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
              "{watch?.quotes?.[0] || 'A masterpiece of precision.'}"
            </p>
          </FadeIn>

          <FadeIn delay={0.2} style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 40 }}>
            <p style={{
              fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', color: '#000', lineHeight: 1.15,
              fontWeight: 700, marginBottom: 24, fontFamily: "'Inter', sans-serif",
            }}>
              "{watch?.quotes?.[1] || 'Unapologetic excellence.'}"
            </p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(0,0,0,0.65)', lineHeight: 1.75, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
              {watch?.description}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ======== SECTION 2: CINEMATIC VIDEO ======== */}
      <FadeIn>
        <div style={{
          position: 'relative', width: '100%', height: '80vh', background: '#000',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          contentVisibility: 'auto', containIntrinsicSize: '0 80vh',
        }}>
          <video 
            ref={videoRef}
            autoPlay loop muted={isMuted} playsInline
            preload="metadata"
            poster={activeImage}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transform: 'scale(1.35) translateZ(0)',
            }}
          >
            <source src={watch.cinematicVideo} type="video/mp4" />
          </video>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.7) 100%)',
          }} />
          
          <button onClick={() => setIsMuted(!isMuted)}
            style={{
              position: 'absolute', bottom: 28, right: 28, zIndex: 20,
              padding: '10px 20px', borderRadius: 9999,
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
          >
            {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
          </button>
          
          <h2 style={{
            position: 'relative', zIndex: 10, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            letterSpacing: '0.5em', fontWeight: 300, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif",
          }}>
            Uncompromised
          </h2>
        </div>
      </FadeIn>

      {/* ======== SECTION 3: SPECS ======== */}
      <div style={{
        width: '100%', background: '#0a0a0a', padding: '80px 24px', color: '#fff',
        contentVisibility: 'auto', containIntrinsicSize: '0 600px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="flex flex-col lg:flex-row gap-16">
          
          <FadeIn className="w-full lg:w-1/3">
            <h3 style={{ fontSize: 11, letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase', color: '#8B6914', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 1, background: '#8B6914', display: 'inline-block' }} />
              Signature Details
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {watch.features?.map((f, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  fontSize: '1.05rem', color: '#ddd', fontWeight: 300,
                  opacity: 0, animation: `fadeSlideIn 0.5s ease ${0.1 * i}s forwards`,
                }}>
                  <span style={{ color: '#8B6914', fontSize: 10 }}>⬦</span> {f}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.15} className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "⚙️", label: "Engine", value: watch.specs?.movement },
              { icon: "🛡️", label: "Architecture", value: watch.specs?.caseMaterial },
              { icon: "📐", label: "Proportions", value: `${watch.specs?.diameter} / ${watch.specs?.thickness}` },
              { icon: "💎", label: "Shield", value: watch.specs?.glass },
              { icon: "💧", label: "Resistance", value: watch.specs?.waterResistance },
              { icon: "🔗", label: "Band", value: watch.specs?.strap }
            ].map((s, i) => (
              <div key={i} style={{
                padding: 22, borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'default', transform: 'translateZ(0)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, color: '#8B6914' }}>{s.label}</span>
                  <span style={{ fontSize: '1rem', opacity: 0.7 }}>{s.icon}</span>
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif" }}>{s.value}</span>
              </div>
            ))}

            {/* Anchor Note */}
            <div className="sm:col-span-2" style={{
              padding: 22, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(139,105,20,0.08), rgba(255,255,255,0.04))',
              border: '1px solid rgba(139,105,20,0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700, color: '#C9A96E' }}>
                  📜 YOUR TIME ANCHOR NOTE
                </span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase' }}>
                  FREE
                </span>
              </div>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontWeight: 300, lineHeight: 1.6 }}>
                "For the late nights nobody saw and the battles fought in silence. Your time starts now."
              </p>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ✦ Customize via WhatsApp after ordering
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ======== SECTION 4: BUY ======== */}
      <FadeIn>
        <div style={{ width: '100%', background: '#fff', color: '#000', padding: '100px 20px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700,
            letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 0.9,
            fontFamily: "'Inter', sans-serif",
          }}>
            Own the moment.
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(0,0,0,0.5)', marginBottom: 60, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}>
            Some wait for their time. You wear yours.
          </p>
          <div style={{
            fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 300,
            letterSpacing: '-0.04em', marginBottom: 40, fontFamily: "'Inter', sans-serif",
          }}>
            {watch.price}
          </div>
          
          {watch.outOfStock ? (
            <button 
              onClick={() => window.location.href = `https://wa.me/918431724851?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(watch.brand + ' ' + watch.model)}.%20Is%20it%20available%3F`}
              style={{
                padding: '18px 48px', background: 'transparent',
                border: '2px solid #000', borderRadius: 9999,
                fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s ease',
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
              className="btn-google-pill-gold"
              style={{
                fontSize: 15, padding: '20px 52px', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {isRedirecting ? 'REDIRECTING TO CHECKOUT...' : `BUY TIME — ${watch.price} →`}
            </button>
          )}
        </div>
      </FadeIn>

      {/* Keyframes for feature list stagger */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

    </div>,
    portalRoot
  );
}
