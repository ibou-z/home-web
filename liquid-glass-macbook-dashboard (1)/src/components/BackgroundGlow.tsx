import React from 'react';
import { BackgroundPreset } from '../types';

interface BackgroundGlowProps {
  preset: BackgroundPreset;
  customColors?: { c1: string; c2: string; c3: string; c4: string };
  useCustomBg: boolean;
  intensity: number; // 0.2 to 1.0
  speed: number; // 0.2 to 2.0
  animationsEnabled: boolean;
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  preset,
  customColors,
  useCustomBg,
  intensity,
  speed,
  animationsEnabled,
}) => {
  const c1 = useCustomBg && customColors ? customColors.c1 : preset.c1;
  const c2 = useCustomBg && customColors ? customColors.c2 : preset.c2;
  const c3 = useCustomBg && customColors ? customColors.c3 : preset.c3;
  const c4 = useCustomBg && customColors ? customColors.c4 : preset.c4;

  const durationMultiplier = speed > 0 ? 1 / speed : 1;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 bg-[#04060A]">
      {/* Deep foundation vignette gradient */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 30%, rgba(3, 5, 8, 0.7) 70%, #030508 100%)'
        }}
      />

      {/* Fluid Glowing Orb 1 (Top Right - Electric Blue / Cyan) */}
      <div
        className={`absolute -top-32 -right-32 w-[650px] md:w-[950px] h-[650px] md:h-[950px] rounded-full filter blur-[100px] md:blur-[140px] ${
          animationsEnabled ? 'animate-orb-1' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${c1} 0%, ${c1}60 40%, transparent 70%)`,
          opacity: 0.7 * intensity,
          animationDuration: `${24 * durationMultiplier}s`,
        }}
      />

      {/* Fluid Glowing Orb 2 (Bottom Left - Deep Purple / Violet) */}
      <div
        className={`absolute -bottom-48 -left-48 w-[600px] md:w-[900px] h-[600px] md:h-[900px] rounded-full filter blur-[110px] md:blur-[150px] ${
          animationsEnabled ? 'animate-orb-2' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${c2} 0%, ${c2}60 40%, transparent 70%)`,
          opacity: 0.65 * intensity,
          animationDuration: `${28 * durationMultiplier}s`,
        }}
      />

      {/* Fluid Glowing Orb 3 (Center Top / Clock Ambient - Magenta / Pink) */}
      <div
        className={`absolute top-[10%] left-[25%] w-[500px] md:w-[750px] h-[450px] md:h-[600px] rounded-full filter blur-[90px] md:blur-[130px] ${
          animationsEnabled ? 'animate-orb-3' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${c3} 0%, ${c3}50 45%, transparent 70%)`,
          opacity: 0.55 * intensity,
          animationDuration: `${22 * durationMultiplier}s`,
        }}
      />

      {/* Fluid Glowing Orb 4 (Center Bottom - Accent Cyan / Highlight) */}
      <div
        className="absolute bottom-[10%] right-[20%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full filter blur-[80px] md:blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${c4} 0%, ${c4}40 40%, transparent 70%)`,
          opacity: 0.45 * intensity,
        }}
      />

      {/* Fine Liquid Glass Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
