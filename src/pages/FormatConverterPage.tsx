import { ToolLayout } from '../components/common/ToolLayout';
import { FormatConverter } from '../components/tools/format-converter/FormatConverter';
import { SEOHead } from '../seo/SEOHead';
import { toolsMetaData } from '../seo/meta-data';

const toolMeta = toolsMetaData['image-format-converter'];

const seoMeta = {
  title: toolMeta.title,
  description: toolMeta.description,
  keywords: toolMeta.keywords,
  canonicalUrl: 'https://webtools.suite/format-converter',
  ogImage: toolMeta.ogImage,
};

const howToUseSteps = [
  'Drag and drop your images into the upload area, or click to browse and select files. Supported input formats include PNG, JPG, WebP, GIF, BMP, and TIFF.',
  'Choose your desired output format from the conversion settings panel. Available formats are PNG, JPEG, WebP, and AVIF.',
  'Adjust quality settings for lossy formats (JPEG, WebP, AVIF). Higher quality means larger files but better image fidelity.',
  'Optionally enable resizing to set maximum dimensions while maintaining aspect ratio.',
  'For formats that support it, choose whether to preserve transparency or fill transparent areas with a white background.',
  'Click "Convert All" to process your images. Track progress for each file as it converts.',
  'Download individual converted images or click "Download All as ZIP" to get everything in one archive.',
];

const faqs = [
  {
    question: 'What image formats can I convert between?',
    answer:
      'You can convert from PNG, JPG/JPEG, WebP, GIF, BMP, and TIFF formats. Output formats include PNG, JPEG, WebP, and AVIF. All conversions are performed directly in your browser.',
  },
  {
    question: 'Does converting images affect quality?',
    answer:
      'Converting between lossless formats (like PNG to BMP) preserves full quality. When converting to lossy formats (like JPEG or WebP), you can adjust the quality setting to control the balance between file size and visual quality. Higher quality settings preserve more detail.',
  },
  {
    question: 'Why should I convert to WebP format?',
    answer:
      'WebP offers superior compression compared to PNG and JPEG, resulting in significantly smaller file sizes with similar or better visual quality. It supports both lossy and lossless compression, transparency, and animation. WebP is supported by all modern browsers and is ideal for web use.',
  },
  {
    question: 'What is AVIF format?',
    answer:
      'AVIF (AV1 Image File Format) is a modern image format that offers even better compression than WebP in many cases. It supports high dynamic range (HDR), wide color gamut, and transparency. Note that AVIF support depends on your browser capabilities.',
  },
  {
    question: 'Can I convert animated GIFs?',
    answer:
      'When converting animated GIFs to other formats, only the first frame will be converted. To preserve animation, keep the GIF format or consider using our Video to GIF tool for creating new animations.',
  },
  {
    question: 'Is the conversion done on your servers?',
    answer:
      'No, all conversions happen directly in your browser using HTML5 Canvas and modern JavaScript APIs. Your images never leave your device, ensuring complete privacy and faster processing.',
  },
  {
    question: 'What happens to transparent backgrounds?',
    answer:
      'For formats that support transparency (PNG, WebP, AVIF), you can choose to preserve transparent areas. When converting to JPEG (which does not support transparency), transparent areas are filled with white.',
  },
  {
    question: 'Can I resize images during conversion?',
    answer:
      'Yes! Enable the resize option and set maximum width and height dimensions. Images will be scaled down to fit within these dimensions while maintaining their original aspect ratio.',
  },
];

const relatedTools = [
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
  },
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images instantly',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Generate custom QR codes for any content',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between formats',
  },
  {
    name: 'Video to GIF',
    href: '/video-to-gif',
    description: 'Convert video clips to animated GIFs',
  },
  {
    name: 'Password Generator',
    href: '/password-generator',
    description: 'Create strong, secure passwords instantly',
  },
];

