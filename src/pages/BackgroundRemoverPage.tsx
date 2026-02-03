import { ToolLayout } from '../components/common/ToolLayout';
import { BackgroundRemover } from '../components/tools/background-remover/BackgroundRemover';
import { SEOHead } from '../seo/SEOHead';
import { toolsMetaData } from '../seo/meta-data';

const toolMeta = toolsMetaData['background-remover'];

const seoMeta = {
  title: toolMeta.title,
  description: toolMeta.description,
  keywords: toolMeta.keywords,
  canonicalUrl: 'https://webtools.suite/background-remover',
  ogImage: toolMeta.ogImage,
};

const howToUseSteps = [
  'Click the upload area or drag and drop your image file. Supported formats include PNG, JPG, JPEG, WebP, and GIF up to 50MB.',
  'Once your image is loaded, click the "Remove Background" button to start processing.',
  'Wait while our AI-powered engine analyzes your image and removes the background. You can track progress with the loading indicator.',
  'After processing completes, compare the original and processed images side by side or use the slider comparison view.',
  'Click "Download PNG" to save your image with the transparent background.',
  'Use the "Start Over" button to process another image.',
];

const faqs = [
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
      'The background remover supports all common image formats including PNG, JPG, JPEG, WebP, and GIF. The output is always a transparent PNG file.',
  },
  {
    question: 'Is my data safe when using this tool?',
    answer:
      'Absolutely. All processing happens locally in your browser. Your images are never uploaded to any server, ensuring complete privacy and security.',
  },
  {
    question: 'Can I remove backgrounds from multiple images at once?',
    answer:
      'Currently, the tool processes one image at a time for optimal quality. Simply upload a new image after downloading your processed result.',
  },
  {
    question: 'Why does the first image take longer to process?',
    answer:
      'The first time you use the tool, the AI model needs to be downloaded and loaded into your browser. This is a one-time process that takes a few seconds. Subsequent images will process faster.',
  },
  {
    question: 'What types of images work best with this tool?',
    answer:
      'The tool works best with images that have clear subjects and distinct backgrounds. Photos of people, products, animals, and objects typically yield excellent results. Complex scenes with overlapping elements may require additional editing.',
  },
  {
    question: 'Can I adjust the background removal results?',
    answer:
      'The current version provides automatic background removal. For fine-tuning edges, you can use the exported PNG in an image editor. We are working on adding manual refinement tools in future updates.',
  },
];

const relatedTools = [
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
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
    name: 'Invoice Generator',
    href: '/invoice-generator',
    description: 'Create professional invoices instantly',
  },
];

const seoDescription = `
Removing backgrounds from images has never been easier. Our free online background remover uses cutting-edge artificial intelligence to automatically detect subjects in your photos and cleanly remove the background, leaving you with a professional-quality transparent PNG image ready for use in any project.

Why Use Our Background Remover?

In today's digital world, having images with transparent backgrounds is essential for countless applications. Whether you're creating product photos for an e-commerce store, designing marketing materials, preparing images for presentations, or simply want to create fun photo montages, our background remover delivers professional results in seconds without requiring any design skills or expensive software.

Advanced AI-Powered Technology

Our tool leverages sophisticated machine learning models that have been trained on millions of images to accurately identify and separate foreground subjects from their backgrounds. The AI understands complex edges, handles fine details like hair and fur, and produces clean cutouts that look natural and professional.

Complete Privacy and Security

Unlike many online tools that upload your images to remote servers for processing, our background remover works entirely within your web browser. Your photos never leave your device, ensuring complete privacy and security for sensitive or personal images. This also means faster processing since there's no upload or download time to worry about.

Perfect for E-commerce and Marketing

Product photography is one of the most common uses for background removal. Online marketplaces often require product images on white or transparent backgrounds, and our tool makes this process effortless. Simply upload your product photo, let the AI work its magic, and download the result ready for your listings.

Social Media and Content Creation

Content creators and social media managers frequently need to isolate subjects for creating thumbnails, promotional graphics, and engaging visual content. Our tool streamlines this workflow, allowing you to quickly prepare images for platforms like Instagram, YouTube, TikTok, and more.

No Software Installation Required

Forget about downloading and installing complex image editing software. Our background remover runs directly in your browser on any device with an internet connection. Whether you're using a Windows PC, Mac, Chromebook, or even a tablet, you can access professional-grade background removal instantly.

High-Quality Output

The processed images maintain their original quality and resolution. The output PNG files include full alpha transparency, meaning you can place your cutout subjects over any background color or image seamlessly. The AI preserves fine details and produces smooth, natural-looking edges.

Unlimited Free Usage

There are no hidden costs, no subscription fees, and no limits on how many images you can process. Our tool is completely free to use as many times as you need. We also don't add watermarks to your images - what you create is 100% yours.

Quick and Efficient Workflow

The entire process takes just seconds. Upload your image, click the remove background button, and download your result. The intuitive interface requires no learning curve, making it accessible to users of all skill levels.

Whether you're a professional designer looking for a quick solution, a small business owner managing your own marketing, or anyone who needs to remove image backgrounds, our tool provides the perfect combination of quality, speed, and ease of use - all while keeping your data completely private and secure.
`.trim();

export function BackgroundRemoverPage() {
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
        title="Background Remover"
        description={seoDescription}
        howToUse={howToUseSteps}
        faqs={faqs}
        relatedTools={relatedTools}
        privacyNote="Your files are processed entirely in your browser"
      >
        <BackgroundRemover />
      </ToolLayout>
    </>
  );
}

export default BackgroundRemoverPage;
