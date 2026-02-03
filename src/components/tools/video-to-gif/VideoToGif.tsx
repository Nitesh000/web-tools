import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react';
import GIF from 'gif.js';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';

interface VideoToGifSettings {
  startTime: number;
  endTime: number;
  frameRate: number;
  width: number;
  height: number;
  quality: number;
}

interface OutputSize {
  label: string;
  value: number | 'original';
}

const OUTPUT_SIZES: OutputSize[] = [
  { label: 'Original', value: 'original' },
  { label: '480p', value: 480 },
  { label: '360p', value: 360 },
  { label: '240p', value: 240 },
  { label: '120p', value: 120 },
];

const FRAME_RATES = [5, 10, 15, 20, 25, 30];

const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export function VideoToGif() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<number>(0);
  const [previewFrame, setPreviewFrame] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [settings, setSettings] = useState<VideoToGifSettings>({
    startTime: 0,
    endTime: 0,
    frameRate: 10,
    width: 0,
    height: 0,
    quality: 70,
  });

  const [selectedSize, setSelectedSize] = useState<number | 'original'>('original');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, [videoUrl, gifUrl]);

  // Update dimensions when size selection changes
  useEffect(() => {
    if (videoWidth && videoHeight) {
      const aspectRatio = videoWidth / videoHeight;
      let newWidth: number;
      let newHeight: number;

      if (selectedSize === 'original') {
        newWidth = videoWidth;
        newHeight = videoHeight;
      } else {
        newHeight = selectedSize;
        newWidth = Math.round(selectedSize * aspectRatio);
      }

      setSettings((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    }
  }, [selectedSize, videoWidth, videoHeight]);

  // Estimate output size
  useEffect(() => {
    if (settings.width && settings.height && settings.endTime > settings.startTime) {
      const duration = settings.endTime - settings.startTime;
      const totalFrames = Math.ceil(duration * settings.frameRate);
      // Rough estimate: each pixel takes about 0.1-0.3 bytes in GIF depending on quality
      const bytesPerPixel = 0.15 * (1 - (settings.quality - 10) / 100);
      const estimatedBytes = settings.width * settings.height * totalFrames * bytesPerPixel;

      if (estimatedBytes < 1024) {
        setEstimatedSize(`~${Math.round(estimatedBytes)} B`);
      } else if (estimatedBytes < 1024 * 1024) {
        setEstimatedSize(`~${Math.round(estimatedBytes / 1024)} KB`);
      } else {
        setEstimatedSize(`~${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`);
      }
    } else {
      setEstimatedSize('');
    }
  }, [settings]);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, or MOV)');
      return;
    }

    setError('');
    setVideoFile(file);
    setGifBlob(null);
    setGifUrl('');
    setProgress(0);

    // Revoke previous URL
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  }, [videoUrl]);

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoDuration(video.duration);
    setVideoWidth(video.videoWidth);
    setVideoHeight(video.videoHeight);

    setSettings((prev) => ({
      ...prev,
      endTime: Math.min(video.duration, 10), // Default to first 10 seconds
      width: video.videoWidth,
      height: video.videoHeight,
    }));

    // Capture first frame as preview
    captureFrame(0);
  }, []);

  const captureFrame = useCallback((time: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    video.currentTime = time;

    const handleSeeked = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      setPreviewFrame(canvas.toDataURL('image/jpeg', 0.8));
      video.removeEventListener('seeked', handleSeeked);
    };

    video.addEventListener('seeked', handleSeeked);
  }, []);

  const handleStartTimeChange = useCallback((value: number) => {
    setSettings((prev) => ({
      ...prev,
      startTime: Math.min(value, prev.endTime - 0.1),
    }));
    captureFrame(value);
  }, [captureFrame]);

  const handleEndTimeChange = useCallback((value: number) => {
    setSettings((prev) => ({
      ...prev,
      endTime: Math.max(value, prev.startTime + 0.1),
    }));
  }, []);

  const extractFrames = useCallback(async (): Promise<ImageData[]> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) throw new Error('Video or canvas not available');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const { startTime, endTime, frameRate, width, height } = settings;
    const duration = endTime - startTime;
    const totalFrames = Math.ceil(duration * frameRate);
    const frameInterval = 1 / frameRate;

    canvas.width = width;
    canvas.height = height;

    const frames: ImageData[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const time = startTime + i * frameInterval;

      await new Promise<void>((resolve) => {
        const handleSeeked = () => {
          ctx.drawImage(video, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          frames.push(imageData);
          video.removeEventListener('seeked', handleSeeked);
          resolve();
        };
        video.addEventListener('seeked', handleSeeked);
        video.currentTime = time;
      });

      setProgress(Math.round((i / totalFrames) * 50)); // 0-50% for frame extraction
      setProgressStatus(`Extracting frame ${i + 1} of ${totalFrames}`);
    }

    return frames;
  }, [settings]);

  const convertToGif = useCallback(async () => {
    if (!videoFile) return;

    setIsConverting(true);
    setProgress(0);
    setProgressStatus('Preparing...');
    setError('');
    setGifBlob(null);
    if (gifUrl) URL.revokeObjectURL(gifUrl);

    try {
      // Extract frames from video
      const frames = await extractFrames();

      setProgressStatus('Encoding GIF...');

      // Convert quality from 1-100 to gif.js quality (1-20, lower is better)
      const gifQuality = Math.max(1, Math.min(20, Math.round(21 - (settings.quality / 100) * 20)));
      const delay = Math.round(1000 / settings.frameRate);

      // Create GIF using gif.js
      const gif = new GIF({
        workers: 2,
        quality: gifQuality,
        width: settings.width,
        height: settings.height,
        workerScript: '/gif.worker.js',
      });

      // Add frames
      frames.forEach((frameData) => {
        gif.addFrame(frameData, { delay });
      });

      gif.on('progress', (p: number) => {
        setProgress(50 + Math.round(p * 50)); // 50-100% for encoding
      });

      await new Promise<void>((resolve, reject) => {
        gif.on('finished', (blob: Blob) => {
          setGifBlob(blob);
          const url = URL.createObjectURL(blob);
          setGifUrl(url);
          resolve();
        });

        gif.on('error', (err: Error) => {
          reject(err);
        });

        gif.render();
      });

      setProgress(100);
      setProgressStatus('Complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setProgress(0);
      setProgressStatus('');
    } finally {
      setIsConverting(false);
    }
  }, [videoFile, extractFrames, settings, gifUrl]);

  const handleDownload = useCallback(() => {
    if (!gifBlob || !videoFile) return;

    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = `${videoFile.name.replace(/\.[^/.]+$/, '')}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [gifBlob, gifUrl, videoFile]);

  const handleReset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);

    setVideoFile(null);
    setVideoUrl('');
    setVideoDuration(0);
    setVideoWidth(0);
    setVideoHeight(0);
    setPreviewFrame('');
    setGifBlob(null);
    setGifUrl('');
    setProgress(0);
    setProgressStatus('');
    setError('');
    setEstimatedSize('');
    setSelectedSize('original');
    setSettings({
      startTime: 0,
      endTime: 0,
      frameRate: 10,
      width: 0,
      height: 0,
      quality: 70,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [videoUrl, gifUrl]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.round((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* File Upload Area */}
      {!videoFile && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
            onChange={handleFileSelect}
            className="sr-only"
            id="video-upload"
            aria-describedby="upload-help"
          />
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-700/30 transition-all"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-12 h-12 text-slate-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="mb-2 text-lg text-slate-300">
                <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p id="upload-help" className="text-sm text-slate-400">
                MP4, WebM, or MOV (max 100MB recommended)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-400"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Video Preview and Settings */}
      {videoFile && (
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Video Preview</h3>
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  onLoadedMetadata={handleVideoLoad}
                  preload="metadata"
                  aria-label="Video preview"
                />
              </div>
              {videoFile && (
                <div className="text-sm text-slate-400">
                  <p>File: {videoFile.name}</p>
                  <p>Size: {formatFileSize(videoFile.size)}</p>
                  {videoDuration > 0 && (
                    <p>
                      Duration: {formatTime(videoDuration)} | Resolution: {videoWidth}x{videoHeight}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* First Frame Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Preview (Start Frame)</h3>
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                {previewFrame ? (
                  <img
                    src={previewFrame}
                    alt="First frame preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    Loading preview...
                  </div>
                )}
              </div>
              {estimatedSize && (
                <p className="text-sm text-slate-400">
                  Estimated output size: <span className="text-blue-400">{estimatedSize}</span>
                </p>
              )}
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium text-white">Time Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-time" className="block text-sm font-medium text-slate-300">
                  Start Time: {formatTime(settings.startTime)}
                </label>
                <input
                  id="start-time"
                  type="range"
                  min={0}
                  max={videoDuration}
                  step={0.01}
                  value={settings.startTime}
                  onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  aria-valuemin={0}
                  aria-valuemax={videoDuration}
                  aria-valuenow={settings.startTime}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-time" className="block text-sm font-medium text-slate-300">
                  End Time: {formatTime(settings.endTime)}
                </label>
                <input
                  id="end-time"
                  type="range"
                  min={0}
                  max={videoDuration}
                  step={0.01}
                  value={settings.endTime}
                  onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  aria-valuemin={0}
                  aria-valuemax={videoDuration}
                  aria-valuenow={settings.endTime}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Selected duration: {formatTime(settings.endTime - settings.startTime)}
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Frame Rate */}
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
              <label htmlFor="frame-rate" className="block text-sm font-medium text-slate-300">
                Frame Rate
              </label>
              <select
                id="frame-rate"
                value={settings.frameRate}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, frameRate: parseInt(e.target.value) }))
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-describedby="frame-rate-desc"
              >
                {FRAME_RATES.map((fps) => (
                  <option key={fps} value={fps}>
                    {fps} FPS
                  </option>
                ))}
              </select>
              <p id="frame-rate-desc" className="text-xs text-slate-500">
                Higher = smoother but larger file
              </p>
            </div>

            {/* Output Size */}
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
              <label htmlFor="output-size" className="block text-sm font-medium text-slate-300">
                Output Size
              </label>
              <select
                id="output-size"
                value={selectedSize}
                onChange={(e) => {
                  const value = e.target.value === 'original' ? 'original' : parseInt(e.target.value);
                  setSelectedSize(value);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-describedby="output-size-desc"
              >
                {OUTPUT_SIZES.map((size) => (
                  <option key={size.label} value={size.value}>
                    {size.label} {size.value !== 'original' && `(${size.value}p)`}
                  </option>
                ))}
              </select>
              <p id="output-size-desc" className="text-xs text-slate-500">
                {settings.width}x{settings.height}px
              </p>
            </div>

            {/* Quality */}
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
              <label htmlFor="quality" className="block text-sm font-medium text-slate-300">
                Quality: {settings.quality}%
              </label>
              <input
                id="quality"
                type="range"
                min={10}
                max={100}
                step={5}
                value={settings.quality}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, quality: parseInt(e.target.value) }))
                }
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                aria-valuemin={10}
                aria-valuemax={100}
                aria-valuenow={settings.quality}
                aria-describedby="quality-desc"
              />
              <p id="quality-desc" className="text-xs text-slate-500">
                Higher = better quality, larger file
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {isConverting && (
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">{progressStatus}</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <ProgressBar
                value={progress}
                max={100}
                variant="default"
                size="md"
                ariaLabel={`Conversion progress: ${progress}%`}
              />
            </div>
          )}

          {/* GIF Preview */}
          {gifUrl && (
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-medium text-white">Generated GIF</h3>
              <div className="flex justify-center">
                <img
                  src={gifUrl}
                  alt="Generated GIF preview"
                  className="max-w-full max-h-96 rounded-lg"
                />
              </div>
              {gifBlob && (
                <p className="text-center text-sm text-slate-400">
                  Final size: <span className="text-green-400">{formatFileSize(gifBlob.size)}</span>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {!gifUrl ? (
              <Button
                onClick={convertToGif}
                disabled={isConverting || !videoFile}
                isLoading={isConverting}
                size="lg"
                leftIcon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                }
              >
                {isConverting ? 'Converting...' : 'Convert to GIF'}
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                size="lg"
                leftIcon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                }
              >
                Download GIF
              </Button>
            )}
            <Button onClick={handleReset} variant="secondary" size="lg">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoToGif;
