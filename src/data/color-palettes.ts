import { hslToHex } from '../lib/color/conversions';

export interface ColorPalette {
  id: string;
  name: string;
  category: string;
  colors: string[];
}

// Real Tailwind CSS default design tokens (tailwindcss/colors), five representative shades each.
const TAILWIND_SCALES: Record<string, string[]> = {
  slate: ['#f1f5f9', '#94a3b8', '#64748b', '#334155', '#0f172a'],
  gray: ['#f3f4f6', '#9ca3af', '#6b7280', '#374151', '#111827'],
  zinc: ['#f4f4f5', '#a1a1aa', '#71717a', '#3f3f46', '#18181b'],
  neutral: ['#f5f5f5', '#a3a3a3', '#737373', '#404040', '#171717'],
  stone: ['#f5f5f4', '#a8a29e', '#78716c', '#44403c', '#1c1917'],
  red: ['#fee2e2', '#f87171', '#ef4444', '#b91c1c', '#7f1d1d'],
  orange: ['#ffedd5', '#fb923c', '#f97316', '#c2410c', '#7c2d12'],
  amber: ['#fef3c7', '#fbbf24', '#f59e0b', '#b45309', '#78350f'],
  yellow: ['#fef9c3', '#facc15', '#eab308', '#a16207', '#713f12'],
  lime: ['#ecfccb', '#a3e635', '#84cc16', '#4d7c0f', '#365314'],
  green: ['#dcfce7', '#4ade80', '#22c55e', '#15803d', '#14532d'],
  emerald: ['#d1fae5', '#34d399', '#10b981', '#047857', '#064e3b'],
  teal: ['#ccfbf1', '#2dd4bf', '#14b8a6', '#0f766e', '#134e4a'],
  cyan: ['#cffafe', '#22d3ee', '#06b6d4', '#0e7490', '#164e63'],
  sky: ['#e0f2fe', '#38bdf8', '#0ea5e9', '#0369a1', '#0c4a6e'],
  blue: ['#dbeafe', '#60a5fa', '#3b82f6', '#1d4ed8', '#1e3a8a'],
  indigo: ['#e0e7ff', '#818cf8', '#6366f1', '#4338ca', '#312e81'],
  violet: ['#ede9fe', '#a78bfa', '#8b5cf6', '#6d28d9', '#4c1d95'],
  purple: ['#f3e8ff', '#c084fc', '#a855f7', '#7e22ce', '#581c87'],
  fuchsia: ['#fae8ff', '#e879f9', '#d946ef', '#a21caf', '#701a75'],
  pink: ['#fce7f3', '#f472b6', '#ec4899', '#be185d', '#831843'],
  rose: ['#ffe4e6', '#fb7185', '#f43f5e', '#be123c', '#881337'],
};

