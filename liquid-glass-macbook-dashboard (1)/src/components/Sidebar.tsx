import React, { useState, useEffect } from 'react';
import {
  Home,
  Bookmark,
  FileText,
  CheckSquare,
  Calendar as CalendarIcon,
  CloudSun,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  PanelLeftClose,
  PanelRightClose,
  Sun,
  CloudRain,
  Cloud,
  Clock,
  Sparkles,
  Search,
  RotateCcw,
} from 'lucide-react';
import { SidebarShortcut, TodoItem, SidebarSettings, AppShortcut } from '../types';
import { DEFAULT_SIDEBAR_SHORTCUTS } from '../data/sidebarShortcuts';

interface SidebarProps {
  settings: SidebarSettings;
  onUpdateSettings: (newSettings: SidebarSettings) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onLaunchApp: (app: AppShortcut) => void;
  allApps: AppShortcut[];
  recentApps: AppShortcut[];
  onTrackRecent: (app: AppShortcut) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenSearch,
  onLaunchApp,
  allApps,
  recentApps,
  onTrackRecent,
}) => {
  const togglePosition = () => {
    onUpdateSettings({
      ...settings,
      position: settings.position === 'left' ? 'right' : 'left',
    });
  };

  const toggleCollapsed = () => {
    onUpdateSettings({
      ...settings,
      isCollapsed: !settings.isCollapsed,
    });
  };

  const setActiveTab = (tab: SidebarSettings['activeTab']) => {
    onUpdateSettings({
      ...settings,
      activeTab: tab,
      isCollapsed: false, // expand if an icon was clicked while collapsed
    });
  };

  // 2. Website Shortcuts (Customisable CRUD & Reordering)
  const [shortcuts, setShortcuts] = useState<SidebarShortcut[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_sidebar_shortcuts') || localStorage.getItem('macbook_dashboard_sidebar_shortcuts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading sidebar shortcuts', e);
    }
    return DEFAULT_SIDEBAR_SHORTCUTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_sidebar_shortcuts', JSON.stringify(shortcuts));
    } catch (e) {
      console.error('Error saving sidebar shortcuts', e);
    }
  }, [shortcuts]);

  // Modal / Inline Form for Add & Edit Shortcut
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [editingShortcutId, setEditingShortcutId] = useState<string | null>(null);
  const [shortcutFormName, setShortcutFormName] = useState('');
  const [shortcutFormUrl, setShortcutFormUrl] = useState('');
  const [shortcutFormCategory, setShortcutFormCategory] = useState<SidebarShortcut['category']>('General');

  const handleOpenAddShortcut = () => {
    setShortcutFormName('');
    setShortcutFormUrl('');
    setShortcutFormCategory('General');
    setEditingShortcutId(null);
    setIsAddingShortcut(true);
  };

  const handleOpenEditShortcut = (s: SidebarShortcut) => {
    setShortcutFormName(s.name);
    setShortcutFormUrl(s.url);
    setShortcutFormCategory(s.category);
    setEditingShortcutId(s.id);
    setIsAddingShortcut(true);
  };

  const handleSaveShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcutFormName.trim() || !shortcutFormUrl.trim()) return;

    let validUrl = shortcutFormUrl.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    if (editingShortcutId) {
      // Edit existing
      setShortcuts((prev) =>
        prev.map((s) =>
          s.id === editingShortcutId
            ? { ...s, name: shortcutFormName.trim(), url: validUrl, category: shortcutFormCategory }
            : s
        )
      );
    } else {
      // Add new
      const newShortcut: SidebarShortcut = {
        id: `shortcut-${Date.now()}`,
        name: shortcutFormName.trim(),
        url: validUrl,
        category: shortcutFormCategory,
        iconColor: '#38BDF8',
      };
      setShortcuts((prev) => [...prev, newShortcut]);
    }

    setIsAddingShortcut(false);
    setEditingShortcutId(null);
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMoveShortcut = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= shortcuts.length) return;
    const updated = [...shortcuts];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setShortcuts(updated);
  };

  const handleOpenWebsite = (s: SidebarShortcut) => {
    window.open(s.url, '_blank', 'noopener,noreferrer');
  };

  // 3. Quick Notes
  const [noteText, setNoteText] = useState<string>(() => {
    try {
      return localStorage.getItem('liquid_dashboard_quick_notes') || localStorage.getItem('macbook_dashboard_quick_notes') || '';
    } catch {
      return '';
    }
  });
  const [copiedNote, setCopiedNote] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_quick_notes', noteText);
    } catch (e) {
      console.error('Error saving notes', e);
    }
  }, [noteText]);

  const handleCopyNote = () => {
    navigator.clipboard.writeText(noteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // 4. To-Do List
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_dashboard_todos') || localStorage.getItem('macbook_dashboard_todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading todos', e);
    }
    return [
      { id: '1', text: 'Review quarterly goals & projects', completed: false, createdAt: Date.now() },
      { id: '2', text: 'Customize Liquid Glass Clock styling', completed: true, createdAt: Date.now() },
      { id: '3', text: 'Organize favorite application dock', completed: false, createdAt: Date.now() },
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('liquid_dashboard_todos', JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos', e);
    }
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // 5. Interactive Calendar
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // 6. Weather Widget
  const [weatherUnit, setWeatherUnit] = useState<'C' | 'F'>(() => {
    return ((localStorage.getItem('liquid_dashboard_weather_unit') || localStorage.getItem('macbook_dashboard_weather_unit')) as 'C' | 'F') || 'C';
  });
  const [weatherCity, setWeatherCity] = useState<string>(() => {
    return localStorage.getItem('liquid_dashboard_weather_city') || localStorage.getItem('macbook_dashboard_weather_city') || 'San Francisco, CA';
  });
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [cityInput, setCityInput] = useState(weatherCity);

  const toggleWeatherUnit = () => {
    const next = weatherUnit === 'C' ? 'F' : 'C';
    setWeatherUnit(next);
    localStorage.setItem('liquid_dashboard_weather_unit', next);
  };

  const handleSaveCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setWeatherCity(cityInput.trim());
      localStorage.setItem('liquid_dashboard_weather_city', cityInput.trim());
    }
    setIsEditingCity(false);
  };

  const tempDisplay = weatherUnit === 'C' ? '21°C' : '70°F';
  const highLowDisplay = weatherUnit === 'C' ? 'H: 24° L: 16°' : 'H: 75° L: 61°';

  // Position classes
  const isLeft = settings.position === 'left';
  const isCollapsed = settings.isCollapsed;

  return (
    <>
      {/* 
        PREMIUM MACBOOK LIQUID GLASS SIDEBAR:
        - Positionable on LEFT or RIGHT.
        - Smoothly animated collapse and expansion.
        - Fluid layout integration with persistence.
      */}
      <aside
        className={`fixed top-3 bottom-3 z-40 transition-all duration-300 ease-in-out select-none flex flex-col ${
          isLeft ? 'left-3' : 'right-3'
        } ${isCollapsed ? 'w-14' : 'w-80 sm:w-84'}`}
      >
        <div className="relative w-full h-full rounded-[28px] apple-liquid-glass-elevated border border-white/20 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl">
          {/* Subtle Meniscus Refraction */}
          <div className="apple-glass-meniscus pointer-events-none" />
          <div className="apple-glass-rim pointer-events-none" />

          {/* ==========================================================
              COLLAPSED STATE VIEW (Slim vertical icon launcher strip)
              ========================================================== */}
          {isCollapsed ? (
            <div className="relative z-10 w-full h-full py-4 flex flex-col items-center justify-between text-white/70">
              {/* Expand Toggle Button */}
              <button
                onClick={toggleCollapsed}
                title="Expand Sidebar"
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10 shadow-sm hover:scale-105"
              >
                {isLeft ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              {/* Quick Tab Icon Launchers */}
              <div className="flex flex-col items-center gap-3 w-full px-2">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Dashboard Top"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('shortcuts')}
                  title="Website Shortcuts"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  title="Quick Notes"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('todo')}
                  title="To-Do Tasks"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer relative"
                >
                  <CheckSquare className="w-4 h-4" />
                  {todos.filter((t) => !t.completed).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('widgets')}
                  title="Weather & Calendar"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <CloudSun className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Utility Icons */}
              <div className="flex flex-col items-center gap-2.5">
                <button
                  onClick={togglePosition}
                  title={`Move to ${isLeft ? 'Right' : 'Left'}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {isLeft ? <PanelRightClose className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>

                <button
                  onClick={onOpenSettings}
                  title="Dashboard Preferences"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================================
               EXPANDED SIDEBAR VIEW (Full Liquid Glass Modular Dashboard)
               ========================================================== */
            <div className="relative z-10 w-full h-full flex flex-col text-white">
              {/* 1. Header Bar: Title, Position Switcher, and Collapse Button */}
              <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  <span className="text-sm font-semibold tracking-tight text-white/95">
                    Dashboard Hub
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Position Toggle (Left ↔ Right) */}
                  <button
                    onClick={togglePosition}
                    title={`Dock to ${isLeft ? 'Right' : 'Left'} side`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
                  >
                    {isLeft ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
                  </button>

                  {/* Collapse Button */}
                  <button
                    onClick={toggleCollapsed}
                    title="Collapse Sidebar"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
                  >
                    {isLeft ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2. Modular Segmented Tabs Bar */}
              <div className="p-2 border-b border-white/5">
                <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs gap-1">
                  {[
                    { id: 'all', label: 'Overview' },
                    { id: 'shortcuts', label: 'Links' },
                    { id: 'notes', label: 'Notes' },
                    { id: 'todo', label: 'Tasks' },
                    { id: 'widgets', label: 'Widgets' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all cursor-pointer font-medium truncate ${
                        settings.activeTab === tab.id
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Scrollable Sidebar Content Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                {/* TAB 1: OVERVIEW (ALL USEFUL WIDGETS AT A GLANCE) */}
                {settings.activeTab === 'all' && (
                  <div className="space-y-3.5">
                    {/* Quick Launchpad Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer text-left"
                      >
                        <Home className="w-4 h-4 text-purple-300" />
                        <div>
                          <span className="font-medium text-white/90 block">Dashboard</span>
                          <span className="text-[10px] text-white/40 block">Scroll to top</span>
                        </div>
                      </button>

                      <button
                        onClick={onOpenSearch}
                        className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer text-left"
                      >
                        <Search className="w-4 h-4 text-cyan-300" />
                        <div>
                          <span className="font-medium text-white/90 block">Spotlight</span>
                          <span className="text-[10px] text-white/40 block">⌘K Search</span>
                        </div>
                      </button>
                    </div>

                    {/* Weather & Date Card */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <CloudSun className="w-4 h-4 text-amber-300" />
                          <span className="font-medium text-white/90">{weatherCity}</span>
                        </div>
                        <button
                          onClick={toggleWeatherUnit}
                          className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-mono transition-colors cursor-pointer text-white/80"
                        >
                          {weatherUnit === 'C' ? '°C' : '°F'}
                        </button>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-2xl font-light tracking-tight text-white">{tempDisplay}</span>
                        <span className="text-[11px] text-white/50">Partly Cloudy · {highLowDisplay}</span>
                      </div>
                    </div>

                    {/* Quick Website Shortcuts Carousel/List */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-white/60 px-0.5">
                        <span>Favorite Websites</span>
                        <button
                          onClick={() => setActiveTab('shortcuts')}
                          className="hover:text-white transition-colors cursor-pointer underline text-[10px]"
                        >
                          View all ({shortcuts.length})
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {shortcuts.slice(0, 4).map((s) => (
                          <div
                            key={s.id}
                            onClick={() => handleOpenWebsite(s)}
                            className="group flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
                          >
                            <span className="font-medium text-white/90 truncate">{s.name}</span>
                            <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white/80 shrink-0 ml-1 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recently Used Applications (if any) */}
                    {recentApps.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-white/60 block px-0.5">Recently Launched</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {recentApps.slice(0, 5).map((app) => (
                            <button
                              key={app.id}
                              onClick={() => {
                                onLaunchApp(app);
                                onTrackRecent(app);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer shrink-0"
                            >
                              <span className="text-xs text-white/90">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Notes Scratchpad Preview */}
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span className="flex items-center gap-1.5 font-medium text-white/80">
                          <FileText className="w-3.5 h-3.5 text-purple-300" />
                          <span>Quick Scratchpad</span>
                        </span>
                        <button
                          onClick={() => setActiveTab('notes')}
                          className="hover:text-white transition-colors cursor-pointer underline text-[10px]"
                        >
                          Full Note
                        </button>
                      </div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type any quick thoughts, clipboard text, or URLs..."
                        rows={3}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none font-sans"
                      />
                    </div>

                    {/* Active To-Do Checklist Preview */}
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span className="flex items-center gap-1.5 font-medium text-white/80">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Today's Priorities</span>
                        </span>
                        <span className="text-[10px] text-white/40">
                          {todos.filter((t) => !t.completed).length} pending
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {todos.slice(0, 3).map((todo) => (
                          <div
                            key={todo.id}
                            onClick={() => handleToggleTodo(todo.id)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                todo.completed
                                  ? 'bg-purple-600 border-purple-400'
                                  : 'border-white/30 bg-transparent'
                              }`}
                            >
                              {todo.completed && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span
                              className={`text-[11px] truncate ${
                                todo.completed ? 'line-through text-white/40' : 'text-white/85'
                              }`}
                            >
                              {todo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: FULL WEBSITE SHORTCUTS MANAGER */}
                {settings.activeTab === 'shortcuts' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Website Shortcuts</span>
                        <span className="text-[10px] text-white/45">Quick links to favourite sites</span>
                      </div>
                      <button
                        onClick={handleOpenAddShortcut}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Inline Add / Edit Form Modal */}
                    {isAddingShortcut && (
                      <form
                        onSubmit={handleSaveShortcut}
                        className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2.5 animate-in fade-in duration-200"
                      >
                        <span className="font-medium text-white block text-xs">
                          {editingShortcutId ? 'Edit Website Shortcut' : 'New Website Shortcut'}
                        </span>
                        <div>
                          <label className="text-[10px] text-white/50 block mb-0.5">Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. GitHub"
                            value={shortcutFormName}
                            onChange={(e) => setShortcutFormName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 block mb-0.5">Website URL</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. https://github.com"
                            value={shortcutFormUrl}
                            onChange={(e) => setShortcutFormUrl(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddingShortcut(false)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Shortcuts List */}
                    <div className="space-y-1.5">
                      {shortcuts.map((shortcut, index) => (
                        <div
                          key={shortcut.id}
                          className="group flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all"
                        >
                          <div
                            onClick={() => handleOpenWebsite(shortcut)}
                            className="flex-1 flex items-center gap-2 cursor-pointer min-w-0 mr-2"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-xs font-semibold shrink-0 text-white/90">
                              {shortcut.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <span className="font-medium text-white/90 block truncate">{shortcut.name}</span>
                              <span className="text-[10px] text-white/40 block truncate">{shortcut.url}</span>
                            </div>
                          </div>

                          {/* Quick Actions (Move, Edit, Delete) */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleMoveShortcut(index, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveShortcut(index, 'down')}
                              disabled={index === shortcuts.length - 1}
                              title="Move Down"
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleOpenEditShortcut(shortcut)}
                              title="Edit"
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteShortcut(shortcut.id)}
                              title="Delete"
                              className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: NOTES / QUICK NOTES */}
                {settings.activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Quick Notes</span>
                        <span className="text-[10px] text-white/45">Saved automatically</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleCopyNote}
                          title="Copy text to clipboard"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white/80 transition-colors cursor-pointer"
                        >
                          {copiedNote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedNote ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => setNoteText('')}
                          title="Clear notes"
                          className="p-1 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Start writing notes, ideas, code snippets, or links here..."
                      rows={14}
                      className="w-full bg-black/40 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none font-sans leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-[10px] text-white/40 px-1">
                      <span>{noteText.length} characters</span>
                      <span>{noteText.trim() ? noteText.trim().split(/\s+/).length : 0} words</span>
                    </div>
                  </div>
                )}

                {/* TAB 4: TO-DO CHECKLIST */}
                {settings.activeTab === 'todo' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Task List</span>
                        <span className="text-[10px] text-white/45">
                          {todos.filter((t) => !t.completed).length} incomplete tasks
                        </span>
                      </div>
                      {todos.some((t) => t.completed) && (
                        <button
                          onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
                          className="text-[10px] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                        >
                          Clear completed
                        </button>
                      )}
                    </div>

                    {/* Add Todo Input */}
                    <form onSubmit={handleAddTodo} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Todo Items */}
                    <div className="space-y-1.5">
                      {todos.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-white/40 text-xs">
                          No tasks yet. Add one above!
                        </div>
                      ) : (
                        todos.map((todo) => (
                          <div
                            key={todo.id}
                            className="group flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-colors"
                          >
                            <div
                              onClick={() => handleToggleTodo(todo.id)}
                              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer mr-2"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                  todo.completed
                                    ? 'bg-purple-600 border-purple-400'
                                    : 'border-white/30 bg-transparent'
                                }`}
                              >
                                {todo.completed && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span
                                className={`text-xs break-words leading-tight ${
                                  todo.completed ? 'line-through text-white/35' : 'text-white/90'
                                }`}
                              >
                                {todo.text}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              title="Delete task"
                              className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: WEATHER & CALENDAR WIDGETS */}
                {settings.activeTab === 'widgets' && (
                  <div className="space-y-4">
                    {/* Detailed Weather Card */}
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {isEditingCity ? (
                            <form onSubmit={handleSaveCity} className="flex items-center gap-1">
                              <input
                                type="text"
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                className="px-2 py-0.5 rounded bg-black/50 border border-white/20 text-xs text-white"
                                placeholder="City name"
                                autoFocus
                              />
                              <button
                                type="submit"
                                className="px-2 py-0.5 rounded bg-purple-600 text-[10px] text-white"
                              >
                                Save
                              </button>
                            </form>
                          ) : (
                            <div
                              onClick={() => {
                                setCityInput(weatherCity);
                                setIsEditingCity(true);
                              }}
                              className="flex items-center gap-1.5 cursor-pointer group"
                              title="Click to edit location"
                            >
                              <span className="font-semibold text-white/90 text-sm">{weatherCity}</span>
                              <Edit2 className="w-3 h-3 text-white/30 group-hover:text-white/80 transition-colors" />
                            </div>
                          )}
                          <span className="text-[10px] text-white/45 block mt-0.5">Live Conditions</span>
                        </div>
                        <button
                          onClick={toggleWeatherUnit}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors cursor-pointer text-white"
                        >
                          {weatherUnit === 'C' ? '°C' : '°F'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3">
                          <CloudSun className="w-8 h-8 text-amber-300" />
                          <div>
                            <span className="text-3xl font-light text-white block leading-none">{tempDisplay}</span>
                            <span className="text-[11px] text-white/60 block mt-1">Partly Cloudy</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-white/50 space-y-0.5">
                          <div>{highLowDisplay}</div>
                          <div>Humidity: 58%</div>
                          <div>Wind: 8 mph</div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Mini Calendar */}
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">
                          {monthNames[currentMonth]} {currentYear}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePrevMonth}
                            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleNextMonth}
                            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Day Names Header */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-white/40">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: firstDayIndex }).map((_, i) => (
                          <div key={`empty-${i}`} className="p-1.5" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const isToday =
                            dayNum === new Date().getDate() &&
                            currentMonth === new Date().getMonth() &&
                            currentYear === new Date().getFullYear();
                          const isSelected = dayNum === selectedDay;

                          return (
                            <button
                              key={`day-${dayNum}`}
                              onClick={() => setSelectedDay(dayNum)}
                              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                                isToday
                                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                  : isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Bottom Quick Settings & System Links */}
              <div className="p-3 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs text-white/70">
                <button
                  onClick={togglePosition}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {isLeft ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
                  <span>{isLeft ? 'Dock Right' : 'Dock Left'}</span>
                </button>

                <button
                  onClick={onOpenSettings}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
