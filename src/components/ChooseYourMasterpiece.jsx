import { motion } from 'framer-motion';

export default function ChooseYourMasterpiece() {
  return (
    <section className="w-full bg-black flex justify-center items-center py-32 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center leading-[0.85] font-anton text-[12vw] md:text-[10vw] uppercase tracking-wide"
      >
        <span className="text-[var(--text-color)] drop-shadow-2xl">
          CHOOSE YOUR
        </span>
        <span className="text-outline-thick text-[16vw] md:text-[14vw] w-full text-center tracking-wider">
          LEGACY
        </span>
      </motion.div>
    </section>
  );
}
