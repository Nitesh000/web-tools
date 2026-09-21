import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const ICON_SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'flex items-center justify-center rounded-lg',
        'bg-gray-100 text-gray-700 hover:bg-gray-200',
        'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        'transition-colors duration-200',
        SIZE_CLASSES[size],
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className={ICON_SIZE_CLASSES[size]} /> : <Moon className={ICON_SIZE_CLASSES[size]} />}
    </button>
  );
}

export default ThemeToggle;
