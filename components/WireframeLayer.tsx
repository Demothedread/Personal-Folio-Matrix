import React from 'react';
import { ModuleData } from '../types';
import { projectBox } from '../utils/geometry';

interface WireframeLayerProps {
  modules: ModuleData[];
  scrollY: number;
  windowSize: { w: number; h: number };
  rotationY?: number; // Optional to maintain backward compat if needed, but best passed
}

const WireframeLayer: React.FC<WireframeLayerProps> = ({ modules, scrollY, windowSize, rotationY = 0 }) => {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      {modules.map((mod) => {
        // Create a "Z-Axis Tunnel" wireframe for each module
        // It runs deep into the background and foreground relative to the module
        const tunnelDepth = 4000;
        const tunnelPoints = projectBox(
            { ...mod.worldPos }, // Center
            { w: mod.dimensions.w + 40, h: mod.dimensions.h + 40, d: tunnelDepth }, // Slightly larger than module
            scrollY,
            windowSize.w,
            windowSize.h,
            rotationY
        );

        // Create a "Y-Axis Shaft" wireframe
        // Runs vertically through the module
        const shaftHeight = 6000;
        const shaftPoints = projectBox(
            { ...mod.worldPos },
            { w: mod.dimensions.w, h: shaftHeight, d: 20 }, // Thin in depth
            scrollY,
            windowSize.w,
            windowSize.h,
            rotationY
        );
        
        // Helper to draw a cube from 8 points
        const drawCube = (pts: {x: number, y: number}[], strokeWidth: number, opacity: number) => {
             // Front Face: 0-1-2-3
             // Back Face: 4-5-6-7
             // Connections: 0-4, 1-5, 2-6, 3-7
             
             // Check if vaguely on screen to avoid rendering glitches
             if (pts.every(p => p.y < -1000) || pts.every(p => p.y > windowSize.h + 1000)) return null;

             const path = `
                M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y} L ${pts[2].x},${pts[2].y} L ${pts[3].x},${pts[3].y} Z
                M ${pts[4].x},${pts[4].y} L ${pts[5].x},${pts[5].y} L ${pts[6].x},${pts[6].y} L ${pts[7].x},${pts[7].y} Z
                M ${pts[0].x},${pts[0].y} L ${pts[4].x},${pts[4].y}
                M ${pts[1].x},${pts[1].y} L ${pts[5].x},${pts[5].y}
                M ${pts[2].x},${pts[2].y} L ${pts[6].x},${pts[6].y}
                M ${pts[3].x},${pts[3].y} L ${pts[7].x},${pts[7].y}
             `;

             return (
                 <path d={path} 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth={strokeWidth} 
                       className={`text-black dark:text-white transition-colors duration-500`}
                       style={{ opacity }}
                 />
             );
        };

        return (
            <g key={`wireframe-${mod.id}`}>
                {/* Z-Axis Tunnel - Thicker */}
                {drawCube(tunnelPoints, 1, 0.15)}
                
                {/* Y-Axis Shaft - Thinner, more subtle */}
                {drawCube(shaftPoints, 0.5, 0.1)}
            </g>
        );
      })}
    </svg>
  );
};

export default WireframeLayer;
