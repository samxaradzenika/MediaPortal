import React from 'react';

export const ImageCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="relative pb-[66.67%] bg-gray-200 dark:bg-gray-700"></div>

      {/* Content placeholder */}
      <div className="p-3">
        {/* User info placeholder */}
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        {/* Stats placeholder */}
        <div className="flex justify-between">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
