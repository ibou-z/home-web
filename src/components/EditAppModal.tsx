import React, { useState, useEffect } from 'react';
import { X, Check, Globe } from 'lucide-react';
import { AppShortcut } from '../types';
import { AppLogo } from './AppLogo';

interface EditAppModalProps {
  app: AppShortcut | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApp: AppShortcut) => void;
}

const PRESET_ICONS = [
  'youtube',
  '7reels',
  'glow-rrmumify',
  'classroom',
  'teams',
  'google',
  'copilot',
  'chatgpt',
  'claude',
  'humanize-ai',
  'custom',
];

const PRESET_COLORS = [
  '#FF0000',
  '#F59E0B',
  '#8B5CF6',
  '#22C55E',
  '#6366F1',
  '#4285F4',
  '#06B6D4',
  '#10A37F',
  '#D97706',
  '#EC4899',
  '#E11D48',
  '#3B82F6',
];

export const EditAppModal: React.FC<EditAppModalProps> = ({
  app,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('custom');
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [category, setCategory] = useState<'AI & Tools' | 'Productivity' | 'Media' | 'General'>('Productivity');

  useEffect(() => {
    if (app) {
      setName(app.name);
      setUrl(app.url);
      setIcon(app.icon);
      setAccentColor(app.accentColor || '#8B5CF6');
      setCategory(app.category || 'Productivity');
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    onSave({
      ...app,
      name: name.trim() || app.name,
      url: cleanUrl,
      icon,
      accentColor,
      category,
    });
    onClose();
  };

  const isGlowRRMumify = app.id === 'glow-rrmumify';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg apple-liquid-glass-elevated rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="apple-glass-meniscus" />
        <div className="apple-glass-rim" />
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl p-2 bg-white/10 border border-white/15 flex items-center justify-center">
              <AppLogo icon={icon} className="w-full h-full object-contain" accentColor={accentColor} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Edit Shortcut</h2>
              <p className="text-xs text-white/50">Customize tile details & web destination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note specifically for Glow RRMumify as highlighted in prompt */}
        {isGlowRRMumify && (
          <div className="my-4 p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Glow RRMumify:</span> Enter your specific target URL below when ready. The dashboard will instantly update and save it.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Application Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Website Address (URL)</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <option value="AI & Tools">AI & Tools</option>
              <option value="Productivity">Productivity</option>
              <option value="Media">Media</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Icon Motif</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_ICONS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    icon === i
                      ? 'bg-white/25 ring-2 ring-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/15'
                  }`}
                >
                  <AppLogo icon={i} className="w-5 h-5 object-contain" accentColor={accentColor} />
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selector */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Tile Ambient Glow Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setAccentColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: c }}
                >
                  {accentColor.toLowerCase() === c.toLowerCase() && (
                    <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                  )}
                </button>
              ))}
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-7 h-7 rounded-full bg-transparent cursor-pointer border-0 p-0"
                title="Custom color"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
