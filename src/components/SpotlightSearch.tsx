import React, { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink, Globe, X } from 'lucide-react';
import { AppShortcut } from '../types';
import { AppLogo } from './AppLogo';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppShortcut[];
  onOpenApp: (app: AppShortcut) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  apps,
  onOpenApp,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.url.toLowerCase().includes(query.toLowerCase()) ||
    app.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredApps.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredApps.length || 1)) % (filteredApps.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredApps.length > 0 && filteredApps[selectedIndex]) {
        onOpenApp(filteredApps[selectedIndex]);
        onClose();
      } else if (query.trim()) {
        // Search Google directly
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl apple-liquid-glass-elevated rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="apple-glass-meniscus" />
        <div className="apple-glass-rim" />
        {/* Search Input Bar */}
        <div className="relative z-10 flex items-center px-5 py-4 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search applications or Google..."
            className="w-full bg-transparent text-white placeholder-white/40 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-white/10 rounded-md text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] bg-white/10 rounded text-white/50 border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/5">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, idx) => {
              const isCurrent = idx === selectedIndex;
              return (
                <div
                  key={app.id}
                  onClick={() => {
                    onOpenApp(app);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isCurrent ? 'bg-white/15 shadow-sm' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg p-1.5 flex items-center justify-center bg-white/10 border border-white/10 shrink-0">
                      <AppLogo icon={app.icon} className="w-full h-full object-contain" accentColor={app.accentColor} />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{app.name}</div>
                      <div className="text-xs text-white/50 truncate max-w-xs">{app.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 hidden sm:inline">
                      {app.category}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          ) : query.trim() ? (
            <div
              onClick={() => {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                onClose();
              }}
              className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer hover:bg-white/10 text-white/80"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="font-medium text-white">Search Google for &ldquo;{query}&rdquo;</div>
                  <div className="text-xs text-white/50">Press Enter to search in new tab</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40" />
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 text-sm">
              Type to search applications...
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>·</span>
            <span>↵ Open</span>
            <span>·</span>
            <span>ESC Close</span>
          </div>
          <span>Quick Search</span>
        </div>
      </div>
    </div>
  );
};
