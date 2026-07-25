import React from 'react';

export default function PolicyModal({ type, onClose }) {
  const policies = {
    terms: {
      title: "TERMS OF SERVICE",
      url: "meredianwatches.store/terms",
      content: (
        <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
          <p><strong>1. OVERVIEW</strong><br />This website is operated by MERIDIAN. Throughout the site, the terms “we”, “us” and “our” refer to MERIDIAN. MERIDIAN offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
          <p><strong>2. ONLINE STORE TERMS</strong><br />By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.</p>
          <p><strong>3. ACCURACY OF PRICING AND PRODUCTS</strong><br />Prices for our products are subject to change without notice. All timepieces feature Japanese/Swiss-inspired automatic or quartz movements with 316L stainless steel architecture and sapphire crystal glass as specified.</p>
          <p><strong>4. GOVERNING LAW</strong><br />These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.</p>
        </div>
      )
    },
    privacy: {
      title: "PRIVACY POLICY",
      url: "meredianwatches.store/privacy",
      content: (
        <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
          <p><strong>1. INFORMATION WE COLLECT</strong><br />When you visit meredianwatches.store, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases (Name, Shipping Address, Phone Number, and Payment Credentials).</p>
          <p><strong>2. HOW WE USE YOUR INFORMATION</strong><br />We use order information to fulfill orders placed through the Site (including processing payment information, arranging for shipping, and providing invoices/order confirmations).</p>
          <p><strong>3. DATA SECURITY</strong><br />Your payment credentials are processed through encrypted 256-bit SSL connections directly via compliant payment gateways. We never store raw credit card numbers or UPI PINs.</p>
        </div>
      )
    },
    refund: {
      title: "REFUND & CANCELLATION POLICY",
      url: "meredianwatches.store/refund-policy",
      content: (
        <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
          <p><strong>1. 7-DAY RETURN GUARANTEE</strong><br />We offer a 7-day hassle-free return policy for all un-worn MERIDIAN timepieces in original protective packaging with security seals intact.</p>
          <p><strong>2. REFUND PROCESSING</strong><br />Once your return is inspected and approved, your refund will be processed to your original prepaid payment method (UPI / Bank Account / Card) within 5-7 business days.</p>
          <p><strong>3. CANCELLATION POLICY</strong><br />Orders can be canceled within 12 hours of placement before white-glove dispatch. Contact support@meredianwatches.store for immediate cancellation requests.</p>
        </div>
      )
    },
    shipping: {
      title: "SHIPPING & DELIVERY POLICY",
      url: "meredianwatches.store/shipping-policy",
      content: (
        <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
          <p><strong>1. DISPATCH TIMELINES</strong><br />All orders are processed and dispatched within 24-48 hours. Transit time across India is 3-5 business days via insured express air courier.</p>
          <p><strong>2. INSURED TRANSIT</strong><br />Every MERIDIAN timepiece is shipped with 100% full transit insurance coverage against loss or damage.</p>
        </div>
      )
    },
    contact: {
      title: "CONTACT & SUPPORT",
      url: "meredianwatches.store/contact",
      content: (
        <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
          <p><strong>MERIDIAN LUXURY HOROLOGY</strong></p>
          <p><strong>Support Email:</strong> support@meredianwatches.store</p>
          <p><strong>Operating Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
          <p><strong>Official Merchant Address:</strong> MERIDIAN Horology Atelier, India</p>
          <p><strong>WhatsApp Support:</strong> Available 24/7 via the live chat icon on site.</p>
        </div>
      )
    }
  };

  const activePolicy = policies[type] || policies.terms;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-3xl bg-[#0a0a0f] border border-white/20 rounded-[3rem] p-6 sm:p-10 text-white shadow-[0_40px_100px_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#10B981] uppercase font-bold block mb-1">
              OFFICIAL POLICY // {activePolicy.url}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight">
              {activePolicy.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {activePolicy.content}

      </div>
    </div>
  );
}
