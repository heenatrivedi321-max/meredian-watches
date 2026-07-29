import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function Reviews() {
  const containerRef = useRef(null);

  // Scroll Parallax for the heading and cards
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Alternating column speeds for the grid
  const col1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const col2Y = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  const col3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  // Mouse tracking for the heading
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const headingXMouse = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-30, 30]), springConfig);
  const headingYMouse = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-30, 30]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const reviews = [
    {
      name: "ARJUN M.",
      quote: "GOT IT ON MY WRIST. MY BOSS THINKS I GOT A PROMOTION.",
      body: "Walked into the boardroom and three people asked what I was wearing. I let them think it costs more than my rent. Insane value."
    },
    {
      name: "VIKRAM R.",
      quote: "MY SMARTWATCH IS IN A DRAWER. IT DESERVES TO BE THERE.",
      body: "Notifications stress me out. This just sits there looking like a million bucks. No buzzing. No updates. Just pure class."
    },
    {
      name: "KARAN J.",
      quote: "I ORDERED AT 11 PM. IT WAS AT MY DOOR BY LUNCH.",
      body: "South Mumbai delivery in under 24 hours. The packaging alone felt like I was unboxing something from Geneva. Absolutely elite."
    },
    {
      name: "NEHA S.",
      quote: "MY HUSBAND HASN'T STOPPED STARING AT HIS WRIST.",
      body: "I bought this for his birthday. He keeps saying 'look at the second hand glide.' I don't get it. But he's happy. Worth every rupee."
    },
    {
      name: "ROHAN D.",
      quote: "WORE IT TO A WEDDING. THE GROOM ASKED FOR THE LINK.",
      body: "The rose gold caught the light and suddenly everyone wanted one. I said 'Meridian. You're welcome.' Felt like a celebrity."
    },
    {
      name: "PRIYA T.",
      quote: "THE AUTOMATIC MOVEMENT IS MESMERIZING.",
      body: "I just sit there watching the skeleton dial tick. No battery. No screen. Just pure mechanical poetry on my wrist."
    }
  ];

  // Helper to render cards
  const renderCard = (review, idx) => (
    <motion.div 
      key={idx}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[var(--text-color)]/10 mb-6 bg-black"
    >
      <div className="w-full bg-[var(--text-color)] py-5 px-6 flex justify-between items-center">
        <div className="w-2.5 h-2.5 bg-[#0a0a0a] rounded-full"></div>
        <h3 className="font-anton text-xl md:text-2xl text-[#0a0a0a] uppercase tracking-widest m-0">{review.name}</h3>
        <div className="w-2.5 h-2.5 bg-[#0a0a0a] rounded-full"></div>
      </div>
      <div className="w-full p-8 flex flex-col items-center text-center relative min-h-[300px]">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM0 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z' fill='%23f5e5ce' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        <div className="mb-6 text-[var(--text-color)] relative z-10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11V18H3V11L7 3H10L7 11H10ZM21 11V18H14V11L18 3H21L18 11H21Z" />
          </svg>
        </div>
        <h4 
          className="font-anton text-2xl md:text-3xl text-transparent tracking-widest uppercase mb-6 leading-[1.1] relative z-10"
          style={{ WebkitTextStroke: '1px var(--text-color)' }}
        >
          {review.quote}
        </h4>
        <p className="font-sans text-[var(--text-color)]/80 text-sm md:text-base leading-relaxed font-light mt-auto relative z-10">
          {review.body}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#0a0a0a] py-32 px-4 md:px-12 flex flex-col items-center justify-center min-h-[150vh]">
      
      {/* Massive Outlined Background Text - No longer cut off, moves on scroll & mouse */}
      <motion.div 
        className="absolute top-0 left-0 w-full flex justify-center items-start pointer-events-none select-none z-0 pt-20"
        style={{ 
          y: headingY, 
          x: headingXMouse,
          marginTop: headingYMouse
        }}
      >
        <h2 
          className="text-[25vw] font-anton tracking-tighter text-transparent leading-none m-0 whitespace-nowrap"
          style={{ WebkitTextStroke: '2px rgba(245, 229, 206, 0.15)' }}
        >
          REVIEWS
        </h2>
      </motion.div>

      {/* Review Cards Grid - Parallax Columns */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-[10vh]">
        
        {/* Column 1 */}
        <motion.div className="flex flex-col" style={{ y: col1Y }}>
          {renderCard(reviews[0], 0)}
          {renderCard(reviews[3], 3)}
        </motion.div>

        {/* Column 2 */}
        <motion.div className="flex flex-col" style={{ y: col2Y }}>
          {renderCard(reviews[1], 1)}
          {renderCard(reviews[4], 4)}
        </motion.div>

        {/* Column 3 */}
        <motion.div className="flex flex-col" style={{ y: col3Y }}>
          {renderCard(reviews[2], 2)}
          {renderCard(reviews[5], 5)}
        </motion.div>

      </div>
    </section>
  );
}