const seoDescription = `
Image format conversion is a fundamental task in digital media workflows, and our free online format converter makes it easier than ever to transform your images between popular formats. Whether you need to convert PNG to JPG for smaller file sizes, transform images to modern WebP format for web optimization, or convert legacy formats to something more accessible, our tool handles it all directly in your browser.

Understanding Image Formats

Different image formats serve different purposes, and knowing when to use each one can significantly impact your projects. PNG (Portable Network Graphics) is a lossless format that supports transparency, making it ideal for logos, icons, graphics with text, and images requiring crisp edges. JPEG (Joint Photographic Experts Group) uses lossy compression that excels at photographs and complex images where small quality losses are acceptable in exchange for much smaller file sizes.

WebP is a modern format developed by Google that combines the best of both worlds, offering both lossy and lossless compression modes with excellent quality-to-size ratios. It typically produces files 25-35% smaller than JPEG at equivalent quality, while also supporting transparency like PNG. Most modern browsers now support WebP, making it an excellent choice for web images.

AVIF (AV1 Image File Format) represents the cutting edge of image compression technology. Based on the AV1 video codec, AVIF can achieve even better compression than WebP in many cases. It supports HDR, wide color gamuts, and transparency. Browser support for AVIF is growing rapidly, making it an increasingly viable option for forward-thinking projects.

Why Convert Image Formats?

There are numerous scenarios where converting between image formats is necessary or beneficial. Web developers often need to convert images to WebP or AVIF to improve page load times and reduce bandwidth consumption. Designers may need to convert between PNG and JPEG depending on whether their images require transparency or benefit from smaller file sizes.

When preparing images for print, specific formats may be required by printing services. Converting digital photos to standard formats ensures compatibility with various software and services. Legacy formats like BMP or TIFF can be converted to more efficient modern formats for easier storage and sharing.

Batch Conversion for Productivity

Our converter supports processing multiple images at once, dramatically improving productivity for tasks involving many files. Upload dozens of images, configure your settings once, and convert them all with a single click. This batch capability is invaluable for tasks like migrating website images to a new format, preparing asset libraries for different platforms, or standardizing image formats across a project.

Quality Control Options

Not all conversions are created equal, which is why we provide granular control over the conversion process. For lossy formats, adjust the quality slider to find your optimal balance between file size and visual fidelity. Higher quality settings (85-95%) preserve maximum detail while still achieving good compression. Lower settings (60-75%) prioritize smaller files and work well for thumbnails or less critical images.

Resize While Converting

Our tool allows you to resize images during the conversion process, combining two common tasks into one efficient operation. Set maximum dimensions and let the converter automatically scale down oversized images while maintaining proper aspect ratios. This is perfect for preparing images for specific display sizes or reducing both format and dimension in a single step.

Transparency Handling

When working with images that have transparent areas, our converter gives you control over how transparency is handled. For formats that support transparency (PNG, WebP, AVIF), you can preserve transparent pixels. When converting to JPEG, which does not support transparency, you can choose to fill transparent areas with a solid background color.

Privacy and Security First

Every conversion happens locally in your browser using HTML5 Canvas technology. Your images are processed using your device's computing power and never uploaded to any external server. This ensures complete privacy for sensitive images, confidential documents, or any content you prefer to keep private. There are no usage logs, no temporary storage, and no data collection of any kind.

No Installation Required

Access professional-grade image conversion from any device with a modern web browser. There is no software to download, no plugins to install, and no account to create. Whether you are using Windows, macOS, Linux, Chrome OS, or even a mobile device, our converter works seamlessly across platforms.

Free and Unlimited Usage

Convert as many images as you need without any restrictions. There are no daily limits, no file size caps for reasonable images, no watermarks, and no premium tiers. Our tool is designed to be genuinely useful without artificial limitations or hidden costs.

Modern Browser Technology

Our converter leverages the latest web technologies including HTML5 Canvas, modern JavaScript APIs, and WebAssembly where available. This means fast, efficient conversions that take advantage of your device's capabilities. For supported browsers, even advanced formats like AVIF can be created directly in the browser without any server interaction.

Whether you are optimizing images for the web, preparing assets for different platforms, converting legacy formats, or simply need to change an image from one format to another, our format converter provides a fast, private, and completely free solution that works anywhere you have a browser.
`.trim();

export function FormatConverterPage() {
  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        canonicalUrl={seoMeta.canonicalUrl}
        ogImage={seoMeta.ogImage}
        faqItems={faqs}
      />
      <ToolLayout
        seo={seoMeta}
        title="Image Format Converter"
        description={seoDescription}
        howToUse={howToUseSteps}
        faqs={faqs}
        relatedTools={relatedTools}
        privacyNote="Your files are processed entirely in your browser"
      >
        <FormatConverter />
      </ToolLayout>
    </>
  );
}

export default FormatConverterPage;
