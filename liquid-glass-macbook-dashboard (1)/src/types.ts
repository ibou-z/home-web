export interface AppShortcut {
  id: string;
  name: string;
  url: string;
  icon: string;
  accentColor: string;
  category: 'AI & Tools' | 'Productivity' | 'Media' | 'General';
  description?: string;
  isCustom?: boolean;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  c1: string; // Electric blue / cyan
  c2: string; // Deep purple / violet
  c3: string; // Magenta / pink
  c4: string; // Ambient core highlight
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ClockGlassSettings {
  // Main Glass Core Body
  glassColorHex: string;
  glassColorRgb: RgbColor;
  transparency: number; // 0.05 to 1.0 (opacity of glass core)
  glassSaturation: number; // 0.0 to 2.0 (color saturation)
  glassIntensity: number; // 0.2 to 2.0 (color brilliance)

  // Edge Highlights & Bevel
  highlightEnabled?: boolean;
  highlightColorHex: string;
  highlightColorRgb: RgbColor;
  highlightIntensity: number; // 0.0 to 2.0 (edge highlight brightness)
  highlightOpacity: number; // 0.0 to 1.0
  thickness: number; // 0.0 to 2.5 (perceived edge thickness & bevel)

  // Reflections
  reflectionEnabled?: boolean;
  reflectionColorHex: string;
  reflectionColorRgb: RgbColor;
  reflectionIntensity: number; // 0.0 to 1.0 (specular reflection strength)

  // Glow / Caustics Aura
  glowEnabled?: boolean;
  glowColorHex: string;
  glowColorRgb: RgbColor;
  glowIntensity: number; // 0.0 to 1.0
  glowRadius: number; // 0 to 40px

  // Typography & Layout
  fontWeight: '200' | '300' | '400' | '500' | '600' | '700';
  fontSize: number; // 0.7 to 1.4 (scale factor)
  spacing: number; // -0.08 to 0.08em (tracking between digits)
  blur: number; // 0 to 12px (optical softness)
  animation: 'liquid' | 'fade' | 'slide' | 'none';

  // Legacy compatibility fields
  glassColor?: string;
  customColor?: string;
  highlight?: number;
  reflection?: number;
  glowColor?: string;
}

export interface SidebarShortcut {
  id: string;
  name: string;
  url: string;
  category: 'Social' | 'Productivity' | 'Dev' | 'Media' | 'General';
  iconColor: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface SidebarSettings {
  position: 'left' | 'right';
  isCollapsed: boolean;
  activeTab: 'all' | 'shortcuts' | 'notes' | 'todo' | 'widgets';
}

export interface DashboardSettings {
  bgPresetId: string;
  customColors: {
    c1: string;
    c2: string;
    c3: string;
    c4: string;
  };
  useCustomBg: boolean;
  bgIntensity: number; // 0.2 to 1.0
  animationSpeed: number; // 0.2 to 2.0
  animationsEnabled: boolean;
  is24Hour: boolean;
  showSeconds: boolean;
  userName: string;
  customGreeting: string;
  gridColumns: 'auto' | '4' | '5';
  clock: ClockGlassSettings;
  sidebar?: SidebarSettings;
}
