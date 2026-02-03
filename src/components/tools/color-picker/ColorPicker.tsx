import { useState, useCallback, useRef, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import clsx from 'clsx';

// Color conversion utilities
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

interface SavedColor {
  hex: string;
  name?: string;
  savedAt: number;
}

// Conversion functions
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
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
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Palette generation functions
function getComplementary(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const complementHue = (hsl.h + 180) % 360;
  const complementRgb = hslToRgb(complementHue, hsl.s, hsl.l);
  return [hex, rgbToHex(complementRgb.r, complementRgb.g, complementRgb.b)];
}

function getTriadic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [hex];

  for (let i = 1; i <= 2; i++) {
    const newHue = (hsl.h + i * 120) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

function getAnalogous(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];

  for (let i = -2; i <= 2; i++) {
    const newHue = (hsl.h + i * 30 + 360) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

function getSplitComplementary(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [hex];

  const hue1 = (hsl.h + 150) % 360;
  const hue2 = (hsl.h + 210) % 360;

  const rgb1 = hslToRgb(hue1, hsl.s, hsl.l);
  const rgb2 = hslToRgb(hue2, hsl.s, hsl.l);

  colors.push(rgbToHex(rgb1.r, rgb1.g, rgb1.b));
  colors.push(rgbToHex(rgb2.r, rgb2.g, rgb2.b));

  return colors;
}

function getTetradic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [hex];

  for (let i = 1; i <= 3; i++) {
    const newHue = (hsl.h + i * 90) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

function getMonochromatic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];

  // Generate shades and tints
  const lightnesses = [10, 25, 40, 55, 70, 85];
  for (const l of lightnesses) {
    const newRgb = hslToRgb(hsl.h, hsl.s, l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

// Extract colors from image using canvas
function extractColorsFromImage(
  imageData: ImageData,
  numColors: number = 6
): string[] {
  const pixels: RGB[] = [];
  const data = imageData.data;

  // Sample pixels (skip some for performance)
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    pixels.push({ r, g, b });
  }

  // Simple color quantization using median cut algorithm approximation
  if (pixels.length === 0) return [];

  // Sort by brightness and divide into buckets
  const buckets: RGB[][] = [pixels];

  while (buckets.length < numColors && buckets.length > 0) {
    let largestBucket = buckets[0];
    let largestIndex = 0;

    for (let i = 1; i < buckets.length; i++) {
      if (buckets[i].length > largestBucket.length) {
        largestBucket = buckets[i];
        largestIndex = i;
      }
    }

    if (largestBucket.length < 2) break;

    // Find the channel with the largest range
    let maxRange = 0;
    let channel: 'r' | 'g' | 'b' = 'r';

    for (const c of ['r', 'g', 'b'] as const) {
      const values = largestBucket.map((p) => p[c]);
      const range = Math.max(...values) - Math.min(...values);
      if (range > maxRange) {
        maxRange = range;
        channel = c;
      }
    }

    // Sort by that channel and split
    largestBucket.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(largestBucket.length / 2);
    buckets[largestIndex] = largestBucket.slice(0, mid);
    buckets.push(largestBucket.slice(mid));
  }

  // Get average color of each bucket
  return buckets
    .filter((bucket) => bucket.length > 0)
    .map((bucket) => {
      const avg = bucket.reduce(
        (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
        { r: 0, g: 0, b: 0 }
      );
      return rgbToHex(
        Math.round(avg.r / bucket.length),
        Math.round(avg.g / bucket.length),
        Math.round(avg.b / bucket.length)
      );
    })
    .slice(0, numColors);
}

// Storage key for saved colors
const SAVED_COLORS_KEY = 'color-picker-saved-colors';

export function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'picker' | 'palettes' | 'contrast' | 'extract'>('picker');
  const [contrastBgColor, setContrastBgColor] = useState('#ffffff');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load saved colors from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(SAVED_COLORS_KEY);
      if (saved) {
        setSavedColors(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved colors:', e);
    }
  }, []);

  // Save colors to localStorage
  const saveColor = useCallback(() => {
    const newColor: SavedColor = {
      hex: color,
      savedAt: Date.now(),
    };
    const updated = [newColor, ...savedColors.filter((c) => c.hex !== color)].slice(0, 20);
    setSavedColors(updated);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(updated));
  }, [color, savedColors]);

  const removeSavedColor = useCallback((hex: string) => {
    const updated = savedColors.filter((c) => c.hex !== hex);
    setSavedColors(updated);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(updated));
  }, [savedColors]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  }, []);

  // Get all color formats
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const colorFormats = [
    { name: 'HEX', value: color.toUpperCase() },
    { name: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { name: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { name: 'HSV/HSB', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { name: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  // Palette types
  const palettes = [
    { name: 'Complementary', colors: getComplementary(color), description: 'Opposite colors on the wheel' },
    { name: 'Triadic', colors: getTriadic(color), description: 'Three colors equally spaced' },
    { name: 'Analogous', colors: getAnalogous(color), description: 'Adjacent colors' },
    { name: 'Split-Complementary', colors: getSplitComplementary(color), description: 'A color and two neighbors of its complement' },
    { name: 'Tetradic', colors: getTetradic(color), description: 'Four colors forming a rectangle' },
    { name: 'Monochromatic', colors: getMonochromatic(color), description: 'Shades and tints of one hue' },
  ];

  // Contrast checking
  const contrastRatio = getContrastRatio(color, contrastBgColor);
  const wcagAA = contrastRatio >= 4.5;
  const wcagAALarge = contrastRatio >= 3;
  const wcagAAA = contrastRatio >= 7;
  const wcagAAALarge = contrastRatio >= 4.5;

  // Export as CSS variables
  const exportAsCss = useCallback((colors: string[]) => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    copyToClipboard(css, 'css');
  }, [copyToClipboard]);

  // Export as Tailwind config
  const exportAsTailwind = useCallback((colors: string[]) => {
    const config = `// tailwind.config.js colors\ncolors: {\n  custom: {\n${colors.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join('\n')}\n  }\n}`;
    copyToClipboard(config, 'tailwind');
  }, [copyToClipboard]);

  // Handle image upload for color extraction
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize for performance
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImage(imageData);
        setExtractedColors(colors);
        setIsExtracting(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  }, []);

  const tabs = [
    { id: 'picker' as const, label: 'Color Picker' },
    { id: 'palettes' as const, label: 'Palettes' },
    { id: 'contrast' as const, label: 'Contrast Checker' },
    { id: 'extract' as const, label: 'Extract from Image' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all',
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Picker Tab */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Picker */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <HexColorPicker
                color={color}
                onChange={setColor}
                style={{ width: '100%', maxWidth: '300px', height: '200px' }}
              />
            </div>

            <div className="flex items-center gap-4 justify-center">
              <label htmlFor="hex-input" className="text-slate-300 font-medium">
                HEX:
              </label>
              <HexColorInput
                id="hex-input"
                color={color}
                onChange={setColor}
                prefixed
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveColor}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                aria-label="Save color to favorites"
              >
                Save
              </button>
            </div>

            {/* Color Preview */}
            <div
              className="w-full h-24 rounded-xl border border-slate-600 shadow-lg"
              style={{ backgroundColor: color }}
              aria-label={`Color preview: ${color}`}
            />
          </div>

          {/* Color Formats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Color Formats</h3>
            <div className="space-y-2">
              {colorFormats.map((format) => (
                <div
                  key={format.name}
                  className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                >
                  <div>
                    <span className="text-slate-400 text-sm">{format.name}</span>
                    <p className="text-white font-mono">{format.value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(format.value, format.name)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      copiedFormat === format.name
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    )}
                    aria-label={`Copy ${format.name} value`}
                  >
                    {copiedFormat === format.name ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Colors */}
      {activeTab === 'picker' && savedColors.length > 0 && (
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Saved Colors</h3>
          <div className="flex flex-wrap gap-2">
            {savedColors.map((saved) => (
              <div key={saved.hex} className="relative group">
                <button
                  onClick={() => setColor(saved.hex)}
                  className="w-12 h-12 rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-colors shadow-lg"
                  style={{ backgroundColor: saved.hex }}
                  aria-label={`Select color ${saved.hex}`}
                  title={saved.hex}
                />
                <button
                  onClick={() => removeSavedColor(saved.hex)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label={`Remove ${saved.hex} from saved colors`}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Palettes Tab */}
      {activeTab === 'palettes' && (
        <div className="space-y-8">
          {/* Current color preview */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg border border-slate-600"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="text-slate-400 text-sm">Base Color</p>
              <p className="text-white font-mono text-lg">{color.toUpperCase()}</p>
            </div>
          </div>

          {palettes.map((palette) => (
            <div key={palette.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{palette.name}</h3>
                  <p className="text-slate-400 text-sm">{palette.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportAsCss(palette.colors)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      copiedFormat === 'css'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    )}
                  >
                    CSS
                  </button>
                  <button
                    onClick={() => exportAsTailwind(palette.colors)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      copiedFormat === 'tailwind'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    )}
                  >
                    Tailwind
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {palette.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      copyToClipboard(c, `palette-${palette.name}-${i}`);
                    }}
                    className="group relative"
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all shadow-lg hover:scale-105"
                      style={{ backgroundColor: c }}
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-xs text-center bg-black/70 text-white py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contrast Checker Tab */}
      {activeTab === 'contrast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foreground color */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Text Color (Foreground)</h3>
              <div className="flex justify-center">
                <HexColorPicker
                  color={color}
                  onChange={setColor}
                  style={{ width: '100%', maxWidth: '200px', height: '150px' }}
                />
              </div>
              <div className="flex items-center gap-2 justify-center">
                <HexColorInput
                  color={color}
                  onChange={setColor}
                  prefixed
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center w-28"
                />
              </div>
            </div>

            {/* Background color */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Background Color</h3>
              <div className="flex justify-center">
                <HexColorPicker
                  color={contrastBgColor}
                  onChange={setContrastBgColor}
                  style={{ width: '100%', maxWidth: '200px', height: '150px' }}
                />
              </div>
              <div className="flex items-center gap-2 justify-center">
                <HexColorInput
                  color={contrastBgColor}
                  onChange={setContrastBgColor}
                  prefixed
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center w-28"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div
            className="p-8 rounded-xl border border-slate-600"
            style={{ backgroundColor: contrastBgColor }}
          >
            <p style={{ color: color }} className="text-2xl font-bold mb-2">
              Sample Heading Text
            </p>
            <p style={{ color: color }} className="text-base">
              This is sample body text to preview the contrast between the foreground and background colors. Make sure text is readable for all users.
            </p>
          </div>

          {/* Contrast Results */}
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-1">Contrast Ratio</p>
              <p className="text-4xl font-bold text-white">{contrastRatio.toFixed(2)}:1</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={clsx(
                'p-4 rounded-lg text-center border',
                wcagAA ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
              )}>
                <p className={clsx('text-sm font-medium', wcagAA ? 'text-green-400' : 'text-red-400')}>
                  {wcagAA ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-white font-semibold">AA Normal</p>
                <p className="text-slate-400 text-xs">4.5:1</p>
              </div>

              <div className={clsx(
                'p-4 rounded-lg text-center border',
                wcagAALarge ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
              )}>
                <p className={clsx('text-sm font-medium', wcagAALarge ? 'text-green-400' : 'text-red-400')}>
                  {wcagAALarge ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-white font-semibold">AA Large</p>
                <p className="text-slate-400 text-xs">3:1</p>
              </div>

              <div className={clsx(
                'p-4 rounded-lg text-center border',
                wcagAAA ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
              )}>
                <p className={clsx('text-sm font-medium', wcagAAA ? 'text-green-400' : 'text-red-400')}>
                  {wcagAAA ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-white font-semibold">AAA Normal</p>
                <p className="text-slate-400 text-xs">7:1</p>
              </div>

              <div className={clsx(
                'p-4 rounded-lg text-center border',
                wcagAAALarge ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
              )}>
                <p className={clsx('text-sm font-medium', wcagAAALarge ? 'text-green-400' : 'text-red-400')}>
                  {wcagAAALarge ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-white font-semibold">AAA Large</p>
                <p className="text-slate-400 text-xs">4.5:1</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extract from Image Tab */}
      {activeTab === 'extract' && (
        <div className="space-y-6">
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Image
            </label>
            <p className="text-slate-400 text-sm mt-2">
              Upload an image to extract its dominant colors
            </p>
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {isExtracting && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-300 mt-2">Extracting colors...</p>
            </div>
          )}

          {extractedColors.length > 0 && !isExtracting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Extracted Colors</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportAsCss(extractedColors)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      copiedFormat === 'css'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    )}
                  >
                    Export CSS
                  </button>
                  <button
                    onClick={() => exportAsTailwind(extractedColors)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      copiedFormat === 'tailwind'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    )}
                  >
                    Export Tailwind
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {extractedColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      copyToClipboard(c, `extracted-${i}`);
                    }}
                    className="group relative"
                  >
                    <div
                      className="aspect-square rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all shadow-lg hover:scale-105"
                      style={{ backgroundColor: c }}
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-xs text-center bg-black/70 text-white py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-slate-400 text-sm text-center">
                Click on any color to select it and copy to clipboard
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
