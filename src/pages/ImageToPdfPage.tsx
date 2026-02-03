import { ToolLayout } from '../components/common/ToolLayout';
import { ImageToPdf } from '../components/tools/image-to-pdf/ImageToPdf';

const seoMeta = {
  title: 'Image to PDF Converter - Convert JPG, PNG to PDF Free Online',
  description:
    'Convert images to PDF online for free. Combine multiple JPG, PNG, or WebP images into a single PDF document. Customize page size and quality. No signup required - all processing in your browser.',
  keywords: [
    'image to pdf',
    'jpg to pdf',
    'png to pdf',
    'convert image to pdf',
    'picture to pdf',
    'photo to pdf',
    'images to pdf converter',
    'combine images to pdf',
    'merge images to pdf',
    'multiple images to pdf',
    'free image to pdf',
    'online image to pdf',
    'jpeg to pdf',
    'webp to pdf',
    'create pdf from images',
    'image to pdf converter online',
    'convert photos to pdf',
    'batch image to pdf',
    'image to pdf no signup',
    'browser image to pdf',
  ],
  canonicalUrl: 'https://webtools.dev/image-to-pdf',
};

const howToUseSteps = [
  'Click the upload area or drag and drop your images into the converter. You can add multiple images at once.',
  'Arrange your images in the desired order using the up/down arrows. The order determines page sequence in the PDF.',
  'Remove any unwanted images by clicking the X button next to each image.',
  'Choose your page size: A4 (standard), Letter (US standard), or Fit to Image (matches image dimensions).',
  'Select quality: High quality for print-ready PDFs, or Low quality for smaller file sizes.',
  'Click "Create PDF" to generate your document.',
  'Your PDF will download automatically once processing is complete.',
];

const faqs = [
  {
    question: 'How do I convert images to a PDF?',
    answer:
      'Upload your images by clicking the upload area or dragging and dropping. Arrange them in your preferred order, choose page size and quality settings, then click "Create PDF". Your PDF will download automatically with all images as pages.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'Our converter supports all common image formats including JPG (JPEG), PNG, WebP, and GIF. You can mix different formats in the same PDF - they will all be converted and included as pages.',
  },
  {
    question: 'Can I combine multiple images into one PDF?',
    answer:
      'Yes, you can upload as many images as you need. Each image becomes a page in the final PDF. Use the arrow buttons to arrange images in your desired order before creating the PDF.',
  },
  {
    question: 'What page sizes are available?',
    answer:
      'We offer three page size options: A4 (210 x 297 mm, international standard), Letter (8.5 x 11 inches, US standard), and Fit to Image (each page matches the dimensions of its image, preserving the original aspect ratio).',
  },
  {
    question: 'How does the "Fit to Image" option work?',
    answer:
      'When you select "Fit to Image", each page in the PDF matches the exact dimensions of its source image. This preserves the original aspect ratio and prevents any cropping or padding. Different images can result in different page sizes within the same PDF.',
  },
  {
    question: 'What is the difference between High and Low quality?',
    answer:
      'High quality keeps images at their original resolution with minimal compression, producing larger PDFs ideal for printing. Low quality applies more compression to reduce file size, suitable for email sharing or web viewing where smaller files are preferred.',
  },
  {
    question: 'Is there a limit on the number of images?',
    answer:
      'There is no strict limit on the number of images. However, very large batches (100+ high-resolution images) may take longer to process and result in large PDF files. For best performance, we recommend batches of 50 or fewer images.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Yes, completely. All image processing and PDF creation happens in your browser using JavaScript. Your images are never uploaded to any server. When you close the tab, all data is cleared. This makes our converter safe for personal and confidential images.',
  },
  {
    question: 'Can I reorder images after uploading?',
    answer:
      'Yes, use the up and down arrow buttons next to each image to change its position in the sequence. The order shown in the list is the order pages will appear in the final PDF.',
  },
  {
    question: 'How do I remove an image from the list?',
    answer:
      'Click the X button next to any image to remove it from the conversion. You can also click "Clear All" to remove all images and start over.',
  },
];

const relatedTools = [
  {
    name: 'PDF to Image',
    href: '/pdf-to-image',
    description: 'Convert PDF pages to images',
  },
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images before converting',
  },
  {
    name: 'Image Format Converter',
    href: '/format-converter',
    description: 'Convert between image formats',
  },
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images',
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
Creating PDF documents from images is essential for many professional and personal workflows. Whether you are compiling a photo album, creating a portfolio, scanning documents, or preparing files for printing, our free Image to PDF converter makes the process simple and efficient.

Why Convert Images to PDF?

PDF is the universal document format that preserves layout across all devices and platforms. Converting images to PDF allows you to combine multiple images into a single shareable file, maintain consistent quality when printing, protect images from easy editing, and create professional-looking documents from photo collections.

Multiple Image Support

Upload as many images as you need in a single session. Our converter handles JPG, PNG, WebP, and GIF formats seamlessly. You can mix different formats in the same PDF - our tool processes each image appropriately and combines them into a unified document.

Flexible Arrangement

The order of your images matters. After uploading, use the intuitive arrow controls to arrange images exactly as you want them to appear in the PDF. Move images up or down in the sequence, remove unwanted images, or clear all and start fresh. The visual preview shows exactly how your PDF will be organized.

Page Size Options

Different use cases require different page sizes. A4 is the international standard size used in most countries for documents and printing. Letter size is the US standard (8.5 x 11 inches) common in North America. Fit to Image preserves each image's original dimensions, creating pages that match the image size exactly.

The Fit to Image option is particularly useful for photography portfolios, scanned documents, or any case where maintaining the original aspect ratio is important. Each page in the PDF will have different dimensions matching its source image.

Quality Control

Choose between High and Low quality based on your needs. High quality maintains image resolution and uses minimal compression, resulting in larger PDFs suitable for professional printing or archival purposes. Low quality applies compression to reduce file size significantly, ideal for email attachments, web sharing, or when storage space is limited.

Browser-Based Processing

All PDF creation happens locally in your web browser. When you upload images, they are processed entirely on your device using JavaScript and the jsPDF library. No data is ever sent to our servers. This ensures complete privacy for personal photos, confidential documents, and sensitive content.

Common Use Cases

Photographers compile images into PDF portfolios for clients. Students combine scanned notes and diagrams into study materials. Businesses create PDF catalogs from product images. Real estate agents prepare property photo packages. Anyone can create digital photo albums in a universally viewable format.

No Installation Needed

Our tool runs entirely in your web browser. There is no software to download or install. Works on any modern browser including Chrome, Firefox, Safari, and Edge. Available on desktop and mobile devices. Just open the page and start converting.

Completely Free

Convert as many images to PDF as you need with no limits, no watermarks, and no account required. Our tool is free for everyone to use, whether you need to convert one image or hundreds.
`.trim();

export function ImageToPdfPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Image to PDF Converter"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="Your images are processed locally - never uploaded to our servers"
    >
      <ImageToPdf />
    </ToolLayout>
  );
}

export default ImageToPdfPage;
