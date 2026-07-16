export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[var(--text-color)]/20 relative z-10 flex flex-col md:flex-row text-[var(--text-color)]">
      
      {/* Left Box (Logo) */}
      <div className="w-full md:w-1/4 p-12 border-b md:border-b-0 md:border-r border-[var(--text-color)]/20 border-dotted flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center">
          <svg width="120" height="80" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-color)] mb-4">
            <path d="M10,30 Q20,10 40,25 Q50,30 45,15 Q30,5 20,20" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M90,30 Q80,10 60,25 Q50,30 55,15 Q70,5 80,20" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className="font-anton tracking-widest text-3xl uppercase">APEX</span>
          <span className="font-sans text-xs tracking-[0.3em] opacity-50 uppercase mt-2">Archives</span>
        </div>
      </div>

      {/* Center Box (Links) */}
      <div className="w-full md:w-1/4 flex flex-col justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-[var(--text-color)]/20 border-dotted">
        {['SHOP', 'WHOLESALE', 'ABOUT', 'FAQ', 'CONTACT'].map((link, idx) => (
          <a 
            key={idx} 
            href={`#${link.toLowerCase()}`}
            className="w-full py-4 px-12 font-anton text-xl tracking-wider hover:text-white hover:bg-[var(--text-color)]/5 transition-colors border-b border-[var(--text-color)]/10 border-dotted last:border-b-0"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right Box (Newsletter + Socials) */}
      <div className="w-full md:w-2/4 flex flex-col md:flex-row">
        
        {/* Newsletter */}
        <div className="flex-grow p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--text-color)]/20 border-dotted">
          <h3 className="font-anton text-4xl uppercase tracking-widest mb-4">JOIN THE APEX CLUB</h3>
          <p className="font-sans font-light text-[var(--text-color)]/60 mb-8">
            New prints. Secret restocks. Merch drops. Don't miss out.
          </p>
          <div className="relative w-full max-w-md">
            <input 
              type="email" 
              placeholder="Your email..." 
              className="w-full bg-transparent border border-[var(--text-color)]/30 rounded-full py-4 px-6 text-[var(--text-color)] placeholder:text-[var(--text-color)]/40 focus:outline-none focus:border-[var(--text-color)]/80 transition-colors"
            />
            <button className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center text-[var(--text-color)]/60 hover:text-[var(--text-color)] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Socials Column */}
        <div className="w-full md:w-32 flex flex-row md:flex-col">
          <a href="#instagram" className="flex-1 md:h-1/3 flex items-center justify-center border-r md:border-r-0 md:border-b border-[var(--text-color)]/20 border-dotted hover:bg-[var(--text-color)]/5 hover:text-white transition-colors py-8 md:py-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#twitter" className="flex-1 md:h-1/3 flex items-center justify-center border-r md:border-r-0 md:border-b border-[var(--text-color)]/20 border-dotted hover:bg-[var(--text-color)]/5 hover:text-white transition-colors py-8 md:py-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href="#contact" className="flex-1 md:h-1/3 flex items-center justify-center hover:bg-[var(--text-color)]/5 hover:text-white transition-colors py-8 md:py-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-[var(--text-color)]/20 border-dotted text-center md:text-left text-xs font-sans tracking-widest text-[var(--text-color)]/40 md:pl-12">
        &copy; 2026. APEX ARCHIVES CO. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
