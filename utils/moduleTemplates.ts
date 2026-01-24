import { ModuleData, ModuleType } from '../types';

export interface ModuleTemplate {
  name: string;
  description: string;
  category: 'content' | 'gallery' | 'interactive' | 'text' | 'feed';
  icon: string;
  template: Omit<ModuleData, 'id' | 'worldPos'>;
}

export const MODULE_TEMPLATES: ModuleTemplate[] = [
  // TEXT CONTENT TEMPLATES
  {
    name: 'Text Editor',
    description: 'Rich text content with typewriter effect',
    category: 'text',
    icon: '📝',
    template: {
      type: ModuleType.TEXT_EDITOR,
      title: 'NEW_TEXT_EDITOR',
      dimensions: { w: 380, h: 280 },
      themeColor: 'cyan',
      content: 'Enter your text content here...'
    }
  },
  {
    name: 'Text Box',
    description: 'Simple text display box',
    category: 'text',
    icon: '📄',
    template: {
      type: ModuleType.TEXT_BOX,
      title: 'NEW_TEXT_BOX',
      dimensions: { w: 180, h: 160 },
      themeColor: 'yellow',
      content: 'Simple text content...'
    }
  },
  
  // GALLERY TEMPLATES
  {
    name: 'Main Gallery',
    description: 'Primary image gallery with navigation',
    category: 'gallery',
    icon: '🖼️',
    template: {
      type: ModuleType.GALLERY_MAIN,
      title: 'VISUAL_DB_MAIN',
      dimensions: { w: 450, h: 320 },
      themeColor: 'magenta'
    }
  },
  {
    name: 'Fade Gallery',
    description: 'Auto-cycling gallery with fade transitions',
    category: 'gallery',
    icon: '🎞️',
    template: {
      type: ModuleType.GALLERY_SATELLITE_FADE,
      title: 'SAT_UPLINK_FADE',
      dimensions: { w: 200, h: 150 },
      themeColor: 'cyan'
    }
  },
  {
    name: 'Carousel Gallery',
    description: 'Gallery with wipe transitions',
    category: 'gallery',
    icon: '🎠',
    template: {
      type: ModuleType.GALLERY_SATELLITE_CAROUSEL,
      title: 'SAT_UPLINK_CAROUSEL',
      dimensions: { w: 240, h: 180 },
      themeColor: 'yellow'
    }
  },
  
  // CONTENT TEMPLATES
  {
    name: 'List View',
    description: 'Structured list of items',
    category: 'content',
    icon: '📋',
    template: {
      type: ModuleType.ITEM_LIST,
      title: 'SYSTEM_LIST',
      dimensions: { w: 220, h: 320 },
      themeColor: 'slate'
    }
  },
  {
    name: 'Hero Section',
    description: 'Large hero/banner section',
    category: 'content',
    icon: '⭐',
    template: {
      type: ModuleType.HERO,
      title: 'UPLINK_TERMINAL',
      dimensions: { w: 420, h: 250 },
      themeColor: 'slate'
    }
  },
  
  // INTERACTIVE TEMPLATES
  {
    name: 'OS Sandbox',
    description: 'Terminal/console interface',
    category: 'interactive',
    icon: '💻',
    template: {
      type: ModuleType.OS_SANDBOX,
      title: 'DEBUG_LOG',
      dimensions: { w: 250, h: 250 },
      themeColor: 'olive'
    }
  },
  {
    name: 'External Embed',
    description: 'Embed external websites',
    category: 'interactive',
    icon: '🌐',
    template: {
      type: ModuleType.EXTERNAL_EMBED,
      title: 'EXTERNAL_LINK',
      dimensions: { w: 400, h: 300 },
      themeColor: 'rust',
      embedUrl: 'https://example.com'
    }
  },
  {
    name: 'Custom Code',
    description: 'Custom HTML/JS code module',
    category: 'interactive',
    icon: '⚙️',
    template: {
      type: ModuleType.CUSTOM_CODE,
      title: 'CUSTOM_MODULE',
      dimensions: { w: 350, h: 280 },
      themeColor: 'magenta',
      codeSnippet: '<div style="padding: 20px; text-align: center;"><h1>Hello World!</h1></div>'
    }
  },
  // FEED TEMPLATES
  {
    name: 'RSS Feed',
    description: 'Live RSS/Atom feed reader (uses public proxy)',
    category: 'feed',
    icon: '🛰️',
    template: {
      type: ModuleType.RSS_FEED,
      title: 'RSS_TRANSMISSIONS',
      dimensions: { w: 320, h: 320 },
      themeColor: 'slate',
      rssUrl: 'https://example.com/rss.xml'
    }
  }
];

export const getCategoryColor = (category: ModuleTemplate['category']): string => {
  switch (category) {
    case 'text': return 'bg-blue-600';
    case 'gallery': return 'bg-purple-600';
    case 'content': return 'bg-green-600';
    case 'interactive': return 'bg-orange-600';
    case 'feed': return 'bg-cyan-700';
    default: return 'bg-gray-600';
  }
};
