import { motion } from 'framer-motion';

export default function Manifesto() {
  const lineVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="min-h-screen bg-black flex flex-col justify-center px-6 md:px-20 pt-32 pb-20 relative z-10"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={lineVariants} className="mb-12">
          <span className="text-accent tracking-[0.4em] uppercase text-xs font-bold border-b border-accent pb-2">
            The Manifesto
          </span>
        </motion.div>
        
        <motion.h1 variants={lineVariants} className="text-4xl md:text-7xl font-serif text-white leading-tight tracking-tight mb-10">
          Most people settle. <br/>
          <span className="text-gray-600">They accept the average.</span>
        </motion.h1>

        <motion.p variants={lineVariants} className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed mb-8">
          But you aren't most people. You have a hunger that mediocrity cannot feed. You understand that satisfaction is the enemy of greatness.
        </motion.p>
        
        <motion.p variants={lineVariants} className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed mb-16">
          We forge visual anchors for the uncompromising. When the grind gets dark, when the doubts creep in, our archives stand as a permanent reminder on your wall: <strong className="text-white">Stop at nothing.</strong>
        </motion.p>

        <motion.div variants={lineVariants}>
          <a href="/" className="inline-block px-12 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-300 transition-colors">
            Return to the Archives
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
