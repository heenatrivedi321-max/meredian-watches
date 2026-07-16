import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, View } from 'lucide-react';
import '@google/model-viewer';

export default function ShopShowcase() {
  const modelViewerRef = useRef(null);
  
  const products = [
    { name: "OLEVS ANALOG QUARTZ", price: "4,499", image: "/watches/ea_watch.png" },
    { name: "HEXA HUSTLER AUTOMATIC", price: "7,999", image: "/watches/hx_watch.png" },
    { name: "FOSSIL HERITAGE", price: "9,499", image: "/watches/fossil-gold-me3280.png" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProduct = () => setCurrentIndex((prev) => (prev + 1) % products.length);
  const prevProduct = () => setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  return (
    <section className="w-full min-h-[70vh] bg-black flex flex-col md:flex-row overflow-hidden relative z-10 rounded-2xl border border-white/10 max-w-7xl mx-auto shadow-2xl">
      
      {/* Left Side (3D Model Area) */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#111] to-black">
        <model-viewer
          ref={modelViewerRef}
          src="/golden_watch.glb"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          style={{ width: '100%', height: '100%', zIndex: 10 }}
        ></model-viewer>
        
        {/* Mock Bundle overlay graphic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10">
          <div className="text-white font-anton text-3xl tracking-widest uppercase drop-shadow-lg">
            {products[currentIndex].name}
          </div>
          <div className="flex space-x-2 pointer-events-auto">
            <button onClick={prevProduct} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all">
              <ArrowLeft size={20} />
            </button>
            <button onClick={nextProduct} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side (Content Area) */}
      <div className="w-full md:w-1/2 bg-[#0a0a0a] flex flex-col relative p-10 md:p-16 justify-center">
        
        <h2 className="font-anton text-4xl md:text-5xl tracking-widest text-white m-0 uppercase leading-[1.1] mb-6">
          ACQUIRE THE TIMEPIECE
        </h2>
        
        <p className="font-sans text-white/60 tracking-wide font-light leading-relaxed mb-10">
          Experience the weight of true luxury. Featuring a precision-engineered automatic movement, aerospace-grade 316L stainless steel, and a scratch-resistant sapphire crystal display.
        </p>

        {/* Specs Selectors */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="text-xs tracking-widest font-sans uppercase text-white/50 border border-white/20 rounded-full px-5 py-2">
            42MM CASE
          </div>
          <div className="text-xs tracking-widest font-sans uppercase text-white border border-white rounded-full px-5 py-2">
            AUTOMATIC
          </div>
          <div className="text-xs tracking-widest font-sans uppercase text-white/50 border border-white/20 rounded-full px-5 py-2">
            SAPPHIRE GLASS
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-auto">
          <button className="flex-1 bg-white text-black font-anton text-xl tracking-widest uppercase py-4 rounded-sm hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center space-x-3">
            <span>ADD TO CART</span>
            <span className="w-1 h-1 bg-black rounded-full"></span>
            <span>₹{products[currentIndex].price}</span>
          </button>
          <button 
            onClick={() => modelViewerRef.current?.activateAR()}
            className="px-6 bg-transparent border border-white/30 text-white hover:bg-white hover:text-black font-anton text-xl tracking-widest uppercase py-4 rounded-sm active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <View className="w-5 h-5" />
            <span>AR</span>
          </button>
        </div>
      </div>
    </section>
  );
}
