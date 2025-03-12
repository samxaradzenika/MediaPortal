import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Cache time settings
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const DEFAULT_PAGE_SIZE = 20; // Consistent page size
const MAX_TOTAL_IMAGES = 500; // Pixabay API limit

interface UseImagesOptions {
  query?: string;
  perPage?: number;
}

interface ImageData {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  tags: string;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  favorites: number;
  type: string;
  user: string;
  userImageURL: string;
}

interface ImageResponse {
  total: number;
  totalHits: number;
  hits: ImageData[];
}

export const useImages = ({ query = '', perPage = DEFAULT_PAGE_SIZE }: UseImagesOptions = {}) => {
  // Sanitize perPage to be between 10 and 50
  const sanitizedPerPage = Math.max(10, Math.min(50, perPage));

  return useInfiniteQuery<ImageResponse, Error>({
    queryKey: ['images', query, sanitizedPerPage],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`📥 Fetching page ${pageParam} with ${sanitizedPerPage} items per page...`);

      try {
        const response = await api.get<ImageResponse>('', {
          params: {
            q: query,
            page: pageParam,
            per_page: sanitizedPerPage,
          },
        });

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.hits)) {
          console.error('❌ Invalid API response:', response.data);
          throw new Error('Invalid API response structure');
        }

        // Log success with detailed information
        console.log('✅ API Response:', {
          page: pageParam,
          itemsReceived: response.data.hits.length,
          totalHits: response.data.totalHits,
          firstImageId: response.data.hits[0]?.id,
          lastImageId: response.data.hits[response.data.hits.length - 1]?.id,
        });

        return response.data;
      } catch (error) {
        console.error('❌ Error fetching images:', error);
        throw error; // Let React Query handle the error
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce((sum, page) => sum + page.hits.length, 0);
      const nextPage = allPages.length + 1;
      const totalPages = Math.min(
        Math.ceil(lastPage.totalHits / sanitizedPerPage),
        Math.ceil(MAX_TOTAL_IMAGES / sanitizedPerPage)
      );
      const hasMore = loadedItems < MAX_TOTAL_IMAGES && nextPage <= totalPages;

      console.log('📊 Pagination Status:', {
        currentPage: allPages.length,
        nextPage,
        totalPages,
        totalHits: lastPage.totalHits,
        loadedItems,
        hasMore,
        reachedMaxLimit: loadedItems >= MAX_TOTAL_IMAGES,
      });

      return hasMore ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
};
