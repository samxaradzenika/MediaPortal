import { useParams } from 'react-router-dom';
import { ImageDetail } from '../components/ImageDetail';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useQuery } from '@tanstack/react-query';
import { ImageSkeleton } from '../components/ImageSkeleton';

export const ImageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['image', id],
    queryFn: async () => {
      const response = await fetch(`/api/images/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch image details');
      }
      return response.json();
    },
  });

  if (isLoading) return <ImageSkeleton />;
  if (error) throw error;

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">{image && <ImageDetail image={image} />}</div>
    </ErrorBoundary>
  );
};
