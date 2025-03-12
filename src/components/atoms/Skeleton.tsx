import React from 'react';
import clsx from 'clsx';

type SkeletonVariant = 'text' | 'rectangular' | 'circular';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const classes = clsx(
    'animate-pulse bg-gray-200 dark:bg-gray-700',
    {
      'rounded-md': variant === 'text',
      'rounded-none': variant === 'rectangular',
      'rounded-full': variant === 'circular',
    },
    className
  );

  const style = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height:
      height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return <div className={classes} style={style} />;
};
