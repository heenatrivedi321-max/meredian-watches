import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. FLUID RAINBOW WEBGL SHADER
// ----------------------------------------------------
const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    
    // Create organic warping
    float noise1 = snoise(uv * 3.0 + uTime * 0.2);
    float noise2 = snoise(uv * 2.0 - uTime * 0.3 + noise1);
    
    vec2 warpedUv = uv + vec2(noise1, noise2) * 0.3;
    
    // Psychedelic color palette
    float r = sin(warpedUv.x * 10.0 + uTime) * 0.5 + 0.5;
    float g = cos(warpedUv.y * 8.0 - uTime * 0.8) * 0.5 + 0.5;
    float b = sin((warpedUv.x + warpedUv.y) * 5.0 + uTime * 1.2) * 0.5 + 0.5;
    
    // Add iridescent fluid feel (neon greens, electric pinks, purples)
    vec3 color = vec3(r, g, b);
    
    // Push contrast and saturate
    color = smoothstep(0.1, 0.9, color);
    color *= vec3(1.2, 0.5, 1.5); // Push towards magenta/purple base
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FluidBackground = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

// ----------------------------------------------------
// 2. DATA & ASSETS
// ----------------------------------------------------
const WATCHES = [
  {
    id: 1,
    brand: "OLEVS",
    model: "BROWN LEATHER",
    price: "₹3,420",
    image: "/616VL9Lw5eL._SX679_.jpg", // Raw cutout
    video: "/Porsche_driving_through_tunnel_202606281316.mp4"
  },
  {
    id: 2,
    brand: "OLEVS",
    model: "MOON PHASE",
    price: "₹3,419",
    image: "/61IK4P4qMmL._SX679_.jpg", // Raw cutout
    video: "/Spitfire_cockpit_flying_storm_cl…_202606281328.mp4"
  },
  {
    id: 3,
    brand: "HEXA",
    model: "HUSTLER AUTO",
    price: "₹6,999",
    image: "/714YTmfbWsL._SX679_.jpg", // Raw cutout
    video: "/Driver's_hand_on_steering_wheel_202606281350.mp4"
  },
  {
    id: 4,
    brand: "FORSINING",
    model: "TOURBILLON",
    price: "₹8,106",
    image: "/71AUrD6Ml-L._SX679_.jpg", // Raw cutout
    video: "/Diving_bell_underwater_illuminat…_202606281332.mp4"
  },
  {
    id: 5,
    brand: "OLEVS",
    model: "DIAMOND DRESS",
    price: "₹3,420",
    image: "/616e4lz-yRL._SX679_.jpg", // Raw cutout
    video: "/Digital_interface_morphs_into_la…_202607081706.mp4"
  },
  {
    id: 6,
    brand: "OLEVS",
    model: "PREM CHRONO",
    price: "₹3,420",
    image: "/61aosvrrvNL._SX679_.jpg", // Raw cutout
    video: "/Futuristic_bridge_cyber-city_spa…_202607081714.mp4"
  }
];

// ----------------------------------------------------
// 3. VIDEO-MASKED TYPOGRAPHY (SVG CLIP)
// ----------------------------------------------------
const VideoMaskedText = ({ text, videoSrc, scrollYProgress }) => {
  const clipId = `mask-${text.replace(/\s+/g, '')}`;
  
  // Aggressive Parallax
  const y = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  
  return (
    <motion.div style={{ y }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70 mix-blend-screen">
      
      {/* The video playing in the background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* SVG defining the text mask */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipId}>
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="font-black text-[15vw] tracking-tighter uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }} // A highly aggressive, crispy font
            >
              {text}
            </text>
          </clipPath>
        </defs>
      </svg>
      
    </motion.div>
  );
};

// ----------------------------------------------------
// 4. FOREGROUND PRODUCT (AGGRESSIVE PHYSICS)
// ----------------------------------------------------
const KineticProduct = ({ watch, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Snappy, aggressive physics
  const springY = useSpring(scrollYProgress, { stiffness: 400, damping: 30 });
  
  const yImage = useTransform(springY, [0, 0.5, 1], ["150%", "0%", "-150%"]);
  const rotateImage = useTransform(springY, [0, 0.5, 1], [45, 0, -45]);
  const scaleImage = useTransform(springY, [0, 0.5, 1], [0.5, 1.2, 0.5]);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      
      <VideoMaskedText text={watch.model} videoSrc={watch.video} scrollYProgress={scrollYProgress} />

      <motion.div 
        style={{ y: yImage, rotate: rotateImage, scale: scaleImage }}
        className="relative z-30 w-[40vw] max-w-[500px] aspect-square flex flex-col items-center justify-center group"
      >
        <img 
          src={watch.image} 
          alt={watch.model} 
          className="w-full h-full object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] mix-blend-normal group-hover:scale-110 transition-transform duration-300 ease-out"
          style={{ mixBlendMode: 'multiply' }} // Removes the white background of the raw cutouts if they are jpegs
        />
        
        {/* Aggressive Acquire Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40 scale-0 group-hover:scale-100 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] pointer-events-auto">
           <button className="bg-black text-white px-8 py-4 font-black uppercase tracking-[0.3em] text-xl border-4 border-white hover:bg-white hover:text-black transition-colors duration-100 shadow-[0_0_50px_rgba(255,255,255,0.8)]">
             Acquire
           </button>
        </div>
      </motion.div>
      
      {/* Price Tag (Glitchy absolute positioning) */}
      <motion.div 
         style={{ y: useTransform(springY, [0, 1], ["-100%", "100%"]) }}
         className="absolute right-[10%] bottom-[20%] z-20 pointer-events-none mix-blend-difference"
      >
         <span className="text-white text-6xl font-black tracking-tighter">{watch.price}</span>
      </motion.div>

    </section>
  );
};

export default function BloodyHellEngine() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  
  // Chromatic Aberration / RGB Split effect mapped to scroll speed
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-5, 5]);

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden font-sans">
      
      {/* Layer 1: Fluid Rainbow WebGL */}
      <div className="fixed inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidBackground />
        </Canvas>
      </div>

      {/* Dynamic Chromatic Aberration Container */}
      <motion.div 
        className="relative z-10 w-full"
        style={{
          // When scrolling extremely fast, slightly skew the container to simulate G-force tearing
          skewY: skewVelocity
        }}
      >
        {WATCHES.map((watch, index) => (
          <KineticProduct key={watch.id} watch={watch} index={index} />
        ))}
      </motion.div>

    </div>
  );
}
