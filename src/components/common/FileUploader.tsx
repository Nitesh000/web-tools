import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  hint?: string;
}

export function FileUploader({
  accept = 'image/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFileSelect,
  disabled = false,
  className,
  label = 'Drop your file here or click to browse',
  hint,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return false;
      }

      // Check file type if accept is specified
      if (accept && accept !== '*') {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const isAccepted = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            const category = type.slice(0, -2);
            return file.type.startsWith(category);
          }
          return file.type === type || file.name.endsWith(type);
        });

        if (!isAccepted) {
          setError('File type not supported');
          return false;
        }
      }

      return true;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input so the same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled]
  );

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={clsx(
          'relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
          {
            'border-slate-600 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800':
              !isDragging && !disabled,
            'border-blue-500 bg-blue-900/20': isDragging && !disabled,
            'border-slate-700 bg-slate-900/50 cursor-not-allowed opacity-60':
              disabled,
          }
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center text-center">
          {/* Upload Icon */}
          <div
            className={clsx(
              'w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-colors',
              {
                'bg-slate-700': !isDragging,
                'bg-blue-600': isDragging,
              }
            )}
          >
            <svg
              className={clsx('w-8 h-8 transition-colors', {
                'text-slate-400': !isDragging,
                'text-white': isDragging,
              })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Label */}
          <p className="text-lg font-medium text-white mb-2">{label}</p>

          {/* Hint */}
          {hint && <p className="text-sm text-slate-400">{hint}</p>}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 text-red-400 text-sm"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
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
      )}
    </div>
  );
}

export default FileUploader;
