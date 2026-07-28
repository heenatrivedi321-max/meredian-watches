import React, { useState, useRef, useEffect } from 'react';

const KNOWLEDGE_BASE = {
  watches: [
    {
      name: "OLEVS Dual-Tone Chronograph",
      price: "₹4,420",
      specs: "316L dual-tone stainless steel, sunburst blue-black dial, Japanese Quartz, sapphire crystal, 30M water resistant.",
      bestFor: "Executive wear, luxury cars, formal occasions."
    },
    {
      name: "OLEVS Moon Phase",
      price: "₹4,419",
      specs: "Moonphase complication, stainless steel mesh, sapphire crystal, Japanese Quartz.",
      bestFor: "Evening galas, dark suits, horology collectors."
    },
    {
      name: "OLEVS Diamond Dress Watch",
      price: "₹4,420",
      specs: "Diamond index markers, rose gold & silver 316L steel, sapphire crystal, high-contrast black dial.",
      bestFor: "High-status luxury statement, black-tie events."
    },
    {
      name: "Forsining Skeleton Tourbillon",
      price: "₹4,420",
      specs: "Exposed mechanical gear movement, rose gold case, self-winding automatic rotor, sapphire crystal.",
      bestFor: "Mechanical watch enthusiasts, exposed movement lovers."
    }
  ],
  policies: {
    shipping: "Dispatched daily via Air Express. Delivery takes 48 to 72 hours and is 100% fully insured.",
    cod: "Cash on Delivery is available across all Indian pincodes.",
    warranty: "Every Meridian timepiece comes with a 1-Year International Mechanical Warranty.",
    materials: "Surgical-grade 316L stainless steel and anti-reflective coated high-hardness sapphire glass."
  }
};

export default function AIConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'concierge',
      text: "Welcome to Meridian Horology. I am your Atelier Private Concierge. How may I assist your collection today?",
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const generateResponse = (userInput) => {
    const text = userInput.toLowerCase();

    if (text.includes('ship') || text.includes('deliver') || text.includes('time') || text.includes('when')) {
      return `${KNOWLEDGE_BASE.policies.shipping} Hand-inspected prior to dispatch.`;
    }
    if (text.includes('cod') || text.includes('cash') || text.includes('pay') || text.includes('razorpay')) {
      return `${KNOWLEDGE_BASE.policies.cod} We also accept 100% secure online checkout via Razorpay (UPI, Credit/Debit Cards, Net Banking).`;
    }
    if (text.includes('glass') || text.includes('steel') || text.includes('material') || text.includes('scratch')) {
      return KNOWLEDGE_BASE.policies.materials;
    }
    if (text.includes('warrant') || text.includes('guarantee') || text.includes('return')) {
      return KNOWLEDGE_BASE.policies.warranty;
    }
    if (text.includes('suit') || text.includes('wear') || text.includes('recommend') || text.includes('best')) {
      return `For formal tailoring, I highly recommend the ${KNOWLEDGE_BASE.watches[0].name} (${KNOWLEDGE_BASE.watches[0].price}). The 316L dual-tone bracelet catches ambient light magnificently.`;
    }
    if (text.includes('tourbillon') || text.includes('mechanical') || text.includes('gear')) {
      return `The ${KNOWLEDGE_BASE.watches[3].name} (${KNOWLEDGE_BASE.watches[3].price}) features an exposed mechanical gear assembly with a self-winding automatic rotor.`;
    }
    if (text.includes('diamond') || text.includes('dress')) {
      return `The ${KNOWLEDGE_BASE.watches[2].name} (${KNOWLEDGE_BASE.watches[2].price}) is crafted with hand-applied diamond indices against a deep black sunburst dial.`;
    }

    return "Every Meridian timepiece is engineered with 316L surgical steel, sapphire crystal glass, and precision movements. All orders include 100% insured 48-72h Air Express delivery. Would you like a specific model recommendation?";
  };

  const handleSend = (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === inputValue) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[999999]">
      {/* Floating Gold Atelier Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#050508]/90 backdrop-blur-2xl border border-[#C9A96E]/50 text-[#C9A96E] shadow-2xl shadow-[#C9A96E]/20 hover:border-[#FFD700] hover:scale-105 transition-all duration-500"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD700]"></span>
          </span>
          <span className="text-xs font-serif font-semibold tracking-[0.2em] uppercase text-white group-hover:text-[#FFD700] transition-colors">
            ATELIER CONCIERGE
          </span>
          <span className="text-sm">⏱️</span>
        </button>
      )}

      {/* Full 3D Glassmorphic Atelier Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[540px] rounded-3xl bg-[#08080C]/95 backdrop-blur-3xl border border-[#C9A96E]/40 shadow-2xl shadow-black flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Atelier Header */}
          <div className="p-4 bg-gradient-to-r from-black via-[#12121A] to-black border-b border-[#C9A96E]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C9A96E]/5 border border-[#C9A96E]/40 flex items-center justify-center text-lg shadow-inner">
                👑
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold tracking-wider text-white">MERIDIAN ATELIER</h4>
                <p className="text-[10px] font-sans text-[#C9A96E] tracking-[0.18em] uppercase">Private Horology Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-[#C9A96E]/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#C9A96E] to-[#997A3D] text-black font-semibold rounded-br-none'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none font-light'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#FFD700] bg-white/5 border border-white/10 p-3.5 rounded-2xl w-fit font-serif italic">
                <span className="animate-pulse">👑 Concierge is responding...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Luxury Suggestion Chips */}
          <div className="px-3.5 py-2.5 bg-black/60 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSend("How long is shipping?")}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A96E]/20 border border-white/10 text-gray-300 hover:text-[#FFD700] transition-all cursor-pointer"
            >
              🚚 Air Express Shipping
            </button>
            <button
              onClick={() => handleSend("Is COD available?")}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A96E]/20 border border-white/10 text-gray-300 hover:text-[#FFD700] transition-all cursor-pointer"
            >
              💵 Cash on Delivery
            </button>
            <button
              onClick={() => handleSend("What materials are used?")}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A96E]/20 border border-white/10 text-gray-300 hover:text-[#FFD700] transition-all cursor-pointer"
            >
              💎 Steel & Glass Specs
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3.5 bg-black border-t border-[#C9A96E]/20 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Inquire about timepieces, specs, delivery..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#C9A96E] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md cursor-pointer"
            >
              Inquire
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
