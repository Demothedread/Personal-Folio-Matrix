# GitHub Copilot Instructions for Personal-Folio-Matrix

## Project Overview

This is a **retro-future modular portfolio** application - a 1970s Space Age TV-style personal portfolio with pseudo-3D parallax modules, interconnected chaining, and a robust Bauhaus-Prairie aesthetic. It's designed as a containerized customizable site where users can select from several pre-defined modular template widgets to build their personal folio.

### Core Concept

- **Modular Widgets**: Users can select different module types and place them on a 3D canvas
- **Pseudo-3D World**: Modules are positioned in a 3D space (X, Y, Z coordinates) with parallax scrolling
- **Containerized Components**: Each module is a self-contained component with plug-and-play capability
- **Interconnections**: Modules can be connected to each other and trigger events
- **Customizable Templates**: Built-in templates for various content types (galleries, text editors, OS sandboxes, etc.)

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Web Audio API** for custom sound system
- **CSS** for styling (no UI framework - custom retro styling)
- **No backend** - purely client-side application

## Architecture

### Module System

The core of the application is the modular widget system defined in `types.ts`:

```typescript
export enum ModuleType {
  HERO, NAV, GALLERY_MAIN, GALLERY_SATELLITE_FADE, 
  GALLERY_SATELLITE_CAROUSEL, PDF_VIEWER, ITEM_LIST,
  BLOG_PORTAL, SITE_PORTAL, TEXT_BOX, TEXT_EDITOR,
  OS_SANDBOX, MINIGAME, EXTERNAL_EMBED, CUSTOM_CODE
}
```

Each module has:
- **ID**: Unique identifier
- **Type**: One of the ModuleType enum values
- **WorldPos**: 3D position (x, y, z) in the parallax world
- **Dimensions**: Width and height in pixels
- **Theme Color**: One of 6 retro colors (cyan, magenta, yellow, rust, olive, slate)
- **Connections**: Array of IDs for connected modules

### Directory Structure

```
/
├── components/           # React components
│   ├── contents/        # Module content components (one per ModuleType)
│   ├── AdminPanel.tsx   # Module management UI
│   ├── ModuleFrame.tsx  # Container for modules
│   ├── ModuleEditor.tsx # Module property editor
│   └── ...
├── hooks/               # Custom React hooks
│   └── useSoundSystem.ts # Web Audio API sound system
├── utils/               # Utility functions
│   ├── geometry.ts      # 3D projection calculations
│   └── moduleTemplates.ts # Template definitions
├── types.ts             # TypeScript interfaces and enums
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## Key Concepts

### 1. 3D Positioning System

The application uses a pseudo-3D coordinate system:
- **X**: Horizontal offset from center (pixels)
- **Y**: Vertical position in scrolling world (pixels)
- **Z**: Depth (pixels) - negative values are further away
- Modules use `project3DTo2D()` from `utils/geometry.ts` for screen positioning

### 2. Edit Mode vs Preview Mode

- **Edit Mode**: Admin panel visible, modules can be edited/moved/deleted
- **Preview Mode**: Public-facing view with all functionality enabled
- Toggle via `isEditMode` state in App.tsx

### 3. Module Templates

Templates are defined in `utils/moduleTemplates.ts` with categories:
- **text**: Text editors and text boxes
- **gallery**: Image galleries with different transition effects
- **content**: Hero sections, lists, portals
- **interactive**: OS sandbox, external embeds, custom code

### 4. Sound System

Custom Web Audio API implementation in `hooks/useSoundSystem.ts`:
- **Theremin drone**: Ambient background with vibrato
- **FM synthesis**: Glass/bell-like hover sounds
- **Spatial audio**: Panning and reverb for depth
- **Event sounds**: Different sounds for hover, expand, close

## Coding Conventions

### TypeScript
- Use strict TypeScript - no `any` types unless absolutely necessary
- Define interfaces for all data structures
- Use enums for fixed sets of values (like ModuleType)
- Follow functional React patterns with hooks

### React Components
- Use functional components with hooks (no class components)
- Keep components focused and single-purpose
- Module content components should be in `components/contents/`
- Use `useState`, `useEffect`, `useCallback` appropriately
- Memoize expensive calculations with `useMemo`

### Styling
- **Inline styles** or **CSS-in-JS** patterns (no CSS files currently)
- Retro aesthetic: CRT effects, scanlines, phosphor glow
- Theme colors: cyan, magenta, yellow, rust, olive, slate
- Use CSS transforms for 3D effects
- Maintain the 1970s space-age TV aesthetic

### Naming Conventions
- Components: PascalCase (`ModuleFrame.tsx`)
- Hooks: camelCase with "use" prefix (`useSoundSystem.ts`)
- Files: Match component/export name
- Module titles: UPPERCASE_WITH_UNDERSCORES (retro terminal style)

### State Management
- Local state with `useState` for component-specific state
- Props drilling for shared state (no Redux/Context needed yet)
- `App.tsx` holds global state (modules, editMode, expandedModule, etc.)

## Common Workflows

### Adding a New Module Type

1. Add enum value to `ModuleType` in `types.ts`
2. Create content component in `components/contents/YourModule.tsx`
3. Add template to `MODULE_TEMPLATES` in `utils/moduleTemplates.ts`
4. Add switch case in `ModuleFrame.tsx` to render your component
5. Update type definitions if new properties needed

### Creating a New Module Content Component

```typescript
import React from 'react';
import { ModuleData } from '../../types';

