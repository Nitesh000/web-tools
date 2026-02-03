import { ToolLayout } from '../components/common/ToolLayout';
import { PdfToImage } from '../components/tools/pdf-to-image/PdfToImage';

const seoMeta = {
  title: 'PDF to Image Converter - Convert PDF to JPG, PNG, WebP Free Online',
  description:
    'Convert PDF to images online for free. Export PDF pages as JPG, PNG, or WebP. Select specific pages, choose quality settings, and download instantly. No signup required - all processing happens in your browser.',
  keywords: [
    'pdf to image',
    'pdf to jpg',
    'pdf to png',
    'pdf to webp',
    'convert pdf to image',
    'pdf converter',
    'extract images from pdf',
    'pdf to image converter online',
    'free pdf to jpg converter',
    'pdf page to image',
    'convert pdf pages to images',
    'pdf to jpeg',
    'pdf to picture',
    'pdf image extractor',
    'online pdf to image',
    'pdf to image free',
    'pdf to high quality image',
    'batch pdf to image',
    'pdf to image no signup',
    'browser pdf converter',
  ],
  canonicalUrl: 'https://webtools.dev/pdf-to-image',
};

const howToUseSteps = [
  'Click the upload area or drag and drop your PDF file into the converter.',
  'Wait for the PDF to load - you will see thumbnails of all pages.',
  'Click on individual pages to select or deselect them for conversion, or use "Select All" to include all pages.',
  'Choose your preferred output format: JPG for photos, PNG for graphics with transparency, or WebP for modern browsers.',
  'Select quality level: High quality for print or Low quality for smaller file sizes.',
  'Click "Convert" to process the selected pages.',
  'Download your images - single images download directly, multiple pages are zipped together.',
];

const faqs = [
  {
    question: 'How do I convert a PDF to images?',
    answer:
      'Simply upload your PDF file by clicking the upload area or dragging and dropping. Once loaded, you will see thumbnails of all pages. Select the pages you want to convert, choose your output format (JPG, PNG, or WebP) and quality settings, then click Convert. Your images will download automatically.',
  },
  {
    question: 'What image formats can I export to?',
    answer:
      'You can export PDF pages to JPG (JPEG), PNG, or WebP formats. JPG is best for photographs and images with many colors. PNG is ideal for graphics, text, and images requiring transparency. WebP offers excellent compression and is supported by all modern browsers.',
  },
  {
    question: 'Is there a limit on PDF file size or page count?',
    answer:
      'There is no strict limit since all processing happens in your browser. However, very large PDFs (100+ pages or 50MB+) may take longer to process. For best performance, we recommend working with PDFs under 50MB.',
  },
  {
    question: 'Can I select specific pages to convert?',
    answer:
      'Yes, after uploading your PDF, you will see thumbnails of all pages. Click on any page to select or deselect it. Use "Select All" or "Deselect All" buttons for bulk selection. Only selected pages will be included in the conversion.',
  },
  {
    question: 'What is the difference between High and Low quality?',
    answer:
      'High quality produces larger images at 2x resolution with better detail - ideal for printing or when you need crisp images. Low quality produces smaller files at standard resolution - perfect for web use or when file size matters more than image detail.',
  },
  {
    question: 'Is my PDF data secure?',
    answer:
      'Absolutely. All PDF processing happens entirely in your browser using JavaScript. Your PDF file is never uploaded to any server. When you close the browser tab, all data is cleared. This makes our converter safe for sensitive or confidential documents.',
  },
  {
    question: 'How are multiple images downloaded?',
    answer:
      'If you convert a single page, the image downloads directly. If you convert multiple pages, all images are automatically packaged into a ZIP file for convenient downloading. Each image is named with its page number (page-1.jpg, page-2.jpg, etc.).',
  },
  {
    question: 'Can I convert password-protected PDFs?',
    answer:
      'Currently, our converter does not support password-protected PDFs. You would need to remove the password protection from your PDF first using another tool, then upload the unprotected PDF for conversion.',
  },
];

const relatedTools = [
  {
    name: 'Image to PDF',
    href: '/image-to-pdf',
    description: 'Convert images to PDF documents',
  },
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
  },
  {
    name: 'Image Format Converter',
    href: '/format-converter',
    description: 'Convert between image formats',
  },
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images with AI',
  },
  {
    name: 'Invoice Generator',
    href: '/invoice-generator',
    description: 'Create professional invoices as PDF',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Generate QR codes for any content',
  },
];

const seoDescription = `
Converting PDF documents to images is a common need for many workflows. Whether you need to extract pages for presentations, share specific pages on social media, or archive document pages as images, our free PDF to Image converter makes it simple.

Why Convert PDF to Images?

PDFs are great for preserving document formatting, but images are more versatile for many use cases. Converting PDF to images allows you to share individual pages without the full document, embed pages in websites or presentations, edit content in image editing software, and create thumbnails or previews of documents.

Multiple Output Formats

Our converter supports the three most popular image formats. JPG (JPEG) is the universal format supported everywhere, offering good compression for photographs and complex images. PNG provides lossless compression and supports transparency, making it perfect for graphics, diagrams, and text-heavy pages. WebP is the modern format offering superior compression compared to both JPG and PNG while maintaining quality.

Page Selection for Efficiency

Not every PDF conversion requires all pages. Our page selection feature lets you choose exactly which pages to convert. After uploading your PDF, you see thumbnails of every page. Click to toggle selection on individual pages, or use bulk selection to include all pages at once. This saves time and bandwidth by only converting what you need.

Quality Control

Different use cases require different quality levels. Our High Quality setting renders pages at 2x resolution, producing crisp images suitable for printing or detailed viewing. The Low Quality setting produces smaller files at standard resolution, ideal for web use, email attachments, or when storage space is limited.

Browser-Based Processing

Every aspect of the conversion happens locally in your web browser. When you upload a PDF, it is processed by JavaScript running on your device. The PDF is rendered using PDF.js, the same library that powers Firefox's PDF viewer. Your document never touches our servers, ensuring complete privacy for sensitive content.

Batch Download

When converting multiple pages, our tool automatically packages all images into a ZIP file. This makes downloading convenient and keeps your images organized. Each file is named sequentially (page-1.jpg, page-2.jpg, etc.) for easy identification.

Use Cases

Business professionals convert PDF reports to images for presentations and email newsletters. Educators extract diagrams and charts from textbooks for classroom materials. Designers pull reference images from PDF portfolios and catalogs. Legal professionals convert document pages for case presentations. Anyone can create image backups of important document pages.

No Installation Required

As a web-based tool, there is nothing to install or update. Open the page in any modern browser and start converting. Works on Windows, Mac, Linux, and mobile devices. Bookmark the page for instant access whenever you need PDF to image conversion.

Free and Unlimited

Our PDF to Image converter is completely free with no daily limits, no watermarks, and no account required. Convert as many PDFs as you need, whenever you need them.
`.trim();

export function PdfToImagePage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="PDF to Image Converter"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="Your PDF is processed locally - never uploaded to our servers"
    >
      <PdfToImage />
    </ToolLayout>
  );
}

export default PdfToImagePage;
