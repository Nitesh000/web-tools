import { ToolLayout } from '../components/common/ToolLayout';
import { ColorPicker } from '../components/tools/color-picker/ColorPicker';

const seoMeta = {
  title: 'Color Picker - Free Online HEX, RGB, HSL Color Converter | Web Tools Suite',
  description:
    'Pick and convert colors between HEX, RGB, HSL, HSV, and CMYK formats. Free online color picker with palette generator, contrast checker, and color extraction from images. Copy color codes instantly.',
  keywords: [
    'color picker',
    'hex color picker',
    'rgb color picker',
    'hsl color picker',
    'color converter',
    'hex to rgb',
    'rgb to hex',
    'color palette generator',
    'complementary colors',
    'triadic colors',
    'analogous colors',
    'contrast checker',
    'wcag contrast',
    'color accessibility',
    'extract colors from image',
    'css colors',
    'web colors',
    'tailwind colors',
  ],
  canonicalUrl: 'https://webtools.dev/color-picker',
};

const howToUseSteps = [
  'Use the color picker wheel to select your desired color, or enter a HEX value directly in the input field.',
  'View the color in multiple formats including HEX, RGB, HSL, HSV/HSB, and CMYK. Click "Copy" on any format to copy it to your clipboard.',
  'Save your favorite colors by clicking the "Save" button. Saved colors appear below the picker for quick access.',
  'Switch to the "Palettes" tab to generate color harmonies including complementary, triadic, analogous, split-complementary, tetradic, and monochromatic schemes.',
  'Export your palettes as CSS variables or Tailwind configuration with a single click.',
  'Use the "Contrast Checker" tab to test text readability. Select foreground and background colors to see WCAG compliance ratings.',
  'Extract colors from images using the "Extract from Image" tab. Upload any image to automatically extract its dominant colors.',
  'Click on any color in palettes or extracted colors to select it as your current color and copy it to clipboard.',
];

const faqs = [
  {
    question: 'What color formats does this tool support?',
    answer:
      'Our color picker supports all major color formats including HEX (e.g., #FF5733), RGB (e.g., rgb(255, 87, 51)), HSL (e.g., hsl(9, 100%, 60%)), HSV/HSB, and CMYK. You can instantly convert between any of these formats and copy the values to your clipboard.',
  },
  {
    question: 'What are color harmonies and how do I use them?',
    answer:
      'Color harmonies are predefined combinations of colors that work well together based on their positions on the color wheel. Complementary colors are opposite each other, triadic uses three equally spaced colors, analogous uses adjacent colors, and monochromatic uses different shades of one hue. Use these to create visually appealing designs and websites.',
  },
  {
    question: 'How does the contrast checker work?',
    answer:
      'The contrast checker calculates the contrast ratio between two colors according to WCAG (Web Content Accessibility Guidelines). It shows whether your color combination passes AA or AAA standards for both normal and large text. A contrast ratio of 4.5:1 is required for AA normal text, and 7:1 for AAA compliance.',
  },
  {
    question: 'Can I extract colors from my own images?',
    answer:
      'Yes! Upload any image using the "Extract from Image" tab and our tool will automatically identify and extract the dominant colors. This is perfect for creating color palettes based on photographs, brand materials, or inspiration images. All processing happens locally in your browser.',
  },
  {
    question: 'What is the difference between HEX and RGB?',
    answer:
      'HEX and RGB represent the same colors in different formats. HEX uses hexadecimal notation (#RRGGBB), while RGB uses decimal values from 0-255 for each channel (Red, Green, Blue). Both are commonly used in web development and CSS. HEX is more compact, while RGB can be easier to understand.',
  },
  {
    question: 'What is HSL and when should I use it?',
    answer:
      'HSL stands for Hue, Saturation, and Lightness. It is often more intuitive than RGB because you can easily adjust brightness or saturation without changing the base hue. HSL is great for creating color variations and themes, as you can keep the same hue while adjusting saturation and lightness.',
  },
  {
    question: 'How can I export colors for my project?',
    answer:
      'You can export color palettes as CSS custom properties (variables) or as Tailwind CSS configuration. Simply generate a palette and click the "CSS" or "Tailwind" button to copy the code. Individual colors can be copied by clicking on them or using the "Copy" button next to each format.',
  },
  {
    question: 'Is my data safe when using this tool?',
    answer:
      'Absolutely! All color processing and image analysis happens entirely in your browser. No data is ever sent to any server. Your saved colors are stored locally in your browser storage, ensuring complete privacy.',
  },
];

