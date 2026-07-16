import React from 'react';

export default function CinematicEngine() {
  return (
    <div className="relative w-full min-h-screen flex items-center bg-[#fdfdfd] overflow-hidden">
      
      {/* Ambient Radiating Glow Effect (Rolex/Apple Style) */}
      <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] bg-white rounded-full blur-[100px] -translate-y-1/2 opacity-100 pointer-events-none" />
      <div className="absolute top-1/2 right-[10%] w-[600px] h-[600px] bg-gray-200/50 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-[90rem] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Massive Google-Style Typography */}
        <div className="flex flex-col justify-center space-y-8 pr-12">
          <h1 className="font-sans text-7xl md:text-[6rem] font-black text-black leading-[0.85] tracking-tighter uppercase">
            Engineered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500">
              For The<br/>Unforgiving.
            </span>
          </h1>
          
          <p className="font-sans text-lg md:text-2xl text-gray-500 font-light leading-relaxed max-w-lg mt-8">
            A symbol of absolute precision. A watchmaking icon, completely reinvented. 
            Crafted for those who demand excellence in every single fraction of a second.
          </p>
          
          <div className="pt-8">
             <button className="px-10 py-4 bg-black text-white font-sans text-sm font-bold tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl">
               Discover More
             </button>
          </div>
        </div>

        {/* Right Side: The Watch Macro */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[600px] h-[600px] hover:scale-105 transition-transform duration-1000 ease-out z-20">
            {/* We use the Hexa watch because it has a transparent background, sitting perfectly on the glow */}
            <img 
              src="/watches/hx_watch.png" 
              alt="Luxury Timepiece" 
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)] filter contrast-125"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
