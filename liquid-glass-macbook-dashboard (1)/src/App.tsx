/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { AppShortcut, DashboardSettings, SidebarSettings } from './types';
import { DEFAULT_APPS } from './data/defaultApps';
import { BACKGROUND_PRESETS } from './data/presets';
import { BackgroundGlow } from './components/BackgroundGlow';
import { PreservedTopControls } from './components/PreservedTopControls';
import { Sidebar } from './components/Sidebar';
import { LiquidClock } from './components/LiquidClock';
import { AppTile } from './components/AppTile';
import { SpotlightSearch } from './components/SpotlightSearch';
import { EditAppModal } from './components/EditAppModal';
import { AddAppModal } from './components/AddAppModal';
import { SettingsModal } from './components/SettingsModal';
import { DEFAULT_CLOCK_SETTINGS } from './data/clockPresets';
import { hexToRgb, isValidRgb } from './utils/colorUtils';

const DEFAULT_SIDEBAR_SETTINGS: SidebarSettings = {
  position: 'left',
  isCollapsed: false,
  activeTab: 'all',
};

const DEFAULT_SETTINGS: DashboardSettings = {
  bgPresetId: 'tahoe-aurora',
  customColors: {
    c1: '#0066FF',
    c2: '#7C3AED',
    c3: '#D946EF',
    c4: '#06B6D4',
  },
  useCustomBg: false,
  bgIntensity: 0.85,
  animationSpeed: 1.0,
  animationsEnabled: true,
  is24Hour: false,
  showSeconds: true,
  userName: 'Ibrahim',
  customGreeting: '',
  gridColumns: '5',
  clock: DEFAULT_CLOCK_SETTINGS,
  sidebar: DEFAULT_SIDEBAR_SETTINGS,
};

