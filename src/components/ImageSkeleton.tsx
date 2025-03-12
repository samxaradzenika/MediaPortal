import { FC } from 'react';

export const ImageSkeleton: FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-200 rounded-lg" />

      {/* Metrics placeholder */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-4 bg-gray-200 rounded mb-1" />
            <div className="w-12 h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Tags placeholder */}
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-20 h-6 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* User info placeholder */}
      <div className="w-32 h-4 bg-gray-200 rounded" />
    </div>
  );
};
