import React, { ReactNode, useState, useRef, MouseEvent } from 'react';
import { Dimensions, ModuleType } from '../types';

interface ModuleFrameProps {
  children: ReactNode;
  id: string;
  title: string;
  dimensions: Dimensions;
  type: ModuleType;
  isActive: boolean;
  themeColor?: string;
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  rotationY: number;
  isExpanded?: boolean;
  isExploding?: boolean;
  isEditMode?: boolean;
  onResize: (id: string, newW: number, newH: number) => void;
  onExpand: () => void;
  onClose: () => void;
  onEdit?: () => void;
  onHoverSound?: () => void;
}

const ModuleFrame: React.FC<ModuleFrameProps> = ({
  children,
  id,
  title,
  dimensions,
  type,
  isActive,
  themeColor = 'cyan',
  x,
  y,
  scale,
  zIndex,
  rotationY,
  isExpanded = false,
  isExploding = false,
  isEditMode = false,
  onResize,
  onExpand,
  onClose,
  onEdit,
  onHoverSound
}) => {
  const [localRotation, setLocalRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const renderW = isExpanded ? 'calc(100vw - 40px)' : `${dimensions.w}px`;
  const renderH = isExpanded ? 'calc(100vh - 60px)' : `${dimensions.h}px`;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0, 
    top: 0,
    width: renderW,
    height: renderH,
    maxWidth: isExpanded ? '1200px' : 'none',
    maxHeight: isExpanded ? '900px' : 'none',
    transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${isExpanded ? 1 : (isExploding ? 10 : scale)})`,
    zIndex: isExpanded ? 10000 : (isExploding ? 8888 : zIndex),
    opacity: isExploding ? 0 : (isActive ? 1 : 0),
    filter: isExploding ? 'blur(120px) brightness(2) saturate(2)' : 'none',
    transition: isExploding 
       ? 'all 2.5s cubic-bezier(1, 0, 0, 1)' 
       : (isResizing ? 'none' : 'opacity 0.5s, width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'), 
    pointerEvents: (isActive && !isExploding) ? 'auto' : 'none',
    mixBlendMode: isExploding ? 'screen' : 'normal',
    // In edit mode, we want a dashed border indication if not expanded
    outline: (isEditMode && !isExpanded) ? '1px dashed #cc9933' : 'none',
    outlineOffset: '4px',
  };

  const colorMap: Record<string, string> = {
    cyan: '#00f3ff',
    magenta: '#ff00ff',
    yellow: '#ffe600',
    rust: '#a63737',
    olive: '#708238',
    slate: '#4a5d6e',
  };

  const themeHex = colorMap[themeColor] || colorMap.cyan;

  let transformString;
  if (isExpanded) {
    transformString = `perspective(2000px) rotateY(0deg) rotateX(0deg) scale(1) translateZ(0)`;
  } else if (isExploding) {
    transformString = `perspective(800px) rotateX(90deg) translateZ(800px) scale(2)`;
  } else {
    transformString = `
      perspective(800px) 
      rotateY(${rotationY * 0.5}deg) 
      rotateX(${localRotation.x}deg) 
      rotateY(${localRotation.y}deg) 
      scale(${isPressed ? 0.95 : (isHovered ? 0.98 : 1)}) 
      translateZ(${isPressed ? -50 : (isHovered ? -15 : 0)}px)
    `;
  }

  const handleResizeStart = (e: MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = dimensions.w;
    const startH = dimensions.h;

    const handleMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;
      onResize(id, Math.max(150, startW + deltaX), Math.max(150, startH + deltaY));
    };

    const handleUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div 
      ref={containerRef}
      style={style} 
      className={`will-change-transform ${isExpanded ? 'pointer-events-auto' : ''}`}
      onMouseEnter={() => {
        if (!isExpanded && !isExploding) {
          setIsHovered(true);
          onHoverSound?.();
        }
      }}
      onMouseLeave={() => { setIsHovered(false); setLocalRotation({x:0,y:0}); setIsPressed(false); }}
      onMouseDown={() => !isExpanded && !isExploding && setIsPressed(true)}
      onMouseUp={() => { if(isPressed && !isEditMode) { setIsPressed(false); onExpand(); } }}
    >
      {/* Nebula Flash Overlay */}
      {isExploding && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse" 
          style={{ 
            background: `radial-gradient(circle, ${themeHex} 0%, transparent 80%)`,
            transform: 'scale(5)',
            opacity: 0.9
          }} 
        />
      )}
      
      <div 
        className={`relative w-full h-full flex flex-col overflow-hidden rounded-xl bg-prairie-cream dark:bg-[#151515] border-[1px] border-white/10 ${isExpanded ? 'shadow-2xl' : 'shadow-xl'}`}
        style={{
          transform: transformString,
          transition: isResizing ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
          boxShadow: isExpanded 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : `inset 1px 1px 2px rgba(255,255,255,0.3), inset -1px -1px 2px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.5)`
        }}
      >
        <div className={`absolute inset-0 pointer-events-none rounded-xl border-[4px] opacity-80 border-${themeColor === 'rust' ? 'prairie-rust' : 'space-'+themeColor}`} />
        
        <div className="relative h-12 flex items-center justify-between px-4 bg-black/5 dark:bg-white/5 shrink-0 z-30">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 truncate w-2/3">
              {type} {isExpanded ? '// FOCUS_MODE' : ''}
            </span>
            
            {/* Control Buttons */}
            <div className="flex gap-2 z-50">
              {/* EDIT BUTTON (Only in Edit Mode) */}
              {isEditMode && onEdit && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="w-8 h-8 rounded-lg bg-prairie-ochre hover:bg-yellow-600 text-black border border-yellow-800 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                  title="Edit Module Properties"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </button>
              )}

              {/* CLOSE BUTTON (Only when Expanded) */}
              {isExpanded && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/50 flex items-center justify-center text-red-500 transition-colors cursor-pointer group"
                  aria-label="Exit Focus"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="group-hover:scale-110 transition-transform"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
        </div>

        <div className="relative flex-1 overflow-hidden m-1 rounded-lg bg-prairie-cream dark:bg-black/40 shadow-inner-screen">
          <div className={`w-full h-full p-6 md:p-10 text-gray-800 dark:text-gray-200 relative z-0 overflow-y-auto ${isExpanded ? 'text-xl' : ''} ${isEditMode ? 'pointer-events-none opacity-50' : ''}`}>
             <div className={`${isExpanded ? 'max-w-4xl mx-auto' : 'h-full'}`}>
               <h2 className={`font-black font-sans uppercase mb-6 tracking-tighter opacity-90 ${isExpanded ? 'text-5xl md:text-7xl mb-10' : 'text-xl'}`}>
                 {title}
               </h2>
               <div className={`${isExpanded ? 'leading-relaxed space-y-6' : 'h-full'}`}>
                 {children}
               </div>
             </div>
          </div>
        </div>

        {!isExpanded && (
          <div 
            className="absolute bottom-1 right-1 w-6 h-6 z-50 cursor-se-resize group opacity-50 hover:opacity-100"
            onMouseDown={handleResizeStart}
          >
              <svg viewBox="0 0 10 10" className="w-full h-full fill-gray-500">
                  <path d="M 6 10 L 10 10 L 10 6 Z" />
                  <path d="M 2 10 L 4 10 L 10 4 L 10 2 Z" />
              </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFrame;