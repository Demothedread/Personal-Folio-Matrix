import React from 'react';

interface BackgroundDecorationsProps {
  isSurging?: boolean;
}

const BackgroundDecorations: React.FC<BackgroundDecorationsProps> = ({ isSurging = false }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-[3000ms] ${isSurging ? 'bg-space-black' : ''}`}>
      <svg className={`w-full h-full transition-opacity duration-1000 ${isSurging ? 'opacity-50' : 'opacity-10 dark:opacity-20'}`}>
        <g stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-400 dark:text-gray-600">
           {[100, 300, 600, 1200, 2000, 4000].map((size, i) => (
             <rect 
               key={i}
               x="50%" 
               y="50%" 
               width={size} 
               height={size * 0.75} 
               transform={`translate(-${size/2}, -${size*0.75/2})`}
               className={`transition-all duration-[2000ms] ${isSurging ? 'opacity-100 stroke-space-cyan' : 'opacity-50'}`}
               style={{
                 transform: isSurging ? `translate(-${size/2}, -${size*0.75/2}) scale(2.5)` : `translate(-${size/2}, -${size*0.75/2}) scale(1)`,
               }}
             />
           ))}
           <line x1="0" y1="0" x2="50%" y2="50%" className={isSurging ? 'stroke-space-magenta stroke-2' : ''} />
           <line x1="100%" y1="0" x2="50%" y2="50%" className={isSurging ? 'stroke-space-magenta stroke-2' : ''} />
           <line x1="0" y1="100%" x2="50%" y2="50%" className={isSurging ? 'stroke-space-magenta stroke-2' : ''} />
           <line x1="100%" y1="100%" x2="50%" y2="50%" className={isSurging ? 'stroke-space-magenta stroke-2' : ''} />
        </g>

        <g className="text-space-cyan dark:text-space-cyan mix-blend-screen">
            <path 
              d="M 800 100 L 820 150 L 800 200 L 780 150 Z" 
              fill="currentColor" 
              className={`transition-all duration-[3000ms] ${isSurging ? 'scale-[20] translate-x-[-1000px]' : 'opacity-40'}`}
            />

            <path 
              d="M 100 800 Q 150 850 300 820 Q 200 800 180 700 Q 150 780 100 800" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className={`dark:text-space-magenta text-prairie-rust transition-all duration-[3000ms] ${isSurging ? 'scale-[5] opacity-100 stroke-[5px]' : 'opacity-40'}`}
            />
            
            <circle cx="20%" cy="30%" r="2" fill="currentColor" />
            <circle cx="80%" cy="70%" r="3" fill="currentColor" className="animate-pulse" />
        </g>
      </svg>

      {isSurging && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1),transparent_70%)] animate-pulse" />
      )}
    </div>
  );
};

export default BackgroundDecorations;