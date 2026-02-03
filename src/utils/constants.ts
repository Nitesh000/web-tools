// Tool definitions with icons, paths, and colors
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  path: string;
  icon: string;
  color: string;
  bgColor: string;
  category: 'image' | 'document' | 'utility' | 'developer';
  features: string[];
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Remove backgrounds from images instantly using AI. Perfect for product photos, portraits, and more.',
    shortDescription: 'Remove image backgrounds with AI',
    path: '/background-remover',
    icon: '🖼️',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    category: 'image',
    features: ['AI-powered removal', 'Transparent PNG output', 'Batch processing'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality. Reduce file sizes for faster web loading.',
    shortDescription: 'Compress images without quality loss',
    path: '/image-compressor',
    icon: '📦',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    category: 'image',
    features: ['Lossless compression', 'Multiple formats', 'Bulk compression'],
  },
  {
    id: 'format-converter',
    name: 'Image Format Converter',
    description: 'Convert images between formats: PNG, JPG, WebP, AVIF, and more. Optimize for web or print.',
    shortDescription: 'Convert between image formats',
    path: '/format-converter',
    icon: '🔄',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    category: 'image',
    features: ['PNG, JPG, WebP, AVIF', 'Quality control', 'Batch conversion'],
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF Converter',
    description: 'Convert video clips to animated GIFs. Perfect for social media, tutorials, and memes.',
    shortDescription: 'Convert videos to animated GIFs',
    path: '/video-to-gif',
    icon: '🎬',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    category: 'image',
    features: ['MP4, WebM support', 'Custom frame rate', 'Trim & resize'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, WiFi, vCard, and more. Customize colors and add logos.',
    shortDescription: 'Generate customizable QR codes',
    path: '/qr-generator',
    icon: '📱',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    category: 'utility',
    features: ['Custom colors', 'Logo embedding', 'Multiple formats'],
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable length and character options.',
    shortDescription: 'Create secure random passwords',
    path: '/password-generator',
    icon: '🔐',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    category: 'utility',
    features: ['Customizable length', 'Strength indicator', 'Passphrase option'],
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text between different cases: uppercase, lowercase, title case, camelCase, and more.',
    shortDescription: 'Convert text between cases',
    path: '/text-case-converter',
    icon: '📝',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    category: 'utility',
    features: ['Multiple case formats', 'Character counter', 'One-click copy'],
  },
  {
    id: 'color-picker',
    name: 'Color Picker & Palette',
    description: 'Pick colors, generate palettes, check contrast, and extract colors from images.',
    shortDescription: 'Pick colors and create palettes',
    path: '/color-picker',
    icon: '🎨',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    category: 'utility',
    features: ['Palette generator', 'Contrast checker', 'Image color extractor'],
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON. Convert to other formats like YAML or TypeScript.',
    shortDescription: 'Format and validate JSON',
    path: '/json-formatter',
    icon: '{ }',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    category: 'developer',
    features: ['Syntax highlighting', 'Error detection', 'Tree view'],
  },
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    description: 'Create professional invoices with customizable templates. Download as PDF instantly.',
    shortDescription: 'Create professional invoices',
    path: '/invoice-generator',
    icon: '📄',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    category: 'document',
    features: ['Multiple templates', 'PDF export', 'Auto calculations'],
  },
  {
    id: 'json-viewer',
    name: 'JSON Viewer',
    description: 'View, explore, and analyze JSON data with a full-screen interactive tree viewer. Search, expand/collapse, and navigate complex JSON structures easily.',
    shortDescription: 'Full-screen JSON tree viewer',
    path: '/json-viewer',
    icon: '🔍',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    category: 'developer',
    features: ['Full-screen mode', 'Tree navigation', 'Search & filter', 'Syntax highlighting'],
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview Markdown documents with live preview. Auto-saves to browser storage. Export as .md or .html files.',
    shortDescription: 'Write Markdown with live preview',
    path: '/markdown-editor',
    icon: '📝',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    category: 'document',
    features: ['Live preview', 'Auto-save', 'Templates', 'Export .md/.html'],
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images. Export as JPG, PNG, or WebP. Select specific pages and choose quality settings.',
    shortDescription: 'Convert PDF pages to images',
    path: '/pdf-to-image',
    icon: '📄',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    category: 'document',
    features: ['JPG, PNG, WebP output', 'Page selection', 'Quality options', 'Batch download'],
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images to PDF documents. Combine multiple images into a single PDF with customizable page sizes and quality.',
    shortDescription: 'Convert images to PDF',
    path: '/image-to-pdf',
    icon: '🖼️',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    category: 'document',
    features: ['Multiple images', 'Page size options', 'Reorder pages', 'Quality control'],
  },
];

export const TOOL_CATEGORIES = {
  image: {
    name: 'Image Tools',
    description: 'Edit, convert, and enhance your images',
  },
  document: {
    name: 'Document Tools',
    description: 'Create and manage documents',
  },
  utility: {
    name: 'Utility Tools',
    description: 'Helpful tools for everyday tasks',
  },
  developer: {
    name: 'Developer Tools',
    description: 'Tools for developers and coders',
  },
};

export const SITE_CONFIG = {
  name: 'Web Tools Suite',
  tagline: 'Free Online Tools for Everyone',
  description: 'A collection of free, privacy-focused online tools. All processing happens in your browser - your files never leave your device.',
  url: 'https://webtools.example.com',
  twitterHandle: '@webtools',
};

export const STATS = {
  usersCount: '50,000+',
  filesProcessed: '1,000,000+',
  toolsAvailable: TOOLS.length,
  satisfaction: '99%',
};

export const BENEFITS = [
  {
    icon: '🔒',
    title: 'Private & Secure',
    description: 'All processing happens in your browser. Your files never leave your device.',
  },
  {
    icon: '💰',
    title: '100% Free',
    description: 'No hidden fees, no premium tiers. All features are completely free.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Client-side processing means instant results without server delays.',
  },
  {
    icon: '🚫',
    title: 'No Signup Required',
    description: 'Start using tools immediately. No account or email needed.',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Fully responsive design works on desktop, tablet, and mobile.',
  },
  {
    icon: '♾️',
    title: 'Unlimited Usage',
    description: 'No daily limits or watermarks. Use as much as you need.',
  },
];

export const COMPARISON_FEATURES = [
  { feature: 'Free to use', us: true, others: 'Limited' },
  { feature: 'No signup required', us: true, others: false },
  { feature: 'Client-side processing', us: true, others: false },
  { feature: 'No file upload to servers', us: true, others: false },
  { feature: 'No watermarks', us: true, others: 'Premium only' },
  { feature: 'Unlimited usage', us: true, others: 'Daily limits' },
  { feature: 'Works offline (PWA)', us: true, others: false },
  { feature: 'Open source', us: true, others: false },
];
