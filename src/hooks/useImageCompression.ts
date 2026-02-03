import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  quality: number; // 1-100
  maxWidth: number;
  maxHeight: number;
  outputFormat: 'original' | 'jpeg' | 'png' | 'webp';
}

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  compressedFile: File | null;
  compressedSize: number | null;
  originalPreview: string;
  compressedPreview: string | null;
  progress: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error: string | null;
}

export interface UseImageCompressionReturn {
  images: ImageFile[];
  isCompressing: boolean;
  addImages: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  compressImages: (options: CompressionOptions) => Promise<void>;
  compressSingleImage: (id: string, options: CompressionOptions) => Promise<void>;
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const getMimeType = (format: string): string => {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};

const getFileExtension = (format: string, originalName: string): string => {
  if (format === 'original') {
    const ext = originalName.split('.').pop()?.toLowerCase();
    return ext || 'jpg';
  }
  return format === 'jpeg' ? 'jpg' : format;
};

export function useImageCompression(): UseImageCompressionReturn {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith('image/')
    );

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: generateId(),
      file,
      originalSize: file.size,
      compressedFile: null,
      compressedSize: null,
      originalPreview: URL.createObjectURL(file),
      compressedPreview: null,
      progress: 0,
      status: 'pending',
      error: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.originalPreview);
        if (image.compressedPreview) {
          URL.revokeObjectURL(image.compressedPreview);
        }
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages((prev) => {
      prev.forEach((image) => {
        URL.revokeObjectURL(image.originalPreview);
        if (image.compressedPreview) {
          URL.revokeObjectURL(image.compressedPreview);
        }
      });
      return [];
    });
  }, []);

  const compressSingleImage = useCallback(
    async (id: string, options: CompressionOptions): Promise<void> => {
      const imageToCompress = images.find((img) => img.id === id);
      if (!imageToCompress) return;

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, status: 'compressing', progress: 0, error: null }
            : img
        )
      );

      try {
        const compressionOptions = {
          maxSizeMB: 10,
          maxWidthOrHeight: Math.max(options.maxWidth, options.maxHeight),
          useWebWorker: true,
          initialQuality: options.quality / 100,
          fileType:
            options.outputFormat === 'original'
              ? undefined
              : getMimeType(options.outputFormat),
          onProgress: (progress: number) => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === id ? { ...img, progress: Math.round(progress) } : img
              )
            );
          },
        };

        const compressedFile = await imageCompression(
          imageToCompress.file,
          compressionOptions
        );

        // Rename the file with the correct extension
        const extension = getFileExtension(
          options.outputFormat,
          imageToCompress.file.name
        );
        const baseName = imageToCompress.file.name.replace(/\.[^/.]+$/, '');
        const newFileName = `${baseName}-compressed.${extension}`;

        const renamedFile = new File([compressedFile], newFileName, {
          type: compressedFile.type,
        });

        const compressedPreview = URL.createObjectURL(renamedFile);

        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  compressedFile: renamedFile,
                  compressedSize: renamedFile.size,
                  compressedPreview,
                  progress: 100,
                  status: 'completed',
                }
              : img
          )
        );
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'error',
                  error:
                    error instanceof Error
                      ? error.message
                      : 'Compression failed',
                }
              : img
          )
        );
      }
    },
    [images]
  );

  const compressImages = useCallback(
    async (options: CompressionOptions): Promise<void> => {
      setIsCompressing(true);

      const pendingImages = images.filter(
        (img) => img.status === 'pending' || img.status === 'error'
      );

      for (const image of pendingImages) {
        await compressSingleImage(image.id, options);
      }

      setIsCompressing(false);
    },
    [images, compressSingleImage]
  );

  return {
    images,
    isCompressing,
    addImages,
    removeImage,
    clearImages,
    compressImages,
    compressSingleImage,
  };
}

export default useImageCompression;
