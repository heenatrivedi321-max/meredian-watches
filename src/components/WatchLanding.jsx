import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShopShowcase from './ShopShowcase';

const banners = [
  {
    image: "/3fd0c5d7-64ef-4f3b-b47e-ae63d43bc7c0.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "THE OLEVS ARCHIVE",
    subtitle: "Precision engineering meets timeless design."
  },
  {
    image: "/772c7f78-61a2-4064-b6d5-d96e33d5fe8c.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "OBSIDIAN TOURBILLON",
    subtitle: "Exposed mechanics. Unapologetic luxury."
  },
  {
    image: "/9155c033-af80-4453-a056-13225b87d607.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
    title: "SAPPHIRE RESERVE",
    subtitle: "Aerospace-grade steel and scratch-resistant crystal."
  }
];

function ParallaxSection({ banner }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={ref} className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center bg-black">
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y, scale }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${banner.image}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
      >
        <div className="backdrop-blur-md bg-black/30 border border-white/10 p-10 md:p-16 rounded-xl shadow-2xl">
          <h2 className="text-4xl md:text-7xl font-anton tracking-widest text-white uppercase mb-4 drop-shadow-lg">
            {banner.title}
          </h2>
          <p className="text-lg md:text-xl font-sans text-white/80 tracking-widest uppercase font-light max-w-lg mx-auto">
            {banner.subtitle}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default function WatchLanding() {
  return (
    <div className="w-full bg-black min-h-screen flex flex-col">
      {/* Hero Welcome */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)]"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 flex flex-col items-center px-4"
        >
          <div className="text-[10vw] md:text-[8rem] font-anton text-white leading-none tracking-tight uppercase mb-6 flex flex-col items-center">
            <span>ENTER THE</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400">MERIDIAN</span>
          </div>
          <p className="text-sm md:text-lg font-sans text-white/50 tracking-[0.3em] uppercase mb-12">
            The New Standard in Accessible Luxury
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[1px] h-24 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Parallax Banners */}
      {banners.map((banner, i) => (
        <ParallaxSection key={i} banner={banner} />
      ))}

      {/* 3D Showcase Finale */}
      <div className="relative z-20 bg-black pt-24 pb-32 border-t border-white/10">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-5xl font-anton text-[var(--text-color)] tracking-widest uppercase mb-4">
            INSPECT THE CRAFTSMANSHIP
          </h2>
          <p className="text-[var(--text-color)]/50 font-sans tracking-widest uppercase text-sm">
            Fully interactive 3D model. View in AR.
          </p>
        </div>
        <ShopShowcase />
      </div>
    </div>
  );
}
