import React, { useState, useEffect, useRef } from 'react';

const IMAGES = [
  "https://picsum.photos/400/300?random=10",
  "https://picsum.photos/400/300?random=11",
  "https://picsum.photos/400/300?random=12",
  "https://picsum.photos/400/300?random=13",
  "https://picsum.photos/400/300?random=14",
];

// --- MAIN GALLERY (Manual + Slide) ---
export const GalleryMain: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next

  const next = () => {
    setDirection(1);
    setIdx((p) => (p + 1) % IMAGES.length);
  };
  const prev = () => {
    setDirection(-1);
    setIdx((p) => (p - 1 + IMAGES.length) % IMAGES.length);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="relative flex-1 overflow-hidden border-b-2 border-gray-800 group">
        {IMAGES.map((src, i) => {
          let transform = 'translateX(100%)';
          if (i === idx) transform = 'translateX(0)';
          else if (direction === 1 && i === (idx - 1 + IMAGES.length) % IMAGES.length) transform = 'translateX(-100%)';
          else if (direction === -1 && i === (idx + 1) % IMAGES.length) transform = 'translateX(100%)'; // Stack order handles overlap

          // Simple active/inactive logic for basic sliding
          const isActive = i === idx;
          const isPrev = i === (idx - 1 + IMAGES.length) % IMAGES.length;
          const isNext = i === (idx + 1) % IMAGES.length;
          
          let style: React.CSSProperties = { 
            position: 'absolute', inset: 0, transition: 'transform 0.5s ease-in-out',
            transform: isActive ? 'translateX(0)' : (i < idx ? 'translateX(-100%)' : 'translateX(100%)')
          };
          
          // Override for loop-around cases would require more complex state or a library like framer-motion.
          // For this CSS implementation, we will use opacity + scale for a "Deck" feel to avoid complex list virtualization
          style = {
             position: 'absolute', 
             inset: 0, 
             opacity: isActive ? 1 : 0,
             transform: isActive ? 'scale(1)' : 'scale(0.9)',
             transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
             zIndex: isActive ? 10 : 0
          };

          return (
            <img 
                key={i}
                src={src} 
                alt="" 
                className="w-full h-full object-cover"
                style={style}
            />
          );
        })}
        
        {/* Overlay Info */}
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-[10px] text-space-cyan font-mono border border-space-cyan/30">
            IMG_SEQ :: {String(idx + 1).padStart(2, '0')} / {String(IMAGES.length).padStart(2, '0')}
        </div>
      </div>
      
      {/* Controls */}
      <div className="h-10 flex items-center justify-between px-2 bg-gray-900 border-t border-gray-700">
        <button onClick={prev} className="hover:text-space-cyan transition-colors font-mono text-xs">
           [ PREV ]
        </button>
        <div className="flex gap-1">
            {IMAGES.map((_, i) => (
                <div key={i} className={`h-1 w-3 rounded-full transition-colors ${i === idx ? 'bg-space-cyan' : 'bg-gray-600'}`} />
            ))}
        </div>
        <button onClick={next} className="hover:text-space-cyan transition-colors font-mono text-xs">
           [ NEXT ]
        </button>
      </div>
    </div>
  );
};

// --- SATELLITE: CROSS DISSOLVE ---
export const GallerySatelliteFade: React.FC = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((p) => (p + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden pointer-events-none">
      {IMAGES.map((src, i) => (
        <div 
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
            style={{ 
                backgroundImage: `url(${src})`,
                opacity: i === idx ? 1 : 0 
            }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-3 right-3 text-xs font-mono text-gray-400 tracking-widest">
         AUTO_SEQ.FADE
      </div>
    </div>
  );
};

// --- SATELLITE: CAROUSEL (Random Wipe) ---
export const GallerySatelliteCarousel: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [direction, setDirection] = useState<'UP'|'DOWN'|'LEFT'|'RIGHT'>('LEFT');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
       if (isAnimating) return;
       
       const next = (currentIdx + 1) % IMAGES.length;
       const dirs: ('UP'|'DOWN'|'LEFT'|'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
       const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
       
       setNextIdx(next);
       setDirection(randomDir);
       setIsAnimating(true);

       setTimeout(() => {
           setCurrentIdx(next);
           setIsAnimating(false);
       }, 800); // Match transition duration

    }, 3500);
    return () => clearInterval(timer);
  }, [currentIdx, isAnimating]);

  const getInitialTransform = (dir: string) => {
      switch(dir) {
          case 'UP': return 'translateY(100%)';
          case 'DOWN': return 'translateY(-100%)';
          case 'LEFT': return 'translateX(100%)';
          case 'RIGHT': return 'translateX(-100%)';
          default: return 'translateX(100%)';
      }
  };

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden pointer-events-none">
      {/* Current Image (Static until covered or moves out) */}
      {/* For a true wipe, the old image stays put and the new one slides over it. */}
      
      <img 
        src={IMAGES[currentIdx]} 
        alt=""
        className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125"
      />

      {/* Next Image (Animating In) */}
      <img 
        src={IMAGES[nextIdx]}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125 transition-transform duration-800 ease-in-out z-10`}
        style={{
            transform: isAnimating ? 'translate(0,0)' : getInitialTransform(direction),
            boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow to sell the "over" effect
        }}
      />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 z-20 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      
      <div className="absolute top-3 left-3 px-1 border border-white/40 text-[9px] font-mono text-white/80 z-30 bg-black/50 backdrop-blur-md">
         WIPE_DIR: {direction}
      </div>
    </div>
  );
};
