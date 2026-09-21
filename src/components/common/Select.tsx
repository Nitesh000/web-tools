import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className, children, ...props }, ref) => {
    const select = (
      <select
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
      >
        {children}
      </select>
    );

    if (!label) return select;

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        {select}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
