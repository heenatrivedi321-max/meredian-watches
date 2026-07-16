import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import LiquidShader from './LiquidShader';

const products = [
  {
    title: "OLEVS Original Analog Quartz Stylish Brown Leather",
    price: "3,420",
    image: "/616VL9Lw5eL._SX679_.jpg",
    banners: [
      "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg"
    ]
  },
  {
    title: "OLEVS Chronograph Moon Phase Stainless Steel",
    price: "3,419",
    image: "/61aosvrrvNL._SX679_.jpg",
    banners: [
      "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg"
    ]
  },
  {
    title: "HEXA Hustler Automatic Mechanical Multifunction",
    price: "6,999",
    image: "/714YTmfbWsL._SX679_.jpg",
    banners: [
      "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg"
    ]
  }
];

const springTransition = {
  type: "spring",
  stiffness: 40,
  damping: 15,
  mass: 1.5,
};

export default function WebGLMagic() {
  return (
    <div className="w-full bg-black relative min-h-screen overflow-x-hidden">
      
      {/* WebGL Fluid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <LiquidShader />
          </Suspense>
        </Canvas>
      </div>

      {/* The Content Overlay */}
      <div className="relative z-10 w-full">
        
        {/* Hero Section */}
        <section className="h-screen w-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="overflow-hidden"
          >
            <h1 className="text-white font-anton text-6xl md:text-9xl tracking-widest uppercase mix-blend-overlay text-center opacity-80">
              MERIDIAN
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="text-[#d09e53] font-sans tracking-[0.5em] uppercase text-xs mt-6"
          >
            Awwwards Tier Engineering
          </motion.p>
        </section>

        {/* The Product Showcases */}
        <section className="w-full py-20 flex flex-col space-y-32">
          {products.map((product, idx) => (
            <div key={idx} className="w-full flex flex-col items-center">
              
              {/* Product Header */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={springTransition}
                className="text-center px-4 mb-12 max-w-4xl"
              >
                <h2 className="text-white font-sans text-xl md:text-3xl font-light tracking-wide mb-4">
                  {product.title}
                </h2>
                <p className="text-[#d09e53] font-anton text-4xl tracking-widest">₹{product.price}</p>
              </motion.div>

              {/* Product Banner (A+ Content) */}
              <div className="w-full h-[40vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden group mb-12">
                <motion.div 
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.banners[0]}')` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
                </motion.div>
                
                <motion.img 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...springTransition, delay: 0.3 }}
                  src={product.image}
                  alt={product.title}
                  className="relative z-10 h-full object-contain filter drop-shadow-2xl mix-blend-screen py-8 pointer-events-none"
                />
              </div>

              {/* Acquire Button */}
              <motion.button 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-12 py-4 border border-white/20 bg-black/50 backdrop-blur-md text-white font-anton tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all duration-500"
              >
                Acquire The Masterpiece
              </motion.button>

            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
