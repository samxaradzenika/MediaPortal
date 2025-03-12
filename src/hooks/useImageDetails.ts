import { useQuery } from '@tanstack/react-query';
import { Image, imagesApi } from '../services/api';

interface UseImageDetailsReturn {
  image: Image | null;
  loading: boolean;
  error: string | null;
}

export const useImageDetails = (id: string): UseImageDetailsReturn => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['image', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Image ID is required');
      }

      try {
        console.log(`Fetching image details for ID: ${id}`);
        const result = await imagesApi.getById(id);

        if (!result) {
          console.error('Image details returned null');
          throw new Error('Failed to load image details');
        }

        return result;
      } catch (error) {
        console.error('Error fetching image details:', error);
        throw error; // Let React Query handle the error
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  let errorMessage: string | null = null;
  if (isError) {
    errorMessage =
      error instanceof Error ? error.message : 'Failed to load image details. Please try again.';
  }

  return {
    image: data || null,
    loading: isLoading,
    error: errorMessage,
  };
};
