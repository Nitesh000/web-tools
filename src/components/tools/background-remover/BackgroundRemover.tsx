import { useState, useCallback, useRef, useEffect } from 'react';
import { removeBackground, type Config } from '@imgly/background-removal';
import { ChevronsLeftRight, AlertCircle, ArrowRight, Wand2, Download, RotateCcw } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';

interface ProcessingState {
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  message: string;
}

interface ImageData {
  file: File;
  url: string;
  size: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function BackgroundRemover() {
  const { showToast } = useToast();
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalImage?.url) {
        URL.revokeObjectURL(originalImage.url);
      }
      if (processedImage?.url) {
        URL.revokeObjectURL(processedImage.url);
      }
    };
  }, [originalImage, processedImage]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Cleanup previous images
    if (originalImage?.url) {
      URL.revokeObjectURL(originalImage.url);
    }
    if (processedImage?.url) {
      URL.revokeObjectURL(processedImage.url);
    }

    const url = URL.createObjectURL(file);
    setOriginalImage({ file, url, size: file.size });
    setProcessedImage(null);
    setProcessing({ status: 'idle', progress: 0, message: '' });
  }, [originalImage, processedImage]);

  const processImage = useCallback(async () => {
    if (!originalImage) return;

    setProcessing({
      status: 'loading',
      progress: 0,
      message: 'Loading AI model...',
    });

    try {
      const config: Config = {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          let message = 'Processing...';

          if (key === 'fetch:model') {
            message = 'Downloading AI model...';
          } else if (key === 'compute:inference') {
            message = 'Analyzing image...';
          } else if (key === 'compute:postprocess') {
            message = 'Removing background...';
          }

          setProcessing({
            status: 'processing',
            progress: percentage,
            message,
          });
        },
        output: {
          format: 'image/png',
          quality: 1,
        },
      };

      const blob = await removeBackground(originalImage.url, config);
      const url = URL.createObjectURL(blob);
      const file = new File([blob], `${originalImage.file.name.replace(/\.[^/.]+$/, '')}_no_bg.png`, {
        type: 'image/png',
      });

      setProcessedImage({ file, url, size: blob.size });
      setProcessing({
        status: 'done',
        progress: 100,
        message: 'Background removed successfully!',
      });
      showToast('Background removed successfully', 'success');
    } catch (error) {
      console.error('Background removal failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove background. Please try again.';
      setProcessing({
        status: 'error',
        progress: 0,
        message,
      });
      showToast(message, 'error');
    }
  }, [originalImage, showToast]);

  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = processedImage.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded PNG', 'success');
  }, [processedImage, showToast]);

  const handleReset = useCallback(() => {
    if (originalImage?.url) {
      URL.revokeObjectURL(originalImage.url);
    }
    if (processedImage?.url) {
      URL.revokeObjectURL(processedImage.url);
    }
    setOriginalImage(null);
    setProcessedImage(null);
    setProcessing({ status: 'idle', progress: 0, message: '' });
  }, [originalImage, processedImage]);

  // Slider drag handling
  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  }, []);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!isDragging.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleSliderMove(e.touches[0].clientX);
      }
    };
    const handleEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleSliderMove]);

  const isProcessing = processing.status === 'loading' || processing.status === 'processing';

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      {!originalImage && (
        <FileUploader
          accept="image/png,image/jpeg,image/webp,image/gif"
          maxSize={50 * 1024 * 1024}
          onFileSelect={handleFileSelect}
          label="Drop your image here or click to browse"
          hint="Supports PNG, JPG, WEBP, GIF - Max 50MB"
        />
      )}

      {/* Image Preview Section */}
      {originalImage && (
        <>
          {/* View Mode Toggle */}
          {processedImage && (
            <div className="flex justify-center gap-2">
              <Button
                variant={viewMode === 'side-by-side' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('side-by-side')}
              >
                Side by Side
              </Button>
              <Button
                variant={viewMode === 'slider' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('slider')}
              >
                Slider Compare
              </Button>
            </div>
          )}

          {/* Image Comparison */}
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Original</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(originalImage.size)}
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Checkered background pattern */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                        linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  />
                  <img
                    src={originalImage.url}
                    alt="Original image"
                    className="relative w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {processedImage ? 'Background Removed' : 'Result'}
                  </h3>
                  {processedImage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(processedImage.size)}
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 min-h-[200px]">
                  {/* Checkered background pattern */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                        linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  />
                  {processedImage ? (
                    <img
                      src={processedImage.url}
                      alt="Processed image with background removed"
                      className="relative w-full h-auto max-h-[400px] object-contain"
                    />
                  ) : (
                    <div className="relative flex items-center justify-center min-h-[200px] text-gray-400">
                      {isProcessing ? (
                        <div className="text-center p-4">
                          <div className="w-12 h-12 mx-auto mb-3 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-gray-700 dark:text-gray-300">{processing.message}</p>
                          <div className="mt-3 w-full max-w-xs mx-auto">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                style={{ width: `${processing.progress}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {processing.progress}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p>Click "Remove Background" to process</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Slider View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Drag slider to compare
                </h3>
              </div>
              <div
                ref={sliderRef}
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-ew-resize select-none"
                onMouseDown={handleSliderMouseDown}
                onTouchStart={(e) => {
                  isDragging.current = true;
                  if (e.touches.length > 0) {
                    handleSliderMove(e.touches[0].clientX);
                  }
                }}
              >
                {/* Checkered background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />

                {/* Original Image (Full) */}
                <img
                  src={originalImage.url}
                  alt="Original"
                  className="relative w-full h-auto max-h-[500px] object-contain"
                  draggable={false}
                />

                {/* Processed Image (Clipped) */}
                {processedImage && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={processedImage.url}
                      alt="Processed"
                      className="w-full h-auto max-h-[500px] object-contain"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Slider Handle */}
                {processedImage && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <ChevronsLeftRight className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                )}

                {/* Labels */}
                {processedImage && (
                  <>
                    <span className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded text-xs text-white">
                      Original
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded text-xs text-white">
                      Processed
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {processing.status === 'error' && (
            <div
              role="alert"
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{processing.message}</span>
            </div>
          )}

          {/* File Size Comparison */}
          {processedImage && (
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatFileSize(originalImage.size)}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Processed</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatFileSize(processedImage.size)}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {!processedImage && !isProcessing && (
              <Button
                size="lg"
                onClick={processImage}
                leftIcon={<Wand2 className="w-5 h-5" />}
              >
                Remove Background
              </Button>
            )}

            {processedImage && (
              <Button
                size="lg"
                onClick={handleDownload}
                leftIcon={<Download className="w-5 h-5" />}
              >
                Download PNG
              </Button>
            )}

            <Button
              size="lg"
              variant="secondary"
              onClick={handleReset}
              disabled={isProcessing}
              leftIcon={<RotateCcw className="w-5 h-5" />}
            >
              Start Over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default BackgroundRemover;
