import React from 'react';

const items = [
  { id: 1, title: 'React Architecture', date: '2023-10-15', status: 'MASTERED' },
  { id: 2, title: 'Three.js & WebGL', date: '2023-11-02', status: 'LOADING' },
  { id: 3, title: 'UI/UX Principles', date: '2023-12-10', status: 'OPTIMIZED' },
  { id: 4, title: 'Backend Systems', date: '2024-01-05', status: 'PENDING' },
];

const ListContent: React.FC = () => {
  return (
    <ul className="space-y-2 font-mono text-sm">
      {items.map((item) => (
        <li key={item.id} className="group flex items-center justify-between p-2 border border-gray-300 dark:border-gray-700 hover:border-space-magenta transition-colors cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold uppercase group-hover:text-space-magenta transition-colors">{item.title}</span>
            <span className="text-xs opacity-60">{item.date}</span>
          </div>
          <span className="text-[10px] px-1 border border-current opacity-70">
            {item.status}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ListContent;