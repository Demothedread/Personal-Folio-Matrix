import React from 'react';
import { ModuleData } from '../types';
import { project3DTo2D } from '../utils/geometry';

interface ConnectionLayerProps {
  modules: ModuleData[];
  scrollY: number;
  windowSize: { w: number; h: number };
  rotationY?: number;
}

const ConnectionLayer: React.FC<ConnectionLayerProps> = ({ modules, scrollY, windowSize, rotationY = 0 }) => {
  // We need to calculate projections for all modules to draw lines
  const projectedModules = new Map();
  
  modules.forEach(mod => {
    projectedModules.set(mod.id, project3DTo2D(mod.worldPos, scrollY, windowSize.w, windowSize.h, rotationY));
  });

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      <defs>
        <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-2,2 l4,-4
                   M0,8 l8,-8
                   M6,10 l4,-4" 
                style={{stroke:'currentColor', strokeWidth:1, opacity: 0.2}} />
        </pattern>
        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {modules.map((mod) => {
        if (!mod.connectedTo) return null;
        const startProj = projectedModules.get(mod.id);
        if (!startProj) return null;

        return mod.connectedTo.map((targetId) => {
          const targetMod = modules.find(m => m.id === targetId);
          const endProj = projectedModules.get(targetId);
          
          if (!targetMod || !endProj) return null;

          // Don't render lines if both are way off screen to save performance
          if ((startProj.y < -500 && endProj.y < -500) || 
              (startProj.y > windowSize.h + 500 && endProj.y > windowSize.h + 500)) {
            return null;
          }

          // We draw a "Beam" - a thick line that looks like a structural element
          const strokeWidth = Math.max(4, 15 * ((startProj.scale + endProj.scale) / 2));
          
          return (
            <g key={`${mod.id}-${targetId}`} className="text-gray-400 dark:text-gray-700">
               {/* Outer "Casing" of the beam */}
               <line 
                 x1={startProj.x} y1={startProj.y} 
                 x2={endProj.x} y2={endProj.y} 
                 stroke="currentColor"
                 strokeWidth={strokeWidth + 4}
                 strokeLinecap="square"
                 className="opacity-50"
               />
               
               {/* Inner "Hollow" or "filled" part */}
               <line 
                 x1={startProj.x} y1={startProj.y} 
                 x2={endProj.x} y2={endProj.y} 
                 stroke="black" // Dark interior for high contrast
                 strokeWidth={strokeWidth}
                 strokeLinecap="square"
                 className="dark:stroke-space-black stroke-prairie-cream"
               />

               {/* The "Energy" or "Data" cable inside */}
               <line 
                 x1={startProj.x} y1={startProj.y} 
                 x2={endProj.x} y2={endProj.y} 
                 className="stroke-prairie-rust dark:stroke-space-cyan opacity-80"
                 strokeWidth={strokeWidth * 0.2}
                 strokeDasharray="10, 5"
               />
               
               {/* Animated Packet */}
               <circle r={strokeWidth * 0.3} fill="white" className="filter drop-shadow-lg">
                 <animateMotion 
                    dur={`${Math.random() * 4 + 2}s`} 
                    repeatCount="indefinite"
                    path={`M${startProj.x},${startProj.y} L${endProj.x},${endProj.y}`}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                 />
               </circle>

               {/* Connector Joints */}
               <rect 
                  x={startProj.x - strokeWidth/2} 
                  y={startProj.y - strokeWidth/2} 
                  width={strokeWidth} 
                  height={strokeWidth} 
                  fill="currentColor"
                  className="rotate-45 transform origin-center"
               />
               <rect 
                  x={endProj.x - strokeWidth/2} 
                  y={endProj.y - strokeWidth/2} 
                  width={strokeWidth} 
                  height={strokeWidth} 
                  fill="currentColor"
                  className="rotate-45 transform origin-center"
               />
            </g>
          );
        });
      })}
    </svg>
  );
};

export default ConnectionLayer;
