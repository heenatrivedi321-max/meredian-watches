import React, { useState } from 'react';
import { createCheckout } from '../shopify';

export default function WatchConfigurator({ onClose }) {
  const [bezel, setBezel] = useState('Fluted Gold');
  const [strap, setStrap] = useState('Jubilee Gold');
  const [dial, setDial] = useState('Onyx Black');
  const [isOrdering, setIsOrdering] = useState(false);

  const bezelPrices = { 'Fluted Gold': 0, 'Obsidian Black': 500, 'Emerald Green': 800 };
  const strapPrices = { 'Jubilee Gold': 0, 'Oyster Steel': 300, 'Alligator Leather': 600 };
  const basePrice = 4420;
  
  const totalPrice = basePrice + bezelPrices[bezel] + strapPrices[strap];

  const handleOrder = async () => {
    if (isOrdering) return;
    setIsOrdering(true);
    try {
      // Default variant ID for OLEVS custom build
      const cart = await createCheckout("44400000000000");
      window.location.href = cart.checkoutUrl;
    } catch {
      window.location.href = "https://smgnhj-dr.myshopify.com/cart/44400000000000:1";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/15 rounded-[3rem] p-6 sm:p-10 text-white shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Ambient Rolex Emerald Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#10B981] uppercase font-bold block mb-1">
              ATELIER MERIDIAN // BESPOKE BUILDER
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight uppercase">
              Configure Your Masterpiece
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 2-Column Customizer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Visual Showcase */}
          <div className="relative h-72 sm:h-96 rounded-3xl bg-[#14141c] border border-white/10 p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute w-48 h-48 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
            <img
              src="/Rose_gold_mens_watch_202607141839.mp4"
              alt="Custom Watch Preview"
              className="hidden"
            />
            <div className="relative z-10 text-center">
              <span className="text-6xl sm:text-8xl block mb-4">⌚</span>
              <h3 className="text-xl font-mono text-white/90 font-bold uppercase">{bezel} // {strap}</h3>
              <p className="text-xs font-mono text-[#10B981] uppercase mt-1">Dial: {dial}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            
            {/* Bezel Selector */}
            <div>
              <label className="text-xs font-mono text-white/50 tracking-widest uppercase block mb-2">1. SELECT BEZEL</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(bezelPrices).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBezel(b)}
                    className={`py-3 px-2 rounded-2xl text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                      bezel === b ? 'bg-white text-black border-white font-bold' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Strap Selector */}
            <div>
              <label className="text-xs font-mono text-white/50 tracking-widest uppercase block mb-2">2. SELECT BRACELET</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(strapPrices).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStrap(s)}
                    className={`py-3 px-2 rounded-2xl text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                      strap === s ? 'bg-white text-black border-white font-bold' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Dial Selector */}
            <div>
              <label className="text-xs font-mono text-white/50 tracking-widest uppercase block mb-2">3. SELECT DIAL COLOR</label>
              <div className="grid grid-cols-3 gap-2">
                {['Onyx Black', 'Deep Sunray', 'Emerald Green'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDial(d)}
                    className={`py-3 px-2 rounded-2xl text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                      dial === d ? 'bg-[#10B981] text-black border-[#10B981] font-bold' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Price & Checkout Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block">TOTAL BESPOKE ESTIMATE</span>
                <span className="text-3xl font-extrabold text-white">₹{totalPrice.toLocaleString()}</span>
              </div>

              <button
                onClick={handleOrder}
                disabled={isOrdering}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black text-xs font-extrabold tracking-[0.2em] uppercase hover:bg-white/90 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.3)] cursor-pointer"
              >
                {isOrdering ? 'GENERATING CHECKOUT...' : 'ORDER CUSTOM TIMEPIECE →'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
