import React, { useState, useEffect } from 'react';
import { ModuleData, ModuleType } from '../types';

interface ModuleEditorProps {
  module: ModuleData;
  onSave: (updated: ModuleData) => void;
  onCancel: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({ module, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ModuleData>({ ...module });

  const handleChange = (field: keyof ModuleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (field: 'w' | 'h', value: number) => {
    setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, [field]: Number(value) } }));
  };

  const handlePosChange = (field: 'x' | 'y' | 'z', value: number) => {
    setFormData(prev => ({ ...prev, worldPos: { ...prev.worldPos, [field]: Number(value) } }));
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-prairie-cream dark:bg-gray-900 border-2 border-prairie-ochre shadow-[0_0_50px_rgba(204,153,51,0.3)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-prairie-ochre text-black font-bold font-mono px-4 py-2 flex justify-between items-center">
          <span>ADMIN_CONSOLE // EDIT_MODULE :: {module.id}</span>
          <button onClick={onCancel} className="hover:text-white">✕</button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-sm text-gray-800 dark:text-gray-200">
          
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase opacity-70">Title</label>
              <input 
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 focus:border-prairie-ochre outline-none"
                value={formData.title} 
                onChange={e => handleChange('title', e.target.value)} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase opacity-70">Module Type</label>
              <select 
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 focus:border-prairie-ochre outline-none"
                value={formData.type} 
                onChange={e => handleChange('type', e.target.value as ModuleType)}
              >
                {Object.values(ModuleType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs uppercase opacity-70">Theme Color</label>
                <select 
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 focus:border-prairie-ochre outline-none"
                  value={formData.themeColor || 'cyan'} 
                  onChange={e => handleChange('themeColor', e.target.value)}
                >
                    {['cyan', 'magenta', 'yellow', 'rust', 'olive', 'slate'].map(c => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                </select>
            </div>
          </div>

          <hr className="border-gray-400 opacity-30" />

          {/* Geometry Section */}
          <div className="space-y-2">
             <label className="text-xs uppercase font-bold text-prairie-ochre">Spatial Geometry</label>
             <div className="grid grid-cols-3 gap-2">
                <label className="flex flex-col"><span className="text-[10px]">POS X</span>
                    <input type="number" value={formData.worldPos.x} onChange={e => handlePosChange('x', Number(e.target.value))} className="bg-gray-100 dark:bg-gray-800 border p-1" />
                </label>
                <label className="flex flex-col"><span className="text-[10px]">POS Y</span>
                    <input type="number" value={formData.worldPos.y} onChange={e => handlePosChange('y', Number(e.target.value))} className="bg-gray-100 dark:bg-gray-800 border p-1" />
                </label>
                <label className="flex flex-col"><span className="text-[10px]">POS Z</span>
                    <input type="number" value={formData.worldPos.z} onChange={e => handlePosChange('z', Number(e.target.value))} className="bg-gray-100 dark:bg-gray-800 border p-1" />
                </label>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="flex flex-col"><span className="text-[10px]">WIDTH</span>
                    <input type="number" value={formData.dimensions.w} onChange={e => handleDimensionChange('w', Number(e.target.value))} className="bg-gray-100 dark:bg-gray-800 border p-1" />
                </label>
                <label className="flex flex-col"><span className="text-[10px]">HEIGHT</span>
                    <input type="number" value={formData.dimensions.h} onChange={e => handleDimensionChange('h', Number(e.target.value))} className="bg-gray-100 dark:bg-gray-800 border p-1" />
                </label>
             </div>
          </div>

          <hr className="border-gray-400 opacity-30" />

          {/* Content Source Section */}
          <div className="space-y-2 flex-1">
             <label className="text-xs uppercase font-bold text-prairie-ochre">Source Data</label>
             
             {formData.type === ModuleType.EXTERNAL_EMBED && (
                 <div className="space-y-1">
                    <label className="text-xs opacity-70">Embed URL (https://...)</label>
                    <input 
                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 font-mono text-xs"
                        value={formData.embedUrl || ''} 
                        onChange={e => handleChange('embedUrl', e.target.value)} 
                        placeholder="https://example.com"
                    />
                 </div>
             )}

             {formData.type === ModuleType.CUSTOM_CODE && (
                 <div className="space-y-1 flex flex-col h-40">
                    <label className="text-xs opacity-70">HTML/JS Source Code</label>
                    <textarea 
                        className="flex-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 font-mono text-xs"
                        value={formData.codeSnippet || ''} 
                        onChange={e => handleChange('codeSnippet', e.target.value)} 
                        placeholder="<h1>Hello World</h1><script>console.log('hi')</script>"
                    />
                 </div>
             )}

             {(formData.type === ModuleType.TEXT_BOX || formData.type === ModuleType.TEXT_EDITOR) && (
                 <div className="space-y-1 flex flex-col h-32">
                    <label className="text-xs opacity-70">Text Content</label>
                    <textarea 
                        className="flex-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-400 p-2 font-mono text-xs"
                        value={formData.content || ''} 
                        onChange={e => handleChange('content', e.target.value)} 
                    />
                 </div>
             )}

             {/* Generic warning for other types */}
             {!['EXTERNAL_EMBED', 'CUSTOM_CODE', 'TEXT_BOX', 'TEXT_EDITOR'].includes(formData.type) && (
                 <div className="p-2 border border-dashed border-gray-500 text-xs opacity-60">
                     Content for {formData.type} is handled by internal components. Dimensions and Position can still be edited.
                 </div>
             )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-400 flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-xs uppercase font-bold border border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700">
                Cancel
            </button>
            <button onClick={() => onSave(formData)} className="px-4 py-2 text-xs uppercase font-bold bg-prairie-ochre text-black hover:bg-yellow-600 shadow-lg">
                Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;