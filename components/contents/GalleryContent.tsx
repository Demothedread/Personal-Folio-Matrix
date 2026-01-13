import React, { useState } from 'react';

const images = [
  "https://picsum.photos/600/400?random=1",
  "https://picsum.photos/600/400?random=2",
  "https://picsum.photos/600/400?random=3",
  "https://picsum.photos/600/400?random=4"
];

const GalleryContent: React.FC = () => {
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((p) => (p + 1) % images.length);
  const prev = () => setIdx((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden border-2 border-gray-700">
        <img 
            src={images[idx]} 
            alt="Gallery" 
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
        <div className="absolute bottom-0 left-0 w-full p-2 bg-black/60 backdrop-blur-sm text-white text-xs font-mono">
            IMG_SEQ_{idx + 101} :: BUFFER_LOADED
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <button onClick={prev} className="p-2 border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800">
            &lt; PREV
        </button>
        <div className="flex gap-1 items-center">
            {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-space-cyan' : 'bg-gray-500'}`} />
            ))}
        </div>
        <button onClick={next} className="p-2 border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800">
            NEXT &gt;
        </button>
      </div>
    </div>
  );
};

export default GalleryContent;