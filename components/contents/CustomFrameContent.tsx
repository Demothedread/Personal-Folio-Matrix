import React from 'react';

interface CustomFrameContentProps {
  type: 'EMBED' | 'CODE';
  source?: string;
}

const CustomFrameContent: React.FC<CustomFrameContentProps> = ({ type, source }) => {
  if (!source) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-mono text-xs p-4 text-center">
        NO SOURCE CONFIGURED.<br/>ENTER ADMIN MODE TO SET DATA.
      </div>
    );
  }

  if (type === 'EMBED') {
    return (
      <iframe 
        src={source} 
        className="w-full h-full border-0 bg-white"
        title="External Content"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (type === 'CODE') {
    return (
      <iframe 
        srcDoc={source}
        className="w-full h-full border-0 bg-white"
        title="Custom Code"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
      />
    );
  }

  return null;
};

export default CustomFrameContent;