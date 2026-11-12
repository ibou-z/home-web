import { ClockGlassSettings } from '../types';

export const DEFAULT_CLOCK_SETTINGS: ClockGlassSettings = {
  // Main Glass Core Body
  glassColorHex: '#FFFFFF',
  glassColorRgb: { r: 255, g: 255, b: 255 },
  transparency: 0.75, // natural physical translucency
  glassSaturation: 1.0,
  glassIntensity: 1.0,

  // Highlights (natural, subtle, contour-following, non-harsh)
  highlightEnabled: true,
  highlightColorHex: '#FFFFFF',
  highlightColorRgb: { r: 255, g: 255, b: 255 },
  highlightIntensity: 1.0,
  highlightOpacity: 0.85,
  thickness: 1.0, // refined edge thickness that doesn't clip thin glyphs

  // Reflections (optical specular sheen)
  reflectionEnabled: true,
  reflectionColorHex: '#FFFFFF',
  reflectionColorRgb: { r: 255, g: 255, b: 255 },
  reflectionIntensity: 0.65,

  // Glow / Caustics Aura
  glowEnabled: true,
  glowColorHex: '#FFFFFF',
  glowColorRgb: { r: 255, g: 255, b: 255 },
  glowIntensity: 0.25,
  glowRadius: 18,

  // Typography & Layout
  fontWeight: '200',
  fontSize: 1.0,
  spacing: -0.045,
  blur: 0, // 0 for maximum sharpness and low GPU overhead
  animation: 'liquid',

  // Legacy compatibility
  glassColor: 'crystal',
  customColor: '#FFFFFF',
  highlight: 1.0,
  reflection: 0.65,
  glowColor: '#FFFFFF',
};

export interface GlassColorPreset {
  id: string;
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  tint: string;
  glowHex: string;
}

export const GLASS_COLOR_PRESETS: GlassColorPreset[] = [
  { id: 'crystal', name: 'Crystal Sapphire', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, tint: '255, 255, 255', glowHex: '#FFFFFF' },
  { id: 'silver', name: 'Liquid Titanium', hex: '#E2E8F0', rgb: { r: 226, g: 232, b: 240 }, tint: '226, 232, 240', glowHex: '#CBD5E1' },
  { id: 'cyan', name: 'Glacier Frost', hex: '#22D3EE', rgb: { r: 34, g: 211, b: 238 }, tint: '34, 211, 238', glowHex: '#06B6D4' },
  { id: 'blue', name: 'Electric Azure', hex: '#60A5FA', rgb: { r: 96, g: 165, b: 250 }, tint: '96, 165, 250', glowHex: '#3B82F6' },
  { id: 'purple', name: 'Violet Amethyst', hex: '#C084FC', rgb: { r: 192, g: 132, b: 252 }, tint: '192, 132, 252', glowHex: '#A855F7' },
  { id: 'pink', name: 'Rose Quartz', hex: '#F472B6', rgb: { r: 244, g: 114, b: 182 }, tint: '244, 114, 182', glowHex: '#EC4899' },
  { id: 'emerald', name: 'Mint Emerald', hex: '#34D399', rgb: { r: 52, g: 211, b: 153 }, tint: '52, 211, 153', glowHex: '#10B981' },
  { id: 'amber', name: 'Champagne Topaz', hex: '#FBBF24', rgb: { r: 251, g: 191, b: 36 }, tint: '251, 191, 36', glowHex: '#F59E0B' },
];

export const CLOCK_WEIGHT_OPTIONS = [
  { id: '200', label: 'Ultralight' },
  { id: '300', label: 'Light' },
  { id: '400', label: 'Regular' },
  { id: '500', label: 'Medium' },
  { id: '600', label: 'Semibold' },
  { id: '700', label: 'Bold' },
];
