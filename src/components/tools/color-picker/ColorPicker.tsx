import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';
import clsx from 'clsx';
import { Copy, Check, Upload, Star, X, Search, Palette as PaletteIcon } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  getContrastRatio,
} from '../../../lib/color/conversions';
import { COLOR_PALETTES, PALETTE_CATEGORIES } from '../../../data/color-palettes';
import { useToast } from '../../common/Toast';

interface SavedColor {
  hex: string;
  savedAt: number;
}

// Palette generation functions (color harmonies derived from the current base color)
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
    const newRgb = hslToRgb((hsl.h + i * 120) % 360, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  return colors;
}

function getAnalogous(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  for (let i = -2; i <= 2; i++) {
    const newRgb = hslToRgb((hsl.h + i * 30 + 360) % 360, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  return colors;
}

function getSplitComplementary(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgb1 = hslToRgb((hsl.h + 150) % 360, hsl.s, hsl.l);
  const rgb2 = hslToRgb((hsl.h + 210) % 360, hsl.s, hsl.l);
  return [hex, rgbToHex(rgb1.r, rgb1.g, rgb1.b), rgbToHex(rgb2.r, rgb2.g, rgb2.b)];
}

function getTetradic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [hex];
  for (let i = 1; i <= 3; i++) {
    const newRgb = hslToRgb((hsl.h + i * 90) % 360, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  return colors;
}

function getMonochromatic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [10, 25, 40, 55, 70, 85].map((l) => {
    const newRgb = hslToRgb(hsl.h, hsl.s, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  });
}

// Extract colors from image using canvas (median-cut approximation)
function extractColorsFromImage(imageData: ImageData, numColors: number = 6): string[] {
  const pixels: { r: number; g: number; b: number }[] = [];
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 16) {
    const a = data[i + 3];
    if (a < 128) continue;
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  if (pixels.length === 0) return [];

  const buckets: (typeof pixels)[] = [pixels];

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

    largestBucket.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(largestBucket.length / 2);
    buckets[largestIndex] = largestBucket.slice(0, mid);
    buckets.push(largestBucket.slice(mid));
  }

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

// 8-digit hex (#rrggbbaa) <-> hex6 + alpha(0-1) helpers, used by HexAlphaColorPicker
function hex8ToHex6Alpha(hex8: string): { hex6: string; alpha: number } {
  const clean = hex8.replace('#', '');
  const hex6 = `#${clean.slice(0, 6).padEnd(6, '0')}`;
  const alphaHex = clean.slice(6, 8);
  const alpha = alphaHex ? Math.round((parseInt(alphaHex, 16) / 255) * 100) / 100 : 1;
  return { hex6, alpha: isNaN(alpha) ? 1 : alpha };
}

function hex6AlphaToHex8(hex6: string, alpha: number): string {
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex6}${alphaHex}`;
}

const SAVED_COLORS_KEY = 'color-picker-saved-colors';
const RECENT_LIBRARY_CATEGORY = 'All';

function CopyButton({ value, label }: { value: string; label: string }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast(`Copied ${label} to clipboard`, 'success');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  }, [value, label, showToast]);

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        copied ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
      )}
      aria-label={`Copy ${label} value`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export function ColorPicker() {
  const { showToast } = useToast();
  const [hex8, setHex8] = useState('#3b82f6ff');
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [activeTab, setActiveTab] = useState<'picker' | 'harmonies' | 'library' | 'contrast' | 'extract'>('picker');
  const [contrastBgColor, setContrastBgColor] = useState('#ffffff');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [libraryCategory, setLibraryCategory] = useState(RECENT_LIBRARY_CATEGORY);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { hex6: color, alpha } = hex8ToHex6Alpha(hex8);

  const setColor = useCallback((newHex6: string) => {
    setHex8(hex6AlphaToHex8(newHex6, alpha));
  }, [alpha]);

  const setAlpha = useCallback((newAlpha: number) => {
    setHex8(hex6AlphaToHex8(color, newAlpha));
  }, [color]);

  // Load saved colors from localStorage (deferred to an effect - this is SSG'd,
  // so localStorage isn't available during the server render and reading it eagerly
  // in a lazy useState initializer would cause a hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(SAVED_COLORS_KEY);
      if (saved) setSavedColors(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load saved colors:', e);
    }
  }, []);

  const saveColor = useCallback(() => {
    const newColor: SavedColor = { hex: color, savedAt: Date.now() };
    const updated = [newColor, ...savedColors.filter((c) => c.hex !== color)].slice(0, 20);
    setSavedColors(updated);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(updated));
    showToast('Color saved', 'success');
  }, [color, savedColors, showToast]);

  const removeSavedColor = useCallback((hex: string) => {
    const updated = savedColors.filter((c) => c.hex !== hex);
    setSavedColors(updated);
    if (typeof window !== 'undefined') localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(updated));
  }, [savedColors]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard`, 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  }, [showToast]);

  // Derived color values
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const alphaPercent = Math.round(alpha * 100);

  const colorFormats = [
    { name: 'HEX', value: color.toUpperCase() },
    { name: 'HEX8', value: hex8.toUpperCase() },
    { name: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { name: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})` },
    { name: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { name: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha.toFixed(2)})` },
    { name: 'HSV/HSB', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { name: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const harmonies = [
    { name: 'Complementary', colors: getComplementary(color), description: 'Opposite colors on the wheel' },
    { name: 'Triadic', colors: getTriadic(color), description: 'Three colors equally spaced' },
    { name: 'Analogous', colors: getAnalogous(color), description: 'Adjacent colors' },
    { name: 'Split-Complementary', colors: getSplitComplementary(color), description: 'A color and two neighbors of its complement' },
    { name: 'Tetradic', colors: getTetradic(color), description: 'Four colors forming a rectangle' },
    { name: 'Monochromatic', colors: getMonochromatic(color), description: 'Shades and tints of one hue' },
  ];

  const contrastRatio = getContrastRatio(color, contrastBgColor);
  const wcagAA = contrastRatio >= 4.5;
  const wcagAALarge = contrastRatio >= 3;
  const wcagAAA = contrastRatio >= 7;
  const wcagAAALarge = contrastRatio >= 4.5;

  const copyAsCss = useCallback((colors: string[]) => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    copyToClipboard(css, 'CSS variables');
  }, [copyToClipboard]);

  const copyAsTailwind = useCallback((colors: string[]) => {
    const config = `// tailwind.config.js colors\ncolors: {\n  custom: {\n${colors.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join('\n')}\n  }\n}`;
    copyToClipboard(config, 'Tailwind config');
  }, [copyToClipboard]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    setIsExtracting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setExtractedColors(extractColorsFromImage(imageData));
        setIsExtracting(false);
      };
      img.onerror = () => {
        setIsExtracting(false);
        showToast('Could not read that image', 'error');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsExtracting(false);
      showToast('Could not read that file', 'error');
    };

    reader.readAsDataURL(file);
  }, [showToast]);

  const filteredPalettes = useMemo(() => {
    const q = libraryQuery.trim().toLowerCase();
    return COLOR_PALETTES.filter((p) => {
      if (libraryCategory !== RECENT_LIBRARY_CATEGORY && p.category !== libraryCategory) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q);
    }).slice(0, 60);
  }, [libraryQuery, libraryCategory]);

  const tabs = [
    { id: 'picker' as const, label: 'Color Picker' },
    { id: 'harmonies' as const, label: 'Harmonies' },
    { id: 'library' as const, label: `Palette Library (${COLOR_PALETTES.length})` },
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
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
              <HexAlphaColorPicker
                color={hex8}
                onChange={setHex8}
                style={{ width: '100%', maxWidth: '300px', height: '220px' }}
              />
            </div>

            <div className="flex items-center gap-3 justify-center flex-wrap">
              <label htmlFor="hex-input" className="text-slate-300 font-medium">HEX:</label>
              <HexColorInput
                id="hex-input"
                color={color}
                onChange={setColor}
                prefixed
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveColor}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                aria-label="Save color to favorites"
              >
                <Star className="w-4 h-4" /> Save
              </button>
            </div>

            {/* Numeric RGB inputs */}
            <div className="grid grid-cols-3 gap-2">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <label key={channel} className="text-xs text-slate-400 uppercase text-center block">
                  {channel}
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                      const newRgb = { ...rgb, [channel]: val };
                      setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                    }}
                    className="mt-1 w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>

            {/* Numeric HSL inputs */}
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'h', max: 360, label: 'H' },
                { key: 's', max: 100, label: 'S' },
                { key: 'l', max: 100, label: 'L' },
              ] as const).map(({ key, max, label }) => (
                <label key={key} className="text-xs text-slate-400 uppercase text-center block">
                  {label}
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={hsl[key]}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(max, Number(e.target.value) || 0));
                      const newHsl = { ...hsl, [key]: val };
                      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
                      setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                    }}
                    className="mt-1 w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>

            {/* Alpha slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Alpha / Transparency</span>
                <span>{alphaPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={alphaPercent}
                onChange={(e) => setAlpha(Number(e.target.value) / 100)}
                className="w-full accent-blue-500"
                aria-label="Alpha transparency"
              />
            </div>

            {/* Color Preview (checkerboard to show transparency) */}
            <div
              className="relative w-full h-24 rounded-xl border border-slate-600 shadow-lg overflow-hidden"
              aria-label={`Color preview: ${hex8}`}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #94a3b8 25%, transparent 25%), linear-gradient(-45deg, #94a3b8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #94a3b8 75%), linear-gradient(-45deg, transparent 75%, #94a3b8 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` }} />
            </div>
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
                  <div className="min-w-0">
                    <span className="text-slate-400 text-sm">{format.name}</span>
                    <p className="text-white font-mono truncate">{format.value}</p>
                  </div>
                  <CopyButton value={format.value} label={format.name} />
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
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label={`Remove ${saved.hex} from saved colors`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Harmonies Tab */}
      {activeTab === 'harmonies' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-slate-600" style={{ backgroundColor: color }} />
            <div>
              <p className="text-slate-400 text-sm">Base Color</p>
              <p className="text-white font-mono text-lg">{color.toUpperCase()}</p>
            </div>
          </div>

          {harmonies.map((harmony) => (
            <div key={harmony.name} className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{harmony.name}</h3>
                  <p className="text-slate-400 text-sm">{harmony.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyAsCss(harmony.colors)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-600 text-slate-200 hover:bg-slate-500 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> CSS
                  </button>
                  <button
                    onClick={() => copyAsTailwind(harmony.colors)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-600 text-slate-200 hover:bg-slate-500 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> Tailwind
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {harmony.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      copyToClipboard(c, c.toUpperCase());
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

      {/* Palette Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={libraryQuery}
                onChange={(e) => setLibraryQuery(e.target.value)}
                placeholder="Search palettes by name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={libraryCategory}
              onChange={(e) => setLibraryCategory(e.target.value)}
              className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={RECENT_LIBRARY_CATEGORY}>All categories</option>
              {PALETTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <p className="text-slate-400 text-sm flex items-center gap-1.5">
            <PaletteIcon className="w-4 h-4" />
            {COLOR_PALETTES.length} built-in palettes &mdash; click any swatch to copy its hex code
            {filteredPalettes.length >= 60 && ' (showing first 60 matches, refine your search for more)'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPalettes.map((palette) => (
              <div key={palette.id} className="bg-slate-700/50 rounded-lg border border-slate-600 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white truncate">{palette.name}</span>
                  <button
                    onClick={() => copyAsCss(palette.colors)}
                    className="text-slate-400 hover:text-white flex-shrink-0"
                    aria-label={`Copy ${palette.name} as CSS variables`}
                    title="Copy as CSS variables"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex rounded-md overflow-hidden h-10">
                  {palette.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setColor(c);
                        copyToClipboard(c, c.toUpperCase());
                      }}
                      className="flex-1 hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: c }}
                      title={c.toUpperCase()}
                      aria-label={`Copy ${c}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPalettes.length === 0 && (
            <p className="text-center text-slate-400 py-8">No palettes match "{libraryQuery}"</p>
          )}
        </div>
      )}

      {/* Contrast Checker Tab */}
      {activeTab === 'contrast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Text Color (Foreground)</h3>
              <div className="flex justify-center">
                <HexAlphaColorPicker
                  color={hex8}
                  onChange={setHex8}
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Background Color</h3>
              <div className="flex justify-center">
                <HexAlphaColorPicker
                  color={`${contrastBgColor}ff`}
                  onChange={(v) => setContrastBgColor(hex8ToHex6Alpha(v).hex6)}
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

          <div className="p-8 rounded-xl border border-slate-600" style={{ backgroundColor: contrastBgColor }}>
            <p style={{ color }} className="text-2xl font-bold mb-2">Sample Heading Text</p>
            <p style={{ color }} className="text-base">
              This is sample body text to preview the contrast between the foreground and background colors. Make sure text is readable for all users.
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-1">Contrast Ratio</p>
              <p className="text-4xl font-bold text-white">{contrastRatio.toFixed(2)}:1</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { pass: wcagAA, label: 'AA Normal', ratio: '4.5:1' },
                { pass: wcagAALarge, label: 'AA Large', ratio: '3:1' },
                { pass: wcagAAA, label: 'AAA Normal', ratio: '7:1' },
                { pass: wcagAAALarge, label: 'AAA Large', ratio: '4.5:1' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={clsx('p-4 rounded-lg text-center border', item.pass ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700')}
                >
                  <p className={clsx('text-sm font-medium', item.pass ? 'text-green-400' : 'text-red-400')}>
                    {item.pass ? 'PASS' : 'FAIL'}
                  </p>
                  <p className="text-white font-semibold">{item.label}</p>
                  <p className="text-slate-400 text-xs">{item.ratio}</p>
                </div>
              ))}
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
              <Upload className="w-5 h-5" />
              Upload Image
            </label>
            <p className="text-slate-400 text-sm mt-2">Upload an image to extract its dominant colors</p>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {isExtracting && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-300 mt-2">Extracting colors...</p>
            </div>
          )}

          {extractedColors.length > 0 && !isExtracting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-white">Extracted Colors</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyAsCss(extractedColors)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-600 text-slate-200 hover:bg-slate-500 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> CSS
                  </button>
                  <button
                    onClick={() => copyAsTailwind(extractedColors)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-600 text-slate-200 hover:bg-slate-500 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> Tailwind
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {extractedColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      copyToClipboard(c, c.toUpperCase());
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

              <p className="text-slate-400 text-sm text-center">Click on any color to select it and copy to clipboard</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
