import { WorldPosition } from '../types';

export const PROJECT_CONSTANTS = {
  PERSPECTIVE: 800, // Reduced for stronger parallax/depth effect
  SCROLL_DEPTH_FACTOR: 0.12,
  DEPTH_ATTENUATION: 1000,
};

/**
 * Scale scroll-driven depth offset by distance from the camera.
 * @param z - World space z position.
 * @param attenuation - Depth distance where influence reaches 1.
 * @returns Normalized influence factor between 0 and 1.
 */
const calculateDepthInfluence = (z: number, attenuation: number) => (
  Math.min(1, Math.max(0, -z / attenuation))
);

/**
 * Projects a 3D point in world space to 2D screen space based on scroll position and global rotation.
 */
export const project3DTo2D = (
  pos: WorldPosition,
  scrollY: number,
  windowWidth: number,
  windowHeight: number,
  rotationY: number = 0 // Degrees
) => {
  const { PERSPECTIVE, SCROLL_DEPTH_FACTOR, DEPTH_ATTENUATION } = PROJECT_CONSTANTS;

  // 1. Apply Global Rotation (Y-Axis)
  // Rotate around the world origin (0, 0, 0)
  const rad = rotationY * (Math.PI / 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Standard rotation matrix for Y-axis
  // x' = x cos θ + z sin θ
  // z' = z cos θ - x sin θ
  const rx = pos.x * cos + pos.z * sin;
  // Apply scroll-based depth offset that increases for objects farther from camera (negative z).
  const depthInfluence = calculateDepthInfluence(pos.z, DEPTH_ATTENUATION);
  const scrollDepth = scrollY * SCROLL_DEPTH_FACTOR * depthInfluence;
  const rz = pos.z * cos - pos.x * sin + scrollDepth;

  // 2. Relative Y position based on scroll. 
  // We assume y=0 is the top of the "world".
  const relativeY = pos.y - scrollY;

  // 3. Calculate Scale Factor
  // CSS Perspective formula: scale = d / (d - z)
  // We assume Camera is at (0, 0, PERSPECTIVE) looking at Z=0 plane.
  const safeZ = Math.min(rz, PERSPECTIVE - 10); 
  const scale = Math.max(0, PERSPECTIVE / (PERSPECTIVE - safeZ));

  const cx = windowWidth / 2;
  const cy = windowHeight / 2;

  // 4. Apply Perspective Projection
  const screenX = cx + (rx * scale);
  const screenY = cy + (relativeY * scale);

  return {
    x: screenX,
    y: screenY,
    scale,
    zIndex: Math.floor(scale * 1000)
  };
};

/**
 * Projects a 3D cube/prism to 2D screen coordinates for wireframe rendering.
 */
export const projectBox = (
  center: WorldPosition,
  size: { w: number; h: number; d: number },
  scrollY: number,
  windowWidth: number,
  windowHeight: number,
  rotationY: number = 0
) => {
  const halfW = size.w / 2;
  const halfH = size.h / 2;
  const halfD = size.d / 2;

  // 8 corners of the box
  const corners = [
    { x: center.x - halfW, y: center.y - halfH, z: center.z - halfD }, // 0: TL Front
    { x: center.x + halfW, y: center.y - halfH, z: center.z - halfD }, // 1: TR Front
    { x: center.x + halfW, y: center.y + halfH, z: center.z - halfD }, // 2: BR Front
    { x: center.x - halfW, y: center.y + halfH, z: center.z - halfD }, // 3: BL Front
    { x: center.x - halfW, y: center.y - halfH, z: center.z + halfD }, // 4: TL Back
    { x: center.x + halfW, y: center.y - halfH, z: center.z + halfD }, // 5: TR Back
    { x: center.x + halfW, y: center.y + halfH, z: center.z + halfD }, // 6: BR Back
    { x: center.x - halfW, y: center.y + halfH, z: center.z + halfD }, // 7: BL Back
  ];

  return corners.map(p => project3DTo2D(p, scrollY, windowWidth, windowHeight, rotationY));
};
