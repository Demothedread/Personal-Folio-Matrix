import React from 'react';
import { CMSItem } from '../../types';

const defaultItems = [
  { id: 'skill-1', title: 'React Architecture', date: '2023-10-15', status: 'MASTERED' },
  { id: 'skill-2', title: 'Three.js & WebGL', date: '2023-11-02', status: 'LOADING' },
  { id: 'skill-3', title: 'UI/UX Principles', date: '2023-12-10', status: 'OPTIMIZED' },
  { id: 'skill-4', title: 'Backend Systems', date: '2024-01-05', status: 'PENDING' },
];

interface ListContentProps {
  items?: CMSItem[];
  variant?: 'default' | 'blog';
}

const ListContent: React.FC<ListContentProps> = ({ items, variant = 'default' }) => {
  if (variant === 'blog') {
    const blogItems = items ?? [];
    return (
      <div className="space-y-4 font-mono text-sm">
        {blogItems.length === 0 ? (
          <div className="text-xs opacity-60 border border-dashed border-gray-400 dark:border-gray-700 p-3">
            NO TRANSMISSIONS FOUND. OPEN ADMIN MODE TO UPDATE CMS DATA.
          </div>
        ) : (
          blogItems.map((item) => (
            <article key={item.id} className="border border-gray-300 dark:border-gray-700 p-3 space-y-2 hover:border-space-magenta transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold uppercase text-sm">{item.title}</h3>
                  <p className="text-xs opacity-70">{item.excerpt}</p>
                </div>
                <span className="text-[10px] border border-current px-1 opacity-70">{item.date}</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-[10px] opacity-70">
                  {item.tags.map(tag => (
                    <span key={tag} className="border border-current px-2 py-0.5 uppercase">{tag}</span>
                  ))}
                </div>
              )}
              {item.body && (
                <p className="text-xs leading-relaxed opacity-80">{item.body}</p>
              )}
            </article>
          ))
        )}
      </div>
    );
  }

  const listItems = defaultItems;
  return (
    <ul className="space-y-2 font-mono text-sm">
      {listItems.map((item) => (
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
