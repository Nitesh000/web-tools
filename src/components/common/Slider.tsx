import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  minLabel?: string;
  maxLabel?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, minLabel, maxLabel, id, className, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type="range"
          className={clsx(
            'h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700',
            className
          )}
          {...props}
        />
        {(minLabel || maxLabel) && (
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
