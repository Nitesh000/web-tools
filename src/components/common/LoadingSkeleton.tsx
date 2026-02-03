import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  animate = true,
  className,
  ...props
}: LoadingSkeletonProps) {
  const baseClasses = clsx(
    'bg-gray-200 dark:bg-gray-700',
    animate && 'animate-pulse'
  );

  const variantClasses: Record<SkeletonVariant, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }
    if (variant === 'circular' && !height) {
      style.height = style.width || '40px';
    }
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div
        className={clsx('space-y-2', className)}
        role="status"
        aria-label="Loading content"
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(baseClasses, variantClasses[variant])}
            style={{
              ...getStyle(),
              width:
                index === lines - 1 && !width
                  ? '75%'
                  : width
                    ? typeof width === 'number'
                      ? `${width}px`
                      : width
                    : '100%',
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      style={getStyle()}
      role="status"
      aria-label="Loading content"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Preset skeleton components for common use cases
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      role="status"
      aria-label="Loading card"
    >
      <LoadingSkeleton variant="rounded" width={48} height={48} className="mb-4" />
      <LoadingSkeleton variant="text" width="60%" height={24} className="mb-2" />
      <LoadingSkeleton variant="text" lines={2} />
      <span className="sr-only">Loading card...</span>
    </div>
  );
}

export function TableRowSkeleton({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <tr className={className} role="status" aria-label="Loading table row">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <LoadingSkeleton variant="text" />
        </td>
      ))}
      <span className="sr-only">Loading table row...</span>
    </tr>
  );
}

export function ImageSkeleton({
  aspectRatio = '16/9',
  className,
}: {
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700',
        className
      )}
      style={{ aspectRatio }}
      role="status"
      aria-label="Loading image"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="h-10 w-10 text-gray-400 dark:text-gray-600"
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
      </div>
      <span className="sr-only">Loading image...</span>
    </div>
  );
}

export default LoadingSkeleton;