interface YourModuleProps {
  module: ModuleData;
  isExpanded?: boolean;
  onUpdate?: (module: ModuleData) => void;
}

const YourModule: React.FC<YourModuleProps> = ({ module, isExpanded, onUpdate }) => {
  // Your implementation
  return <div>{/* Module content */}</div>;
};

export default YourModule;
```

### Working with 3D Positioning

```typescript
import { project3DTo2D } from '../utils/geometry';

// Project 3D world position to 2D screen coordinates
const screenPos = project3DTo2D(
  module.worldPos,
  scrollY,           // Current scroll position
  rotationY,         // Camera rotation
  windowSize         // Browser window dimensions
);
```

## Build & Development

### Setup
```bash
npm install              # Install dependencies
```

### Development
```bash
npm run dev              # Start development server (Vite)
```

### Build
```bash
npm run build            # Production build
npm run preview          # Preview production build
```

### Environment
- Optional: Set `GEMINI_API_KEY` or `OPENAI_API_KEY` in `.env.local` for AI features (future)

## Best Practices

### When Adding Features

1. **Maintain the modular architecture** - new features should fit the container model
2. **Preserve the retro aesthetic** - keep the 1970s space-age TV styling
3. **Sound matters** - consider adding sound effects for new interactions
4. **3D space awareness** - respect the parallax scrolling and depth system
5. **Edit/Preview modes** - ensure features work in both modes appropriately

### Performance

- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive calculations (especially 3D projections)
- Avoid re-renders of all modules when only one changes
- Keep module content components lightweight

### Accessibility

- Provide keyboard navigation where applicable
- Use semantic HTML
- Consider screen readers (though retro visual style is primary)
- Provide alternative ways to interact beyond drag-and-drop

### Testing

- Currently no automated tests - manual testing required
- Test in both edit and preview modes
- Test module interconnections and triggers
- Verify sound system works (may require user interaction to initialize)

## Module Categories & Use Cases

- **HERO**: Large banner sections, landing content
- **TEXT_EDITOR**: Rich text with typewriter effects
- **TEXT_BOX**: Simple text displays
- **GALLERY_MAIN**: Primary image gallery with manual controls
- **GALLERY_SATELLITE_FADE**: Auto-cycling with fade transitions
- **GALLERY_SATELLITE_CAROUSEL**: Auto-cycling with wipe transitions
- **ITEM_LIST**: Structured lists of content
- **OS_SANDBOX**: Terminal/console interface for interactive demos
- **EXTERNAL_EMBED**: Embed external websites via iframe
- **CUSTOM_CODE**: Custom HTML/JS code injection
- **NAV, BLOG_PORTAL, SITE_PORTAL, PDF_VIEWER, MINIGAME**: Future implementations

## Common Pitfalls

1. **Don't break the 3D illusion** - maintain depth sorting and parallax
2. **Respect module boundaries** - keep content within module dimensions
3. **Theme consistency** - use the 6 defined theme colors
4. **Sound initialization** - Web Audio requires user interaction first
5. **Edit mode visibility** - admin controls should only show in edit mode

## Future Enhancements

- Backend integration for saving/loading layouts
- More module types (PDF viewer, minigames, blog portal)
- Advanced module interconnections (data passing, event chains)
- Collaborative editing
- Mobile/touch optimization
- Accessibility improvements

## Getting Help

- Check existing modules in `components/contents/` for examples
- Review `types.ts` for data structure definitions
- Study `App.tsx` for state management patterns
- Examine `utils/moduleTemplates.ts` for template patterns
