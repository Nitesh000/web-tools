import { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '../../common/Button';
import { ProgressBar } from '../../common/ProgressBar';

// Types
type InputFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/tiff';
type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif';

interface ConversionSettings {
  outputFormat: OutputFormat;
  quality: number;
  preserveTransparency: boolean;
  resizeEnabled: boolean;
  resizeWidth: number;
  resizeHeight: number;
  maintainAspectRatio: boolean;
}

interface ImageFile {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  convertedSize: number | null;
  status: 'pending' | 'converting' | 'done' | 'error';
  progress: number;
  error: string | null;
}

const SUPPORTED_INPUT_FORMATS: InputFormat[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

const SUPPORTED_INPUT_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.tif';

const OUTPUT_FORMATS: { value: OutputFormat; label: string; supportsTransparency: boolean }[] = [
  { value: 'png', label: 'PNG', supportsTransparency: true },
  { value: 'jpeg', label: 'JPEG', supportsTransparency: false },
  { value: 'webp', label: 'WebP', supportsTransparency: true },
  { value: 'avif', label: 'AVIF', supportsTransparency: true },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateSizeChange(original: number, converted: number): { percentage: number; isSmaller: boolean } {
  const percentage = ((converted - original) / original) * 100;
  return {
    percentage: Math.abs(percentage),
    isSmaller: converted < original,
  };
}

function checkAvifSupport(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').startsWith('data:image/avif');
}

export function FormatConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    outputFormat: 'webp',
    quality: 85,
    preserveTransparency: true,
    resizeEnabled: false,
    resizeWidth: 1920,
    resizeHeight: 1080,
    maintainAspectRatio: true,
  });
  const [isConverting, setIsConverting] = useState(false);
  const [avifSupported, setAvifSupported] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setAvifSupported(checkAvifSupport());
  }, []);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      });
    };
  }, [images]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      SUPPORTED_INPUT_FORMATS.includes(file.type as InputFormat)
    );
    addFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: generateId(),
      file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      convertedBlob: null,
      convertedUrl: null,
      convertedSize: null,
      status: 'pending',
      progress: 0,
      error: null,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
    });
    setImages([]);
  }, [images]);

  const convertImage = useCallback(
    async (imageFile: ImageFile): Promise<{ blob: Blob; url: string }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            let targetWidth = img.naturalWidth;
            let targetHeight = img.naturalHeight;

            if (settings.resizeEnabled) {
              if (settings.maintainAspectRatio) {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                if (img.naturalWidth > img.naturalHeight) {
                  targetWidth = Math.min(settings.resizeWidth, img.naturalWidth);
                  targetHeight = Math.round(targetWidth / aspectRatio);
                } else {
                  targetHeight = Math.min(settings.resizeHeight, img.naturalHeight);
                  targetWidth = Math.round(targetHeight * aspectRatio);
                }
              } else {
                targetWidth = settings.resizeWidth;
                targetHeight = settings.resizeHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }

            // Fill with white background for JPEG (no transparency)
            if (settings.outputFormat === 'jpeg' || !settings.preserveTransparency) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const mimeType = `image/${settings.outputFormat}`;
            const quality = settings.outputFormat === 'png' ? undefined : settings.quality / 100;

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  resolve({ blob, url });
                } else {
                  reject(new Error('Failed to convert image'));
                }
              },
              mimeType,
              quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = imageFile.originalUrl;
      });
    },
    [settings]
  );

  const convertAll = useCallback(async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    abortControllerRef.current = new AbortController();

    const pendingImages = images.filter((img) => img.status === 'pending' || img.status === 'error');

    for (let i = 0; i < pendingImages.length; i++) {
      if (abortControllerRef.current?.signal.aborted) break;

      const img = pendingImages[i];

      setImages((prev) =>
        prev.map((item) =>
          item.id === img.id ? { ...item, status: 'converting', progress: 0 } : item
        )
      );

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === img.id && item.status === 'converting'
                ? { ...item, progress: Math.min(item.progress + 10, 90) }
                : item
            )
          );
        }, 100);

        const { blob, url } = await convertImage(img);

        clearInterval(progressInterval);

        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? {
                  ...item,
                  convertedBlob: blob,
                  convertedUrl: url,
                  convertedSize: blob.size,
                  status: 'done',
                  progress: 100,
                  error: null,
                }
              : item
          )
        );
      } catch (error) {
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? {
                  ...item,
                  status: 'error',
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Conversion failed',
                }
              : item
          )
        );
      }
    }

    setIsConverting(false);
  }, [images, convertImage]);

  const cancelConversion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsConverting(false);
  }, []);

  const downloadSingle = useCallback((img: ImageFile) => {
    if (!img.convertedBlob) return;

    const extension = settings.outputFormat;
    const originalName = img.file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${originalName}.${extension}`;

    saveAs(img.convertedBlob, fileName);
  }, [settings.outputFormat]);

  const downloadAll = useCallback(async () => {
    const convertedImages = images.filter((img) => img.convertedBlob);
    if (convertedImages.length === 0) return;

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0]);
      return;
    }

    const zip = new JSZip();
    const extension = settings.outputFormat;

    convertedImages.forEach((img) => {
      if (img.convertedBlob) {
        const originalName = img.file.name.replace(/\.[^/.]+$/, '');
        const fileName = `${originalName}.${extension}`;
        zip.file(fileName, img.convertedBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `converted-images-${Date.now()}.zip`);
  }, [images, settings.outputFormat, downloadSingle]);

  const hasConvertedImages = images.some((img) => img.status === 'done');
  const hasPendingImages = images.some((img) => img.status === 'pending' || img.status === 'error');

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={clsx(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload images by clicking or dragging files here"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_INPUT_EXTENSIONS}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop images here or click to upload
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Supports PNG, JPG, WebP, GIF, BMP, TIFF
            </p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Conversion Settings
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Output Format */}
          <div>
            <label
              htmlFor="output-format"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Output Format
            </label>
            <select
              id="output-format"
              value={settings.outputFormat}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  outputFormat: e.target.value as OutputFormat,
                }))
              }
              className={clsx(
                'w-full rounded-lg border border-gray-300 px-3 py-2',
                'bg-white text-gray-900',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              )}
            >
              {OUTPUT_FORMATS.map((format) => (
                <option
                  key={format.value}
                  value={format.value}
                  disabled={format.value === 'avif' && !avifSupported}
                >
                  {format.label}
                  {format.value === 'avif' && !avifSupported && ' (Not supported)'}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Slider (not for PNG) */}
          {settings.outputFormat !== 'png' && (
            <div>
              <label
                htmlFor="quality-slider"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Quality: {settings.quality}%
              </label>
              <input
                id="quality-slider"
                type="range"
                min="1"
                max="100"
                value={settings.quality}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    quality: parseInt(e.target.value, 10),
                  }))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Transparency Option (only for formats that support it) */}
          {OUTPUT_FORMATS.find((f) => f.value === settings.outputFormat)?.supportsTransparency && (
            <div className="flex items-center">
              <input
                id="preserve-transparency"
                type="checkbox"
                checked={settings.preserveTransparency}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preserveTransparency: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              />
              <label
                htmlFor="preserve-transparency"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Preserve transparency
              </label>
            </div>
          )}
        </div>

        {/* Resize Options */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex items-center">
            <input
              id="resize-enabled"
              type="checkbox"
              checked={settings.resizeEnabled}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  resizeEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <label
              htmlFor="resize-enabled"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Resize images during conversion
            </label>
          </div>

          {settings.resizeEnabled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="resize-width"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Max Width (px)
                </label>
                <input
                  id="resize-width"
                  type="number"
                  min="1"
                  max="10000"
                  value={settings.resizeWidth}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      resizeWidth: parseInt(e.target.value, 10) || 1920,
                    }))
                  }
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 px-3 py-2',
                    'bg-white text-gray-900',
                    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                    'dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="resize-height"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Max Height (px)
                </label>
                <input
                  id="resize-height"
                  type="number"
                  min="1"
                  max="10000"
                  value={settings.resizeHeight}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      resizeHeight: parseInt(e.target.value, 10) || 1080,
                    }))
                  }
                  className={clsx(
                    'w-full rounded-lg border border-gray-300 px-3 py-2',
                    'bg-white text-gray-900',
                    'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                    'dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    id="maintain-aspect"
                    type="checkbox"
                    checked={settings.maintainAspectRatio}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maintainAspectRatio: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                  <label
                    htmlFor="maintain-aspect"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Maintain aspect ratio
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {hasPendingImages && (
            <Button
              onClick={convertAll}
              disabled={isConverting}
              isLoading={isConverting}
            >
              {isConverting ? 'Converting...' : 'Convert All'}
            </Button>
          )}
          {isConverting && (
            <Button variant="secondary" onClick={cancelConversion}>
              Cancel
            </Button>
          )}
          {hasConvertedImages && (
            <Button variant="secondary" onClick={downloadAll}>
              Download All as ZIP
            </Button>
          )}
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Images ({images.length})
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Preview */}
                <div className="relative grid grid-cols-2">
                  {/* Original */}
                  <div className="relative aspect-square border-r border-gray-200 dark:border-gray-700">
                    <img
                      src={img.originalUrl}
                      alt={`Original: ${img.file.name}`}
                      className="h-full w-full object-contain bg-gray-100 dark:bg-gray-900"
                    />
                    <span className="absolute left-2 top-2 rounded bg-gray-900/75 px-2 py-0.5 text-xs text-white">
                      Original
                    </span>
                  </div>

                  {/* Converted */}
                  <div className="relative aspect-square">
                    {img.convertedUrl ? (
                      <img
                        src={img.convertedUrl}
                        alt={`Converted: ${img.file.name}`}
                        className="h-full w-full object-contain bg-gray-100 dark:bg-gray-900"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                        {img.status === 'converting' ? (
                          <svg
                            className="h-8 w-8 animate-spin text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : img.status === 'error' ? (
                          <span className="text-red-500">Error</span>
                        ) : (
                          <span className="text-sm text-gray-400">Pending</span>
                        )}
                      </div>
                    )}
                    <span className="absolute right-2 top-2 rounded bg-gray-900/75 px-2 py-0.5 text-xs text-white">
                      {settings.outputFormat.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {img.status === 'converting' && (
                  <div className="px-4 py-2">
                    <ProgressBar
                      value={img.progress}
                      size="sm"
                      ariaLabel={`Converting ${img.file.name}`}
                    />
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <p
                    className="truncate text-sm font-medium text-gray-900 dark:text-white"
                    title={img.file.name}
                  >
                    {img.file.name}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(img.originalSize)}</span>
                    {img.convertedSize !== null && (
                      <>
                        <span>-&gt;</span>
                        <span>{formatFileSize(img.convertedSize)}</span>
                        {(() => {
                          const { percentage, isSmaller } = calculateSizeChange(
                            img.originalSize,
                            img.convertedSize
                          );
                          return (
                            <span
                              className={clsx(
                                'font-medium',
                                isSmaller ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              )}
                            >
                              ({isSmaller ? '-' : '+'}
                              {percentage.toFixed(1)}%)
                            </span>
                          );
                        })()}
                      </>
                    )}
                  </div>

                  {img.error && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {img.error}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    {img.status === 'done' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadSingle(img)}
                      >
                        Download
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeImage(img.id)}
                      aria-label={`Remove ${img.file.name}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No images yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Upload images to convert them to a different format
          </p>
        </div>
      )}
    </div>
  );
}

export default FormatConverter;
