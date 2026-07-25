import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WATCHES } from '../data/watches';

export default function AiConciergeModal({ isOpen, onClose, onSelectWatch }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings. I am the Meridian AI Horology Concierge. How may I assist your timepiece selection today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Best watch for formal suits?',
    'Which timepiece is for racing?',
    'Water resistance details?',
    'Recommend under ₹5,000'
  ];

  const handleSend = (userText) => {
    const query = userText || input;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // AI Intelligence Matching Logic
    setTimeout(() => {
      let replyText = '';
      let recommendedWatch = null;
      const lower = query.toLowerCase();

      if (lower.includes('formal') || lower.includes('suit') || lower.includes('dress') || lower.includes('gold')) {
        recommendedWatch = WATCHES.find(w => w.id === 'watch-1') || WATCHES[0];
        replyText = `For formal attire and executive presence, I highly recommend the ${recommendedWatch.brand} ${recommendedWatch.model}. Its light ceramic pedestal aesthetic and 316L stainless steel frame pair perfectly with tailored suits.`;
      } else if (lower.includes('racing') || lower.includes('sport') || lower.includes('car') || lower.includes('speed')) {
        recommendedWatch = WATCHES.find(w => w.id === 'watch-2') || WATCHES[1];
        replyText = `For motorsport and high-octane performance, the ${recommendedWatch.brand} ${recommendedWatch.model} features precision chronograph sub-dials designed for speed calibration.`;
      } else if (lower.includes('water') || lower.includes('dive') || lower.includes('sea') || lower.includes('resistance')) {
        recommendedWatch = WATCHES.find(w => w.id === 'watch-3') || WATCHES[2];
        replyText = `All Meridian timepieces feature superlative 50M water resistance and scratch-resistant sapphire crystal glass engineered for marine durability.`;
      } else {
        recommendedWatch = WATCHES[0];
        replyText = `Every Meridian timepiece is built to superlative chronometer standards with Japanese/Swiss-inspired automatic precision, 316L surgical steel, and a 3-year international warranty.`;
      }

      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: replyText,
          watch: recommendedWatch
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#09090e] border border-white/20 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col h-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center">
                <span className="text-[#10B981] text-xs">✦</span>
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold tracking-[0.2em] text-white uppercase">
                  MERIDIAN AI CONCIERGE
                </h3>
                <span className="text-[10px] font-mono text-[#10B981] uppercase block">
                  ● HOROLOGY INTELLIGENCE ONLINE
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-medium rounded-br-none'
                      : 'bg-white/10 text-white/90 border border-white/10 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Recommended Watch Card */}
                {msg.watch && (
                  <div className="mt-3 p-3 bg-[#111118] border border-white/20 rounded-2xl flex items-center justify-between gap-4 max-w-[85%] cursor-pointer hover:border-[#10B981] transition-colors"
                       onClick={() => { onSelectWatch(msg.watch); onClose(); }}>
                    <img src={msg.watch.image} alt={msg.watch.model} className="w-12 h-12 object-contain mix-blend-multiply bg-white rounded-lg p-1" />
                    <div className="flex-1 text-left">
                      <span className="text-[10px] font-mono text-[#10B981] uppercase block">{msg.watch.brand}</span>
                      <span className="text-xs font-bold text-white block">{msg.watch.model}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-3 py-1 bg-white/10 rounded-full">
                      VIEW →
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-white/40 font-mono italic">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                Meridian AI is analyzing horology catalog...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="py-3 flex flex-wrap gap-2 border-t border-white/10 mt-3">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[10px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/40 hover:bg-white/10 text-white/70 transition-all cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about movements, water rating, styling..."
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#10B981]"
            />
            <button
              onClick={() => handleSend()}
              className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              SEND
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
