import { useParams, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  EyeIcon,
  ArrowLeftIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import { useImageDetails } from '../hooks/useImageDetails';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { image, loading, error } = useImageDetails(id!);
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 dark:text-white mb-4">
            {error || 'Image not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to gallery
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Image header with user info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              {image.userImageURL ? (
                <img
                  src={image.userImageURL}
                  alt={image.user}
                  className="h-10 w-10 rounded-full mr-3"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                  <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">{image.user}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Photographer</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ID: {image.id}</div>
          </div>

          {/* Main image */}
          <div className="relative bg-gray-100 dark:bg-gray-900 flex justify-center">
            <img
              src={image.largeImageURL || image.webformatURL}
              alt={image.tags}
              className="max-h-[70vh] object-contain"
            />
          </div>

          {/* Image stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-500 mb-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(image.views)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Views</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <HeartIcon className="h-6 w-6 text-red-500 mb-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(image.likes)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Likes</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-green-500 mb-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(image.comments)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Comments</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-500 mb-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(image.favorites || 0)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Favorites</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ArrowDownTrayIcon className="h-6 w-6 text-purple-500 mb-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(image.downloads)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Downloads</span>
            </div>
          </div>

          {/* Image details */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Image Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <TagIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {image.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhotoIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {image.type || 'Photo'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <ArrowsPointingOutIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dimensions
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {image.imageWidth} × {image.imageHeight} pixels
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-2 mt-0.5">
                    <span className="text-xs font-bold">MB</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      File Size
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(image.imageSize)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <a
              href={image.largeImageURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              download
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download Image
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
