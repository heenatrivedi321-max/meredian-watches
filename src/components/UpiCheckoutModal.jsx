import React, { useState } from 'react';

export default function UpiCheckoutModal({ watch, onClose }) {
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const upiId = "meredian@upi"; // User's custom UPI ID
  const priceNumber = watch?.price ? parseInt(watch.price.replace(/[^0-9]/g, ''), 10) || 4420 : 4420;
  
  // Standard India UPI Deeplink Format
  const upiString = `upi://pay?pa=${upiId}&pn=MERIDIAN%20HOROLOGY&am=${priceNumber}&cu=INR&tn=MERIDIAN-${watch?.model || 'ORDER'}`;
  
  // Dynamic QR Code API URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(upiString)}`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 6) return;
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `👑 *NEW PREPAID MERIDIAN ORDER*\n\n` +
    `⌚ *Watch:* ${watch?.brand || 'MERIDIAN'} ${watch?.model || 'Timepiece'}\n` +
    `💰 *Amount Paid:* ${watch?.price || '₹4,420'}\n` +
    `🔢 *UTR / Transaction Ref:* ${utr}\n\n` +
    `Please confirm my white-glove delivery!`
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-xl bg-[#0a0a0f] border border-white/20 rounded-[3rem] p-6 sm:p-10 text-white shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Ambient Rolex Emerald Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer z-20"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-[10px] font-mono tracking-[0.3em] uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                INSTANT PREPAID VIP CHECKOUT
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
                {watch?.model || 'Timepiece'}
              </h2>
              <p className="text-sm font-mono text-[#10B981] uppercase font-bold mt-1">
                PREPAID AMOUNT: {watch?.price || '₹4,420'}
              </p>
            </div>

            {/* DYNAMIC HIGH-RES UPI QR CODE BOX */}
            <div className="relative w-64 h-64 mx-auto mb-6 bg-white p-4 rounded-3xl border-4 border-[#10B981]/40 shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center group">
              <img
                src={qrCodeUrl}
                alt="Scan UPI QR Code"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-2 text-[9px] font-mono font-bold tracking-widest text-black/60 uppercase bg-white/90 px-3 py-1 rounded-full border border-black/10">
                SCAN WITH ANY UPI APP 📱
              </span>
            </div>

            {/* QUICK ONE-TAP UPI MOBILE BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <a
                href={`gpay://upi/pay?pa=${upiId}&pn=MERIDIAN&am=${priceNumber}&cu=INR`}
                className="py-3 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-center text-[10px] font-mono tracking-wider font-semibold text-white uppercase block"
              >
                Google Pay 🌐
              </a>
              <a
                href={`phonepe://pay?pa=${upiId}&pn=MERIDIAN&am=${priceNumber}&cu=INR`}
                className="py-3 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-center text-[10px] font-mono tracking-wider font-semibold text-white uppercase block"
              >
                PhonePe 🟣
              </a>
              <a
                href={`paytmmp://pay?pa=${upiId}&pn=MERIDIAN&am=${priceNumber}&cu=INR`}
                className="py-3 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-center text-[10px] font-mono tracking-wider font-semibold text-white uppercase block"
              >
                Paytm 💙
              </a>
              <a
                href={upiString}
                className="py-3 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-center text-[10px] font-mono tracking-wider font-semibold text-white uppercase block"
              >
                CRED / All ⚡
              </a>
            </div>

            {/* COPY UPI ID ROW */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 mb-6">
              <div>
                <span className="text-[9px] font-mono text-white/40 uppercase block">MERIDIAN OFFICIAL UPI ID</span>
                <span className="text-xs font-mono font-bold text-white tracking-widest">{upiId}</span>
              </div>
              <button
                onClick={copyUpi}
                className="px-4 py-2 rounded-xl bg-white text-black text-[10px] font-mono tracking-wider uppercase font-bold hover:bg-white/90 transition-all cursor-pointer"
              >
                {copied ? 'COPIED ✓' : 'COPY UPI ID'}
              </button>
            </div>

            {/* STEP 2: UTR FORM FOR INSTANT ORDER CONFIRMATION */}
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-white/60 tracking-widest uppercase block mb-1.5">
                  ENTER 12-DIGIT UTR / UPI TRANSACTION REF #
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 420192837491"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 font-mono text-sm tracking-widest focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 rounded-full bg-[#10B981] text-black font-extrabold text-xs font-mono tracking-[0.25em] uppercase hover:bg-[#10B981]/90 transition-all shadow-[0_15px_40px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                CONFIRM PREPAID ORDER →
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS ORDER TICKER & WHATSAPP VERIFICATION */
          <div className="text-center py-6">
            <span className="text-6xl block mb-4 animate-bounce">👑</span>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981] bg-[#10B981]/20 text-[#10B981] text-xs font-mono tracking-[0.3em] uppercase mb-4 font-bold">
              ORDER RECEIVED // PAYMENT UNDER VERIFICATION
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-2">
              Thank You For Your Order!
            </h3>
            <p className="text-xs font-mono text-white/60 max-w-md mx-auto mb-6">
              Your prepaid allocation for <strong className="text-white">{watch?.model}</strong> is reserved. UTR Ref: <span className="text-[#10B981]">{utr}</span>
            </p>

            <a
              href={`https://wa.me/919999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full py-5 rounded-full bg-[#25D366] text-black font-extrabold text-xs font-mono tracking-[0.2em] uppercase hover:bg-[#25D366]/90 transition-all shadow-[0_15px_40px_rgba(37,211,102,0.3)]"
            >
              <span>VERIFY ON WHATSAPP FOR DISPATCH 💬</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
