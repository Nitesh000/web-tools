import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        id={id}
        className={clsx(
          'w-full rounded-lg border border-gray-300 px-3 py-2',
          'bg-white text-gray-900',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
          className
        )}
        {...props}
      />
    );

    if (!label) return input;

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        {input}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
