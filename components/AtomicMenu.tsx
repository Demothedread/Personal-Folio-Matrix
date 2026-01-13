import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AtomicMenuProps {
  onClick: () => void;
  onNavigate: (target: string) => void;
  isOpen: boolean;
}

const menuData = [
  { label: 'HOME', color: '#98DDDE', id: 'top' },
  { label: 'RESUMÉ', color: '#E9AAE6', id: 'intro-text' },
  { label: 'PROJECTS', color: '#ffe600', id: 'skills-node' },
  { label: 'GALLERY', color: '#E9897E', id: 'gallery-1' },
  { label: 'BLOG', color: '#A0DAA9', id: 'blog-node' },
  { label: 'VORTEX', color: '#6667AB', id: 'EXPLODE_CMD' },
];

const AtomicMenu: React.FC<AtomicMenuProps> = ({ onClick, onNavigate, isOpen }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPersistedHover, setIsPersistedHover] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Equal line lengths: Priority 1
  const radius = 75; 

  const handleNavigateIndex = useCallback((index: number) => {
    onNavigate(menuData[index].id);
  }, [onNavigate]);

  const cycleIndex = useCallback((dir: number) => {
    setActiveIndex(prev => {
      if (prev === null) return 0;
      const next = (prev + dir + menuData.length) % menuData.length;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(null);
      setIsPersistedHover(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') cycleIndex(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') cycleIndex(-1);
      if (e.key === 'Enter' && activeIndex !== null) handleNavigateIndex(activeIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, cycleIndex, handleNavigateIndex]);

  const handleOrbMouseEnter = (index: number) => {
    setActiveIndex(index);
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsPersistedHover(true);
    }, 400); 
  };

  const handleOrbMouseLeave = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setActiveIndex(null);
    setIsPersistedHover(false);
  };

  return (
    <div 
      className="fixed top-8 right-8 z-[60] flex items-center justify-center pointer-events-none"
      onWheel={(e) => { if (isOpen) { e.preventDefault(); cycleIndex(e.deltaY > 0 ? 1 : -1); } }}
    >
      <button 
        onClick={onClick}
        className="relative z-[70] focus:outline-none pointer-events-auto"
        aria-label="Toggle Menu"
      >
        <div className={`relative w-24 h-24 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'rotate-180 scale-100' : 'rotate-0'}`}>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white dark:bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_white] z-20" />
          
          {menuData.map((item, i) => {
            const angle = i * 60;
            const currentRadius = isOpen ? radius : 0;
            const isActive = activeIndex === i;
            const totalRotation = angle - 90;
            const rad = totalRotation * (Math.PI / 180);
            const x = Math.cos(rad) * currentRadius;
            const y = Math.sin(rad) * currentRadius;

            return (
              <React.Fragment key={i}>
                <div
                  className="absolute top-1/2 left-1/2 h-0.5 bg-gray-400 dark:bg-gray-600 origin-left transition-all duration-700"
                  style={{ 
                    transform: `translate(0, -50%) rotate(${totalRotation}deg)`,
                    width: `${currentRadius}px`,
                    opacity: isOpen ? 0.6 : 0
                  }}
                />

                <div
                  onMouseEnter={() => handleOrbMouseEnter(i)}
                  onMouseLeave={handleOrbMouseLeave}
                  onClick={(e) => {
                    if (!isOpen) return;
                    e.stopPropagation();
                    handleNavigateIndex(i);
                  }}
                  className={`absolute top-1/2 left-1/2 w-6 h-6 flex items-center justify-center transition-all duration-500 cursor-pointer pointer-events-auto group/orb
                    ${isActive ? 'z-[100]' : 'z-80'}
                  `}
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${isOpen ? -180 : 0}deg)`,
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full transition-transform duration-500"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 ${isActive ? '25px' : '8px'} ${item.color}`,
                      transform: `scale(${isActive ? 2 : 1})`
                    }}
                  />

                  {isActive && (
                    <div className="absolute right-[50%] top-[50%] pointer-events-none">
                      <svg className="absolute overflow-visible pointer-events-none" width="400" height="200" style={{ transform: 'translate(-100%, -100%)' }}>
                        <g className="text-gray-400 dark:text-gray-500 opacity-60">
                          <line x1="400" y1="200" x2="385" y2="185" stroke="currentColor" strokeWidth="1" />
                          <line x1="385" y1="185" x2="100" y2="185" stroke="currentColor" strokeWidth="1" />
                        </g>
                      </svg>

                      <div 
                        className={`absolute bottom-[18px] right-[20px] origin-bottom-right transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                          ${isPersistedHover ? 'scale-[3] -translate-x-12' : 'scale-100'}
                        `}
                      >
                         <div className="flex flex-col items-end whitespace-nowrap">
                            <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-gray-600 dark:text-gray-300 opacity-90 uppercase pb-0.5">
                              {item.label}
                            </span>
                            <div className={`h-[1px] bg-gray-400 dark:bg-gray-600 transition-all duration-700 w-full`} />
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-current pointer-events-none" />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </button>
      <div className={`fixed inset-0 bg-black/5 pointer-events-none transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default AtomicMenu;