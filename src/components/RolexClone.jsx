import React from 'react';

const RainbowStyles = () => (
  <style>
    {`
      @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .rainbow-text {
        background: linear-gradient(270deg, #ff007f, #7f00ff, #00ffff, #ff007f);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 4s ease infinite;
        display: inline-block;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .rainbow-text:hover {
        transform: scale(1.05) skew(-2deg);
        filter: drop-shadow(0 0 15px rgba(255,0,127,0.5));
      }
    `}
  </style>
);

export default function RolexClone() {
  return (
    <div className="w-full bg-white text-black font-sans overflow-x-hidden selection:bg-gray-200">
      <RainbowStyles />
      
      {/* 1. Global Navigation */}
      <nav className="fixed top-0 left-0 w-full h-[70px] bg-white border-b border-gray-100 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center space-x-6">
          <button className="text-gray-900 hover:text-gray-500 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          {/* Rolex Crown Placeholder */}
          <svg className="w-10 h-10 text-[#204a30]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" />
          </svg>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-gray-900 font-bold hover:text-gray-500 transition-colors uppercase text-xs tracking-widest hidden md:block">Search</button>
          <button className="text-gray-900 font-bold hover:text-gray-500 transition-colors uppercase text-xs tracking-widest hidden md:block">Locate</button>
        </div>
      </nav>

      {/* 2. Hero Section (Liquid Explosion Clone) */}
      <section className="relative w-full h-screen mt-[70px] bg-black overflow-hidden flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
        >
          <source src="/Watch_rotating_in_liquid_explosion_202607141039.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-white text-xs md:text-sm font-bold tracking-[0.2em] mb-4 uppercase">The Absurd</h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 rainbow-text cursor-crosshair">
            Gravity is optional,<br/>Time is not.
          </h1>
          <button className="mt-8 text-white text-sm font-medium hover:opacity-70 transition-opacity flex items-center space-x-2">
            <span>Discover more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
      </section>

      {/* 3. Product Showcase (Datejust Clone) */}
      <section className="relative w-full py-24 md:py-32 bg-[#fdfdfd]">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 flex flex-col justify-center space-y-6 lg:pr-12">
            <h1 className="text-5xl md:text-[4rem] font-bold text-black leading-[1.1] tracking-tight">
              Make a date of a day
            </h1>
            <div className="max-w-lg text-[#444] text-lg font-light leading-relaxed space-y-6 pt-4">
              <p>
                A symbol of elegance. A watchmaking icon, always reinvented. A window on a world of endless possibilities.
              </p>
              <p>
                Released in 1945, the Oyster Perpetual Datejust displays the date in a window at 3 o'clock on the dial. A subtle reminder that every 24 hours is an opportunity to make the date truly memorable.
              </p>
            </div>
            
            <div className="pt-8">
              <button className="px-10 py-3 bg-[#f5f5f5] text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors shadow-sm">
                Datejust
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center relative">
            <div className="relative w-full max-w-xl aspect-square flex items-center justify-center p-0 overflow-hidden">
               {/* Using the user's specific Olevs image */}
               <img 
                 src="/watches/olevs_blue.jpg" 
                 alt="Rolex Datejust Equivalent" 
                 className="w-full h-full object-cover rounded-3xl mix-blend-multiply"
               />
            </div>
          </div>
          
        </div>
      </section>

      {/* 4. Ambassador Section (Ironical Clone) */}
      <section className="relative w-full h-[90vh] bg-black overflow-hidden flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
        >
          {/* Using Spitfire as the ambassador cinematic shot */}
          <source src="/Spitfire_cockpit_flying_storm_cl…_202606281328.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-6xl md:text-[5rem] font-black tracking-tight mb-4 rainbow-text cursor-crosshair">
            The Architect
          </h1>
          <h2 className="text-white text-2xl md:text-4xl font-serif italic font-light tracking-wide drop-shadow-xl opacity-90">
            Absolute mastery over a meaningless universe
          </h2>
          
          <button className="mt-12 px-8 py-4 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold hover:bg-white/20 transition-colors flex items-center space-x-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
            <span>Play the film</span>
          </button>
        </div>
      </section>

    </div>
  );
}
