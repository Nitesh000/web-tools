import { ToolLayout } from '../components/common/ToolLayout';
import { ImageCompressor } from '../components/tools/image-compressor/ImageCompressor';
import { SEOHead } from '../seo/SEOHead';
import { toolsMetaData } from '../seo/meta-data';

const toolMeta = toolsMetaData['image-compressor'];

const seoMeta = {
  title: toolMeta.title,
  description: toolMeta.description,
  keywords: toolMeta.keywords,
  canonicalUrl: 'https://webtools.suite/image-compressor',
  ogImage: toolMeta.ogImage,
};

const howToUseSteps = [
  'Drag and drop your images into the upload area, or click to browse and select files from your device. You can upload multiple images at once.',
  'Adjust the compression settings: set the quality level (1-100%), maximum width and height dimensions, and choose the output format.',
  'Click the "Compress" button to start processing all your uploaded images.',
  'Monitor the compression progress for each image. You can see the original and compressed previews side by side.',
  'Review the compression results showing original size, compressed size, and percentage reduction for each image.',
  'Download individual compressed images or use "Download All" to get all images in a single ZIP file.',
  'Use the "Clear All" button to start fresh with new images.',
];

const faqs = [
  {
    question: 'How much can I compress my images?',
    answer:
      'Our image compressor can reduce file sizes by up to 90% while maintaining excellent visual quality. The exact compression ratio depends on the original image format, content complexity, and the quality setting you choose.',
  },
  {
    question: 'Will compressing images reduce their quality?',
    answer:
      'Our smart compression algorithm is designed to preserve image quality while significantly reducing file size. At quality settings of 70-85%, most images show no visible difference to the human eye. You can adjust the quality slider to find the perfect balance between size and quality for your needs.',
  },
  {
    question: 'What image formats can I compress?',
    answer:
      'You can compress PNG, JPG, JPEG, WebP, and GIF images. Each format uses optimized compression algorithms tailored to its characteristics for the best possible results.',
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'There is no strict file size limit. However, very large images (over 50MB) may take longer to process. For best performance and quick results, we recommend images under 20MB.',
  },
  {
    question: 'Can I compress multiple images at once?',
    answer:
      'Yes! Our batch compression feature allows you to upload and compress multiple images simultaneously. Simply drag and drop all your images into the upload area, and they will all be processed together.',
  },
  {
    question: 'What is the difference between lossy and lossless compression?',
    answer:
      'Lossy compression (JPEG, WebP) removes some image data to achieve smaller file sizes, which may cause slight quality loss at lower settings. Lossless compression (PNG) preserves all image data but typically results in larger files. Our tool lets you choose the right approach for your needs.',
  },
  {
    question: 'How does the quality slider work?',
    answer:
      'The quality slider (1-100%) controls the compression intensity. Higher values preserve more detail but result in larger files. Lower values create smaller files but may show compression artifacts. For most uses, 70-85% provides an excellent balance.',
  },
  {
    question: 'Can I resize images while compressing them?',
    answer:
      'Yes! You can set maximum width and height dimensions. Images larger than these dimensions will be scaled down proportionally while maintaining their aspect ratio, further reducing file size.',
  },
];

const relatedTools = [
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images instantly',
  },
  {
    name: 'Format Converter',
    href: '/format-converter',
    description: 'Convert images between different formats',
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
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format and validate JSON data',
  },
];

const seoDescription = `
Image compression is an essential skill in today's digital landscape where bandwidth, storage, and loading times matter more than ever. Our free online image compressor helps you reduce file sizes dramatically while maintaining the visual quality your projects demand, all without uploading your files to any server.

Why Compress Your Images?

Large image files slow down websites, consume excessive bandwidth, fill up storage space, and create poor user experiences. Studies show that even a one-second delay in page load time can reduce conversions by 7% and decrease customer satisfaction significantly. By compressing your images, you can improve website performance, reduce hosting costs, speed up file transfers, and create a better experience for your users.

How Our Compression Technology Works

Our image compressor uses advanced algorithms that analyze each image to identify areas where data can be reduced without noticeable quality loss. For JPEG images, we optimize the DCT coefficients and quantization tables. For PNG files, we apply efficient deflate compression and palette optimization. WebP images benefit from both lossy and lossless compression techniques, often achieving the best size-to-quality ratio.

Batch Processing for Efficiency

Unlike many online tools that limit you to one image at a time, our compressor supports batch processing. Upload dozens of images at once and compress them all in a single operation. This is invaluable for photographers processing shoots, web developers optimizing site assets, or marketers preparing campaign images.

Customizable Compression Settings

Every project has different requirements, which is why we give you full control over the compression process. Adjust the quality slider to find your ideal balance between file size and visual fidelity. Set maximum dimensions to automatically resize oversized images. Choose your preferred output format to match your specific use case.

Perfect for Web Development

Website performance is critical for user experience and search engine rankings. Google and other search engines factor page speed into their ranking algorithms, making image optimization a crucial part of SEO strategy. Our compressor helps you prepare images that load quickly without sacrificing the visual impact your designs require.

Ideal for E-commerce

Product images need to look sharp and professional while loading quickly on all devices. Our tool helps e-commerce businesses optimize their product catalogs, reducing page load times and improving conversion rates. Faster-loading product pages mean happier customers and more sales.

Social Media Optimization

Each social platform has its own file size limits and display requirements. Our compressor helps you create perfectly optimized images for Instagram, Facebook, Twitter, LinkedIn, and other platforms, ensuring your content looks great while uploading quickly.

Email Marketing Ready

Large images in emails can trigger spam filters and cause slow loading for recipients. Compress your email marketing images to ensure fast delivery, reliable display across email clients, and better engagement rates.

Privacy-First Processing

All compression happens directly in your browser using JavaScript and WebAssembly technology. Your images never leave your device, are never uploaded to any server, and are never stored anywhere. This makes our tool ideal for sensitive, confidential, or private images that you cannot risk exposing to third-party services.

No Quality Compromises

Our intelligent compression algorithms are designed to preserve what matters most in your images. Faces, text, important details, and edges are protected while less critical areas receive more aggressive compression. The result is significantly smaller files that look virtually identical to the originals.

Free and Unlimited

There are no usage limits, no registration requirements, no watermarks, and no hidden fees. Compress as many images as you need, as often as you need, completely free. Our tool is built to help creators, developers, and businesses optimize their images without any barriers.

Whether you are a web developer optimizing site assets, a photographer sharing your work online, a marketer preparing campaign materials, or simply someone who wants to free up storage space, our image compressor delivers professional-grade results with unmatched convenience and complete privacy.
`.trim();

export function ImageCompressorPage() {
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
        title="Image Compressor"
        description={seoDescription}
        howToUse={howToUseSteps}
        faqs={faqs}
        relatedTools={relatedTools}
        privacyNote="Your files are processed entirely in your browser"
      >
        <ImageCompressor />
      </ToolLayout>
    </>
  );
}

export default ImageCompressorPage;
