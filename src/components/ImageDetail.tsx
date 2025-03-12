import { FC } from 'react';
import { formatNumber } from '../utils/formatters';

interface ImageMetrics {
  views: number;
  likes: number;
  comments: number;
  favorites: number;
  downloads: number;
}

interface ImageDetailProps {
  image: {
    webformatURL: string;
    tags: string;
    user: string;
  } & ImageMetrics;
}

export const ImageDetail: FC<ImageDetailProps> = ({ image }) => {
  const metrics = [
    { label: 'Views', value: image.views },
    { label: 'Likes', value: image.likes },
    { label: 'Comments', value: image.comments },
    { label: 'Favorites', value: image.favorites },
    { label: 'Downloads', value: image.downloads },
  ];

  return (
    <div className="space-y-4">
      <img
        src={image.webformatURL}
        alt={image.tags}
        className="w-full rounded-lg shadow-lg"
        loading="lazy"
      />

      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-lg font-semibold">{formatNumber(value)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {image.tags.split(',').map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 cursor-pointer"
          >
            {tag.trim()}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600">
        Photo by <span className="font-medium">{image.user}</span>
      </p>
    </div>
  );
};
