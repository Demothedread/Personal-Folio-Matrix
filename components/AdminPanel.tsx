import React, { useState } from 'react';
import { ModuleData, ModuleType } from '../types';
import { MODULE_TEMPLATES, getCategoryColor, ModuleTemplate } from '../utils/moduleTemplates';

interface AdminPanelProps {
  modules: ModuleData[];
  onAddModule: (module: ModuleData) => void;
  onDeleteModule: (id: string) => void;
  onDuplicateModule: (id: string) => void;
  onEditModule: (module: ModuleData) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  modules, 
  onAddModule, 
  onDeleteModule, 
  onDuplicateModule, 
  onEditModule, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'modules'>('templates');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ['all', 'text', 'gallery', 'content', 'interactive'];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? MODULE_TEMPLATES 
    : MODULE_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleAddFromTemplate = (template: ModuleTemplate) => {
    // Find highest Y position to place new module below existing ones
    const maxY = modules.length > 0 
      ? Math.max(...modules.map(m => m.worldPos.y)) 
      : 0;
    
    // Generate unique ID
    const newId = `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newModule: ModuleData = {
      ...template.template,
      id: newId,
      worldPos: {
        x: Math.random() * 200 - 100, // Random x position
        y: maxY + 400, // Place below existing modules
        z: Math.random() * 200 - 100 // Random z position
      }
    };
    
    onAddModule(newModule);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteModule(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel after 3 seconds
      setTimeout(() => {
        setDeleteConfirm(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-prairie-cream dark:bg-gray-900 border-2 border-prairie-ochre shadow-[0_0_50px_rgba(204,153,51,0.3)] flex flex-col">
        {/* Header */}
        <div className="bg-prairie-ochre text-black font-bold font-mono px-4 py-2 flex justify-between items-center">
          <span>ADMIN_CONSOLE // MODULE_MANAGER</span>
          <button onClick={onClose} className="hover:text-white text-lg">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-400 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-mono text-sm font-bold transition-colors ${
              activeTab === 'templates'
                ? 'bg-prairie-cream dark:bg-gray-900 text-prairie-ochre border-b-2 border-prairie-ochre'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📦 TEMPLATES
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-6 py-3 font-mono text-sm font-bold transition-colors ${
              activeTab === 'modules'
                ? 'bg-prairie-cream dark:bg-gray-900 text-prairie-ochre border-b-2 border-prairie-ochre'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🔧 MANAGE MODULES ({modules.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'templates' ? (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap pb-4 border-b border-gray-300 dark:border-gray-700">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-mono uppercase rounded transition-all ${
                      selectedCategory === cat
                        ? 'bg-prairie-ochre text-black font-bold'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-prairie-ochre transition-all group"
                  >
                    <div className={`${getCategoryColor(template.category)} text-white px-3 py-2 flex items-center justify-between`}>
                      <span className="font-mono text-xs font-bold uppercase">{template.category}</span>
                      <span className="text-2xl">{template.icon}</span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {template.description}
                      </p>
                      <div className="text-[10px] font-mono text-gray-500 dark:text-gray-500 mt-2">
                        {template.template.dimensions.w}x{template.template.dimensions.h}px
                      </div>
                      <button
                        onClick={() => handleAddFromTemplate(template)}
                        className="w-full mt-3 bg-prairie-ochre hover:bg-yellow-600 text-black font-mono text-xs font-bold py-2 px-3 transition-all shadow-md hover:shadow-lg uppercase"
                      >
                        + Add to Scene
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-mono text-sm">
                  No modules yet. Add some from the Templates tab!
                </div>
              ) : (
                modules.map(module => (
                  <div
                    key={module.id}
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-prairie-ochre transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                            {module.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                            module.themeColor === 'cyan' ? 'bg-cyan-600 text-white' :
                            module.themeColor === 'magenta' ? 'bg-pink-600 text-white' :
                            module.themeColor === 'yellow' ? 'bg-yellow-600 text-black' :
                            module.themeColor === 'rust' ? 'bg-orange-600 text-white' :
                            module.themeColor === 'olive' ? 'bg-green-700 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {module.type}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 dark:text-gray-500 space-x-3">
                          <span>ID: {module.id}</span>
                          <span>POS: ({module.worldPos.x}, {module.worldPos.y}, {module.worldPos.z})</span>
                          <span>SIZE: {module.dimensions.w}×{module.dimensions.h}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditModule(module)}
                          className="px-3 py-1 text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                          title="Edit module"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => onDuplicateModule(module.id)}
                          className="px-3 py-1 text-xs font-mono font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                          title="Duplicate module"
                        >
                          COPY
                        </button>
                        <button
                          onClick={() => handleDelete(module.id)}
                          className={`px-3 py-1 text-xs font-mono font-bold transition-colors ${
                            deleteConfirm === module.id
                              ? 'bg-red-700 text-white animate-pulse'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                          title={deleteConfirm === module.id ? 'Click again to confirm' : 'Delete module'}
                        >
                          {deleteConfirm === module.id ? 'CONFIRM?' : 'DEL'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-400 flex justify-between items-center">
          <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {activeTab === 'templates' 
              ? `${filteredTemplates.length} templates available`
              : `${modules.length} modules in scene`
            }
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase font-bold border border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
