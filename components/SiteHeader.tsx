import React from 'react';

interface SiteHeaderProps {
  isScrolled: boolean;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ isScrolled }) => {
  return (
    <div 
      className={`fixed z-50 p-6 md:p-8 pointer-events-none select-none flex flex-col gap-1 mix-blend-difference text-white w-full max-w-4xl transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]`}
      style={{
        top: isScrolled ? '0%' : '30%',
        left: isScrolled ? '0%' : '50%',
        transform: isScrolled ? 'translate(0, 0) scale(0.8)' : 'translate(-50%, -50%) scale(1.2)',
        transformOrigin: isScrolled ? 'top left' : 'center center',
        alignItems: isScrolled ? 'flex-start' : 'center',
        textAlign: isScrolled ? 'left' : 'center'
      }}
    >
      {/* Name Title with Neon Trace Effect */}
      <div className="relative overflow-hidden group pointer-events-auto cursor-default">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none font-sans neon-trace-text">
          JONATHAN MARK REBACK 
        </h1>
        {/* Subtitle */}
        <div className={`flex items-center gap-3 mt-2 pl-1 ${isScrolled ? 'justify-start' : 'justify-center'}`}>
          <div className="h-px w-8 bg-current opacity-50" />
          <p className="font-mono text-xs md:text-sm tracking-widest opacity-80 uppercase">
            Portfolio | Resumé | Profile | Los Angeles CA 
          </p>
          <div className={`h-px w-8 bg-current opacity-50 ${isScrolled ? 'hidden' : 'block'}`} />
        </div>
      </div>

      <div className={`mt-6 pl-1 pointer-events-auto transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-80'}`}>
         <a href="mailto:contact@example.com" className="text-[10px] font-mono border border-current px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
            Est. Connection
         </a>
      </div>

      <style>{`
        .neon-trace-text {
          background: linear-gradient(
            110deg,
            #888888 0%,
            #ffffff 10%,
            #888888 20%,
            #888888 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 6s linear infinite;
        }
        
        @keyframes shine {
          0% { background-position: 100% 0; }
          20% { background-position: -100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
};

export default SiteHeader;