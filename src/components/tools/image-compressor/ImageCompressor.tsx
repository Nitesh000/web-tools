import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useImageCompression, type CompressionOptions, type ImageFile } from '../../../hooks/useImageCompression';
import { Button } from '../../common/Button';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const calculateReduction = (original: number, compressed: number): number => {
  return Math.round(((original - compressed) / original) * 100);
};

interface ImageCardProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  onDownload: (image: ImageFile) => void;
}

function ImageCard({ image, onRemove, onDownload }: ImageCardProps) {
  const reduction =
    image.compressedSize !== null
      ? calculateReduction(image.originalSize, image.compressedSize)
      : null;

  return (
    <div className="bg-slate-700/50 rounded-xl border border-slate-600/50 overflow-hidden">
      {/* Preview Images */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="space-y-2">
          <p className="text-xs text-slate-400 text-center">Original</p>
          <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={image.originalPreview}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <p className="text-xs text-slate-300 text-center">
            {formatFileSize(image.originalSize)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 text-center">Compressed</p>
          <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
            {image.compressedPreview ? (
              <img
                src={image.compressedPreview}
                alt="Compressed"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-slate-500 text-xs text-center px-2">
                {image.status === 'compressing' ? 'Compressing...' : 'Pending'}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-300 text-center">
            {image.compressedSize !== null
              ? formatFileSize(image.compressedSize)
              : '-'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {image.status === 'compressing' && (
        <div className="px-3 pb-2">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${image.progress}%` }}
              role="progressbar"
              aria-valuenow={image.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-slate-400 text-center mt-1">
            {image.progress}%
          </p>
        </div>
      )}

      {/* File Info & Actions */}
      <div className="p-3 border-t border-slate-600/50">
        <p className="text-sm text-white truncate mb-2" title={image.file.name}>
          {image.file.name}
        </p>

        {/* Status & Reduction */}
        <div className="flex items-center justify-between mb-3">
          {image.status === 'completed' && reduction !== null && (
            <span
              className={`text-sm font-medium ${
                reduction > 0 ? 'text-green-400' : 'text-yellow-400'
              }`}
            >
              {reduction > 0 ? `-${reduction}%` : 'No reduction'}
            </span>
          )}
          {image.status === 'error' && (
            <span className="text-sm text-red-400">{image.error}</span>
          )}
          {image.status === 'pending' && (
            <span className="text-sm text-slate-400">Ready to compress</span>
          )}
          {image.status === 'compressing' && (
            <span className="text-sm text-blue-400">Compressing...</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(image.id)}
            className="flex-1"
            aria-label={`Remove ${image.file.name}`}
          >
            Remove
          </Button>
          {image.status === 'completed' && image.compressedFile && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDownload(image)}
              className="flex-1"
              aria-label={`Download compressed ${image.file.name}`}
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImageCompressor() {
  const {
    images,
    isCompressing,
    addImages,
    removeImage,
    clearImages,
    compressImages,
  } = useImageCompression();

  const [options, setOptions] = useState<CompressionOptions>({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    outputFormat: 'original',
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        addImages(files);
      }
    },
    [addImages]
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        addImages(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [addImages]
  );

  const handleDownloadSingle = useCallback((image: ImageFile) => {
    if (image.compressedFile) {
      saveAs(image.compressedFile, image.compressedFile.name);
    }
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter(
      (img) => img.status === 'completed' && img.compressedFile
    );

    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      handleDownloadSingle(completedImages[0]);
      return;
    }

    const zip = new JSZip();

    completedImages.forEach((image) => {
      if (image.compressedFile) {
        zip.file(image.compressedFile.name, image.compressedFile);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'compressed-images.zip');
  }, [images, handleDownloadSingle]);

  const completedCount = images.filter(
    (img) => img.status === 'completed'
  ).length;
  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce(
    (sum, img) => sum + (img.compressedSize || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Compression Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quality Slider */}
        <div className="space-y-2">
          <label
            htmlFor="quality-slider"
            className="block text-sm font-medium text-slate-300"
          >
            Quality: {options.quality}%
          </label>
          <input
            id="quality-slider"
            type="range"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                quality: Number(e.target.value),
              }))
            }
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-valuemin={1}
            aria-valuemax={100}
            aria-valuenow={options.quality}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Max Width */}
        <div className="space-y-2">
          <label
            htmlFor="max-width"
            className="block text-sm font-medium text-slate-300"
          >
            Max Width (px)
          </label>
          <input
            id="max-width"
            type="number"
            min="100"
            max="10000"
            value={options.maxWidth}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                maxWidth: Number(e.target.value) || 1920,
              }))
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Height */}
        <div className="space-y-2">
          <label
            htmlFor="max-height"
            className="block text-sm font-medium text-slate-300"
          >
            Max Height (px)
          </label>
          <input
            id="max-height"
            type="number"
            min="100"
            max="10000"
            value={options.maxHeight}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                maxHeight: Number(e.target.value) || 1080,
              }))
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label
            htmlFor="output-format"
            className="block text-sm font-medium text-slate-300"
          >
            Output Format
          </label>
          <select
            id="output-format"
            value={options.outputFormat}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                outputFormat: e.target.value as CompressionOptions['outputFormat'],
              }))
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="original">Keep Original</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload images by clicking or dragging and dropping"
        className={`
          relative p-8 border-2 border-dashed rounded-xl text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        <svg
          className="w-12 h-12 mx-auto text-slate-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg text-slate-300 mb-2">
          {isDragging
            ? 'Drop images here'
            : 'Drag & drop images here, or click to select'}
        </p>
        <p className="text-sm text-slate-500">
          Supports JPEG, PNG, WebP, GIF, and more
        </p>
      </div>

      {/* Action Buttons */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => compressImages(options)}
            isLoading={isCompressing}
            disabled={isCompressing || images.every((img) => img.status === 'completed')}
          >
            {isCompressing
              ? 'Compressing...'
              : `Compress ${images.filter((img) => img.status !== 'completed').length} Image(s)`}
          </Button>

          {completedCount > 0 && (
            <Button variant="secondary" size="lg" onClick={handleDownloadAll}>
              Download All ({completedCount})
            </Button>
          )}

          <Button variant="outline" size="lg" onClick={clearImages}>
            Clear All
          </Button>
        </div>
      )}

      {/* Stats Summary */}
      {completedCount > 0 && (
        <div className="bg-slate-700/30 rounded-lg p-4 text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">Original Total</p>
              <p className="text-lg font-semibold text-white">
                {formatFileSize(totalOriginalSize)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Compressed Total</p>
              <p className="text-lg font-semibold text-white">
                {formatFileSize(totalCompressedSize)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Saved</p>
              <p className="text-lg font-semibold text-green-400">
                {totalOriginalSize > 0
                  ? `${calculateReduction(totalOriginalSize, totalCompressedSize)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onRemove={removeImage}
              onDownload={handleDownloadSingle}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No images added yet. Upload some images to get started!</p>
        </div>
      )}
    </div>
  );
}

export default ImageCompressor;
