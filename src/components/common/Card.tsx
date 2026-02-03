import { type ReactNode, type HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  isHoverable?: boolean;
  isClickable?: boolean;
  children?: ReactNode;
}

export function Card({
  title,
  description,
  icon,
  href,
  isHoverable = true,
  isClickable = false,
  className,
  children,
  onClick,
  ...props
}: CardProps) {
  const cardClasses = clsx(
    // Base styles
    'rounded-xl border bg-white p-6',
    'border-gray-200',
    'dark:border-gray-700 dark:bg-gray-800',
    // Transition
    'transition-all duration-200',
    // Hover effects
    isHoverable && [
      'hover:border-gray-300 hover:shadow-lg',
      'dark:hover:border-gray-600',
    ],
    // Clickable styles
    (isClickable || href || onClick) && [
      'cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'dark:focus:ring-offset-gray-900',
    ],
    className
  );

  const content = (
    <>
      {icon && (
        <div
          className={clsx(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-lg',
            'bg-blue-100 text-blue-600',
            'dark:bg-blue-900/50 dark:text-blue-400'
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cardClasses}
        aria-label={title ? `Go to ${title}` : undefined}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cardClasses}
      role={isClickable || onClick ? 'button' : undefined}
      tabIndex={isClickable || onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((isClickable || onClick) && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      aria-label={isClickable && title ? `Select ${title}` : undefined}
      {...props}
    >
      {content}
    </div>
  );
}

export default Card;
