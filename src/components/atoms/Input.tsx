import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className, error, id, ...props }) => {
  return (
    <input
      id={id}
      className={clsx(
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
        error &&
          'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
        className
      )}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  );
};
