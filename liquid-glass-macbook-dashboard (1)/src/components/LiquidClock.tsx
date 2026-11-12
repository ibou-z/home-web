import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ClockGlassSettings } from '../types';
import { adjustColor, hexToRgb, isValidRgb } from '../utils/colorUtils';

interface LiquidClockProps {
  is24Hour: boolean;
  showSeconds: boolean;
  userName?: string;
  customGreeting?: string;
  clockSettings: ClockGlassSettings;
  onOpenSettings?: () => void;
  isLivePreview?: boolean;
}

export const LiquidClock: React.FC<LiquidClockProps> = ({
  is24Hour,
  showSeconds,
  userName = 'Ibrahim',
  customGreeting = '',
  clockSettings,
  onOpenSettings,
  isLivePreview = false,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [prevMinutes, setPrevMinutes] = useState<string>('');
  const [isDigitAnimating, setIsDigitAnimating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const m = now.getMinutes().toString().padStart(2, '0');
      if (m !== prevMinutes) {
        setPrevMinutes(m);
        if (clockSettings.animation && clockSettings.animation !== 'none') {
          setIsDigitAnimating(true);
          setTimeout(() => setIsDigitAnimating(false), 550);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [prevMinutes, clockSettings.animation]);

  const hoursRaw = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  let displayHours = hoursRaw;
  let ampm = '';

  if (!is24Hour) {
    ampm = hoursRaw >= 12 ? 'PM' : 'AM';
    displayHours = hoursRaw % 12 || 12;
  }

  const hoursFormatted = displayHours.toString().padStart(is24Hour ? 2 : 1, '0');

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    if (customGreeting && customGreeting.trim()) {
      return customGreeting;
    }
    if (hoursRaw >= 5 && hoursRaw < 12) return 'Good morning';
    if (hoursRaw >= 12 && hoursRaw < 17) return 'Good afternoon';
    if (hoursRaw >= 17 && hoursRaw < 22) return 'Good evening';
    return 'Good night';
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayName = dayNames[time.getDay()];
  const dateNum = time.getDate();
  const monthName = monthNames[time.getMonth()];

  // Resolve and adjust full spectrum colors accurately
  const resolvedColors = useMemo(() => {
    // 1. Main Glass RGB - strictly check validity so pure black {r:0,g:0,b:0} is preserved!
    let baseGlassRgb = clockSettings.glassColorRgb;
    if (!isValidRgb(baseGlassRgb)) {
      baseGlassRgb = hexToRgb(clockSettings.glassColorHex || clockSettings.customColor || '#FFFFFF');
    }
    // Apply saturation and intensity (short-circuits when both are 1.0)
    const glassRgb = adjustColor(
      baseGlassRgb,
      clockSettings.glassSaturation ?? 1.0,
      clockSettings.glassIntensity ?? 1.0
    );

    // 2. Highlights RGB
    let highlightRgb = clockSettings.highlightColorRgb;
    if (!isValidRgb(highlightRgb)) {
      highlightRgb = hexToRgb(clockSettings.highlightColorHex || '#FFFFFF');
    }

    // 3. Reflection RGB
    let reflectionRgb = clockSettings.reflectionColorRgb;
    if (!isValidRgb(reflectionRgb)) {
      reflectionRgb = hexToRgb(clockSettings.reflectionColorHex || '#FFFFFF');
    }

    // 4. Glow RGB
    let glowRgb = clockSettings.glowColorRgb;
    if (!isValidRgb(glowRgb)) {
      glowRgb = hexToRgb(clockSettings.glowColorHex || clockSettings.glowColor || '#FFFFFF');
    }

    return {
      glass: glassRgb,
      highlight: highlightRgb,
      reflection: reflectionRgb,
      glow: glowRgb,
    };
  }, [
    clockSettings.glassColorRgb,
    clockSettings.glassColorHex,
    clockSettings.customColor,
    clockSettings.glassSaturation,
    clockSettings.glassIntensity,
    clockSettings.highlightColorRgb,
    clockSettings.highlightColorHex,
    clockSettings.reflectionColorRgb,
    clockSettings.reflectionColorHex,
    clockSettings.glowColorRgb,
    clockSettings.glowColorHex,
    clockSettings.glowColor,
  ]);

  // Optical physics calculation for Liquid Glass text
  const glassStyles = useMemo(() => {
    const {
      transparency = 0.75,
      thickness = 1.0,
      fontWeight = '200',
      fontSize = 1.0,
      highlightEnabled = true,
      highlightIntensity = 1.0,
      highlightOpacity = 0.85,
      reflectionEnabled = true,
      reflectionIntensity = 0.65,
      glowEnabled = true,
      glowIntensity = 0.25,
      glowRadius = 18,
      spacing = -0.045,
    } = clockSettings;

    const g = resolvedColors.glass;
    const h = resolvedColors.highlight;
    const r = resolvedColors.reflection;
    const w = resolvedColors.glow;

    const baseAlpha = Math.min(Math.max(transparency, 0.05), 1.0);

    // Edge highlight (specular stroke) calculation
    const showHighlight = highlightEnabled && highlightOpacity > 0 && thickness > 0;
    const strokeWidth = (thickness * 0.22).toFixed(2);
    const strokeAlpha = Math.min(highlightOpacity * highlightIntensity * 0.75, 0.95);
    const webkitTextStroke = showHighlight
      ? `${strokeWidth}px rgba(${h.r}, ${h.g}, ${h.b}, ${strokeAlpha})`
      : '0px transparent';

    // PURE GLASS FILL GRADIENT:
    // Every single stop is purely composed of g.r, g.g, g.b!
    // No white patches, no foreign highlight colors inside the text fill!
    // Optical translucency variation simulates light transmission through curved optical glass:
    const heroGradient = `linear-gradient(180deg, 
      rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 1.0, 1.0)}) 0%, 
      rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.82, 0.95)}) 25%, 
      rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.45, 0.75)}) 65%, 
      rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.78, 0.9)}) 100%)`;

    // Drop shadows for dimensional depth without white contamination
    const dropShadows = [
      '0 4px 18px rgba(0, 0, 0, 0.75)',
      '0 14px 34px rgba(0, 0, 0, 0.5)',
      glowEnabled && glowIntensity > 0 && glowRadius > 0
        ? `0 0 ${glowRadius}px rgba(${w.r}, ${w.g}, ${w.b}, ${(glowIntensity * 0.6).toFixed(2)})`
        : '',
      reflectionEnabled && reflectionIntensity > 0
        ? `0 0 16px rgba(${r.r}, ${r.g}, ${r.b}, ${(reflectionIntensity * 0.2).toFixed(2)})`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    return {
      hero: {
        backgroundImage: heroGradient,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        WebkitTextStroke: webkitTextStroke,
        filter: dropShadows,
        letterSpacing: `${spacing}em`,
        fontWeight: fontWeight,
      },
      subhead: {
        backgroundImage: `linear-gradient(180deg, 
          rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.95, 1.0)}) 0%, 
          rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.7, 0.85)}) 50%, 
          rgba(${g.r}, ${g.g}, ${g.b}, ${Math.min(baseAlpha * 0.45, 0.6)}) 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        WebkitTextStroke: showHighlight
          ? `${(thickness * 0.15).toFixed(2)}px rgba(${h.r}, ${h.g}, ${h.b}, ${(strokeAlpha * 0.5).toFixed(2)})`
          : '0px transparent',
        filter: [
          'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.7))',
          glowEnabled && glowIntensity > 0
            ? `drop-shadow(0 0 12px rgba(${w.r}, ${w.g}, ${w.b}, ${(glowIntensity * 0.35).toFixed(2)}))`
            : '',
        ]
          .filter(Boolean)
          .join(' '),
      },
      fontSizeMultiplier: fontSize,
      rawGlassColor: g,
    };
  }, [clockSettings, resolvedColors]);

  // Scaled responsive font sizes
  const heroFontSizeClass = useMemo(() => {
    const s = glassStyles.fontSizeMultiplier;
    if (s <= 0.8) return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl';
    if (s <= 0.95) return 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem]';
    if (s <= 1.1) return 'text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem]';
    if (s <= 1.25) return 'text-8xl sm:text-[10rem] md:text-[12rem] lg:text-[14.5rem]';
    return 'text-9xl sm:text-[11rem] md:text-[13.5rem] lg:text-[16rem]';
  }, [glassStyles.fontSizeMultiplier]);

  // Digit transition animation class
  const animClass = useMemo(() => {
    if (!isDigitAnimating) return '';
    switch (clockSettings.animation) {
      case 'fade':
        return 'animate-[fadeIn_0.5s_ease-out]';
      case 'slide':
        return 'animate-[slideDown_0.45s_cubic-bezier(0.16,1,0.3,1)]';
      case 'liquid':
        return 'animate-[liquidPulse_0.6s_cubic-bezier(0.16,1,0.3,1)]';
      default:
        return '';
    }
  }, [isDigitAnimating, clockSettings.animation]);

  const g = glassStyles.rawGlassColor;

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none cursor-default relative ${
        isLivePreview ? 'py-4' : 'pt-4 sm:pt-8 pb-6 sm:pb-10 px-4'
      }`}
    >
      {/* 
        AUTHENTIC APPLE IPHONE LIQUID GLASS LOCKSCREEN CLOCK:
        - Floating directly over the animated background.
        - ZERO glass container, card, or panel.
        - 100% pure selected glass color rendering with zero unwanted white patches.
        - Independent edge highlights, reflections, and glow.
      */}

      {/* 1. Large Digital Time Display */}
      <div className={`relative flex items-baseline justify-center leading-none ${animClass}`}>
        <div className={`flex items-center ${heroFontSizeClass} tabular-nums font-sans`}>
          {/* Hours */}
          <span
            style={glassStyles.hero}
            className="inline-block transition-transform duration-200 hover:scale-[1.008]"
          >
            {hoursFormatted}
          </span>

          {/* Liquid Glass Colon */}
          <span
            style={{
              ...glassStyles.hero,
              letterSpacing: '0.02em',
            }}
            className="inline-block px-1 sm:px-2 -translate-y-2 sm:-translate-y-4 md:-translate-y-6 opacity-75 animate-[pulse_2.4s_ease-in-out_infinite]"
          >
            :
          </span>

          {/* Minutes */}
          <span
            style={glassStyles.hero}
            className="inline-block transition-transform duration-200 hover:scale-[1.008]"
          >
            {minutes}
          </span>
        </div>

        {/* Seconds Counter */}
        {showSeconds && (
          <span
            style={glassStyles.subhead}
            className="text-2xl sm:text-3xl md:text-5xl font-[300] tabular-nums font-mono ml-2 sm:ml-4 self-end mb-4 sm:mb-7 md:mb-10 opacity-80"
          >
            .{seconds}
          </span>
        )}

        {/* AM/PM Tag */}
        {!is24Hour && (
          <span
            style={glassStyles.subhead}
            className="text-xs sm:text-sm md:text-base font-light tracking-widest ml-2 sm:ml-3 self-start mt-3 sm:mt-6 opacity-90 uppercase"
          >
            {ampm}
          </span>
        )}
      </div>

      {/* 2. Floating Liquid Glass Date Display */}
      <div className="mt-2 sm:mt-4 flex items-center justify-center gap-2 text-base sm:text-xl md:text-2xl font-[350] tracking-[-0.015em]">
        <span style={glassStyles.subhead} className="font-normal">
          {dayName}
        </span>
        <span style={glassStyles.subhead} className="opacity-40">
          ·
        </span>
        <span style={glassStyles.subhead} className="font-light">
          {dateNum} {monthName}
        </span>
      </div>

      {/* 3. Floating Liquid Glass Greeting Display */}
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3">
        <div
          className="h-[1px] w-8 sm:w-16 transition-colors duration-300"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, rgba(${g.r}, ${g.g}, ${g.b}, 0.45), transparent)`,
          }}
        />
        <span
          style={glassStyles.subhead}
          className="text-sm sm:text-lg md:text-xl font-light tracking-wide"
        >
          {getGreeting()}{userName ? `, ${userName}` : ''}
        </span>
        <div
          className="h-[1px] w-8 sm:w-16 transition-colors duration-300"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(${g.r}, ${g.g}, ${g.b}, 0.45), transparent)`,
          }}
        />
      </div>

      {/* 4. Minimalist Status Indicator & Quick Customize Button */}
      {!isLivePreview && (
        <div className="mt-2.5 flex items-center justify-center gap-2.5 text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: `rgb(${g.r}, ${g.g}, ${g.b})`,
                boxShadow: `0 0 8px rgba(${g.r}, ${g.g}, ${g.b}, 0.8)`,
              }}
            />
            <span style={glassStyles.subhead} className="text-xs font-normal">
              Liquid Glass Core
            </span>
          </span>
          <span className="opacity-40">·</span>
          <button
            onClick={onOpenSettings}
            className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer font-light underline-offset-4 hover:underline"
          >
            Customize Clock
          </button>
        </div>
      )}
    </div>
  );
};
