import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, fullWidth = true, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={props.id} className="text-sm text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'border bg-white px-3 py-1.5 text-gray-900 placeholder-gray-500',
            'focus:outline-none',
            'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
            error ? 'border-red-500' : 'border-gray-300',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
