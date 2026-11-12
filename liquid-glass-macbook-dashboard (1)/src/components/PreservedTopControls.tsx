import React, { useState, useEffect } from 'react';
import { Search, Wifi, BatteryCharging } from 'lucide-react';

interface PreservedTopControlsProps {
  onOpenSearch: () => void;
  onResetLayout: () => void;
}

export const PreservedTopControls: React.FC<PreservedTopControlsProps> = ({
  onOpenSearch,
  onResetLayout,
}) => {
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isCharging, setIsCharging] = useState<boolean>(true);

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
    <div className="w-full px-4 sm:px-8 py-3 flex items-center justify-between text-xs sm:text-sm text-white/90 select-none z-30 pointer-events-auto">
      {/* 1. Left Element: Reset Layout Button in exact position */}
      <div className="flex items-center">
        <button
          onClick={onResetLayout}
          className="text-white/50 hover:text-white/90 transition-colors cursor-pointer text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/10"
          title="Restore original 10 applications layout"
        >
          Reset Layout
        </button>
      </div>

      {/* 2, 3, 4. Right Elements: Search Bar, Wi-Fi, Battery in exact positions */}
      <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
        {/* Search Bar / Spotlight Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white cursor-pointer"
          title="Search Applications (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans text-xs">Search</span>
          <kbd className="hidden md:inline-block px-1 bg-black/40 rounded text-[10px] text-white/60">⌘K</kbd>
        </button>

        {/* Wi-Fi & Battery Status Indicators */}
        <div className="flex items-center gap-2.5 text-white/70">
          <span title="Wi-Fi: Connected" className="flex items-center">
            <Wifi className="w-3.5 h-3.5" />
          </span>
          <div className="flex items-center gap-1" title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}>
            <span className="text-[11px] font-sans">{batteryLevel}%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
