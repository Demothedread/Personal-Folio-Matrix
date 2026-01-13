import React from 'react';

const HeroContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-center space-y-4">
      <div className="border-l-4 border-prairie-rust pl-4 mb-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
          Alex<br/>Mercer
        </h1>
      </div>
      <p className="font-mono text-sm md:text-base opacity-80 max-w-xs">
        System Architect // Creative Developer // Visual Futurist
      </p>
      
      <div className="h-px w-full bg-current opacity-20 my-4" />
      
      <div className="flex flex-col space-y-2 text-xs font-bold tracking-widest uppercase">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-prairie-ochre mr-2 rounded-sm" />
          Ready for deployment
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-space-cyan mr-2 rounded-sm" />
          Open for collaboration
        </span>
      </div>

      <div className="mt-auto pt-4 flex gap-2">
         <button className="px-4 py-2 bg-prairie-rust text-white font-bold hover:bg-red-700 transition-colors uppercase text-xs">
            Init Contact
         </button>
         <button className="px-4 py-2 border border-current hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors uppercase text-xs">
            Download Data
         </button>
      </div>
    </div>
  );
};

export default HeroContent;