export default function App() {
  // Load saved apps or default
  const [apps, setApps] = useState<AppShortcut[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_apps') || localStorage.getItem('macbook_dashboard_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading apps from localStorage', e);
    }
    return DEFAULT_APPS;
  });

  // Load saved settings or default
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_settings') || localStorage.getItem('macbook_dashboard_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawClock = parsed.clock || {};
        const glassColorHex = rawClock.glassColorHex || rawClock.customColor || DEFAULT_CLOCK_SETTINGS.glassColorHex;
        const highlightColorHex = rawClock.highlightColorHex || DEFAULT_CLOCK_SETTINGS.highlightColorHex;
        const reflectionColorHex = rawClock.reflectionColorHex || DEFAULT_CLOCK_SETTINGS.reflectionColorHex;
        const glowColorHex = rawClock.glowColorHex || rawClock.glowColor || DEFAULT_CLOCK_SETTINGS.glowColorHex;

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          clock: {
            ...DEFAULT_CLOCK_SETTINGS,
            ...rawClock,
            highlightEnabled: rawClock.highlightEnabled ?? DEFAULT_CLOCK_SETTINGS.highlightEnabled,
            reflectionEnabled: rawClock.reflectionEnabled ?? DEFAULT_CLOCK_SETTINGS.reflectionEnabled,
            glowEnabled: rawClock.glowEnabled ?? DEFAULT_CLOCK_SETTINGS.glowEnabled,
            glassColorHex,
            glassColorRgb: isValidRgb(rawClock.glassColorRgb) ? rawClock.glassColorRgb : hexToRgb(glassColorHex),
            highlightColorHex,
            highlightColorRgb: isValidRgb(rawClock.highlightColorRgb) ? rawClock.highlightColorRgb : hexToRgb(highlightColorHex),
            reflectionColorHex,
            reflectionColorRgb: isValidRgb(rawClock.reflectionColorRgb) ? rawClock.reflectionColorRgb : hexToRgb(reflectionColorHex),
            glowColorHex,
            glowColorRgb: isValidRgb(rawClock.glowColorRgb) ? rawClock.glowColorRgb : hexToRgb(glowColorHex),
          },
        };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Sidebar state (Position: left/right, Collapsed, Active Tab)
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_sidebar') || localStorage.getItem('macbook_dashboard_sidebar');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading sidebar settings', e);
    }
    return DEFAULT_SIDEBAR_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_sidebar', JSON.stringify(sidebarSettings));
    } catch (e) {
      console.error('Error saving sidebar settings', e);
    }
  }, [sidebarSettings]);

  // Recently used apps & shortcuts
  const [recentApps, setRecentApps] = useState<AppShortcut[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_recent_apps') || localStorage.getItem('macbook_dashboard_recent_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading recent apps', e);
    }
    return [];
  });

  const handleTrackRecent = (app: AppShortcut) => {
    setRecentApps((prev) => {
      const filtered = prev.filter((a) => a.id !== app.id);
      const updated = [app, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('liquid_dashboard_recent_apps', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recent apps', e);
      }
      return updated;
    });
  };

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppShortcut | null>(null);

  // Filter category
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Keyboard navigation focus index
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_apps', JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving apps', e);
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [settings]);

  // Global Keyboard Shortcuts (⌘K, /, arrows, Enter, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K or / to trigger spotlight search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }
      if (e.key === '/' && !isSearchOpen && !isAddModalOpen && !isSettingsOpen && !editingApp) {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // Close modals on Esc
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAddModalOpen(false);
        setIsSettingsOpen(false);
        setEditingApp(null);
        return;
      }

      // Arrow navigation across app tiles when no modal is open
      if (!isSearchOpen && !isAddModalOpen && !isSettingsOpen && !editingApp) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1 < apps.length ? prev + 1 : 0));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : apps.length - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 5 < apps.length ? prev + 5 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 5 >= 0 ? prev - 5 : prev));
        } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < apps.length) {
          e.preventDefault();
          handleOpenApp(apps[focusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apps, focusedIndex, isSearchOpen, isAddModalOpen, isSettingsOpen, editingApp]);

  // App launch action
  const handleOpenApp = (app: AppShortcut) => {
    handleTrackRecent(app);
    showToast(`Launching ${app.name} in new tab...`);
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set custom drag preview data
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...apps];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setApps(updated);
    setDraggedIndex(null);
    showToast('Dashboard layout updated');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Add application
  const handleAddApp = (newApp: AppShortcut) => {
    setApps((prev) => [...prev, newApp]);
    showToast(`Added ${newApp.name} to dashboard`);
  };

  // Edit application
  const handleSaveEditedApp = (updatedApp: AppShortcut) => {
    setApps((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    showToast(`Updated ${updatedApp.name}`);
  };

  // Delete application
  const handleDeleteApp = (id: string) => {
    const target = apps.find((a) => a.id === id);
    setApps((prev) => prev.filter((a) => a.id !== id));
    showToast(`Removed ${target?.name || 'app'}`);
  };

  // Restore Default 10 Apps
  const handleResetLayout = () => {
    setApps(DEFAULT_APPS);
    showToast('Restored original 10 applications');
  };

  // Reset all settings
  const handleResetAllSettings = () => {
    setApps(DEFAULT_APPS);
    setSettings(DEFAULT_SETTINGS);
    showToast('Dashboard reset to factory settings');
  };

  // Reset clock settings
  const handleResetClockSettings = () => {
    setSettings((prev) => ({
      ...prev,
      clock: DEFAULT_CLOCK_SETTINGS,
    }));
    showToast('Reset Liquid Glass Clock to default settings');
  };

  // Active background preset
  const activePreset =
    BACKGROUND_PRESETS.find((p) => p.id === settings.bgPresetId) || BACKGROUND_PRESETS[0];

  // Filter apps by category
  const filteredApps = apps.filter((app) => {
    if (activeCategory === 'all') return true;
    return app.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-white select-none">
      {/* 1. Customisable Animated Ambient Gradient Background */}
      <BackgroundGlow
        preset={activePreset}
        customColors={settings.customColors}
        useCustomBg={settings.useCustomBg}
        intensity={settings.bgIntensity}
        speed={settings.animationSpeed}
        animationsEnabled={settings.animationsEnabled}
      />

      {/* 2. Preserved 4 Top Controls: Battery, Wi-Fi, Reset Layout, Search Bar (Top Bar as a whole removed) */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          sidebarSettings.position === 'left'
            ? (sidebarSettings.isCollapsed ? 'md:pl-16' : 'xl:pl-84')
            : (sidebarSettings.isCollapsed ? 'md:pr-16' : 'xl:pr-84')
        }`}
      >
        <PreservedTopControls
          onOpenSearch={() => setIsSearchOpen(true)}
          onResetLayout={handleResetLayout}
        />
      </div>

      {/* 3. Customisable Liquid Glass Sidebar (Left or Right, Collapsible, Modular) */}
      <Sidebar
        settings={sidebarSettings}
        onUpdateSettings={setSidebarSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLaunchApp={handleOpenApp}
        allApps={apps}
        recentApps={recentApps}
        onTrackRecent={handleTrackRecent}
      />

      {/* 4. Main Dashboard Body (Flows with Sidebar Position) */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col items-center transition-all duration-300 ease-in-out ${
          sidebarSettings.position === 'left'
            ? (sidebarSettings.isCollapsed ? 'md:pl-16' : 'xl:pl-84')
            : (sidebarSettings.isCollapsed ? 'md:pr-16' : 'xl:pr-84')
        }`}
      >
        {/* Huge Liquid Glass Clock & Greeting */}
        <LiquidClock
          is24Hour={settings.is24Hour}
          showSeconds={settings.showSeconds}
          userName={settings.userName}
          customGreeting={settings.customGreeting}
          clockSettings={settings.clock || DEFAULT_CLOCK_SETTINGS}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 4. Applications Section Container */}
        <section className="w-full mt-6 sm:mt-10 mb-12">
          {/* Section Toolbar / Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-1">
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl font-semibold tracking-tight text-white/95">
                Applications
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                {apps.length}
              </span>
            </div>

            {/* Filter Tabs & Quick Action */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'ai & tools', label: 'AI & Tools' },
                  { id: 'productivity', label: 'Productivity' },
                  { id: 'media', label: 'Media' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all cursor-pointer border border-white/15 hover:shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tile</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Dashboard Preferences"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer border border-white/15"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rearrangeable Application Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredApps.map((app, index) => (
              <AppTile
                key={app.id}
                app={app}
                index={index}
                isSelected={focusedIndex === index}
                isDragging={draggedIndex === index}
                onOpenApp={handleOpenApp}
                onEditApp={(targetApp) => setEditingApp(targetApp)}
                onDeleteApp={handleDeleteApp}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Quick Add Glass Tile */}
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="group relative rounded-[28px] p-5 border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-md apple-transition flex flex-col items-center justify-center min-h-[160px] cursor-pointer text-center overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 group-hover:bg-white/15 text-white/50 group-hover:text-white transition-all mb-2.5 border border-white/10 shadow-inner">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                Add Shortcut
              </span>
              <span className="text-[11px] text-white/40 mt-0.5">
                Drag to rearrange
              </span>
            </div>
          </div>

          {/* Keyboard & Tip Hint Bar */}
          <div className="mt-10 py-3.5 px-6 rounded-2xl apple-liquid-pill flex flex-wrap items-center justify-between text-xs text-white/60 gap-3">
            <div className="flex items-center gap-3">
              <span><b>Drag &amp; Drop:</b> Rearrange application tiles</span>
              <span className="hidden md:inline text-white/30">·</span>
              <span className="hidden md:inline"><b>Arrows + Return:</b> Navigate &amp; open</span>
            </div>
            <div className="flex items-center gap-3">
              <span><b>Ctrl / ⌘K</b> Search</span>
              <span className="text-white/30">·</span>
              <button
                onClick={handleResetLayout}
                className="hover:text-white transition-colors underline cursor-pointer"
              >
                Reset layout
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full apple-liquid-glass-elevated text-white text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        apps={apps}
        onOpenApp={handleOpenApp}
      />

      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddApp}
      />

      <EditAppModal
        app={editingApp}
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        onSave={handleSaveEditedApp}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        apps={apps}
        onUpdateApps={setApps}
        onResetLayout={handleResetLayout}
        onResetAllSettings={handleResetAllSettings}
        onResetClockSettings={handleResetClockSettings}
        sidebarSettings={sidebarSettings}
        onUpdateSidebarSettings={setSidebarSettings}
      />
    </div>
  );
}
