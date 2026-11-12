import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, Wifi, BatteryCharging, Volume2, Download } from 'lucide-react';

interface TopBarProps {
  onOpenSearch: () => void;
  onOpenAddApp: () => void;
  onOpenSettings: () => void;
  onResetLayout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onOpenAddApp,
  onOpenSettings,
  onResetLayout,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isCharging, setIsCharging] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = days[now.getDay()];
      const date = now.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      setCurrentTime(`${day} ${month} ${date}  ${displayHours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Try reading battery if available in browser
  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sm:text-sm text-white/90 select-none backdrop-blur-xl bg-black/35 border-b border-white/10">
      {/* Left Zone: System Menu & Navigation Items */}
      <div className="flex items-center gap-4 sm:gap-6 relative">
        <div className="relative">
          <button
            onClick={() => setAppleMenuOpen(!appleMenuOpen)}
            className="p-1 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-white/10"
            title="System Menu"
          >
            {/* Neutral Futuristic Core Icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </button>

          {/* System Dropdown Menu */}
          {appleMenuOpen && (
            <div 
              className="absolute left-0 top-full mt-2 w-56 apple-liquid-glass-elevated rounded-2xl py-1.5 z-50 text-xs shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
              onMouseLeave={() => setAppleMenuOpen(false)}
            >
              <div className="apple-glass-meniscus" />
              <div className="apple-glass-rim" />
              <div className="relative z-10 px-3.5 py-2 font-medium text-white/90 border-b border-white/10 flex items-center justify-between">
                <span>Desktop System</span>
                <span className="text-[10px] text-white/50">Liquid Glass OS</span>
              </div>
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onOpenSettings();
                }}
                className="relative z-10 w-full text-left px-3.5 py-2 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              >
                Dashboard Preferences...
              </button>
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onOpenAddApp();
                }}
                className="relative z-10 w-full text-left px-3.5 py-2 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              >
                Add Application Tile...
              </button>
              <a
                href="/liquid-glass-dashboard.zip"
                download="liquid-glass-dashboard.zip"
                onClick={() => setAppleMenuOpen(false)}
                className="relative z-10 w-full text-left px-3.5 py-2 hover:bg-white/15 text-white/80 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Export Project (ZIP)</span>
                <Download className="w-3.5 h-3.5 text-purple-400" />
              </a>
              <div className="relative z-10 my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onResetLayout();
                }}
                className="relative z-10 w-full text-left px-3.5 py-2 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors"
              >
                Restore Default Layout
              </button>
            </div>
          )}
        </div>

        <span className="font-semibold text-white tracking-tight hidden sm:inline">
          Liquid Glass Dashboard
        </span>
        <button
          onClick={onOpenAddApp}
          className="text-white/70 hover:text-white transition-colors hidden md:flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add App</span>
        </button>
        <button
          onClick={onResetLayout}
          className="text-white/50 hover:text-white/80 transition-colors hidden lg:inline cursor-pointer"
        >
          Reset Layout
        </button>
      </div>

      {/* Right Zone: System Status & Controls */}
      <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
        {/* Spotlight Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white cursor-pointer"
          title="Search Applications (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans text-xs">Search</span>
          <kbd className="hidden md:inline-block px-1 bg-black/40 rounded text-[10px] text-white/60">⌘K</kbd>
        </button>

        {/* Status Icons */}
        <div className="flex items-center gap-2.5 text-white/70">
          <span title="Wi-Fi: Connected" className="flex items-center">
            <Wifi className="w-3.5 h-3.5" />
          </span>
          <span title="Audio: Standard" className="flex items-center">
            <Volume2 className="w-3.5 h-3.5" />
          </span>
          <div className="flex items-center gap-1" title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}>
            <span className="text-[11px] font-sans">{batteryLevel}%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Small Clock in menu bar */}
        <span className="text-white/80 font-medium tracking-tight font-sans hidden sm:inline whitespace-nowrap">
          {currentTime}
        </span>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
          title="Dashboard Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
