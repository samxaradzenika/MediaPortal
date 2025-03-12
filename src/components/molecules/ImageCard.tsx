import React, { useState } from 'react';
import { HeartIcon, ArrowDownTrayIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Image } from '../../services/api';

interface ImageCardProps {
  image: Image;
  onClick: (image: Image) => void;
  className?: string;
}

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(image);
    }
  };

  // Log image details when the component mounts
  React.useEffect(() => {
    console.log('ImageCard rendering with image:', {
      id: image.id,
      webformatURL: image.webformatURL,
      tags: image.tags,
      user: image.user,
    });
  }, [image]);

  // Use a more reliable fallback image URL that doesn't rely on external services
  const getFallbackImageUrl = (id: number) => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23666666' text-anchor='middle' dominant-baseline='middle'%3EImage ${id}%3C/text%3E%3C/svg%3E`;
  };

  const getUserInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Using ui-avatars.com for the fallback avatar URL
  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(image.user)}&size=64&background=random`;

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-gray-100 dark:bg-gray-800 ${className}`}
      onClick={() => onClick(image)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details of image: ${image.tags}`}
    >
      <div className="w-full relative">
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
        )}
        <img
          src={imageError ? getFallbackImageUrl(image.id) : image.webformatURL}
          alt={image.tags}
          className={`object-cover w-full h-48 ${isLoaded || imageError ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => {
            console.log('Image loaded successfully:', image.webformatURL);
            setIsLoaded(true);
          }}
          onError={(e) => {
            console.error('Image failed to load:', image.webformatURL, e);
            setImageError(true);
            setIsLoaded(true); // Show the fallback
          }}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center mb-2">
          <img
            src={avatarError ? fallbackAvatarUrl : image.userImageURL || fallbackAvatarUrl}
            alt={image.user}
            className="w-6 h-6 rounded-full mr-2"
            onError={() => {
              console.error('Avatar failed to load:', image.userImageURL);
              setAvatarError(true);
            }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{image.user}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <HeartIcon className="w-3 h-3 mr-1" />
            <span>{formatNumber(image.likes)}</span>
          </div>
          <div className="flex items-center">
            <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
            <span>{formatNumber(image.downloads)}</span>
          </div>
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="w-3 h-3 mr-1" />
            <span>{formatNumber(image.comments)}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{formatNumber(image.views)}</span>
        </div>
      </div>
    </div>
  );
};
