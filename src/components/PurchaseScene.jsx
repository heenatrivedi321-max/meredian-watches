import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, RefreshCw } from 'lucide-react';

export default function PurchaseScene() {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-24 overflow-hidden border-t border-white/5">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#050505] opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-serif text-[#eaeaea] mb-8"
        >
          Own the Legacy
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#8a8a8a] max-w-lg mb-16 font-serif italic text-lg"
        >
          Secure your allocation from the Masterpiece Collection before the vault closes.
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-[#eaeaea] text-[#050505] px-12 py-5 text-sm uppercase font-mono tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
        >
          Proceed to Checkout
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-t border-white/5 pt-16"
        >
          <div className="flex flex-col items-center text-center group">
            <Shield className="text-[#333] group-hover:text-[#eaeaea] transition-colors duration-500 mb-4" strokeWidth={1} size={32} />
            <h4 className="text-[#eaeaea] font-mono text-xs uppercase tracking-widest mb-2">Authenticity Guaranteed</h4>
            <p className="text-[#8a8a8a] text-xs font-serif italic">Every piece is verified and serialized.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group">
            <Truck className="text-[#333] group-hover:text-[#eaeaea] transition-colors duration-500 mb-4" strokeWidth={1} size={32} />
            <h4 className="text-[#eaeaea] font-mono text-xs uppercase tracking-widest mb-2">White Glove Delivery</h4>
            <p className="text-[#8a8a8a] text-xs font-serif italic">Insured shipping directly to your door.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group">
            <RefreshCw className="text-[#333] group-hover:text-[#eaeaea] transition-colors duration-500 mb-4" strokeWidth={1} size={32} />
            <h4 className="text-[#eaeaea] font-mono text-xs uppercase tracking-widest mb-2">30-Day Returns</h4>
            <p className="text-[#8a8a8a] text-xs font-serif italic">Effortless return policy.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
