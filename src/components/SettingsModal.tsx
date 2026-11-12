import React, { useState } from 'react';
import {
  X,
  Sliders,
  Palette,
  Clock,
  Grid,
  RotateCcw,
  Sparkles,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Sun,
  Layers,
  Sparkle,
  Download,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import { DashboardSettings, AppShortcut, ClockGlassSettings, RgbColor, SidebarSettings } from '../types';
import { BACKGROUND_PRESETS } from '../data/presets';
import {
  DEFAULT_CLOCK_SETTINGS,
  GLASS_COLOR_PRESETS,
  CLOCK_WEIGHT_OPTIONS,
} from '../data/clockPresets';
import { hexToRgb, rgbToHex, isValidRgb } from '../utils/colorUtils';
import { AppLogo } from './AppLogo';
import { LiquidClock } from './LiquidClock';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: DashboardSettings) => void;
  apps: AppShortcut[];
  onUpdateApps: (apps: AppShortcut[]) => void;
  onResetLayout: () => void;
  onResetAllSettings: () => void;
  onResetClockSettings: () => void;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
}

// Reusable Independent Full-Spectrum Color Controller (Hex, RGB, Picker)
const ColorField: React.FC<{
  label: string;
  description?: string;
  hex: string;
  rgb: RgbColor;
  onChange: (newHex: string, newRgb: RgbColor) => void;
  showMatchButton?: boolean;
  onMatchGlass?: () => void;
}> = ({ label, description, hex, rgb, onChange, showMatchButton, onMatchGlass }) => {
  const handleHexInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      onChange(clean.toUpperCase(), hexToRgb(clean));
    } else {
      onChange(clean, rgb);
    }
  };

  const handleRgbInput = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, isNaN(value) ? 0 : value));
    const updated = { ...rgb, [channel]: clamped };
    onChange(rgbToHex(updated), updated);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <span className="text-xs font-medium text-white/90 block">{label}</span>
          {description && <span className="text-[11px] text-white/45 block">{description}</span>}
        </div>
        <div className="flex items-center gap-2">
          {showMatchButton && onMatchGlass && (
            <button
              type="button"
              onClick={onMatchGlass}
              title="Match main glass colour"
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
            >
              Match Glass
            </button>
          )}
          {/* Native Full-Spectrum Picker */}
          <input
            type="color"
            value={hex.length === 7 ? hex : '#FFFFFF'}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              onChange(val, hexToRgb(val));
            }}
            className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0 shadow-inner"
            title="Open colour picker"
          />
          {/* Hex Input */}
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            className="w-20 px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* RGB Numeric Channels */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
        <div>
          <span className="text-[10px] text-white/40 block mb-0.5">R (0-255)</span>
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.r}
            onChange={(e) => handleRgbInput('r', parseInt(e.target.value))}
            className="w-full px-2 py-1 rounded-md bg-black/30 border border-white/10 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <div>
          <span className="text-[10px] text-white/40 block mb-0.5">G (0-255)</span>
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.g}
            onChange={(e) => handleRgbInput('g', parseInt(e.target.value))}
            className="w-full px-2 py-1 rounded-md bg-black/30 border border-white/10 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <div>
          <span className="text-[10px] text-white/40 block mb-0.5">B (0-255)</span>
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.b}
            onChange={(e) => handleRgbInput('b', parseInt(e.target.value))}
            className="w-full px-2 py-1 rounded-md bg-black/30 border border-white/10 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  apps,
  onUpdateApps,
  onResetLayout,
  onResetAllSettings,
  onResetClockSettings,
  sidebarSettings,
  onUpdateSidebarSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'clock' | 'background' | 'apps' | 'system'>('clock');
  const [clockSubTab, setClockSubTab] = useState<'colors' | 'highlights' | 'optics' | 'typography'>('colors');

  if (!isOpen) return null;

  // Hydrate clock settings with safe defaults and robust RGB validation
  const clock: ClockGlassSettings = {
    ...DEFAULT_CLOCK_SETTINGS,
    ...(settings.clock || {}),
    highlightEnabled: settings.clock?.highlightEnabled ?? DEFAULT_CLOCK_SETTINGS.highlightEnabled,
    reflectionEnabled: settings.clock?.reflectionEnabled ?? DEFAULT_CLOCK_SETTINGS.reflectionEnabled,
    glowEnabled: settings.clock?.glowEnabled ?? DEFAULT_CLOCK_SETTINGS.glowEnabled,
    glassColorRgb: isValidRgb(settings.clock?.glassColorRgb)
      ? settings.clock.glassColorRgb
      : hexToRgb(settings.clock?.glassColorHex || DEFAULT_CLOCK_SETTINGS.glassColorHex),
    highlightColorRgb: isValidRgb(settings.clock?.highlightColorRgb)
      ? settings.clock.highlightColorRgb
      : hexToRgb(settings.clock?.highlightColorHex || DEFAULT_CLOCK_SETTINGS.highlightColorHex),
    reflectionColorRgb: isValidRgb(settings.clock?.reflectionColorRgb)
      ? settings.clock.reflectionColorRgb
      : hexToRgb(settings.clock?.reflectionColorHex || DEFAULT_CLOCK_SETTINGS.reflectionColorHex),
    glowColorRgb: isValidRgb(settings.clock?.glowColorRgb)
      ? settings.clock.glowColorRgb
      : hexToRgb(settings.clock?.glowColorHex || DEFAULT_CLOCK_SETTINGS.glowColorHex),
  };

  // Batched atomic updater prevents state tearing and desynchronization
  const updateClockSettings = (partial: Partial<ClockGlassSettings>) => {
    onUpdateSettings({
      ...settings,
      clock: {
        ...clock,
        ...partial,
      },
    });
  };

  const updateClockSetting = <K extends keyof ClockGlassSettings>(
    key: K,
    value: ClockGlassSettings[K]
  ) => {
    updateClockSettings({ [key]: value });
  };

  const handlePresetSelect = (presetId: string) => {
    onUpdateSettings({
      ...settings,
      bgPresetId: presetId,
      useCustomBg: false,
    });
  };

  const handleCustomColorChange = (key: 'c1' | 'c2' | 'c3' | 'c4', value: string) => {
    onUpdateSettings({
      ...settings,
      useCustomBg: true,
      customColors: {
        ...settings.customColors,
        [key]: value,
      },
    });
  };

  const moveApp = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= apps.length) return;
    const reordered = [...apps];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onUpdateApps(reordered);
  };

  const removeApp = (id: string) => {
    onUpdateApps(apps.filter((a) => a.id !== id));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col apple-liquid-glass-elevated rounded-[36px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="apple-glass-meniscus" />
        <div className="apple-glass-rim" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl p-2 bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Sliders className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Dashboard Settings</h2>
              <p className="text-xs text-white/50">Customise Liquid Glass Clock, Background &amp; Launcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/15 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex items-center px-6 pt-3 border-b border-white/10 gap-2 overflow-x-auto shrink-0 bg-black/20">
          <button
            onClick={() => setActiveTab('clock')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === 'clock'
                ? 'border-purple-400 text-white bg-white/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Liquid Glass Clock</span>
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === 'background'
                ? 'border-purple-400 text-white bg-white/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Background Ambient</span>
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === 'apps'
                ? 'border-purple-400 text-white bg-white/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Manage Apps ({apps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === 'system'
                ? 'border-purple-400 text-white bg-white/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: ADVANCED IPHONE LIQUID GLASS CLOCK */}
          {activeTab === 'clock' && (
            <div className="space-y-6">
              {/* LIVE CLOCK PREVIEW CONTAINER */}
              <div className="rounded-3xl p-5 border border-white/15 bg-black/40 overflow-hidden relative shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-medium text-white">Live Liquid Glass Preview</span>
                  </div>
                  <button
                    onClick={onResetClockSettings}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Clock Defaults</span>
                  </button>
                </div>

                {/* Compact Live Render of the Liquid Glass Clock */}
                <div className="py-2 flex items-center justify-center overflow-x-auto">
                  <LiquidClock
                    is24Hour={settings.is24Hour}
                    showSeconds={settings.showSeconds}
                    userName={settings.userName}
                    customGreeting={settings.customGreeting}
                    clockSettings={clock}
                    isLivePreview={true}
                  />
                </div>
              </div>

              {/* CLOCK SUB-TABS FOR DEEP CUSTOMIZATION */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setClockSubTab('colors')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    clockSubTab === 'colors'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Palette className="w-3 h-3 inline mr-1.5" />
                  Glass &amp; Colours
                </button>
                <button
                  type="button"
                  onClick={() => setClockSubTab('highlights')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    clockSubTab === 'highlights'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3 inline mr-1.5" />
                  Highlights &amp; Rim
                </button>
                <button
                  type="button"
                  onClick={() => setClockSubTab('optics')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    clockSubTab === 'optics'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3 inline mr-1.5" />
                  Reflections &amp; Glow
                </button>
                <button
                  type="button"
                  onClick={() => setClockSubTab('typography')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    clockSubTab === 'typography'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sparkle className="w-3 h-3 inline mr-1.5" />
                  Typography &amp; Size
                </button>
              </div>

              {/* SUBTAB 1: FULL COLOUR & MATERIAL CONTROLS */}
              {clockSubTab === 'colors' && (
                <div className="space-y-4">
                  {/* Main Glass Color Controller */}
                  <ColorField
                    label="Main Glass Core Tint"
                    description="Body tint of the translucent glass numerals"
                    hex={clock.glassColorHex}
                    rgb={clock.glassColorRgb}
                    onChange={(hex, rgb) => updateClockSettings({ glassColorHex: hex, glassColorRgb: rgb })}
                  />

                  {/* Standard Test Color Swatches */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80 block">Mandatory Colour Validation Swatches</span>
                      <span className="text-[10px] text-white/40">100% Pure Glass Tints</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { label: 'Pure Red', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
                        { label: 'Pure Blue', hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
                        { label: 'Pure Green', hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } },
                        { label: 'Pure Purple', hex: '#8000FF', rgb: { r: 128, g: 0, b: 255 } },
                        { label: 'Pure Pink', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 } },
                        { label: 'Pure White', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } },
                        { label: 'Pure Black', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
                        { label: 'Electric Cyan', hex: '#00F0FF', rgb: { r: 0, g: 240, b: 255 } },
                        { label: 'Amber Gold', hex: '#FFB703', rgb: { r: 255, g: 183, b: 3 } },
                        { label: 'Neon Mint', hex: '#10B981', rgb: { r: 16, g: 185, b: 129 } },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateClockSettings({ glassColorHex: c.hex, glassColorRgb: c.rgb })}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-all text-left cursor-pointer ${
                            clock.glassColorHex.toUpperCase() === c.hex.toUpperCase()
                              ? 'bg-white/20 border-white/50 shadow-md ring-1 ring-white/40'
                              : 'bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/25 shrink-0"
                            style={{ background: c.hex }}
                          />
                          <span className="text-[11px] text-white/90 truncate font-medium">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders for Transparency, Saturation, Intensity */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Glass Translucency / Core Opacity</span>
                        <span className="font-mono text-white/90">{Math.round(clock.transparency * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={clock.transparency}
                        onChange={(e) => updateClockSettings({ transparency: parseFloat(e.target.value) })}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-white/35 mt-0.5">
                        <span>Crystal Clear (5%)</span>
                        <span>Dense Enamel (100%)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Glass Colour Saturation</span>
                          <span className="font-mono text-white/90">{Math.round((clock.glassSaturation ?? 1.0) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="2.0"
                          step="0.05"
                          value={clock.glassSaturation ?? 1.0}
                          onChange={(e) => updateClockSettings({ glassSaturation: parseFloat(e.target.value) })}
                          className="w-full accent-purple-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Glass Colour Brilliance</span>
                          <span className="font-mono text-white/90">{Math.round((clock.glassIntensity ?? 1.0) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="2.0"
                          step="0.05"
                          value={clock.glassIntensity ?? 1.0}
                          onChange={(e) => updateClockSettings({ glassIntensity: parseFloat(e.target.value) })}
                          className="w-full accent-purple-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Color Palette Inspirations */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-xs font-medium text-white/80 block">Quick Glass Inspirations</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GLASS_COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateClockSettings({
                              glassColorHex: preset.hex,
                              glassColorRgb: preset.rgb,
                            });
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left cursor-pointer"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                            style={{ background: preset.hex }}
                          />
                          <span className="text-xs text-white/80 truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: HIGHLIGHTS & RIM CONTROLS */}
              {clockSubTab === 'highlights' && (
                <div className="space-y-4">
                  {/* Master Toggle for Highlights */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/15">
                    <div>
                      <span className="text-sm font-semibold text-white block">Enable Specular Highlights &amp; Rim</span>
                      <span className="text-xs text-white/50 block">Control edge reflections independently from the glass core</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClockSettings({ highlightEnabled: !(clock.highlightEnabled ?? true) })}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        (clock.highlightEnabled ?? true) ? 'bg-purple-600' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          (clock.highlightEnabled ?? true) ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {(clock.highlightEnabled ?? true) ? (
                    <>
                      {/* Independent Highlight Color */}
                      <ColorField
                        label="Specular Highlight &amp; Rim Colour"
                        description="Edge contour lighting (completely independent of main glass)"
                        hex={clock.highlightColorHex}
                        rgb={clock.highlightColorRgb}
                        showMatchButton={true}
                        onMatchGlass={() =>
                          updateClockSettings({
                            highlightColorHex: clock.glassColorHex,
                            highlightColorRgb: clock.glassColorRgb,
                          })
                        }
                        onChange={(hex, rgb) =>
                          updateClockSettings({ highlightColorHex: hex, highlightColorRgb: rgb })
                        }
                      />

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                        {/* Highlight Brightness */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>Highlight Brightness</span>
                            <span className="font-mono text-white/90">{(clock.highlightIntensity ?? 1.0).toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="2.0"
                            step="0.05"
                            value={clock.highlightIntensity ?? 1.0}
                            onChange={(e) => updateClockSettings({ highlightIntensity: parseFloat(e.target.value) })}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-white/35 mt-0.5">
                            <span>Off / Zero</span>
                            <span>Vivid Specular</span>
                          </div>
                        </div>

                        {/* Highlight Opacity */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>Highlight Opacity</span>
                            <span className="font-mono text-white/90">{Math.round((clock.highlightOpacity ?? 0.85) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={clock.highlightOpacity ?? 0.85}
                            onChange={(e) => updateClockSettings({ highlightOpacity: parseFloat(e.target.value) })}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-white/35 mt-0.5">
                            <span>0% (No Edge Tint)</span>
                            <span>100% (Solid Edge)</span>
                          </div>
                        </div>

                        {/* Thickness & Bevel Depth */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>Perceived Glass Thickness &amp; Bevel</span>
                            <span className="font-mono text-white/90">{clock.thickness.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="2.5"
                            step="0.1"
                            value={clock.thickness}
                            onChange={(e) => updateClockSettings({ thickness: parseFloat(e.target.value) })}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-white/35 mt-0.5">
                            <span>Razor-sharp (0.0x)</span>
                            <span>Deep Curvature (2.5x)</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/50">
                      Highlights are completely disabled. The typography renders with pure glass core color without any edge outlines or specular rim strokes.
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: REFLECTIONS & GLOW */}
              {clockSubTab === 'optics' && (
                <div className="space-y-4">
                  {/* Master Toggle for Reflections */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/15">
                    <div>
                      <span className="text-sm font-semibold text-white block">Enable Optical Reflections</span>
                      <span className="text-xs text-white/50 block">Specular sheen bounce at the lower meniscus</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClockSettings({ reflectionEnabled: !(clock.reflectionEnabled ?? true) })}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        (clock.reflectionEnabled ?? true) ? 'bg-purple-600' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          (clock.reflectionEnabled ?? true) ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {(clock.reflectionEnabled ?? true) ? (
                    <>
                      <ColorField
                        label="Optical Reflection Colour"
                        description="Reflection sheen colour (independent of glass core)"
                        hex={clock.reflectionColorHex}
                        rgb={clock.reflectionColorRgb}
                        showMatchButton={true}
                        onMatchGlass={() =>
                          updateClockSettings({
                            reflectionColorHex: clock.glassColorHex,
                            reflectionColorRgb: clock.glassColorRgb,
                          })
                        }
                        onChange={(hex, rgb) =>
                          updateClockSettings({ reflectionColorHex: hex, reflectionColorRgb: rgb })
                        }
                      />

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Reflection Sheen Intensity</span>
                          <span className="font-mono text-white/90">{Math.round((clock.reflectionIntensity ?? 0.65) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.05"
                          value={clock.reflectionIntensity ?? 0.65}
                          onChange={(e) => updateClockSettings({ reflectionIntensity: parseFloat(e.target.value) })}
                          className="w-full accent-purple-400 cursor-pointer"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/50">
                      Reflections are disabled.
                    </div>
                  )}

                  {/* Master Toggle for Glow */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/15">
                    <div>
                      <span className="text-sm font-semibold text-white block">Enable Outer Glow &amp; Caustics</span>
                      <span className="text-xs text-white/50 block">Luminescent halo surrounding the glass numbers</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClockSettings({ glowEnabled: !(clock.glowEnabled ?? true) })}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        (clock.glowEnabled ?? true) ? 'bg-purple-600' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          (clock.glowEnabled ?? true) ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {(clock.glowEnabled ?? true) ? (
                    <>
                      <ColorField
                        label="Outer Glow &amp; Caustic Aura Colour"
                        description="Luminescent ambient halo colour"
                        hex={clock.glowColorHex}
                        rgb={clock.glowColorRgb}
                        showMatchButton={true}
                        onMatchGlass={() =>
                          updateClockSettings({
                            glowColorHex: clock.glassColorHex,
                            glowColorRgb: clock.glassColorRgb,
                          })
                        }
                        onChange={(hex, rgb) =>
                          updateClockSettings({ glowColorHex: hex, glowColorRgb: rgb })
                        }
                      />

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>Glow Intensity</span>
                            <span className="font-mono text-white/90">{Math.round((clock.glowIntensity ?? 0.25) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={clock.glowIntensity ?? 0.25}
                            onChange={(e) => updateClockSettings({ glowIntensity: parseFloat(e.target.value) })}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>Glow Radius</span>
                            <span className="font-mono text-white/90">{clock.glowRadius ?? 18}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            step="2"
                            value={clock.glowRadius ?? 18}
                            onChange={(e) => updateClockSettings({ glowRadius: parseInt(e.target.value) })}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/50">
                      Outer glow is disabled.
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 4: TYPOGRAPHY, SCALE & TRANSITIONS */}
              {clockSubTab === 'typography' && (
                <div className="space-y-4">
                  {/* Font Weight */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <label className="block text-xs font-medium text-white/80 mb-2">Typography Weight</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {CLOCK_WEIGHT_OPTIONS.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => updateClockSetting('fontWeight', w.id as any)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
                            clock.fontWeight === w.id
                              ? 'bg-white text-slate-900 shadow-md font-semibold'
                              : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Clock Proportions / Scale</span>
                        <span className="font-mono text-white/90">{clock.fontSize.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={clock.fontSize}
                        onChange={(e) => updateClockSetting('fontSize', parseFloat(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>

                    {/* Digit Spacing (Tracking) */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Digit Tracking (Spacing)</span>
                        <span className="font-mono text-white/90">
                          {clock.spacing > 0 ? `+${clock.spacing.toFixed(3)}` : clock.spacing.toFixed(3)}em
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-0.08"
                        max="0.08"
                        step="0.005"
                        value={clock.spacing}
                        onChange={(e) => updateClockSetting('spacing', parseFloat(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Format & Transition Animations */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-xs text-white/80">24-Hour Time Format</span>
                        <button
                          onClick={() => onUpdateSettings({ ...settings, is24Hour: !settings.is24Hour })}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                            settings.is24Hour ? 'bg-purple-600' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              settings.is24Hour ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-xs text-white/80">Show Seconds Display</span>
                        <button
                          onClick={() => onUpdateSettings({ ...settings, showSeconds: !settings.showSeconds })}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                            settings.showSeconds ? 'bg-purple-600' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              settings.showSeconds ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Transition Animations */}
                    <div>
                      <span className="text-xs text-white/70 block mb-2">Minute Transition Effect</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'liquid', label: 'Liquid Pulse' },
                          { id: 'fade', label: 'Smooth Fade' },
                          { id: 'slide', label: 'Subtle Slide' },
                          { id: 'none', label: 'None' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateClockSetting('animation', opt.id as any)}
                            className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
                              clock.animation === opt.id
                                ? 'bg-white text-slate-900 shadow-md font-semibold'
                                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Greeting Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Greeting Name</label>
                        <input
                          type="text"
                          value={settings.userName}
                          onChange={(e) => onUpdateSettings({ ...settings, userName: e.target.value })}
                          placeholder="e.g. Ibrahim"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Custom Greeting Override</label>
                        <input
                          type="text"
                          value={settings.customGreeting}
                          onChange={(e) => onUpdateSettings({ ...settings, customGreeting: e.target.value })}
                          placeholder="Leave blank for auto greeting"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BACKGROUND AMBIENT */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Gradient Ambient Presets</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {BACKGROUND_PRESETS.map((p) => {
                    const isSelected = !settings.useCustomBg && settings.bgPresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handlePresetSelect(p.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-white/15 border-purple-400 ring-2 ring-purple-400/40 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="h-14 rounded-xl mb-2.5 relative overflow-hidden flex items-center justify-center">
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, ${p.c1} 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${p.c2} 0%, ${p.c3} 50%, #030508 100%)`,
                            }}
                          />
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white z-10 shadow">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-white text-xs">{p.name}</div>
                        <div className="text-[11px] text-white/50 truncate mt-0.5">{p.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Gradient Studio */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white">Custom Gradient Studio</h3>
                    <p className="text-[11px] text-white/50">Pick custom radiant stops for your liquid backdrop</p>
                  </div>
                  {settings.useCustomBg && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] text-white/60 block mb-1">Color 1 (Cyan/Blue)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.customColors.c1}
                        onChange={(e) => handleCustomColorChange('c1', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-xs font-mono text-white/80">{settings.customColors.c1}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-white/60 block mb-1">Color 2 (Purple/Violet)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.customColors.c2}
                        onChange={(e) => handleCustomColorChange('c2', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-xs font-mono text-white/80">{settings.customColors.c2}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-white/60 block mb-1">Color 3 (Magenta/Pink)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.customColors.c3}
                        onChange={(e) => handleCustomColorChange('c3', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-xs font-mono text-white/80">{settings.customColors.c3}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-white/60 block mb-1">Color 4 (Accent)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.customColors.c4}
                        onChange={(e) => handleCustomColorChange('c4', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-xs font-mono text-white/80">{settings.customColors.c4}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation & Intensity Controls */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">Enable Ambient Fluid Animations</div>
                    <div className="text-[11px] text-white/50">Slow, smooth CSS hardware-accelerated orb drifting</div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        animationsEnabled: !settings.animationsEnabled,
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      settings.animationsEnabled ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                    <span>Gradient Glow Intensity</span>
                    <span className="font-mono">{Math.round(settings.bgIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={settings.bgIntensity}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        bgIntensity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                    <span>Animation Drift Speed</span>
                    <span className="font-mono">{settings.animationSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={settings.animationSpeed}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        animationSpeed: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE APPS */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">Application Launcher Tiles</h3>
                  <p className="text-[11px] text-white/50">Reorder with arrows, edit destinations or remove</p>
                </div>
                <button
                  onClick={onResetLayout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default 10 Apps</span>
                </button>
              </div>

              <div className="divide-y divide-white/10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                {apps.map((app, index) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg p-1.5 bg-white/10 flex items-center justify-center shrink-0">
                        <AppLogo icon={app.icon} className="w-full h-full object-contain" accentColor={app.accentColor} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-white truncate">{app.name}</div>
                        <div className="text-[11px] text-white/50 truncate font-mono">{app.url}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveApp(index, index - 1)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 text-white/50 hover:text-white disabled:opacity-20 hover:bg-white/10 rounded cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveApp(index, index + 1)}
                        disabled={index === apps.length - 1}
                        title="Move Down"
                        className="p-1.5 text-white/50 hover:text-white disabled:opacity-20 hover:bg-white/10 rounded cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeApp(app.id)}
                        title="Delete App"
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-5">
              {/* Liquid Glass Sidebar Preferences */}
              {sidebarSettings && onUpdateSidebarSettings && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                        <PanelLeftClose className="w-4 h-4 text-purple-400" />
                        <span>Liquid Glass Sidebar Dock</span>
                      </h4>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        Position the modular Liquid Glass sidebar on either screen edge and customize default state.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Position Selector */}
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                      <span className="text-[11px] text-white/70 font-medium block">Screen Edge Position</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateSidebarSettings({ ...sidebarSettings, position: 'left' })}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            sidebarSettings.position === 'left'
                              ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <PanelLeftClose className="w-3.5 h-3.5" />
                          <span>Left Edge</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateSidebarSettings({ ...sidebarSettings, position: 'right' })}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            sidebarSettings.position === 'right'
                              ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <PanelRightClose className="w-3.5 h-3.5" />
                          <span>Right Edge</span>
                        </button>
                      </div>
                    </div>

                    {/* Default State Selector */}
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                      <span className="text-[11px] text-white/70 font-medium block">Display Mode</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateSidebarSettings({ ...sidebarSettings, isCollapsed: false })}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            !sidebarSettings.isCollapsed
                              ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>Expanded</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateSidebarSettings({ ...sidebarSettings, isCollapsed: true })}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            sidebarSettings.isCollapsed
                              ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>Dock Strip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-semibold text-white">System &amp; Engine Profile</h4>
                <div className="text-xs text-white/70 space-y-1">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Environment</span>
                    <span>Cross-Platform Web &amp; Desktop Browser</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Clock Engine</span>
                    <span>Optical Liquid Glass Physics Engine</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Graphics Engine</span>
                    <span>Hardware-Accelerated CSS Compositor (60 FPS)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/40">Persistence</span>
                    <span>Browser localStorage (Auto-saved)</span>
                  </div>
                </div>
              </div>

              {/* Export Complete Project for GitHub */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>Export Project (Complete ZIP)</span>
                    </h4>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Download the entire project as a ZIP archive containing all source files, components, styles, configurations, and assets in their exact directory structure.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="/liquid-glass-dashboard.zip"
                    download="liquid-glass-dashboard.zip"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete ZIP</span>
                  </a>
                  <span className="text-[11px] text-white/40">Includes README.md, package.json, src/, &amp; assets</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-red-300">Factory Reset</h4>
                  <p className="text-[11px] text-red-200/60">
                    Reset all clock customisations, background presets, and application shortcuts back to original defaults.
                  </p>
                </div>
                <button
                  onClick={onResetAllSettings}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium border border-red-500/30 transition-colors cursor-pointer"
                >
                  Reset Everything to Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 py-3.5 border-t border-white/10 flex items-center justify-between bg-black/40 shrink-0">
          <span className="text-xs text-white/40">All changes save automatically to localStorage</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
