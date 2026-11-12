import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { AppShortcut } from '../types';
import { AppLogo } from './AppLogo';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newApp: AppShortcut) => void;
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
  '#0066FF',
  '#7C3AED',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#06B6D4',
  '#E11D48',
  '#3B82F6',
];

export const AddAppModal: React.FC<AddAppModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('custom');
  const [accentColor, setAccentColor] = useState('#0066FF');
  const [category, setCategory] = useState<'AI & Tools' | 'Productivity' | 'Media' | 'General'>('Productivity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const newApp: AppShortcut = {
      id: `app_${Date.now()}`,
      name: name.trim() || 'Custom App',
      url: cleanUrl,
      icon,
      accentColor,
      category,
      isCustom: true,
    };

    onAdd(newApp);
    setName('');
    setUrl('');
    onClose();
  };

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
            <div className="w-10 h-10 rounded-xl p-2 bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add Application Shortcut</h2>
              <p className="text-xs text-white/50">Create a new liquid glass launcher tile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Application Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GitHub, Notion, Spotify"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="AI & Tools">AI & Tools</option>
              <option value="Productivity">Productivity</option>
              <option value="Media">Media</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Icon Selection */}
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

          {/* Accent Color Selection */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Ambient Glow Color</label>
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
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 shadow-lg transition-all"
            >
              Add to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
