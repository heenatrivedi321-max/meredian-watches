import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows, PresentationControls, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';

function WatchModel() {
  const { scene } = useGLTF('/stainless_steel_wristwatch_analog_watch.glb');
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive object={scene} scale={2.5} position={[0, -1, 0]} rotation={[0, -Math.PI / 4, 0]} />
    </Float>
  );
}

export default function Hero3D() {
  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
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
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <Environment preset="studio" />
            <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.2} color="#ffffff" />
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground Typography & Gradient */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-16">
        
        {/* Top Gradient for text readability */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#050505] to-transparent" />
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="relative z-30">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-[#8a8a8a] uppercase tracking-[0.3em] text-xs md:text-sm font-mono mb-4"
          >
            The Masterpiece Collection
          </motion.p>
        </div>

        <div className="relative z-30 flex flex-col md:flex-row items-end justify-between w-full pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.2 }}
            className="text-6xl md:text-8xl lg:text-[10vw] font-serif leading-none tracking-tighter text-[#eaeaea] mix-blend-difference"
          >
            MERIDIAN
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 md:mt-0 pointer-events-auto"
          >
            <p className="text-[#8a8a8a] text-sm md:text-base font-serif italic mb-4 max-w-xs text-right">
              Drag to inspect. Scroll to discover the legacy.
            </p>
            <div className="flex justify-end">
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#eaeaea] to-transparent origin-top animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
      
    </section>
  );
}
