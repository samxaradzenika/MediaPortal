import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ImageCardSkeleton } from './molecules/ImageCardSkeleton';

interface Image {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
  userImageURL: string;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  favorites: number;
}

interface ImageGridProps {
  images: Image[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  error,
  hasMore,
  loadingMore,
  loadMoreRef,
}) => {
  const navigate = useNavigate();

  const handleImageClick = (id: number) => {
    navigate(`/image/${id}`);
  };

  if (loading && images.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ImageCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Failed to load images
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-lg"
            onClick={() => handleImageClick(image.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageClick(image.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View details for image by ${image.user}`}
          >
            <div className="relative pb-[66.67%]">
              <img
                src={image.webformatURL}
                alt={image.tags}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center mb-2">
                {image.userImageURL ? (
                  <img
                    src={image.userImageURL}
                    alt={image.user}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {image.user}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {image.likes}
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {image.views}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loadingMore && (
        <div className="py-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {hasMore && !loadingMore && <div ref={loadMoreRef} className="h-10" />}

      {!hasMore && images.length > 0 && (
        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
          You&apos;ve reached the end of the results
        </div>
      )}
    </div>
  );
};
