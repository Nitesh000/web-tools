/**
 * File utility functions for the web-tools-suite.
 */

/**
 * Size units for formatting
 */
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/**
 * Format file size in bytes to human-readable string.
 *
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return 'Invalid size';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, SIZE_UNITS.length - 1);

  return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(dm))} ${SIZE_UNITS[unitIndex]}`;
}

/**
 * Parse a human-readable file size string to bytes.
 *
 * @param sizeStr - Size string (e.g., "1.5 MB", "500KB")
 * @returns Size in bytes, or null if invalid
 */
export function parseFileSize(sizeStr: string): number | null {
  const match = sizeStr.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  if (isNaN(value)) return null;

  const unitIndex = SIZE_UNITS.indexOf(unit as (typeof SIZE_UNITS)[number]);
  if (unitIndex === -1) return null;

  return Math.round(value * Math.pow(1024, unitIndex));
}

/**
 * Get file extension from filename or path.
 *
 * @param filename - File name or path
 * @param includeDot - Whether to include the dot (default: false)
 * @returns File extension (lowercase) or empty string if none
 */
export function getFileExtension(filename: string, includeDot = false): string {
  if (!filename) return '';

  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }

  // Handle hidden files (e.g., .gitignore)
  const lastSlashIndex = Math.max(
    filename.lastIndexOf('/'),
    filename.lastIndexOf('\\')
  );
  if (lastDotIndex <= lastSlashIndex + 1) {
    return '';
  }

  const extension = filename.slice(lastDotIndex + (includeDot ? 0 : 1));
  return extension.toLowerCase();
}

/**
 * Get filename without extension.
 *
 * @param filename - File name or path
 * @returns Filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  if (!filename) return '';

  const lastDotIndex = filename.lastIndexOf('.');
  const lastSlashIndex = Math.max(
    filename.lastIndexOf('/'),
    filename.lastIndexOf('\\')
  );

  const basename = filename.slice(lastSlashIndex + 1);

  if (lastDotIndex === -1 || lastDotIndex <= lastSlashIndex + 1) {
    return basename;
  }

  return basename.slice(0, basename.lastIndexOf('.'));
}

/**
 * Common MIME type mappings
 */
export const MIME_TYPES: Record<string, string> = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',

  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Text
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/typescript',

  // Archives
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',

  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  flac: 'audio/flac',

  // Video
  mp4: 'video/mp4',
  webm: 'video/webm',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
};

/**
 * Validate if a file matches the accepted types.
 *
 * @param file - File to validate
 * @param acceptedTypes - Array of MIME types or extensions (e.g., ['image/*', '.pdf', 'application/json'])
 * @returns True if file type is accepted
 */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  if (!acceptedTypes || acceptedTypes.length === 0) {
    return true;
  }

  const fileExtension = getFileExtension(file.name);
  const fileMimeType = file.type || MIME_TYPES[fileExtension] || '';

  return acceptedTypes.some((type) => {
    // Handle wildcards (e.g., 'image/*')
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2);
      return fileMimeType.startsWith(category);
    }

    // Handle extension (e.g., '.pdf')
    if (type.startsWith('.')) {
      return `.${fileExtension}` === type.toLowerCase();
    }

    // Handle MIME type
    return fileMimeType === type;
  });
}

/**
 * Create an object URL for a file or blob.
 *
 * @param file - File or Blob to create URL for
 * @returns Object URL string
 */
export function createObjectURL(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke an object URL to free memory.
 *
 * @param url - Object URL to revoke
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Read file as text.
 *
 * @param file - File to read
 * @returns Promise resolving to file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as text'));
    reader.readAsText(file);
  });
}

/**
 * Read file as data URL (base64).
 *
 * @param file - File to read
 * @returns Promise resolving to data URL string
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
}

/**
 * Read file as ArrayBuffer.
 *
 * @param file - File to read
 * @returns Promise resolving to ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file as array buffer'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert a data URL to a Blob.
 *
 * @param dataUrl - Data URL string
 * @returns Blob
 */
export function dataURLToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * Convert a Blob to a data URL.
 *
 * @param blob - Blob to convert
 * @returns Promise resolving to data URL string
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a unique filename with timestamp.
 *
 * @param baseName - Base filename
 * @param extension - File extension (without dot)
 * @returns Unique filename
 */
export function generateUniqueFilename(baseName: string, extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}_${timestamp}_${random}.${extension}`;
}