const relatedTools = [
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images while maintaining quality',
  },
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images instantly',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Create customizable QR codes with colors',
  },
  {
    name: 'Format Converter',
    href: '/format-converter',
    description: 'Convert between image formats',
  },
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format and validate JSON data',
  },
  {
    name: 'Text Case Converter',
    href: '/text-case-converter',
    description: 'Transform text between different cases',
  },
];

const seoDescription = `
Color selection and management is fundamental to web design, graphic design, and digital art. Whether you are a web developer styling a website, a designer creating brand guidelines, or an artist exploring color combinations, having the right tools makes all the difference. Our free online color picker provides everything you need to work with colors efficiently and effectively.

Understanding Color Formats

Different situations call for different color formats. HEX codes are the most common format in web development, offering a compact six-character representation using hexadecimal notation. When you see colors like #3B82F6 or #FF5733 in CSS, that is HEX format at work.

RGB (Red, Green, Blue) breaks colors down into their three component channels, each ranging from 0 to 255. This format is intuitive for understanding how colors mix additively on screens. CSS supports RGB with syntax like rgb(59, 130, 246), and you can add alpha transparency with rgba().

HSL (Hue, Saturation, Lightness) takes a different approach, representing colors in a way that matches human perception. The hue is the base color (0-360 degrees on the color wheel), saturation controls intensity (0-100%), and lightness adjusts brightness (0-100%). This makes HSL excellent for creating color variations - simply adjust lightness to create shades and tints while maintaining the same hue.

HSV (Hue, Saturation, Value), also known as HSB (Hue, Saturation, Brightness), is similar to HSL but uses a different brightness model preferred by many design applications like Adobe Photoshop and Illustrator.

CMYK (Cyan, Magenta, Yellow, Key/Black) is essential for print design, as printers use these four ink colors. While not directly used in web development, understanding CMYK helps when preparing designs for both digital and print media.

Creating Harmonious Color Palettes

Color theory provides proven methods for creating visually appealing color combinations. Our palette generator implements six key color harmony algorithms.

Complementary colors sit opposite each other on the color wheel, creating high contrast and visual impact. Use these for call-to-action buttons or elements that need to stand out.

Triadic schemes use three colors equally spaced on the wheel, creating vibrant and balanced palettes. These work well for playful designs and infographics.

Analogous colors are neighbors on the wheel, creating cohesive and soothing palettes. They are perfect for backgrounds and subtle design elements.

Split-complementary adds sophistication by using a color plus the two neighbors of its complement, offering contrast without the intensity of pure complementary schemes.

Tetradic (rectangle) schemes use four colors forming a rectangle on the wheel, providing maximum variety while maintaining balance.

Monochromatic palettes explore shades and tints of a single hue, creating elegant and professional designs.

Accessibility and Contrast

Web accessibility is not optional - it is essential for inclusive design. The WCAG (Web Content Accessibility Guidelines) define minimum contrast ratios for text readability. Our contrast checker evaluates your color combinations against these standards.

WCAG AA requires a 4.5:1 contrast ratio for normal text and 3:1 for large text. WCAG AAA, the highest standard, requires 7:1 for normal text and 4.5:1 for large text. Meeting these requirements ensures your content is readable by users with visual impairments.

Color Extraction from Images

Sometimes the perfect palette already exists in a photograph or artwork. Our color extraction feature analyzes any uploaded image and identifies its dominant colors using intelligent color quantization algorithms. This is invaluable for creating website themes based on brand photography, ensuring visual consistency across your designs.

Export Options for Developers

We understand developers need colors in formats ready for their projects. Export palettes as CSS custom properties for modern CSS architecture, or as Tailwind CSS configuration for utility-first workflows. Individual colors can be copied in any format with a single click.

All processing happens locally in your browser using efficient JavaScript and Canvas APIs. Your images and color data never leave your device, ensuring complete privacy and instant results.
`.trim();

export function ColorPickerPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Color Picker"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <ColorPicker />
    </ToolLayout>
  );
}

export default ColorPickerPage;