// Hand-curated named palettes.
const CURATED: { name: string; category: string; colors: string[] }[] = [
  { name: 'Sunset Vibes', category: 'Curated', colors: ['#ff6b6b', '#f7b733', '#fc4a1a', '#f8961e', '#f94144'] },
  { name: 'Ocean Depths', category: 'Curated', colors: ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8'] },
  { name: 'Forest Walk', category: 'Curated', colors: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d', '#b7e4c7'] },
  { name: 'Retro Diner', category: 'Curated', colors: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'] },
  { name: 'Cyberpunk Neon', category: 'Curated', colors: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'] },
  { name: 'Desert Sand', category: 'Curated', colors: ['#edc9af', '#e0ac69', '#c68642', '#8d5524', '#4a2c11'] },
  { name: 'Cotton Candy', category: 'Curated', colors: ['#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf'] },
  { name: 'Autumn Leaves', category: 'Curated', colors: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#b6ad90'] },
  { name: 'Spring Bloom', category: 'Curated', colors: ['#ffb4a2', '#e5989b', '#b5838d', '#6d6875', '#ffcdb2'] },
  { name: 'Midnight Blue', category: 'Curated', colors: ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000'] },
  { name: 'Rose Gold', category: 'Curated', colors: ['#b76e79', '#e8c2ca', '#f4dde0', '#fbe9e7', '#c9a66b'] },
  { name: 'Coffee & Cream', category: 'Curated', colors: ['#3c2f2f', '#6f4e37', '#a9746e', '#d7c0ae', '#f5ebe0'] },
  { name: 'Mint Chocolate', category: 'Curated', colors: ['#0b3d2e', '#1b5e20', '#66bb6a', '#a5d6a7', '#3e2723'] },
  { name: 'Lavender Fields', category: 'Curated', colors: ['#dad2ff', '#c8b6ff', '#b8c0ff', '#bbd0ff', '#e7c6ff'] },
  { name: 'Golden Hour', category: 'Curated', colors: ['#ffba08', '#faa307', '#f48c06', '#e85d04', '#dc2f02'] },
  { name: 'Arctic Ice', category: 'Curated', colors: ['#caf0f8', '#ade8f4', '#90e0ef', '#48cae4', '#00b4d8'] },
  { name: 'Volcanic Rock', category: 'Curated', colors: ['#0b090a', '#161a1d', '#660708', '#a4161a', '#ba181b'] },
  { name: 'Tropical Paradise', category: 'Curated', colors: ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00'] },
  { name: 'Berry Smoothie', category: 'Curated', colors: ['#590d22', '#800f2f', '#a4133c', '#c9184a', '#ff4d6d'] },
  { name: 'Sage & Cream', category: 'Curated', colors: ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'] },
  { name: 'Neon City', category: 'Curated', colors: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'] },
  { name: 'Denim Wash', category: 'Curated', colors: ['#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97'] },
  { name: 'Terracotta', category: 'Curated', colors: ['#bc4749', '#a7333f', '#6a040f', '#e29578', '#ffddd2'] },
  { name: 'Cherry Blossom', category: 'Curated', colors: ['#ffcad4', '#f4acb7', '#9d8189', '#d8e2dc', '#ffe5d9'] },
  { name: 'Deep Space', category: 'Curated', colors: ['#03071e', '#10002b', '#240046', '#3c096c', '#5a189a'] },
  { name: 'Citrus Punch', category: 'Curated', colors: ['#ffea00', '#ffd000', '#ff9500', '#ff5400', '#ff0054'] },
  { name: 'Muted Earth', category: 'Curated', colors: ['#5e503f', '#a9927d', '#cbb89d', '#d9cab3', '#ede0d4'] },
  { name: 'Peacock Feathers', category: 'Curated', colors: ['#003844', '#006c67', '#00916e', '#4ce0b3', '#8cffda'] },
  { name: 'Bubblegum Pop', category: 'Curated', colors: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'] },
  { name: 'Espresso Bar', category: 'Curated', colors: ['#231942', '#5e548e', '#9f86c0', '#be95c4', '#e0b1cb'] },
  { name: 'Coral Reef', category: 'Curated', colors: ['#ff6f61', '#ff9a76', '#ffc482', '#f7e199', '#a3d9c9'] },
  { name: 'Northern Lights', category: 'Curated', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'] },
  { name: 'Vintage Rose', category: 'Curated', colors: ['#d8a7b1', '#c98ea2', '#a56480', '#78435c', '#4c2a3c'] },
  { name: 'Lemon Sorbet', category: 'Curated', colors: ['#fffdf0', '#fff8b8', '#fff07a', '#ffe45c', '#ffd23f'] },
  { name: 'Slate Industrial', category: 'Curated', colors: ['#212529', '#343a40', '#495057', '#6c757d', '#adb5bd'] },
  { name: 'Watermelon', category: 'Curated', colors: ['#065143', '#129490', '#70b77e', '#e0a890', '#ce1483'] },
  { name: 'Royal Velvet', category: 'Curated', colors: ['#1a0033', '#33006f', '#4d008c', '#7b2cbf', '#9d4edd'] },
  { name: 'Sand Dune', category: 'Curated', colors: ['#f2e8cf', '#e6ccb2', '#ddb892', '#b08968', '#7f5539'] },
  { name: 'Electric Lime', category: 'Curated', colors: ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a'] },
  { name: 'Plum Wine', category: 'Curated', colors: ['#432818', '#6f1d1b', '#99582a', '#bb9457', '#432818'] },
  { name: 'Ice Cream Shop', category: 'Curated', colors: ['#f8edeb', '#fcd5ce', '#f9dcc4', '#fec89a', '#ffd7ba'] },
  { name: 'Steel & Rust', category: 'Curated', colors: ['#3a3335', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'] },
  { name: 'Poison Ivy', category: 'Curated', colors: ['#081c15', '#1b4332', '#2d6a4f', '#40916c', '#95d5b2'] },
];

// 36 named hues spaced 10 degrees apart around the color wheel.
const HUE_NAMES: { hue: number; label: string }[] = [
  { hue: 0, label: 'Red' }, { hue: 10, label: 'Vermilion' }, { hue: 20, label: 'Persimmon' },
  { hue: 30, label: 'Orange' }, { hue: 40, label: 'Amber' }, { hue: 50, label: 'Marigold' },
  { hue: 60, label: 'Gold' }, { hue: 70, label: 'Chartreuse' }, { hue: 80, label: 'Lime' },
  { hue: 90, label: 'Spring Green' }, { hue: 100, label: 'Shamrock' }, { hue: 110, label: 'Emerald' },
  { hue: 120, label: 'Green' }, { hue: 130, label: 'Jade' }, { hue: 140, label: 'Sea Green' },
  { hue: 150, label: 'Mint' }, { hue: 160, label: 'Turquoise' }, { hue: 170, label: 'Teal' },
  { hue: 180, label: 'Cyan' }, { hue: 190, label: 'Sky' }, { hue: 200, label: 'Azure' },
  { hue: 210, label: 'Cerulean' }, { hue: 220, label: 'Cobalt' }, { hue: 230, label: 'Blue' },
  { hue: 240, label: 'Indigo' }, { hue: 250, label: 'Iris' }, { hue: 260, label: 'Violet' },
  { hue: 270, label: 'Purple' }, { hue: 280, label: 'Orchid' }, { hue: 290, label: 'Magenta' },
  { hue: 300, label: 'Fuchsia' }, { hue: 310, label: 'Pink' }, { hue: 320, label: 'Rose' },
  { hue: 330, label: 'Crimson' }, { hue: 340, label: 'Ruby' }, { hue: 350, label: 'Scarlet' },
];

interface MoodRecipe {
  label: string;
  category: string;
  spread: number; // degrees between each swatch's hue offset
  saturations: number[];
  lightnesses: number[];
}

// Each mood defines how 5 swatches are derived from a base hue via hue spread + S/L curves.
const MOODS: MoodRecipe[] = [
  { label: 'Vibrant', category: 'Vibrant', spread: 20, saturations: [80, 80, 80, 80, 80], lightnesses: [45, 50, 55, 50, 45] },
  { label: 'Pastel', category: 'Pastel', spread: 20, saturations: [55, 55, 55, 55, 55], lightnesses: [88, 85, 82, 85, 88] },
  { label: 'Muted', category: 'Muted', spread: 20, saturations: [28, 28, 28, 28, 28], lightnesses: [65, 60, 55, 60, 65] },
  { label: 'Midnight', category: 'Dark', spread: 20, saturations: [55, 60, 65, 60, 55], lightnesses: [15, 20, 25, 20, 15] },
  { label: 'Sunrise', category: 'Gradient', spread: 30, saturations: [70, 72, 75, 78, 80], lightnesses: [80, 70, 60, 50, 40] },
  { label: 'Jewel', category: 'Jewel', spread: 15, saturations: [70, 70, 70, 70, 70], lightnesses: [30, 35, 40, 35, 30] },
  { label: 'Neon', category: 'Neon', spread: 20, saturations: [95, 95, 95, 95, 95], lightnesses: [50, 55, 60, 55, 50] },
  { label: 'Dusty', category: 'Dusty', spread: 20, saturations: [18, 18, 18, 18, 18], lightnesses: [70, 62, 54, 62, 70] },
  { label: 'Earthy', category: 'Earthy', spread: 15, saturations: [40, 40, 40, 40, 40], lightnesses: [50, 44, 38, 44, 50] },
  { label: 'Twilight Gradient', category: 'Gradient', spread: 10, saturations: [45, 55, 65, 55, 45], lightnesses: [85, 68, 50, 32, 18] },
  { label: 'Ocean Gradient', category: 'Gradient', spread: 8, saturations: [40, 55, 70, 60, 45], lightnesses: [85, 68, 52, 36, 22] },
  { label: 'Tint & Shade', category: 'Monochrome', spread: 0, saturations: [55, 55, 55, 55, 55], lightnesses: [88, 68, 50, 32, 15] },
];

function buildMoodPalette(baseHue: number, hueLabel: string, mood: MoodRecipe): ColorPalette {
  const offsets = [-2, -1, 0, 1, 2];
  const colors = offsets.map((step, i) => {
    const hue = (baseHue + step * mood.spread + 360) % 360;
    return hslToHex(hue, mood.saturations[i], mood.lightnesses[i]);
  });
  return {
    id: `mood-${baseHue}-${mood.label.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${hueLabel} ${mood.label}`,
    category: mood.category,
    colors,
  };
}

function buildMonoLadder(hueDef: { hue: number; label: string }): ColorPalette {
  const lightnesses = [90, 75, 60, 45, 30, 15];
  return {
    id: `mono-${hueDef.hue}`,
    name: `${hueDef.label} Mono Scale`,
    category: 'Monochrome Scale',
    colors: lightnesses.map((l) => hslToHex(hueDef.hue, 55, l)),
  };
}

function buildPaletteLibrary(): ColorPalette[] {
  const palettes: ColorPalette[] = [];

  // Tailwind design tokens
  for (const [name, colors] of Object.entries(TAILWIND_SCALES)) {
    palettes.push({
      id: `tw-${name}`,
      name: `Tailwind ${name[0].toUpperCase()}${name.slice(1)}`,
      category: 'Tailwind',
      colors,
    });
  }

  // Hand-curated
  CURATED.forEach((p, i) => {
    palettes.push({ id: `curated-${i}`, ...p });
  });

  // Hue x mood generated palettes
  for (const hueDef of HUE_NAMES) {
    for (const mood of MOODS) {
      palettes.push(buildMoodPalette(hueDef.hue, hueDef.label, mood));
    }
    palettes.push(buildMonoLadder(hueDef));
  }

  return palettes;
}

export const COLOR_PALETTES: ColorPalette[] = buildPaletteLibrary();

export const PALETTE_CATEGORIES: string[] = Array.from(
  new Set(COLOR_PALETTES.map((p) => p.category))
).sort();
