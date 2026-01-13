import React, { useRef, useState, useEffect } from 'react';

const TextEditorContent: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [font, setFont] = useState('Courier New');

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    if (!document) return;
    const formats = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    setActiveFormats(formats);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      executeCommand('insertText', text);
    } catch (err) {
      // Fallback if clipboard API is blocked
      alert("Please use Ctrl+V / Cmd+V to paste.");
    }
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
        document.execCommand('copy');
    } else {
        alert("Select text to copy.");
    }
  };
  
  // Initialize content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = "<div><b>JONATHAN MARK REBACK</b></div><div><br></div><div>Creative Technologist & Frontend Engineer.</div><div>Specializing in React, WebGL, and Next-Gen UI.</div><div><br></div><div><i>Edit this bio...</i></div>";
    }
  }, []);

  const ToolbarButton = ({ cmd, label, isActive }: { cmd: string, label: React.ReactNode, isActive?: boolean }) => (
      <button 
        onMouseDown={(e) => { e.preventDefault(); executeCommand(cmd); }}
        className={`px-2 py-1 text-xs border border-gray-400 dark:border-gray-600 font-bold transition-colors
            ${isActive 
                ? 'bg-space-cyan text-black' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
      >
          {label}
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-prairie-cream dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono shadow-inner-screen relative">
      {/* Retro Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-400 dark:border-gray-600 z-10 select-none">
         <ToolbarButton cmd="bold" label="B" isActive={activeFormats.includes('bold')} />
         <ToolbarButton cmd="italic" label="I" isActive={activeFormats.includes('italic')} />
         <ToolbarButton cmd="underline" label="U" isActive={activeFormats.includes('underline')} />
         
         <div className="w-px h-4 bg-gray-400 mx-1" />
         
         <button 
            onMouseDown={(e) => { e.preventDefault(); handleCopy(); }} 
            className="px-2 py-1 text-xs border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
         >
             COPY
         </button>
         <button 
            onMouseDown={(e) => { e.preventDefault(); handlePaste(); }} 
            className="px-2 py-1 text-xs border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
         >
             PASTE
         </button>

         <div className="w-px h-4 bg-gray-400 mx-1" />

         <select 
            onChange={(e) => { executeCommand('fontName', e.target.value); setFont(e.target.value); }} 
            value={font}
            className="text-xs p-1 border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 focus:outline-none"
         >
             <option value="Courier New">Mono</option>
             <option value="Arial">Sans</option>
             <option value="Times New Roman">Serif</option>
         </select>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
          <div 
            ref={editorRef}
            contentEditable
            className="w-full h-full p-4 outline-none overflow-y-auto text-sm leading-relaxed"
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            spellCheck={false}
            style={{
                fontFamily: font
            }}
          />
      </div>
      
      <div className="absolute bottom-1 right-1 text-[9px] opacity-50 pointer-events-none">
          TXT_EDIT_MODE
      </div>
    </div>
  );
};

export default TextEditorContent;