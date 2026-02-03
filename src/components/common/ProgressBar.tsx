import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showLabel?: boolean;
  labelPosition?: 'top' | 'right' | 'inside';
  isIndeterminate?: boolean;
  ariaLabel?: string;
}

const variantStyles: Record<ProgressBarVariant, string> = {
  default: 'bg-blue-600 dark:bg-blue-500',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  error: 'bg-red-600 dark:bg-red-500',
};

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

const trackSizeStyles: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  isIndeterminate = false,
  ariaLabel,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const displayPercentage = Math.round(percentage);

  return (
    <div
      className={clsx(
        'w-full',
        labelPosition === 'top' && 'space-y-1',
        labelPosition === 'right' && 'flex items-center gap-3',
        className
      )}
      {...props}
    >
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {displayPercentage}%
          </span>
        </div>
      )}

      <div
        className={clsx(
          'relative w-full overflow-hidden rounded-full',
          'bg-gray-200 dark:bg-gray-700',
          trackSizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || `Progress: ${displayPercentage}%`}
      >
        <div
          className={clsx(
            'rounded-full transition-all duration-300 ease-out',
            sizeStyles[size],
            variantStyles[variant],
            isIndeterminate && 'animate-indeterminate'
          )}
          style={{
            width: isIndeterminate ? '30%' : `${percentage}%`,
          }}
        >
          {showLabel && labelPosition === 'inside' && size === 'lg' && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {displayPercentage}%
            </span>
          )}
        </div>
      </div>

      {showLabel && labelPosition === 'right' && (
        <span className="flex-shrink-0 text-sm font-medium text-gray-900 dark:text-white">
          {displayPercentage}%
        </span>
      )}

      <style>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        .animate-indeterminate {
          animation: indeterminate 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;
