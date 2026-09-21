import {
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadCloud, Download, Trash2 } from "lucide-react";
import {
  useImageCompression,
  type CompressionOptions,
  type ImageFile,
} from "../../../hooks/useImageCompression";
import { Button } from "../../common/Button";
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
    <div className="overflow-hidden rounded-xl border bg-slate-700/50 border-slate-600/50">
      {/* Preview Images */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="space-y-2">
          <p className="text-xs text-center text-slate-400">Original</p>
          <div className="flex overflow-hidden justify-center items-center rounded-lg aspect-square bg-slate-800">
            <img
              src={image.originalPreview}
              alt="Original"
              className="object-contain max-w-full max-h-full"
            />
          </div>
          <p className="text-xs text-center text-slate-300">
            {formatFileSize(image.originalSize)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-center text-slate-400">Compressed</p>
          <div className="flex overflow-hidden justify-center items-center rounded-lg aspect-square bg-slate-800">
            {image.compressedPreview ? (
              <img
                src={image.compressedPreview}
                alt="Compressed"
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <div className="px-2 text-xs text-center text-slate-500">
                {image.status === "compressing" ? "Compressing..." : "Pending"}
              </div>
            )}
          </div>
          <p className="text-xs text-center text-slate-300">
            {image.compressedSize !== null
              ? formatFileSize(image.compressedSize)
              : "-"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {image.status === "compressing" && (
        <div className="px-3 pb-2">
          <div className="overflow-hidden h-2 rounded-full bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${image.progress}%` }}
              role="progressbar"
              aria-valuenow={image.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-1 text-xs text-center text-slate-400">
            {image.progress}%
          </p>
        </div>
      )}

      {/* File Info & Actions */}
      <div className="p-3 border-t border-slate-600/50">
        <p className="mb-2 text-sm text-white truncate" title={image.file.name}>
          {image.file.name}
        </p>

        {/* Status & Reduction */}
        <div className="flex justify-between items-center mb-3">
          {image.status === "completed" && reduction !== null && (
            <span
              className={`text-sm font-medium ${
                reduction > 0 ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {reduction > 0 ? `-${reduction}%` : "No reduction"}
            </span>
          )}
          {image.status === "error" && (
            <span className="text-sm text-red-400">{image.error}</span>
          )}
          {image.status === "pending" && (
            <span className="text-sm text-slate-400">Ready to compress</span>
          )}
          {image.status === "compressing" && (
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quality Slider */}
        <div className="space-y-2">
          <label
            htmlFor="quality-slider"
            className="block text-sm font-medium text-slate-700"
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
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-blue-500"
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
            className="block text-sm font-medium text-slate-700"
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
                maxWidth: Math.min(
                  MAX_DIMENSION,
                  Math.max(
                    MIN_DIMENSION,
                    Number(e.target.value) || MIN_DIMENSION,
                  ),
                ),
              }))
            }
            className="py-2 px-3 w-full text-white rounded-lg border focus:border-transparent focus:ring-2 focus:ring-blue-500 bg-slate-700 border-slate-600"
          />
        </div>

        {/* Max Height */}
        <div className="space-y-2">
          <label
            htmlFor="max-height"
            className="block text-sm font-medium text-slate-700"
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
                maxHeight: Math.min(
                  MAX_DIMENSION,
                  Math.max(
                    MIN_DIMENSION,
                    Number(e.target.value) || MIN_DIMENSION,
                  ),
                ),
              }))
            }
            className="py-2 px-3 w-full text-white rounded-lg border focus:border-transparent focus:ring-2 focus:ring-blue-500 bg-slate-700 border-slate-600"
          />
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label
            htmlFor="output-format"
            className="block text-sm font-medium text-slate-700"
          >
            Output Format
          </label>
          <select
            id="output-format"
            value={options.outputFormat}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                outputFormat: e.target
                  .value as CompressionOptions["outputFormat"],
              }))
            }
            className="py-2 px-3 w-full text-white rounded-lg border focus:border-transparent focus:ring-2 focus:ring-blue-500 bg-slate-700 border-slate-600"
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
          if (e.key === "Enter" || e.key === " ") {
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
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
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
        <UploadCloud
          className="mx-auto mb-4 w-12 h-12 text-slate-400"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p className="mb-2 text-lg text-slate-300">
          {isDragging
            ? "Drop images here"
            : "Drag & drop images here, or click to select"}
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
        <div className="p-4 text-center rounded-lg bg-slate-700/30">
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
        <div className="py-8 text-center text-slate-500">
          <p>No images added yet. Upload some images to get started!</p>
        </div>
      )}
    </div>
  );
}

export default ImageCompressor;
