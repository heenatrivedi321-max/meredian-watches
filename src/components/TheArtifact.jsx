import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Html, Environment, Float, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- Scene Components ---

function CameraController({ ignited }) {
  const { camera } = useThree();
  const targetZ = useRef(5);

  useFrame((state, delta) => {
    if (ignited) {
      // Fly forward until Z = -35
      if (targetZ.current > -35) {
        targetZ.current -= delta * 5;
      }
    }
    
    // Smooth camera movement
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ.current, 2, delta);
    
    // Subtle mouse tracking for the camera rotation
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -mouseX * 0.1, 2, delta);
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, mouseY * 0.1, 2, delta);
  });

  return null;
}

function NarrativeShards() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Image 
          url="/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg" 
          position={[-2, 0, -5]} 
          scale={[8, 3.3]} 
          transparent 
          opacity={0.8}
        />
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Image 
          url="/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg" 
          position={[2, -1, -15]} 
          scale={[8, 3.3]} 
          transparent 
          opacity={0.8}
        />
      </Float>

      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.6}>
        <Image 
          url="/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg" 
          position={[-1, 1, -25]} 
          scale={[8, 3.3]} 
          transparent 
          opacity={0.8}
        />
      </Float>
    </>
  );
}

function TheSynthesis({ onArrived }) {
  const { camera } = useThree();
  const materialRef = useRef();

  useFrame((state) => {
    if (camera.position.z < -34) {
      onArrived(true);
    }
  });

  return (
    <group position={[0, 0, -38]}>
      {/* Specular lighting simulation on the 2D image */}
      <mesh>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#ffffff"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={1}
        />
      </mesh>
      
      {/* The raw image texture */}
      <Image 
        url="/616VL9Lw5eL._SX679_.jpg" 
        position={[0, 0, 0.01]} 
        scale={[4, 5]} 
        transparent 
      />

      <pointLight position={[2, 2, 2]} intensity={50} color="#d09e53" />
      <pointLight position={[-2, -2, 2]} intensity={20} color="#ffffff" />
    </group>
  );
}


// --- Main Application ---

export default function TheArtifact() {
  const [holding, setHolding] = useState(false);
  const [ignited, setIgnited] = useState(false);
  const [arrived, setArrived] = useState(false);
  const progressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Ignition Logic
  useEffect(() => {
    let animationFrame;
    
    const updateProgress = () => {
      if (ignited) return;

      if (holding) {
        progressRef.current += 0.015;
      } else {
        progressRef.current = Math.max(0, progressRef.current - 0.05);
      }

      setDisplayProgress(progressRef.current);

      if (progressRef.current >= 1) {
        setIgnited(true);
      } else {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [holding, ignited]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div 
      className="w-screen h-screen bg-black select-none overflow-hidden relative cursor-crosshair"
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
    >
      
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#020202']} />
        
        {/* Dynamic Environment Lighting */}
        <ambientLight intensity={ignited ? 0.2 : 0} />
        {ignited && <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.2} color="#d09e53" />}
        
        <CameraController ignited={ignited} />
        
        {ignited && <NarrativeShards />}
        {ignited && <TheSynthesis onArrived={setArrived} />}
      </Canvas>

      {/* UI Overlay: Pre-Ignition */}
      <AnimatePresence>
        {!ignited && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <p className="text-white/50 font-sans tracking-[0.5em] uppercase text-xs mb-8">
              Time is the only luxury
            </p>
            <h1 className="text-white font-anton text-4xl tracking-widest uppercase mb-12">
              Press and hold to ignite
            </h1>

            {/* Progress Circle */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                <circle 
                  cx="48" cy="48" r="45" 
                  stroke="#d09e53" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * Math.min(1, displayProgress))}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full bg-[#d09e53] transition-all duration-300 ${holding ? 'scale-150 animate-pulse' : 'scale-100 opacity-50'}`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay: Acquisition */}
      <AnimatePresence>
        {arrived && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-20 left-0 w-full flex flex-col items-center pointer-events-none"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-8 rounded-full border border-[#d09e53] flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 bg-[#d09e53] rounded-full opacity-50" />
              </div>
              <p className="text-[#d09e53] font-anton text-2xl tracking-widest">₹3,420</p>
            </div>
            
            <button className="pointer-events-auto px-12 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white font-sans tracking-[0.3em] uppercase text-sm hover:bg-[#d09e53] hover:text-black hover:border-transparent transition-all duration-500">
              Claim The Artifact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
