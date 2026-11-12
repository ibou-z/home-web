import { RgbColor } from '../types';

export function isValidRgb(rgb?: unknown): rgb is RgbColor {
  return (
    typeof rgb === 'object' &&
    rgb !== null &&
    'r' in rgb &&
    'g' in rgb &&
    'b' in rgb &&
    typeof (rgb as RgbColor).r === 'number' &&
    typeof (rgb as RgbColor).g === 'number' &&
    typeof (rgb as RgbColor).b === 'number' &&
    !isNaN((rgb as RgbColor).r) &&
    !isNaN((rgb as RgbColor).g) &&
    !isNaN((rgb as RgbColor).b)
  );
}

export function hexToRgb(hex: string): RgbColor {
  if (!hex || typeof hex !== 'string') {
    return { r: 255, g: 255, b: 255 };
  }
  const cleanHex = hex.replace('#', '').trim();
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(fullHex, 16);
  if (isNaN(num) || fullHex.length < 6) {
    return { r: 255, g: 255, b: 255 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RgbColor): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Adjust saturation and intensity of an RGB color.
 * Preserves exact values when saturation and intensity are 1.0.
 */
export function adjustColor(
  rgb: RgbColor,
  saturation: number = 1.0,
  intensity: number = 1.0
): RgbColor {
  if (
    (saturation === 1.0 || saturation === undefined) &&
    (intensity === 1.0 || intensity === undefined)
  ) {
    return rgb;
  }

  // Handle pure black specifically
  if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
    if (intensity === 1.0) return rgb;
    const v = Math.max(0, Math.min(255, Math.round(intensity > 1.0 ? (intensity - 1.0) * 120 : 0)));
    return { r: v, g: v, b: v };
  }

  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Apply saturation and intensity/lightness
  s = Math.max(0, Math.min(1, s * saturation));
  l = Math.max(0, Math.min(1, l * intensity));

  // Convert HSL back to RGB
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}
