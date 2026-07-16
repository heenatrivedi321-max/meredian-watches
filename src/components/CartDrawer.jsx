import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-white font-serif text-xl tracking-[0.2em] uppercase flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                Cart
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-400 tracking-[0.1em] uppercase text-xs mb-2">Your cart is empty.</p>
              <p className="text-gray-600 text-sm">Secure your anchor before the drop closes.</p>
              
              <button onClick={onClose} className="mt-8 px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">
                Continue Browsing
              </button>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black">
              <div className="flex justify-between text-white text-sm tracking-[0.1em] uppercase mb-6">
                <span>Subtotal</span>
                <span>₹0</span>
              </div>
              <button disabled className="w-full py-4 bg-white/10 text-white/50 text-xs font-bold uppercase tracking-[0.2em] cursor-not-allowed">
                Checkout securely
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
