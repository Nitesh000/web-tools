import {
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import clsx from "clsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadCloud, Download, Trash2 } from "lucide-react";
import {
  useImageCompression,
  type CompressionOptions,
  type ImageFile,
} from "../../../hooks/useImageCompression";
import { Button } from "../../common/Button";
import { Select } from "../../common/Select";
import { Input } from "../../common/Input";
import { Slider } from "../../common/Slider";
import { useToast } from "../../common/Toast";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Preview Images */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">Original</p>
          <div className="flex overflow-hidden justify-center items-center rounded-lg aspect-square bg-gray-100 dark:bg-gray-900">
            <img
              src={image.originalPreview}
              alt="Original"
              className="object-contain max-w-full max-h-full"
            />
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300">
            {formatFileSize(image.originalSize)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">Compressed</p>
          <div className="flex overflow-hidden justify-center items-center rounded-lg aspect-square bg-gray-100 dark:bg-gray-900">
            {image.compressedPreview ? (
              <img
                src={image.compressedPreview}
                alt="Compressed"
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <div className="px-2 text-xs text-center text-gray-400">
                {image.status === "compressing" ? "Compressing..." : "Pending"}
              </div>
            )}
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300">
            {image.compressedSize !== null
              ? formatFileSize(image.compressedSize)
              : "-"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {image.status === "compressing" && (
        <div className="px-3 pb-2">
          <div className="overflow-hidden h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${image.progress}%` }}
              role="progressbar"
              aria-valuenow={image.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
            {image.progress}%
          </p>
        </div>
      )}

      {/* File Info & Actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <p className="mb-2 text-sm text-gray-900 dark:text-white truncate" title={image.file.name}>
          {image.file.name}
        </p>

        {/* Status & Reduction */}
        <div className="flex justify-between items-center mb-3">
          {image.status === "completed" && reduction !== null && (
            <span
              className={`text-sm font-medium ${
                reduction > 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {reduction > 0 ? `-${reduction}%` : "No reduction"}
            </span>
          )}
          {image.status === "error" && (
            <span className="text-sm text-red-600 dark:text-red-400">{image.error}</span>
          )}
          {image.status === "pending" && (
            <span className="text-sm text-gray-500 dark:text-gray-400">Ready to compress</span>
          )}
          {image.status === "compressing" && (
            <span className="text-sm text-blue-600 dark:text-blue-400">Compressing...</span>
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
          {image.status === "completed" && image.compressedFile && (
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

const MIN_DIMENSION = 100;
const MAX_DIMENSION = 10000;

export function ImageCompressor() {
  const { showToast } = useToast();
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
    outputFormat: "original",
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

  const handleAddFiles = useCallback(
    (files: FileList | File[]) => {
      const { added, rejected } = addImages(files);
      if (rejected > 0) {
        showToast(
          `Skipped ${rejected} file${rejected > 1 ? "s" : ""} - only image files are supported`,
          "error",
        );
      } else if (added > 0) {
        showToast(`Added ${added} image${added > 1 ? "s" : ""}`, "success");
      }
    },
    [addImages, showToast],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleAddFiles(files);
      }
    },
    [handleAddFiles],
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleAddFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleAddFiles],
  );

  const handleDownloadSingle = useCallback(
    (image: ImageFile) => {
      if (image.compressedFile) {
        saveAs(image.compressedFile, image.compressedFile.name);
        showToast(`Downloaded ${image.compressedFile.name}`, "success");
      }
    },
    [showToast],
  );

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter(
      (img) => img.status === "completed" && img.compressedFile,
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

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "compressed-images.zip");
    showToast(`Downloaded ${completedImages.length} images as .zip`, "success");
  }, [images, handleDownloadSingle, showToast]);

  const completedCount = images.filter(
    (img) => img.status === "completed",
  ).length;
  const totalOriginalSize = images.reduce(
    (sum, img) => sum + img.originalSize,
    0,
  );
  const totalCompressedSize = images.reduce(
    (sum, img) => sum + (img.compressedSize || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Compression Options */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Compression Settings
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Slider
            id="quality-slider"
            label={`Quality: ${options.quality}%`}
            minLabel="Low"
            maxLabel="High"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                quality: Number(e.target.value),
              }))
            }
            aria-valuemin={1}
            aria-valuemax={100}
            aria-valuenow={options.quality}
          />

          <Input
            id="max-width"
            label="Max Width (px)"
            type="number"
            min="100"
            max="10000"
            value={options.maxWidth}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                maxWidth: Math.min(
                  MAX_DIMENSION,
                  Math.max(
                    MIN_DIMENSION,
                    Number(e.target.value) || MIN_DIMENSION,
                  ),
                ),
              }))
            }
          />

          <Input
            id="max-height"
            label="Max Height (px)"
            type="number"
            min="100"
            max="10000"
            value={options.maxHeight}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                maxHeight: Math.min(
                  MAX_DIMENSION,
                  Math.max(
                    MIN_DIMENSION,
                    Number(e.target.value) || MIN_DIMENSION,
                  ),
                ),
              }))
            }
          />

          <Select
            id="output-format"
            label="Output Format"
            value={options.outputFormat}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                outputFormat: e.target
                  .value as CompressionOptions["outputFormat"],
              }))
            }
          >
            <option value="original">Keep Original</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </Select>
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload images by clicking or dragging and dropping"
        className={clsx(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
        )}
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
        <UploadCloud
          className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          {isDragging
            ? "Drop images here"
            : "Drag & drop images here, or click to select"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
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
            disabled={
              isCompressing || images.every((img) => img.status === "completed")
            }
          >
            {isCompressing
              ? "Compressing..."
              : `Compress ${images.filter((img) => img.status !== "completed").length} Image(s)`}
          </Button>

          {completedCount > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadAll}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download All ({completedCount})
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={clearImages}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Stats Summary */}
      {completedCount > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Original Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatFileSize(totalOriginalSize)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compressed Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatFileSize(totalCompressedSize)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {totalOriginalSize > 0
                  ? `${calculateReduction(totalOriginalSize, totalCompressedSize)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>No images added yet. Upload some images to get started!</p>
        </div>
      )}
    </div>
  );
}

export default ImageCompressor;
