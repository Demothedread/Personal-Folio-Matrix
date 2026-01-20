import React, { useState, useEffect, useCallback } from 'react';
import AtomicMenu from './components/AtomicMenu';
import SiteHeader from './components/SiteHeader';
import ModuleFrame from './components/ModuleFrame';
import ConnectionLayer from './components/ConnectionLayer';
import WireframeLayer from './components/WireframeLayer';
import BackgroundDecorations from './components/BackgroundDecorations';
import ScrollControls from './components/ScrollControls';
import ListContent from './components/contents/ListContent';
import OsSandbox from './components/contents/OsSandbox';
import TextEditorContent from './components/contents/TextEditorContent';
import CustomFrameContent from './components/contents/CustomFrameContent';
import ModuleEditor from './components/ModuleEditor';
import AdminPanel from './components/AdminPanel';
import { GalleryMain, GallerySatelliteFade, GallerySatelliteCarousel } from './components/contents/GallerySystem';
import { ModuleData, ModuleType } from './types';
import { project3DTo2D } from './utils/geometry';
import { useSoundSystem } from './hooks/useSoundSystem';

const ADMIN_AUTH_KEY = 'pfm_admin_auth';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'matrix';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false); // Admin vs Preview
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Audio System
  const { isMuted, toggleMute, triggerHover, triggerExpand, triggerClose, initializeAudio } = useSoundSystem();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [scrollY, setScrollY] = useState(0);

  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [startScrollY, setStartScrollY] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [startRotationY, setStartRotationY] = useState(0);

  // Global Effects State
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [isSurging, setIsSurging] = useState(false);
  const [surgedIds, setSurgedIds] = useState<Set<string>>(new Set());

  const initialModules: ModuleData[] = [
    { 
        id: 'intro-text', 
        type: ModuleType.TEXT_EDITOR, 
        title: 'ABOUT_ME', 
        dimensions: { w: 380, h: 280 }, 
        worldPos: { x: -60, y: 350, z: -100 }, 
        connectedTo: ['gallery-1', 'skills-node'], 
        themeColor: 'cyan' 
    },
    { id: 'skills-node', type: ModuleType.ITEM_LIST, title: 'SYSTEM_CAPABILITIES', dimensions: { w: 220, h: 320 }, worldPos: { x: 350, y: 650, z: 150 }, connectedTo: ['gallery-1', 'console-node'], themeColor: 'slate' },
    { id: 'gallery-1', type: ModuleType.GALLERY_MAIN, title: 'VISUAL_DB_PRIMARY', dimensions: { w: 450, h: 320 }, worldPos: { x: -150, y: 1100, z: -50 }, connectedTo: ['sat-fade', 'blog-node'], themeColor: 'magenta' },
    { id: 'sat-fade', type: ModuleType.GALLERY_SATELLITE_FADE, title: 'SAT_UPLINK_ALPHA', dimensions: { w: 200, h: 150 }, worldPos: { x: -550, y: 1500, z: -600 }, connectedTo: ['sat-wipe'], themeColor: 'cyan' },
    { id: 'console-node', type: ModuleType.OS_SANDBOX, title: 'DEBUG_LOG', dimensions: { w: 250, h: 250 }, worldPos: { x: 500, y: 1400, z: -300 }, themeColor: 'olive' },
    { id: 'sat-wipe', type: ModuleType.GALLERY_SATELLITE_CAROUSEL, title: 'SAT_UPLINK_BETA', dimensions: { w: 240, h: 180 }, worldPos: { x: 280, y: 2000, z: 200 }, connectedTo: ['side-note'], themeColor: 'yellow' },
    { id: 'side-note', type: ModuleType.TEXT_BOX, title: 'CONTEXT', dimensions: { w: 180, h: 160 }, worldPos: { x: -350, y: 2400, z: -200 }, themeColor: 'yellow', content: "All systems operational. Efficiency at 98%. Neural link stable." },
    { id: 'blog-node', type: ModuleType.ITEM_LIST, title: 'TRANSMISSIONS', dimensions: { w: 300, h: 380 }, worldPos: { x: 100, y: 3000, z: -900 }, connectedTo: ['final-contact'], themeColor: 'rust' },
    { id: 'final-contact', type: ModuleType.HERO, title: 'UPLINK_TERMINAL', dimensions: { w: 420, h: 250 }, worldPos: { x: 0, y: 3800, z: 0 }, themeColor: 'slate' }
  ];

  const [modules, setModules] = useState<ModuleData[]>(initialModules);

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => { if (!isSurging && !expandedModuleId && !editingModule && !showAdminPanel && !showAdminLogin) setScrollY(window.scrollY); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSurging, expandedModuleId, editingModule, showAdminPanel, showAdminLogin]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedAuth = window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    setIsAdminAuthenticated(storedAuth);
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      setIsEditMode(false);
      setShowAdminPanel(false);
      setEditingModule(null);
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      }
      setShowAdminLogin(false);
      setAdminUsername('');
      setAdminPassword('');
      setAdminError('');
      return;
    }
    setAdminError('Invalid credentials.');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminLogin(false);
    setAdminUsername('');
    setAdminPassword('');
    setAdminError('');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  };

  const openAdminLogin = () => {
    setIsMenuOpen(false);
    setShowAdminLogin(true);
    setAdminError('');
  };

  const triggerSingularity = async () => {
    if (isSurging) return;
    setIsSurging(true);
    setIsMenuOpen(false);
    
    // Audio trigger for surge could be added here
    triggerExpand(); 

    const sortedModules = [...modules].sort((a, b) => b.worldPos.y - a.worldPos.y);
    for (const mod of sortedModules) {
      setSurgedIds(prev => new Set(prev).add(mod.id));
      await new Promise(r => setTimeout(r, 150)); 
    }
    setTimeout(() => {
      setIsSurging(false);
      setSurgedIds(new Set());
    }, 4500);
  };

  const handleNavigate = useCallback((targetId: string) => {
    if (targetId === 'EXPLODE_CMD') { triggerSingularity(); return; }
    setIsMenuOpen(false);
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetMod = modules.find(m => m.id === targetId);
      if (targetMod) window.scrollTo({ top: targetMod.worldPos.y - (windowSize.h / 3), behavior: 'smooth' });
    }
  }, [modules, windowSize.h]);

  const handleSaveModule = (updated: ModuleData) => {
    setModules(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingModule(null);
  };

  const handleAddModule = (newModule: ModuleData) => {
    setModules(prev => [...prev, newModule]);
  };

  const handleDeleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const handleDuplicateModule = (id: string) => {
    const moduleToDuplicate = modules.find(m => m.id === id);
    if (moduleToDuplicate) {
      const newId = `${moduleToDuplicate.id}-copy-${Date.now()}`;
      const duplicatedModule: ModuleData = {
        ...moduleToDuplicate,
        id: newId,
        title: `${moduleToDuplicate.title}_COPY`,
        worldPos: {
          x: moduleToDuplicate.worldPos.x + 50,
          y: moduleToDuplicate.worldPos.y + 100,
          z: moduleToDuplicate.worldPos.z + 50
        }
      };
      setModules(prev => [...prev, duplicatedModule]);
    }
  };

  const renderContent = (mod: ModuleData) => {
    const { type, content, embedUrl, codeSnippet } = mod;
    switch (type) {
      case ModuleType.HERO: return <div className="flex flex-col h-full justify-center items-center text-center p-4"><h2 className="text-4xl font-bold uppercase tracking-tighter">Terminal End</h2><p className="mt-4 font-mono text-xs opacity-70">Uplink Stable</p></div>;
      case ModuleType.GALLERY_MAIN: return <GalleryMain />;
      case ModuleType.GALLERY_SATELLITE_FADE: return <GallerySatelliteFade />;
      case ModuleType.GALLERY_SATELLITE_CAROUSEL: return <GallerySatelliteCarousel />;
      case ModuleType.ITEM_LIST: return <ListContent />;
      case ModuleType.OS_SANDBOX: return <OsSandbox />;
      case ModuleType.TEXT_EDITOR: return <TextEditorContent />;
      case ModuleType.EXTERNAL_EMBED: return <CustomFrameContent type="EMBED" source={embedUrl} />;
      case ModuleType.CUSTOM_CODE: return <CustomFrameContent type="CODE" source={codeSnippet} />;
      case ModuleType.TEXT_BOX: return <div className="font-mono text-sm leading-relaxed p-2">{content || "NO DATA"}</div>;
      default: return <div className="p-4 text-xs font-mono">OFFLINE</div>;
    }
  };

  const isScrolledState = scrollY > 100 || expandedModuleId !== null;

  return (
    <div 
        className={`relative w-full font-sans text-gray-900 dark:text-gray-100 bg-prairie-cream dark:bg-space-black transition-colors duration-500 overflow-x-hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        onClick={() => {
            // Initialize audio on first click anywhere if not started
            initializeAudio(); 
        }}
        onMouseDown={(e) => {
          if (expandedModuleId || isSurging || editingModule || showAdminPanel || showAdminLogin) return;
          if ((e.target as HTMLElement).closest('button, select, input, textarea')) return;
          setIsDragging(true); setStartDrag({ x: e.clientX, y: e.clientY }); setStartScrollY(window.scrollY); setStartRotationY(rotationY);
        }}
        onMouseMove={(e) => {
          if (!isDragging || expandedModuleId || isSurging || editingModule || showAdminPanel || showAdminLogin) return;
          window.scrollTo(0, startScrollY - (e.clientY - startDrag.y));
          setRotationY(Math.max(-10, Math.min(10, startRotationY + ((e.clientX - startDrag.x) * (10 / 300)))));
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{ minHeight: '100vh', overflowY: (expandedModuleId || isSurging || editingModule || showAdminPanel || showAdminLogin) ? 'hidden' : 'auto' }}
    >
      <div style={{ height: Math.max(5000, windowSize.h * 5) }} className="w-px invisible" />
      <BackgroundDecorations isSurging={isSurging} />
      
      <div className={`fixed inset-0 transition-all duration-1000 ${isSurging ? 'bg-space-black/80' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]'} z-0`} />

      <SiteHeader isScrolled={isScrolledState} />
      
      {!expandedModuleId && !editingModule && !showAdminPanel && !showAdminLogin && (
        <AtomicMenu onClick={() => setIsMenuOpen(!isMenuOpen)} onNavigate={handleNavigate} isOpen={isMenuOpen} />
      )}
      
      {!expandedModuleId && !isSurging && !editingModule && !showAdminPanel && !showAdminLogin && <ScrollControls />}
      
      <div className={`fixed inset-0 transition-all duration-700 pointer-events-none z-0 ${expandedModuleId || editingModule || showAdminPanel || showAdminLogin ? 'blur-lg scale-90 opacity-20' : (isSurging ? 'opacity-40' : 'opacity-100')}`}>
        <WireframeLayer modules={modules} scrollY={scrollY} windowSize={windowSize} rotationY={rotationY} />
        {!isSurging && <ConnectionLayer modules={modules} scrollY={scrollY} windowSize={windowSize} rotationY={rotationY} />}
      </div>

      {expandedModuleId && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-500" 
          onClick={() => { setExpandedModuleId(null); triggerClose(); }}
        />
      )}

      {/* ADMIN EDITOR MODAL */}
      {isAdminAuthenticated && editingModule && (
        <ModuleEditor 
            module={editingModule} 
            onSave={handleSaveModule} 
            onCancel={() => setEditingModule(null)} 
        />
      )}

      {/* ADMIN PANEL MODAL */}
      {isAdminAuthenticated && showAdminPanel && (
        <AdminPanel
          modules={modules}
          onAddModule={handleAddModule}
          onDeleteModule={handleDeleteModule}
          onDuplicateModule={handleDuplicateModule}
          onEditModule={(module) => {
            setShowAdminPanel(false);
            setEditingModule(module);
          }}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAdminLogin}
            className="w-full max-w-sm border-2 border-prairie-ochre bg-prairie-cream dark:bg-gray-900 shadow-[0_0_40px_rgba(204,153,51,0.3)] p-6 space-y-4 font-mono"
          >
            <div className="flex items-center justify-between text-black dark:text-gray-100">
              <span className="text-sm font-bold">ADMIN_ACCESS</span>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="text-lg hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                Username
                <input
                  value={adminUsername}
                  onChange={(event) => { setAdminUsername(event.target.value); setAdminError(''); }}
                  className="mt-1 w-full border border-gray-400 bg-white dark:bg-black text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
                  type="text"
                  autoComplete="username"
                  required
                />
              </label>
              <label className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                Password
                <input
                  value={adminPassword}
                  onChange={(event) => { setAdminPassword(event.target.value); setAdminError(''); }}
                  className="mt-1 w-full border border-gray-400 bg-white dark:bg-black text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>
            {adminError && (
              <div className="text-xs text-red-600 dark:text-red-400">{adminError}</div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="px-3 py-2 text-xs uppercase font-bold border border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs uppercase font-bold bg-prairie-ochre text-black border border-yellow-700 hover:bg-yellow-500 transition-colors"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="fixed inset-0 z-[50] pointer-events-none">
        {modules.map(mod => {
          const isExpanded = expandedModuleId === mod.id;
          const isExploding = surgedIds.has(mod.id);
          const projection = project3DTo2D(mod.worldPos, scrollY, windowSize.w, windowSize.h, rotationY);
          
          if (expandedModuleId && !isExpanded) return null;
          if (!isExpanded && !isSurging && (projection.y < -mod.dimensions.h * 2 || projection.y > windowSize.h + mod.dimensions.h * 2)) return null;

          return (
            <ModuleFrame
              key={mod.id}
              {...mod}
              x={isExpanded ? windowSize.w / 2 : projection.x}
              y={isExpanded ? windowSize.h / 2 : projection.y}
              scale={isExpanded ? 1 : projection.scale}
              zIndex={isExpanded ? 9999 : (isExploding ? 8888 : projection.zIndex)}
              rotationY={rotationY}
              isActive={true}
              isExpanded={isExpanded}
              isExploding={isExploding}
              isEditMode={isAdminAuthenticated && isEditMode}
              onResize={(id, w, h) => setModules(prev => prev.map(m => m.id === id ? { ...m, dimensions: { w, h } } : m))}
              onExpand={() => { setExpandedModuleId(mod.id); triggerExpand(); }}
              onClose={() => { setExpandedModuleId(null); triggerClose(); }}
              onEdit={() => setEditingModule(mod)}
              onHoverSound={() => triggerHover(mod.id)}
            >
              {renderContent(mod)}
            </ModuleFrame>
          );
        })}
      </div>

      <div className="fixed bottom-6 left-6 z-50 flex gap-4">
        {/* Theme Toggle */}
        <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 border-2 border-current rounded-full flex items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-gray-100 shadow-lg group">
            <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-space-yellow' : 'bg-prairie-rust'}`} />
        </button>
        
        {/* Sound Toggle */}
        <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="w-10 h-10 border-2 border-current rounded-full flex items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-gray-100 shadow-lg hover:scale-110 transition-transform">
            {isMuted ? (
                <span className="text-[10px] font-mono">OFF</span>
            ) : (
                <div className="flex gap-0.5 items-end h-3">
                    <div className="w-0.5 bg-current h-1 animate-[pulse_0.5s_infinite]" />
                    <div className="w-0.5 bg-current h-3 animate-[pulse_0.7s_infinite]" />
                    <div className="w-0.5 bg-current h-2 animate-[pulse_0.6s_infinite]" />
                </div>
            )}
        </button>
      </div>

      {/* Admin Toggle */}
      <div className="fixed bottom-6 right-24 z-50 flex gap-2">
          {isAdminAuthenticated ? (
            <>
              <button 
                onClick={() => { setIsEditMode(!isEditMode); setExpandedModuleId(null); }}
                className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest border border-current transition-all shadow-lg
                    ${isEditMode 
                        ? 'bg-prairie-ochre text-black border-prairie-ochre rotate-1' 
                        : 'bg-black text-gray-500 border-gray-700 hover:text-white'}
                `}
              >
                  {isEditMode ? 'ADMIN // EDIT_MODE' : 'VIEWER // LOCKED'}
              </button>
              
              {isEditMode && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 transition-all shadow-lg"
                >
                  📦 MODULE MANAGER
                </button>
              )}
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest border border-gray-500 text-gray-200 bg-black/80 hover:text-white transition-all shadow-lg"
              >
                LOG OUT
              </button>
            </>
          ) : (
            <button
              onClick={openAdminLogin}
              className="px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest border border-current transition-all shadow-lg bg-black text-gray-500 border-gray-700 hover:text-white"
            >
              ADMIN LOGIN
            </button>
          )}
      </div>

      <div className="fixed top-6 left-6 z-40 mix-blend-difference text-white">
         <div className="text-xs font-mono mt-24 md:mt-32 transition-opacity duration-500" style={{ opacity: (isScrolledState && !expandedModuleId && !editingModule && !showAdminPanel) ? 1 : 0 }}>
            {isSurging ? 'SINGULARITY_SURGE: ACTIVE' : `DEPTH_SENSOR: ${Math.min(100, Math.max(0, (scrollY / (Math.max(5000, windowSize.h * 5) - windowSize.h)) * 100)).toFixed(0)}%`} <br/>
            GYRO_Y: {rotationY.toFixed(1)}°
         </div>
      </div>
    </div>
  );
}

export default App;
