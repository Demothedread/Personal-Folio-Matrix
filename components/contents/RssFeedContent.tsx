import React, { useEffect, useRef, useState } from 'react';

interface RssFeedContentProps {
  rssUrl?: string;
  maxItems?: number;
}

interface FeedItem {
  title: string;
  link: string;
  date?: string;
  key: string;
}

const DEFAULT_MAX_ITEMS = 6;
const RSS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const REQUEST_TIMEOUT_MS = 8000;
const UNSAFE_XML_PATTERN = /<!\s*(DOCTYPE|ENTITY|ATTLIST|ELEMENT|NOTATION)/i;

const hashKey = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return `rss-${hash >>> 0}`;
};

const resolveFeedUrl = (feedUrl: string) => {
  const url = new URL(feedUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Unsupported protocol');
  }
  if (typeof window !== 'undefined' && url.origin === window.location.origin) {
    return url.toString();
  }
  return `${RSS_PROXY_URL}${encodeURIComponent(url.toString())}`;
};

const RssFeedContent: React.FC<RssFeedContentProps> = ({ rssUrl, maxItems = DEFAULT_MAX_ITEMS }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rssUrl) {
      setItems([]);
      setStatus('idle');
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadFeed = async () => {
      timeoutRef.current = window.setTimeout(() => {
        controller.abort();
      }, REQUEST_TIMEOUT_MS);
      try {
        setStatus('loading');
        const requestUrl = resolveFeedUrl(rssUrl);
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          credentials: 'omit',
          mode: 'cors'
        });
        if (!response.ok) {
          throw new Error(`RSS request failed: ${response.status}`);
        }
        const text = await response.text();
        if (UNSAFE_XML_PATTERN.test(text)) {
          throw new Error('Unsupported XML content');
        }
        const parsed = new DOMParser().parseFromString(text, 'text/xml');
        if (parsed.doctype) {
          throw new Error('Unsupported XML content');
        }
        if (parsed.querySelector('parsererror')) {
          throw new Error('Invalid XML');
        }
        const rssItems = Array.from(parsed.querySelectorAll('item'));
        const atomItems = Array.from(parsed.querySelectorAll('entry'));
        const feedItems = (rssItems.length ? rssItems : atomItems).slice(0, maxItems).map((item) => {
          const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
          const linkNode = item.querySelector('link');
          const rawLink = linkNode?.getAttribute('href') || linkNode?.textContent?.trim() || '';
          const link = (() => {
            try {
              if (!rawLink) return '#';
              const url = new URL(rawLink, rssUrl);
              if (!['http:', 'https:'].includes(url.protocol)) {
                return '#';
              }
              return url.toString();
            } catch {
              return '#';
            }
          })();
          const date = item.querySelector('pubDate, updated, published')?.textContent?.trim();
          const key = link !== '#'
            ? link
            : hashKey(`${title}|${date ?? ''}`);
          return { title, link, date, key };
        });

        if (isMounted) {
          setItems(feedItems);
          setStatus('idle');
        }
      } catch (error) {
        if (isMounted) {
          setItems([]);
          setStatus('error');
        }
      } finally {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    loadFeed();

    return () => {
      isMounted = false;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      controller.abort();
    };
  }, [rssUrl, maxItems]);

  if (!rssUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-mono text-xs p-4 text-center">
        NO RSS SOURCE CONFIGURED.<br />ENTER ADMIN MODE TO SET DATA.
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-mono text-xs p-4 text-center">
        LOADING RSS FEED...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-mono text-xs p-4 text-center">
        RSS FEED UNAVAILABLE.<br />CHECK URL OR CORS SETTINGS.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 font-mono text-xs p-4 text-center">
        RSS FEED EMPTY.
      </div>
    );
  }

  return (
    <ul className="space-y-2 font-mono text-xs">
      {items.map((item) => {
        const key = item.key;
        return (
          <li
            key={key}
            className="group flex flex-col gap-1 p-2 border border-gray-300 dark:border-gray-700 hover:border-space-cyan transition-colors"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold uppercase group-hover:text-space-cyan transition-colors"
            >
              {item.title}
            </a>
            {item.date && <span className="text-[10px] opacity-60">{item.date}</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default RssFeedContent;
