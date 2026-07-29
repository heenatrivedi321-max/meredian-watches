import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2 } from 'lucide-react';

export default function VipVaultModal({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NOLAN2026' || cleanCode === 'MERIDIAN' || cleanCode === 'VIP15') {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#0a0a0f] border border-[#FFD700]/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-center overflow-hidden"
        >
          {/* Top Hairline sweep */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent animate-pulse" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center mx-auto mb-4 text-[#FFD700]">
            <Lock size={22} />
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white uppercase mb-2">
            The Meridian Vault
          </h3>
          <p className="text-xs font-mono tracking-widest text-white/50 uppercase mb-6">
            Enter VIP Access Passcode to unlock private allocation perk
          </p>

          {!unlocked ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="TRY PASSCODE: NOLAN2026"
                  className="w-full px-5 py-4 rounded-full bg-white/5 border border-white/20 text-white placeholder:text-white/30 text-center font-mono text-sm tracking-widest focus:outline-none focus:border-[#FFD700] uppercase transition-colors"
                />
                {error && (
                  <p className="text-xs font-mono text-red-400 mt-2 animate-bounce">
                    Invalid passcode. Try NOLAN2026
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFD700] via-[#E8D5A3] to-[#FFD700] text-black font-mono text-xs font-extrabold tracking-[0.25em] uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,215,0,0.3)] cursor-pointer"
              >
                UNLOCK VAULT{' '}
                <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2 text-[#10B981] font-mono text-sm font-bold uppercase">
                <CheckCircle2 size={20} />
                <span>VIP PASSCODE ACCEPTED</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-[#10B981]/40 text-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-1">
                  EXCLUSIVE CHECKOUT PASSCODE
                </span>
                <span className="text-2xl font-mono font-extrabold text-[#FFD700] block tracking-widest">
                  VIP15
                </span>
                <span className="text-[11px] font-mono text-white/70 block mt-1">
                  Enjoy 15% VIP Allocation Discount at checkout
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase hover:bg-white/90 transition-all cursor-pointer"
              >
                RETURN TO STORE{' '}
                <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
