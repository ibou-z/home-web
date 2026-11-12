import React, { useState, useRef } from 'react';
import { ExternalLink, Edit2, Trash2, GripVertical } from 'lucide-react';
import { AppShortcut } from '../types';
import { AppLogo } from './AppLogo';

interface AppTileProps {
  app: AppShortcut;
  index: number;
  isSelected?: boolean;
  onOpenApp: (app: AppShortcut) => void;
  onEditApp: (app: AppShortcut) => void;
  onDeleteApp: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export const AppTile: React.FC<AppTileProps> = ({
  app,
  index,
  isSelected,
  onOpenApp,
  onEditApp,
  onDeleteApp,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button[data-action]')) return;
    onOpenApp(app);
  };

  const isConfigurableNote = app.id === 'glow-rrmumify';

  return (
    <div
      ref={tileRef}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenApp(app);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}
      className={`group relative rounded-[28px] p-5 cursor-pointer select-none apple-transition outline-none overflow-hidden
        ${isDragging ? 'opacity-30 scale-95' : 'opacity-100 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98]'}
        ${isSelected ? 'ring-2 ring-white/70 shadow-[0_0_30px_rgba(255,255,255,0.35)]' : ''}
        apple-liquid-glass
      `}
      style={{
        boxShadow: isHovered
          ? `0 28px 50px -15px rgba(0,0,0,0.75), 0 0 35px ${app.accentColor}25, inset 0 2px 1.5px 0 rgba(255,255,255,0.8), inset 0 -1px 1.5px 0 rgba(255,255,255,0.2)`
          : '0 16px 36px -12px rgba(0,0,0,0.6), inset 0 1.5px 1px 0 rgba(255,255,255,0.65), inset 0 -1px 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {/* Top Curved Specular Meniscus */}
      <div className="apple-glass-meniscus" />

      {/* Razor-sharp Prism Edge */}
      <div className="apple-glass-rim" />

      {/* Dynamic Specular Sheen (Moves with cursor across the glass surface) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          background: isHovered
            ? `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Subtle Brand Accent Optical Bleed through the rear of the glass */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${app.accentColor}30 0%, ${app.accentColor}10 40%, transparent 70%)`,
        }}
      />

      {/* Top Header: Authentic Brand Icon in Optical Glass Pod + Controls */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
        {/* Optical Glass Icon Capsule */}
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 18px -4px rgba(0,0,0,0.5), inset 0 1px 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          {/* Internal gloss reflection on icon pod */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <AppLogo icon={app.icon} className="w-full h-full object-contain drop-shadow" accentColor={app.accentColor} />
        </div>

        {/* Hover Quick Action Buttons (Glass Pills) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            title="Drag to rearrange"
            className="p-1.5 text-white/40 hover:text-white cursor-grab active:cursor-grabbing transition-colors rounded-lg hover:bg-white/15"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <button
            data-action="edit"
            onClick={(e) => {
              e.stopPropagation();
              onEditApp(app);
            }}
            title="Edit Shortcut"
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/15 rounded-lg transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            data-action="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteApp(app.id);
            }}
            title="Remove Shortcut"
            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* App Name and Clean Destination Info (SF Pro Typography) */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-white/95 text-[15px] sm:text-base tracking-[-0.01em] group-hover:text-white transition-colors truncate">
            {app.name}
          </h3>
          <p className="text-[12px] text-white/45 truncate mt-0.5 font-normal tracking-normal">
            {app.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </p>
        </div>

        <div className="text-white/30 group-hover:text-white/80 transition-colors shrink-0">
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Glow RRMumify special indicator */}
      {isConfigurableNote && (
        <div className="relative z-10 mt-3 pt-2 border-t border-white/[0.1] flex items-center justify-between text-[11px] text-purple-200/80">
          <span className="flex items-center gap-1.5 font-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
            Configurable URL
          </span>
          <button
            data-action="edit"
            onClick={(e) => {
              e.stopPropagation();
              onEditApp(app);
            }}
            className="hover:underline text-white/80 hover:text-white font-medium"
          >
            Configure
          </button>
        </div>
      )}
    </div>
  );
};
