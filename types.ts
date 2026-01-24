export enum ModuleType {
  HERO = 'HERO',
  NAV = 'NAV',
  GALLERY_MAIN = 'GALLERY_MAIN',
  GALLERY_SATELLITE_FADE = 'GALLERY_SATELLITE_FADE',
  GALLERY_SATELLITE_CAROUSEL = 'GALLERY_SATELLITE_CAROUSEL',
  PDF_VIEWER = 'PDF_VIEWER',
  ITEM_LIST = 'ITEM_LIST',
  BLOG_PORTAL = 'BLOG_PORTAL',
  SITE_PORTAL = 'SITE_PORTAL',
  TEXT_BOX = 'TEXT_BOX',
  TEXT_EDITOR = 'TEXT_EDITOR',
  OS_SANDBOX = 'OS_SANDBOX',
  MINIGAME = 'MINIGAME',
  EXTERNAL_EMBED = 'EXTERNAL_EMBED',
  CUSTOM_CODE = 'CUSTOM_CODE',
}

export interface Dimensions {
  w: number;
  h: number;
}

// Position in the 3D world
// X: Horizontal offset from center (px)
// Y: Vertical position in the scrolling world (px)
// Z: Depth (px). Negative is further away.
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

export interface ModuleData {
  id: string;
  type: ModuleType;
  title: string;
  content?: any; // Used for text content
  cmsItems?: CMSItem[];
  embedUrl?: string; // Used for EXTERNAL_EMBED
  codeSnippet?: string; // Used for CUSTOM_CODE
  worldPos: WorldPosition;
  dimensions: Dimensions; // Width/Height in pixels (at scale 1)
  connectedTo?: string[]; // IDs of modules this one connects to
  themeColor?: 'cyan' | 'magenta' | 'yellow' | 'rust' | 'olive' | 'slate';
}

export interface CMSItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  body?: string;
  status?: 'draft' | 'published';
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
