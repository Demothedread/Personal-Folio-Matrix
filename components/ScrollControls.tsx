import React, { useEffect, useState } from 'react';

const ScrollControls: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far we've scrolled (0 to 1)
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height : 0;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollBy = (amount: number) => {
    window.scrollBy({ top: amount, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 flex flex-col items-center gap-4 text-gray-900 dark:text-white mix-blend-difference pointer-events-auto">
       {/* Up Arrow */}
       <button 
         onClick={() => scrollBy(-window.innerHeight / 1.5)}
         className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 group backdrop-blur-sm"
         aria-label="Scroll Up"
       >
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-y-1 transition-transform">
           <path d="M12 19V5M5 12l7-7 7 7" />
         </svg>
       </button>

       {/* Track / Indicator - Resembles a fluid level or mercury thermometer */}
       <div className="w-1.5 h-32 border border-current rounded-full relative overflow-hidden bg-white/10">
          <div 
            className="absolute top-0 left-0 w-full bg-current transition-all duration-300 ease-out"
            style={{ 
                height: `${scrollProgress * 100}%`,
                boxShadow: '0 0 10px currentColor' 
            }}
          />
       </div>

       {/* Down Arrow */}
       <button 
         onClick={() => scrollBy(window.innerHeight / 1.5)}
         className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 group backdrop-blur-sm"
         aria-label="Scroll Down"
       >
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-y-1 transition-transform">
           <path d="M12 5v14M5 12l7 7 7-7" />
         </svg>
       </button>
    </div>
  );
};

export default ScrollControls;