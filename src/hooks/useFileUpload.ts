import { useState, useCallback, useRef, type ChangeEvent, type DragEvent } from 'react';

export interface FileValidationOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Accepted MIME types (e.g., ['image/png', 'image/jpeg']) */
  acceptedTypes?: string[];
  /** Accepted file extensions (e.g., ['.png', '.jpg']) */
  acceptedExtensions?: string[];
  /** Maximum number of files for multiple upload */
  maxFiles?: number;
  /** Custom validation function */
  customValidation?: (file: File) => string | null;
}

export interface FileUploadState {
  /** Currently selected files */
  files: File[];
  /** Validation error messages */
  errors: string[];
  /** Whether files are being dragged over the drop zone */
  isDragging: boolean;
  /** Whether files are currently being processed */
  isProcessing: boolean;
}

export interface UseFileUploadReturn extends FileUploadState {
  /** Handle file input change event */
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Handle drag enter event */
  handleDragEnter: (event: DragEvent) => void;
  /** Handle drag leave event */
  handleDragLeave: (event: DragEvent) => void;
  /** Handle drag over event */
  handleDragOver: (event: DragEvent) => void;
  /** Handle drop event */
  handleDrop: (event: DragEvent) => void;
  /** Programmatically open file picker */
  openFilePicker: () => void;
  /** Clear selected files and errors */
  clearFiles: () => void;
  /** Remove a specific file by index */
  removeFile: (index: number) => void;
  /** Reference to attach to hidden file input */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Generate accept string for input element */
  acceptString: string;
}

/**
 * Hook for handling file uploads with validation, drag & drop support.
 *
 * @param options - Validation and configuration options
 * @param onFilesSelected - Callback when valid files are selected
 * @returns Object with state and handlers
 */
export function useFileUpload(
  options: FileValidationOptions = {},
  onFilesSelected?: (files: File[]) => void
): UseFileUploadReturn {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    minSize = 0,
    acceptedTypes = [],
    acceptedExtensions = [],
    maxFiles = 1,
    customValidation,
  } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);

  // Generate accept string for input element
  const acceptString = [...acceptedTypes, ...acceptedExtensions].join(',');

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`;
      }

      if (file.size < minSize) {
        const minSizeKB = (minSize / 1024).toFixed(1);
        return `File "${file.name}" is smaller than minimum size of ${minSizeKB}KB`;
      }

      // Check MIME type
      if (acceptedTypes.length > 0) {
        const isTypeAccepted = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            const category = type.slice(0, -2);
            return file.type.startsWith(category);
          }
          return file.type === type;
        });

        if (!isTypeAccepted) {
          return `File "${file.name}" has unsupported type: ${file.type || 'unknown'}`;
        }
      }

      // Check file extension
      if (acceptedExtensions.length > 0) {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isExtensionAccepted = acceptedExtensions.some(
          (ext) => ext.toLowerCase() === extension
        );

        if (!isExtensionAccepted) {
          return `File "${file.name}" has unsupported extension`;
        }
      }

      // Run custom validation
      if (customValidation) {
        const customError = customValidation(file);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [maxSize, minSize, acceptedTypes, acceptedExtensions, customValidation]
  );

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      setIsProcessing(true);
      const filesArray = Array.from(fileList);
      const validFiles: File[] = [];
      const validationErrors: string[] = [];

      // Check max files limit
      if (filesArray.length > maxFiles) {
        validationErrors.push(`Maximum ${maxFiles} file(s) allowed`);
      }

      // Validate each file (up to maxFiles)
      const filesToProcess = filesArray.slice(0, maxFiles);
      for (const file of filesToProcess) {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      setFiles(validFiles);
      setErrors(validationErrors);
      setIsProcessing(false);

      if (validFiles.length > 0 && onFilesSelected) {
        onFilesSelected(validFiles);
      }
    },
    [maxFiles, validateFile, onFilesSelected]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        processFiles(fileList);
      }
      // Reset input value to allow re-selecting the same file
      event.target.value = '';
    },
    [processFiles]
  );

  const handleDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const fileList = event.dataTransfer.files;
      if (fileList && fileList.length > 0) {
        processFiles(fileList);
      }
    },
    [processFiles]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setErrors([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = prev.filter((_, i) => i !== index);
        if (onFilesSelected && newFiles.length > 0) {
          onFilesSelected(newFiles);
        }
        return newFiles;
      });
    },
    [onFilesSelected]
  );

  return {
    files,
    errors,
    isDragging,
    isProcessing,
    handleChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFilePicker,
    clearFiles,
    removeFile,
    inputRef,
    acceptString,
  };
}

export default useFileUpload;
