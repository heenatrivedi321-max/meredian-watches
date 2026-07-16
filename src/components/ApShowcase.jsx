import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, PresentationControls, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';

function WatchModel() {
  const { scene } = useGLTF('/stainless_steel_wristwatch_analog_watch.glb');
  
  return (
    // Massive scale to fill the screen
    <primitive object={scene} scale={80} position={[0, -5, 0]} rotation={[0, -Math.PI / 4, 0]} />
  );
}

export default function ApShowcase() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between">
      
      {/* Header - Minimal AP Style */}
      <header className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-center z-50 pointer-events-none mix-blend-difference text-white">
        <div className="flex items-center gap-4">
          <svg width="40" height="40" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M10,30 Q20,10 40,25 Q50,30 45,15 Q30,5 20,20" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M90,30 Q80,10 60,25 Q50,30 55,15 Q70,5 80,20" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className="font-mono text-xs uppercase tracking-[0.3em]">MERIDIAN x LAB</span>
        </div>
        <div className="font-mono text-xs tracking-widest uppercase">
          Sound Off
        </div>
      </header>

      {/* The Void & The Hardware */}
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={1.5} />
          
          <Suspense fallback={null}>
            <PresentationControls 
              global 
              config={{ mass: 2, tension: 500 }} 
              snap={{ mass: 4, tension: 1500 }} 
              rotation={[0, 0.3, 0]} 
              polar={[-Math.PI / 3, Math.PI / 3]} 
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
              <WatchModel />
            </PresentationControls>
            
            {/* Extremely dark and moody lighting environment */}
            <Environment preset="city" environmentIntensity={3} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={100} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={2} color="#888888" />
            
            <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#000000" />
          </Suspense>
        </Canvas>
      </div>

      {/* Footer - Minimal Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="group relative px-12 py-4 border border-white/20 text-white hover:border-white transition-colors duration-700 bg-transparent"
        >
          <span className="text-xs uppercase font-mono tracking-[0.2em] relative z-10 group-hover:text-black transition-colors duration-500">
            &gt; Continue the Journey
          </span>
          <div className="absolute inset-0 bg-white scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </motion.button>
      </div>

    </section>
  );
}
