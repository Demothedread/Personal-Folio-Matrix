import React, { useState, useEffect } from 'react';

const OsSandbox: React.FC = () => {
  const [lines, setLines] = useState<string[]>(['> SYSTEM INIT...', '> KERNEL LOADING...']);
  
  useEffect(() => {
    const timer = setInterval(() => {
        setLines(prev => {
            if (prev.length > 8) return prev.slice(1);
            const cmds = ['> CHECKING MEMORY...', '> MOUNTING VIRTUAL DRIVE...', '> PARSING CSS...', '> OPTIMIZING LAYOUT...'];
            return [...prev, cmds[Math.floor(Math.random() * cmds.length)]];
        });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full bg-space-black text-green-500 font-mono text-xs p-2 overflow-hidden flex flex-col relative shadow-inner-screen">
       {lines.map((l, i) => (
           <div key={i} className="mb-1">{l}</div>
       ))}
       <div className="mt-2 animate-pulse">_</div>
       
       <div className="absolute bottom-2 right-2 border border-green-500 px-2 py-1 text-[10px] hover:bg-green-900 cursor-pointer">
         EXECUTE
       </div>
    </div>
  );
};

export default OsSandbox;