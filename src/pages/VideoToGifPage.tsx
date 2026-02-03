import { ToolLayout } from '../components/common/ToolLayout';
import { VideoToGif } from '../components/tools/video-to-gif/VideoToGif';

const seoMeta = {
  title: 'Video to GIF Converter - Free Online MP4 to GIF Tool | Web Tools Suite',
  description:
    'Convert videos to GIF animations instantly online. Free MP4, WebM, MOV to GIF converter with custom frame rate, resolution, and quality options. No watermarks, no signup required.',
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
    'webm to gif',
    'mov to gif',
    'video converter',
    'gif animation',
  ],
  canonicalUrl: 'https://webtools.suite/video-to-gif',
};

const howToUseSteps = [
  'Click the upload area or drag and drop your video file (MP4, WebM, or MOV format supported).',
  'Once the video loads, use the time range sliders to select the portion of the video you want to convert to GIF.',
  'Adjust the frame rate setting - higher frame rates create smoother animations but larger file sizes.',
  'Select your preferred output size from the dropdown (Original, 480p, 360p, 240p, or 120p).',
  'Use the quality slider to balance between image quality and file size.',
  'Click the "Convert to GIF" button and wait for the conversion to complete.',
  'Preview your generated GIF in the preview area below.',
  'Click "Download GIF" to save the file to your device.',
  'Use the "Reset" button to start over with a new video.',
];

const faqs = [
  {
    question: 'What video formats can I convert to GIF?',
    answer:
      'Our converter supports the most common video formats including MP4, WebM, and MOV (QuickTime). These formats cover the vast majority of videos you will encounter from smartphones, cameras, screen recordings, and downloaded content.',
  },
  {
    question: 'Can I select a specific portion of my video to convert?',
    answer:
      'Yes, our tool includes a video trimmer with start and end time sliders. You can precisely select any portion of your video to convert, from a few frames to several seconds. The preview updates in real-time as you adjust the selection.',
  },
  {
    question: 'What frame rate should I use for my GIF?',
    answer:
      'For most purposes, 10-15 FPS provides a good balance between smooth animation and file size. Use 5-10 FPS for simple animations or when file size is critical. Use 20-30 FPS for smooth, high-quality animations where file size is less of a concern.',
  },
  {
    question: 'Why is my GIF file so large?',
    answer:
      'GIF file size is determined by three main factors: resolution, frame rate, and duration. To reduce file size, try lowering the output resolution, reducing the frame rate, shortening the duration, or decreasing the quality setting. A combination of these adjustments can significantly reduce file size.',
  },
  {
    question: 'Is there a video length limit?',
    answer:
      'There is no strict limit, but we recommend keeping GIFs under 10-15 seconds for practical file sizes. Longer videos will result in very large GIF files that may be slow to load or share. For longer content, consider using actual video formats instead.',
  },
  {
    question: 'How long does the conversion take?',
    answer:
      'Conversion time depends on video length, resolution, and frame rate. A typical 5-second clip at moderate settings converts in 10-30 seconds. The progress bar shows both frame extraction (first 50%) and GIF encoding (remaining 50%).',
  },
  {
    question: 'Is my video data safe when using this tool?',
    answer:
      'Absolutely. All video processing happens entirely in your browser using JavaScript. Your video file never leaves your device and is never uploaded to any server. When you close the page, all data is cleared from memory.',
  },
  {
    question: 'Can I add text or effects to my GIF?',
    answer:
      'This tool focuses on clean, fast video-to-GIF conversion. For adding text, effects, or advanced editing, we recommend creating your GIF first, then using a dedicated image editor. This keeps the conversion process fast and efficient.',
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
    description: 'Convert between different image formats',
  },
  {
    name: 'Background Remover',
    href: '/background-remover',
    description: 'Remove backgrounds from images instantly',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Generate QR codes for URLs, text, and more',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between formats',
  },
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format, validate, and beautify JSON data',
  },
];

const seoDescription = `
Video to GIF conversion is one of the most popular ways to create shareable, lightweight animations from video content. GIFs are universally supported across all platforms, social media, messaging apps, and websites, making them perfect for sharing memorable moments, reactions, tutorials, and demonstrations.

Our free online Video to GIF converter transforms your video files into high-quality animated GIFs directly in your browser. Unlike many online converters that require uploads to remote servers, our tool processes everything locally on your device, ensuring complete privacy and faster conversion times.

Why Convert Videos to GIFs?

GIF files have several advantages over video formats for certain use cases. They autoplay and loop automatically without requiring user interaction, making them perfect for eye-catching content on websites and social media. They work everywhere - every browser, email client, and messaging platform supports GIF animations. They are also typically smaller than video files for short clips, making them faster to load and share.

Common uses for video-to-GIF conversion include creating reaction GIFs for messaging and social media, making tutorial demonstrations that loop continuously, capturing memorable moments from videos to share easily, creating product demonstrations for e-commerce sites, building animated content for presentations and documents, and designing eye-catching elements for websites and emails.

Understanding GIF Settings

Frame rate determines how smooth your animation appears. Standard video runs at 24-30 frames per second, but GIFs typically use 10-15 FPS to keep file sizes manageable. Higher frame rates create smoother motion but exponentially increase file size.

Resolution significantly impacts both quality and file size. Original resolution preserves maximum detail but may create very large files. Reducing to 480p or 360p often provides acceptable quality for most sharing purposes while dramatically reducing file size.

Quality settings in our tool control the color palette optimization. Higher quality settings preserve more colors and detail but result in larger files. Lower quality settings create smaller files with potentially visible color banding in gradients.

Duration is perhaps the most important factor in GIF file size. GIF is not an efficient format for long content. Keeping your GIFs under 10 seconds is recommended for reasonable file sizes.

Technical Details

Our converter uses the gif.js library to create GIFs entirely in your browser using Web Workers for multi-threaded encoding. This approach provides several benefits: your files never leave your device, conversion can happen offline once the page is loaded, and processing uses your computer's full power for faster results.

The conversion process works in two phases. First, we extract individual frames from your video at your specified frame rate. This uses the HTML5 Canvas API to capture each frame at the desired resolution. Second, we encode these frames into the GIF format, optimizing the color palette and applying compression.

Tips for Best Results

For the smallest possible file size, use lower resolution (240p or 120p), lower frame rate (5-10 FPS), shorter duration (under 5 seconds), and lower quality settings. Start with these aggressive settings and increase only if the result is not acceptable.

For the best quality, use original or 480p resolution, moderate frame rate (15 FPS), and higher quality settings. Accept that the resulting file will be larger.

For social media sharing, most platforms have file size limits (Twitter: 15MB, Discord: 8MB for free users). Adjust your settings to stay within these limits while maintaining acceptable quality.

Browser-Based Privacy

Unlike cloud-based converters, our tool processes everything locally in your browser using JavaScript. Your video file is read directly from your device, processed in your browser's memory, and the resulting GIF is generated without any server communication. This means complete privacy for sensitive content, faster processing without upload/download delays, offline capability once the page is loaded, and no file size limits imposed by server restrictions.

When you close or refresh the page, all video data and generated GIFs are cleared from memory. We have no way to access, store, or view your content at any time.
`.trim();

export function VideoToGifPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Video to GIF Converter"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <VideoToGif />
    </ToolLayout>
  );
}

export default VideoToGifPage;
