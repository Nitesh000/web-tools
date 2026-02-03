/**
 * SEO Meta Data for Web Tools Suite
 * Comprehensive metadata for all tools optimized for search engine ranking
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMetaData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  faqItems: FAQItem[];
  slug: string;
  category: string;
}

export interface SiteMetaData {
  siteName: string;
  siteUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
  locale: string;
  themeColor: string;
}

export const siteMetaData: SiteMetaData = {
  siteName: 'Web Tools Suite',
  siteUrl: 'https://webtools.suite',
  defaultOgImage: '/og-default.png',
  twitterHandle: '@webtoolssuite',
  locale: 'en_US',
  themeColor: '#3B82F6',
};

export const toolsMetaData: Record<string, ToolMetaData> = {
  'background-remover': {
    title: 'Free Background Remover - Remove Image Backgrounds Instantly Online',
    description:
      'Remove backgrounds from images instantly with our free AI-powered tool. No signup required. Fast, secure, and works entirely in your browser.',
    keywords: [
      'background remover',
      'remove background',
      'image background remover',
      'free background remover',
      'remove image background online',
      'transparent background',
      'AI background removal',
      'photo background eraser',
      'remove bg',
      'background eraser online',
    ],
    ogImage: '/og/background-remover.png',
    slug: 'background-remover',
    category: 'Image Tools',
    faqItems: [
      {
        question: 'How does the background remover work?',
        answer:
          'Our background remover uses advanced AI technology that runs directly in your browser. It automatically detects the subject in your image and removes the background, creating a transparent PNG. No data is uploaded to any server.',
      },
      {
        question: 'Is the background remover free to use?',
        answer:
          'Yes, our background remover is completely free with no limits on usage. There are no watermarks, no signup required, and no hidden fees.',
      },
      {
        question: 'What image formats are supported?',
        answer:
          'The background remover supports all common image formats including PNG, JPG, JPEG, WebP, and BMP. The output is always a transparent PNG file.',
      },
      {
        question: 'Is my data safe when using this tool?',
        answer:
          'Absolutely. All processing happens locally in your browser. Your images are never uploaded to any server, ensuring complete privacy and security.',
      },
      {
        question: 'Can I remove backgrounds from multiple images at once?',
        answer:
          'Yes, you can process multiple images in batch. Simply select or drag multiple images into the tool, and they will be processed one after another.',
      },
    ],
  },

  'image-compressor': {
    title: 'Free Image Compressor - Compress Images Online Without Quality Loss',
    description:
      'Compress images online for free without losing quality. Reduce file size by up to 90%. Supports PNG, JPG, WebP. Fast, secure browser-based compression.',
    keywords: [
      'image compressor',
      'compress image',
      'image compression',
      'reduce image size',
      'compress png',
      'compress jpg',
      'compress jpeg',
      'online image compressor',
      'free image compressor',
      'reduce file size',
      'optimize images',
      'image optimizer',
    ],
    ogImage: '/og/image-compressor.png',
    slug: 'image-compressor',
    category: 'Image Tools',
    faqItems: [
      {
        question: 'How much can I compress my images?',
        answer:
          'Our image compressor can reduce file sizes by up to 90% while maintaining excellent visual quality. The exact compression ratio depends on the original image format and content.',
      },
      {
        question: 'Will compressing images reduce quality?',
        answer:
          'Our smart compression algorithm preserves image quality while significantly reducing file size. You can also adjust the quality slider to find the perfect balance between size and quality.',
      },
      {
        question: 'What image formats can I compress?',
        answer:
          'You can compress PNG, JPG, JPEG, WebP, and GIF images. Each format uses optimized compression algorithms for the best results.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'There is no strict file size limit. However, very large images may take longer to process. For best performance, we recommend images under 50MB.',
      },
      {
        question: 'Can I compress multiple images at once?',
        answer:
          'Yes, our batch compression feature allows you to compress multiple images simultaneously. Simply drag and drop all your images into the tool.',
      },
    ],
  },

  'image-format-converter': {
    title: 'Free Image Format Converter - Convert PNG, JPG, WebP, GIF Online',
    description:
      'Convert images between PNG, JPG, WebP, GIF, and BMP formats instantly. Free online image converter with no signup. Fast browser-based conversion.',
    keywords: [
      'image converter',
      'convert image',
      'png to jpg',
      'jpg to png',
      'webp to png',
      'png to webp',
      'image format converter',
      'free image converter',
      'online image converter',
      'convert to webp',
      'gif converter',
      'bmp converter',
    ],
    ogImage: '/og/image-format-converter.png',
    slug: 'image-format-converter',
    category: 'Image Tools',
    faqItems: [
      {
        question: 'What image formats can I convert between?',
        answer:
          'You can convert between PNG, JPG/JPEG, WebP, GIF, and BMP formats. All conversions are supported in any direction.',
      },
      {
        question: 'Does converting images affect quality?',
        answer:
          'Converting between lossless formats (like PNG to BMP) preserves full quality. When converting to lossy formats (like JPG), you can adjust the quality setting to control the output.',
      },
      {
        question: 'Why should I convert to WebP format?',
        answer:
          'WebP offers superior compression compared to PNG and JPG, resulting in smaller file sizes with similar quality. It is supported by all modern browsers and is ideal for web use.',
      },
      {
        question: 'Can I convert animated GIFs?',
        answer:
          'When converting animated GIFs to other formats, only the first frame will be converted. To preserve animation, keep the GIF format or convert to video formats.',
      },
      {
        question: 'Is the conversion done on your servers?',
        answer:
          'No, all conversions happen directly in your browser. Your images never leave your device, ensuring complete privacy and faster processing.',
      },
    ],
  },

  'video-to-gif': {
    title: 'Free Video to GIF Converter - Convert MP4 to GIF Online',
    description:
      'Convert videos to GIF animations instantly online. Free MP4 to GIF converter with custom frame rate and size options. No watermarks, no signup required.',
    keywords: [
      'video to gif',
      'mp4 to gif',
      'convert video to gif',
      'gif maker',
      'video gif converter',
      'free gif converter',
      'online gif maker',
      'create gif from video',
      'gif creator',
      'animated gif maker',
    ],
    ogImage: '/og/video-to-gif.png',
    slug: 'video-to-gif',
    category: 'Video Tools',
    faqItems: [
      {
        question: 'What video formats can I convert to GIF?',
        answer:
          'Our converter supports MP4, WebM, MOV, AVI, and most other common video formats. Simply upload your video and we will handle the conversion.',
      },
      {
        question: 'Can I customize the GIF output?',
        answer:
          'Yes, you can adjust frame rate, resolution, start/end time, and quality settings. This gives you full control over the final GIF size and appearance.',
      },
      {
        question: 'Is there a video length limit?',
        answer:
          'While there is no strict limit, we recommend keeping videos under 30 seconds for optimal GIF file sizes. Longer videos will result in larger GIF files.',
      },
      {
        question: 'Why is my GIF file so large?',
        answer:
          'GIF files can be large due to high resolution or frame rate. Try reducing the dimensions, lowering the frame rate, or shortening the duration to reduce file size.',
      },
      {
        question: 'Can I trim the video before converting?',
        answer:
          'Yes, our tool includes a video trimmer. You can set custom start and end points to convert only the portion of the video you want.',
      },
    ],
  },

  'qr-code-generator': {
    title: 'Free QR Code Generator - Create Custom QR Codes Online',
    description:
      'Generate QR codes for free with custom colors, logos, and styles. Create QR codes for URLs, text, WiFi, vCard, and more. Download as PNG or SVG.',
    keywords: [
      'qr code generator',
      'create qr code',
      'qr code maker',
      'free qr code',
      'custom qr code',
      'qr code with logo',
      'wifi qr code',
      'url qr code',
      'vcard qr code',
      'qr code creator',
    ],
    ogImage: '/og/qr-code-generator.png',
    slug: 'qr-code-generator',
    category: 'Utility Tools',
    faqItems: [
      {
        question: 'What can I create QR codes for?',
        answer:
          'You can create QR codes for URLs, plain text, WiFi networks, vCards (contact information), email addresses, phone numbers, SMS messages, and more.',
      },
      {
        question: 'Can I customize the QR code appearance?',
        answer:
          'Yes, you can customize colors, add a logo or image in the center, change corner styles, and adjust error correction levels to create unique branded QR codes.',
      },
      {
        question: 'What format should I download my QR code in?',
        answer:
          'For web use, PNG is ideal. For print materials or when you need scalability, download as SVG. SVG files can be scaled to any size without losing quality.',
      },
      {
        question: 'Do QR codes expire?',
        answer:
          'Static QR codes (like those generated by our tool) never expire. They encode information directly and work forever as long as the linked content exists.',
      },
      {
        question: 'What is error correction in QR codes?',
        answer:
          'Error correction allows QR codes to be read even when partially damaged or obscured. Higher error correction (like H level) means more redundancy, allowing for logos to be placed in the center.',
      },
    ],
  },

  'password-generator': {
    title: 'Free Password Generator - Create Strong Secure Passwords Online',
    description:
      'Generate strong, secure passwords instantly. Customize length, characters, and complexity. Free password generator with no data stored. Stay secure online.',
    keywords: [
      'password generator',
      'strong password',
      'secure password',
      'random password',
      'password creator',
      'free password generator',
      'online password generator',
      'generate password',
      'safe password',
      'complex password',
    ],
    ogImage: '/og/password-generator.png',
    slug: 'password-generator',
    category: 'Security Tools',
    faqItems: [
      {
        question: 'How secure are the generated passwords?',
        answer:
          'Our passwords are generated using cryptographically secure random number generation. They are created entirely in your browser and are never stored or transmitted anywhere.',
      },
      {
        question: 'What makes a strong password?',
        answer:
          'A strong password is at least 12-16 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special characters. Our generator creates passwords meeting these criteria.',
      },
      {
        question: 'Can I customize the password requirements?',
        answer:
          'Yes, you can customize length, include or exclude uppercase/lowercase letters, numbers, and special characters. You can also exclude ambiguous characters like 0, O, l, and 1.',
      },
      {
        question: 'Are the passwords saved anywhere?',
        answer:
          'No, passwords are generated locally in your browser and are never sent to any server. Once you leave the page, the generated password exists only if you saved it.',
      },
      {
        question: 'How often should I change my passwords?',
        answer:
          'Security experts now recommend using unique, strong passwords for each account rather than changing them frequently. Use a password manager to keep track of your passwords securely.',
      },
    ],
  },

  'text-case-converter': {
    title: 'Free Text Case Converter - Change Text Case Online Instantly',
    description:
      'Convert text to uppercase, lowercase, title case, sentence case and more. Free online text case converter. Transform text formatting instantly.',
    keywords: [
      'text case converter',
      'uppercase converter',
      'lowercase converter',
      'title case',
      'sentence case',
      'text transformer',
      'change text case',
      'capitalize text',
      'text formatting',
      'case converter online',
    ],
    ogImage: '/og/text-case-converter.png',
    slug: 'text-case-converter',
    category: 'Text Tools',
    faqItems: [
      {
        question: 'What text cases can I convert to?',
        answer:
          'You can convert to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and more. We support all common text formatting styles.',
      },
      {
        question: 'Can I convert large amounts of text?',
        answer:
          'Yes, there is no limit to the amount of text you can convert. The conversion happens instantly in your browser regardless of text length.',
      },
      {
        question: 'What is Title Case vs Sentence case?',
        answer:
          'Title Case Capitalizes The First Letter Of Each Word, while Sentence case only capitalizes the first letter of each sentence. Use Title Case for headings and Sentence case for regular text.',
      },
      {
        question: 'What is camelCase used for?',
        answer:
          'camelCase is commonly used in programming for variable and function names. The first word is lowercase, and subsequent words start with capital letters without spaces.',
      },
      {
        question: 'Can I use this for programming variable names?',
        answer:
          'Yes, we support camelCase, PascalCase, snake_case, and kebab-case which are all common conventions in different programming languages and frameworks.',
      },
    ],
  },

  'color-picker': {
    title: 'Free Color Picker - HEX, RGB, HSL Color Converter Online',
    description:
      'Pick and convert colors between HEX, RGB, HSL formats. Free color picker with palette generator. Copy color codes instantly for web development.',
    keywords: [
      'color picker',
      'hex color',
      'rgb color',
      'hsl color',
      'color converter',
      'color palette generator',
      'web colors',
      'color code',
      'html colors',
      'css colors',
      'color tool',
    ],
    ogImage: '/og/color-picker.png',
    slug: 'color-picker',
    category: 'Design Tools',
    faqItems: [
      {
        question: 'What color formats are supported?',
        answer:
          'Our color picker supports HEX, RGB, RGBA, HSL, HSLA, and HSV formats. You can convert between any of these formats instantly.',
      },
      {
        question: 'How do I copy the color code?',
        answer:
          'Simply click on the color code you want to copy, and it will be copied to your clipboard. You can copy in any supported format.',
      },
      {
        question: 'Can I generate color palettes?',
        answer:
          'Yes, our tool can generate complementary, analogous, triadic, and other color harmonies. You can also create custom palettes and export them.',
      },
      {
        question: 'What is the difference between RGB and HEX?',
        answer:
          'HEX and RGB represent the same colors differently. HEX uses a 6-character code (like #FF5733), while RGB uses three values from 0-255 (like rgb(255, 87, 51)). Both work in CSS.',
      },
      {
        question: 'Can I pick colors from images?',
        answer:
          'Yes, you can upload an image and use our eyedropper tool to pick any color from it. The color values will be displayed in all supported formats.',
      },
    ],
  },

  'json-formatter': {
    title: 'Free JSON Formatter & Validator - Format JSON Online',
    description:
      'Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting. Minify, sort keys, and fix common JSON errors instantly.',
    keywords: [
      'json formatter',
      'json validator',
      'json beautifier',
      'format json',
      'json parser',
      'json viewer',
      'json minifier',
      'validate json',
      'json editor online',
      'pretty print json',
    ],
    ogImage: '/og/json-formatter.png',
    slug: 'json-formatter',
    category: 'Developer Tools',
    faqItems: [
      {
        question: 'What can I do with the JSON formatter?',
        answer:
          'You can format (beautify) JSON with proper indentation, minify JSON to reduce size, validate JSON syntax, sort keys alphabetically, and convert JSON to other formats.',
      },
      {
        question: 'How do I validate my JSON?',
        answer:
          'Simply paste your JSON into the editor. Any syntax errors will be highlighted with line numbers and helpful error messages explaining what is wrong.',
      },
      {
        question: 'Can I minify JSON for production?',
        answer:
          'Yes, click the minify button to remove all whitespace and create the smallest possible JSON string. This is useful for reducing payload sizes in APIs.',
      },
      {
        question: 'Is my JSON data secure?',
        answer:
          'Yes, all processing happens locally in your browser. Your JSON data is never sent to any server or stored anywhere.',
      },
      {
        question: 'Can I download the formatted JSON?',
        answer:
          'Yes, you can download the formatted or minified JSON as a .json file with a single click.',
      },
    ],
  },

  'invoice-generator': {
    title: 'Free Invoice Generator - Create Professional Invoices Online',
    description:
      'Create professional invoices for free. Customize with your logo, add line items, tax calculations. Download as PDF instantly. No signup required.',
    keywords: [
      'invoice generator',
      'create invoice',
      'free invoice maker',
      'invoice template',
      'professional invoice',
      'invoice pdf',
      'billing software',
      'invoice creator',
      'online invoice',
      'make invoice',
    ],
    ogImage: '/og/invoice-generator.png',
    slug: 'invoice-generator',
    category: 'Business Tools',
    faqItems: [
      {
        question: 'Is the invoice generator really free?',
        answer:
          'Yes, our invoice generator is completely free with no limits. Create unlimited invoices, download as PDF, and add your branding without any cost.',
      },
      {
        question: 'Can I add my company logo to invoices?',
        answer:
          'Yes, you can upload your company logo and it will appear on all your invoices. You can also customize colors to match your brand.',
      },
      {
        question: 'What payment terms can I add?',
        answer:
          'You can add custom payment terms, due dates, payment methods, and notes. Common terms like Net 30, Net 15, or Due on Receipt are available as presets.',
      },
      {
        question: 'Can I calculate taxes automatically?',
        answer:
          'Yes, you can set tax rates and the invoice will automatically calculate subtotals, taxes, and totals. Multiple tax rates can be applied if needed.',
      },
      {
        question: 'Are my invoice details stored?',
        answer:
          'Invoice data is stored locally in your browser for convenience. You can clear this data anytime. Nothing is sent to our servers.',
      },
    ],
  },

  'json-viewer': {
    title: 'Free JSON Viewer Online - View, Explore & Analyze JSON Data',
    description:
      'Free online JSON viewer with full-screen mode, tree navigation, search, and syntax highlighting. Explore complex JSON structures easily. No signup required, works entirely in your browser.',
    keywords: [
      'json viewer',
      'json viewer online',
      'free json viewer',
      'json tree viewer',
      'json explorer',
      'view json',
      'json reader',
      'json browser',
      'json inspector',
      'json analyzer',
      'json data viewer',
      'online json viewer',
      'json file viewer',
      'json structure viewer',
      'interactive json viewer',
      'json navigation',
      'json search',
      'fullscreen json viewer',
      'json visualizer',
      'best json viewer',
    ],
    ogImage: '/og/json-viewer.png',
    slug: 'json-viewer',
    category: 'Developer Tools',
    faqItems: [
      {
        question: 'What is a JSON viewer?',
        answer:
          'A JSON viewer is a tool that helps you visualize and explore JSON data in an organized, readable format. Instead of looking at raw JSON text, you can see data in a tree structure, expand/collapse sections, search for specific values, and navigate complex nested objects easily.',
      },
      {
        question: 'How do I use this JSON viewer?',
        answer:
          'Simply paste your JSON data into the input area on the left. The viewer will automatically parse and display it in multiple formats: tree view for navigation, formatted view with line numbers, and raw view. Use the toolbar to format, minify, copy, or download your JSON.',
      },
      {
        question: 'Does this JSON viewer work with large files?',
        answer:
          'Yes, our JSON viewer is optimized for performance and can handle large JSON files efficiently. All processing happens in your browser, so there are no upload limits. For very large files, you can use the collapse all feature to focus on specific sections.',
      },
      {
        question: 'Can I search within my JSON data?',
        answer:
          'Yes, use the search box in the tree view to find specific keys or values instantly. Matching results are highlighted, making it easy to locate data in complex nested structures.',
      },
      {
        question: 'Is my JSON data secure?',
        answer:
          'Absolutely. All processing happens locally in your browser. Your JSON data is never uploaded to any server, ensuring complete privacy. When you close the tab, all data is cleared.',
      },
      {
        question: 'What is the full-screen mode for?',
        answer:
          'Full-screen mode expands the JSON viewer to fill your entire screen, providing maximum space for viewing and navigating large JSON documents. Press Escape or click the exit button to return to normal view.',
      },
      {
        question: 'Can I download the formatted JSON?',
        answer:
          'Yes, click the download button to save your JSON as a .json file. You can choose the indentation level (2 spaces, 4 spaces, or 8 spaces) before downloading.',
      },
      {
        question: 'What is the difference between JSON Viewer and JSON Formatter?',
        answer:
          'JSON Viewer is focused on exploring and navigating JSON data with features like tree view and search. JSON Formatter is more focused on formatting, validating, and converting JSON to other formats like YAML or TypeScript. Both tools complement each other for different use cases.',
      },
    ],
  },

  'markdown-editor': {
    title: 'Free Markdown Editor Online - Write & Preview Markdown',
    description:
      'Free online Markdown editor with live preview, auto-save to browser storage, templates, and export to .md or .html. Write beautiful documents with no signup required.',
    keywords: [
      'markdown editor',
      'markdown editor online',
      'free markdown editor',
      'online markdown editor',
      'markdown preview',
      'live markdown preview',
      'markdown writer',
      'md editor',
      'markdown generator',
      'markdown creator',
      'write markdown online',
      'markdown to html',
      'github markdown editor',
      'readme editor',
      'markdown document editor',
      'best markdown editor',
      'simple markdown editor',
      'markdown text editor',
      'markdown notepad',
      'markdown tool',
      'markdown download',
      'export markdown',
      'markdown file creator',
      'markdown with autosave',
      'browser markdown editor',
    ],
    ogImage: '/og/markdown-editor.png',
    slug: 'markdown-editor',
    category: 'Document Tools',
    faqItems: [
      {
        question: 'What is Markdown?',
        answer:
          'Markdown is a lightweight markup language that lets you write formatted text using simple symbols. For example, **bold** creates bold text, # creates headings, and [text](url) creates links. It is widely used for README files, documentation, blogs, and notes.',
      },
      {
        question: 'Does this editor save my work automatically?',
        answer:
          'Yes, the editor automatically saves your work to your browser local storage every second. Your content persists even if you close the browser or refresh the page. You can also manually save documents with custom names to organize multiple files.',
      },
      {
        question: 'Can I export my Markdown document?',
        answer:
          'Yes, you can export your document as a .md (Markdown) file or as a .html file with styled formatting. Click the respective download button to save your work to your computer.',
      },
      {
        question: 'Are there templates available?',
        answer:
          'Yes, we provide several templates to help you get started: README (for GitHub projects), Blog Post, Documentation, and Meeting Notes. Select a template from the dropdown menu to load it instantly.',
      },
      {
        question: 'Can I see a live preview of my Markdown?',
        answer:
          'Yes, the editor features split-screen view with live preview. As you type Markdown on the left, you see the rendered result on the right in real-time. You can also switch to edit-only or preview-only modes.',
      },
      {
        question: 'Is there a full-screen mode?',
        answer:
          'Yes, click the full-screen button to expand the editor to fill your entire screen for distraction-free writing. Press Escape to exit full-screen mode.',
      },
      {
        question: 'What Markdown features are supported?',
        answer:
          'Our editor supports all common Markdown features: headings (H1-H6), bold, italic, strikethrough, links, images, code blocks with syntax highlighting, blockquotes, ordered and unordered lists, horizontal rules, and inline code.',
      },
      {
        question: 'Is my data secure and private?',
        answer:
          'Yes, everything runs locally in your browser. Your documents are stored in your browser local storage and are never uploaded to any server. Only you have access to your data.',
      },
      {
        question: 'Can I manage multiple documents?',
        answer:
          'Yes, click the sidebar button to see all your saved documents. You can create new documents, switch between them, rename them, and delete ones you no longer need.',
      },
      {
        question: 'What is the word and character count for?',
        answer:
          'The status bar shows real-time word count, character count, and line count to help you track the length of your document. This is useful for blog posts, articles, or any content with length requirements.',
      },
    ],
  },
};

/**
 * Get meta data for a specific tool by slug
 */
export function getToolMetaData(slug: string): ToolMetaData | undefined {
  return toolsMetaData[slug];
}

/**
 * Get all tool slugs
 */
export function getAllToolSlugs(): string[] {
  return Object.keys(toolsMetaData);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ToolMetaData[] {
  return Object.values(toolsMetaData).filter((tool) => tool.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(Object.values(toolsMetaData).map((tool) => tool.category));
  return Array.from(categories);
}

/**
 * Home page meta data
 */
export const homeMetaData = {
  title: 'Web Tools Suite - Free Online Tools for Images, Videos, PDFs & More',
  description:
    'Free online tools for image editing, video conversion, PDF manipulation, and more. No signup required. Fast, secure, and works entirely in your browser.',
  keywords: [
    'online tools',
    'free tools',
    'web tools',
    'image tools',
    'video tools',
    'pdf tools',
    'developer tools',
    'productivity tools',
    'browser tools',
    'no signup tools',
  ],
  ogImage: '/og/home.png',
};
