/**
 * Image utility functions for the web-tools-suite.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  /** Target width (optional if height is provided and maintainAspectRatio is true) */
  width?: number;
  /** Target height (optional if width is provided and maintainAspectRatio is true) */
  height?: number;
  /** Maintain aspect ratio when resizing (default: true) */
  maintainAspectRatio?: boolean;
  /** How to fit image when maintaining aspect ratio */
  fit?: 'contain' | 'cover' | 'fill';
  /** Background color for 'contain' fit (default: transparent) */
  backgroundColor?: string;
  /** Image quality for lossy formats (0-1, default: 0.92) */
  quality?: number;
}

/**
 * Load an image from a URL or File.
 *
 * @param source - Image URL, data URL, File, or Blob
 * @returns Promise resolving to loaded HTMLImageElement
 */
export function loadImage(source: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Clean up object URL if we created one
      if (source instanceof File || source instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
      resolve(img);
    };

    img.onerror = () => {
      if (source instanceof File || source instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
      reject(new Error('Failed to load image'));
    };

    // Set crossOrigin for external URLs to enable canvas operations
    if (typeof source === 'string' && !source.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    // Set source
    if (source instanceof File || source instanceof Blob) {
      img.src = URL.createObjectURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * Get image dimensions without fully loading.
 *
 * @param source - Image URL, data URL, File, or Blob
 * @returns Promise resolving to image dimensions
 */
export function getImageDimensions(source: string | File | Blob): Promise<ImageDimensions> {
  return loadImage(source).then((img) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));
}

/**
 * Convert an HTMLImageElement to a canvas.
 *
 * @param image - HTMLImageElement to convert
 * @param width - Optional target width (default: natural width)
 * @param height - Optional target height (default: natural height)
 * @returns HTMLCanvasElement with the image drawn
 */
export function imageToCanvas(
  image: HTMLImageElement,
  width?: number,
  height?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.width = width ?? image.naturalWidth;
  canvas.height = height ?? image.naturalHeight;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas;
}

/**
 * Convert a canvas to a Blob.
 *
 * @param canvas - HTMLCanvasElement to convert
 * @param mimeType - Output MIME type (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1, default: 0.92)
 * @returns Promise resolving to Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = 'image/png',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Convert a canvas to a data URL.
 *
 * @param canvas - HTMLCanvasElement to convert
 * @param mimeType - Output MIME type (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1, default: 0.92)
 * @returns Data URL string
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  mimeType = 'image/png',
  quality = 0.92
): string {
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Calculate new dimensions while maintaining aspect ratio.
 *
 * @param originalWidth - Original image width
 * @param originalHeight - Original image height
 * @param targetWidth - Target width (optional)
 * @param targetHeight - Target height (optional)
 * @param fit - How to fit the image ('contain' | 'cover')
 * @returns New dimensions
 */
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  fit: 'contain' | 'cover' = 'contain'
): ImageDimensions {
  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && targetHeight) {
    const targetRatio = targetWidth / targetHeight;

    if (fit === 'contain') {
      // Fit inside the target dimensions
      if (aspectRatio > targetRatio) {
        return {
          width: targetWidth,
          height: Math.round(targetWidth / aspectRatio),
        };
      } else {
        return {
          width: Math.round(targetHeight * aspectRatio),
          height: targetHeight,
        };
      }
    } else {
      // Cover the target dimensions
      if (aspectRatio > targetRatio) {
        return {
          width: Math.round(targetHeight * aspectRatio),
          height: targetHeight,
        };
      } else {
        return {
          width: targetWidth,
          height: Math.round(targetWidth / aspectRatio),
        };
      }
    }
  } else if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  } else if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * Resize an image.
 *
 * @param source - Image source (URL, File, Blob, or HTMLImageElement)
 * @param options - Resize options
 * @returns Promise resolving to resized canvas
 */
export async function resizeImage(
  source: string | File | Blob | HTMLImageElement,
  options: ResizeOptions
): Promise<HTMLCanvasElement> {
  const {
    width,
    height,
    maintainAspectRatio = true,
    fit = 'contain',
    backgroundColor,
    quality = 0.92,
  } = options;

  // Load image if needed
  const image =
    source instanceof HTMLImageElement ? source : await loadImage(source);

  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;

  let finalWidth: number;
  let finalHeight: number;
  let drawWidth: number;
  let drawHeight: number;
  let offsetX = 0;
  let offsetY = 0;

  if (maintainAspectRatio) {
    // For 'fill', we don't maintain aspect ratio, so use 'contain' for the calculation
    const fitForCalc = fit === 'fill' ? 'contain' : fit;
    const dimensions = calculateAspectRatioDimensions(
      originalWidth,
      originalHeight,
      width,
      height,
      fitForCalc
    );

    if (fit === 'contain' && width && height) {
      finalWidth = width;
      finalHeight = height;
      drawWidth = dimensions.width;
      drawHeight = dimensions.height;
      offsetX = Math.round((width - drawWidth) / 2);
      offsetY = Math.round((height - drawHeight) / 2);
    } else {
      finalWidth = dimensions.width;
      finalHeight = dimensions.height;
      drawWidth = dimensions.width;
      drawHeight = dimensions.height;
    }
  } else {
    finalWidth = width ?? originalWidth;
    finalHeight = height ?? originalHeight;
    drawWidth = finalWidth;
    drawHeight = finalHeight;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Apply background color if specified
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the image
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  // Store quality in canvas for later use
  (canvas as HTMLCanvasElement & { quality?: number }).quality = quality;

  return canvas;
}

/**
 * Resize an image and return as Blob.
 *
 * @param source - Image source (URL, File, Blob, or HTMLImageElement)
 * @param options - Resize options
 * @param mimeType - Output MIME type (default: 'image/png')
 * @returns Promise resolving to resized Blob
 */
export async function resizeImageToBlob(
  source: string | File | Blob | HTMLImageElement,
  options: ResizeOptions,
  mimeType = 'image/png'
): Promise<Blob> {
  const canvas = await resizeImage(source, options);
  return canvasToBlob(canvas, mimeType, options.quality);
}

/**
 * Crop an image to specified dimensions.
 *
 * @param source - Image source
 * @param x - Crop start X coordinate
 * @param y - Crop start Y coordinate
 * @param width - Crop width
 * @param height - Crop height
 * @returns Promise resolving to cropped canvas
 */
export async function cropImage(
  source: string | File | Blob | HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const image =
    source instanceof HTMLImageElement ? source : await loadImage(source);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  return canvas;
}

/**
 * Rotate an image by specified degrees.
 *
 * @param source - Image source
 * @param degrees - Rotation angle in degrees (90, 180, 270, or any value)
 * @returns Promise resolving to rotated canvas
 */
export async function rotateImage(
  source: string | File | Blob | HTMLImageElement,
  degrees: number
): Promise<HTMLCanvasElement> {
  const image =
    source instanceof HTMLImageElement ? source : await loadImage(source);

  const radians = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const newWidth = Math.round(
    image.naturalWidth * cos + image.naturalHeight * sin
  );
  const newHeight = Math.round(
    image.naturalWidth * sin + image.naturalHeight * cos
  );

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(
    image,
    -image.naturalWidth / 2,
    -image.naturalHeight / 2,
    image.naturalWidth,
    image.naturalHeight
  );

  return canvas;
}

/**
 * Flip an image horizontally or vertically.
 *
 * @param source - Image source
 * @param direction - Flip direction ('horizontal' | 'vertical')
 * @returns Promise resolving to flipped canvas
 */
export async function flipImage(
  source: string | File | Blob | HTMLImageElement,
  direction: 'horizontal' | 'vertical'
): Promise<HTMLCanvasElement> {
  const image =
    source instanceof HTMLImageElement ? source : await loadImage(source);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  if (direction === 'horizontal') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(image, 0, 0);

  return canvas;
}

/**
 * Check if image has transparency.
 *
 * @param source - Image source
 * @returns Promise resolving to boolean indicating transparency
 */
export async function hasTransparency(
  source: string | File | Blob | HTMLImageElement
): Promise<boolean> {
  const image =
    source instanceof HTMLImageElement ? source : await loadImage(source);

  const canvas = imageToCanvas(image);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Check alpha channel (every 4th value starting from index 3)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }

  return false;
}
