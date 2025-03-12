import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useImages } from '../hooks/useImages';
import { ImageGrid } from '../components/ImageGrid';
import { useDebounce } from '../hooks/useDebounce';
import { InfiniteData } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';

interface ImageResponse {
  total: number;
  totalHits: number;
  hits: ImageItem[];
}

// Define a proper type for image items
interface ImageItem {
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

const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Use the improved useImages hook with proper typing
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useImages({
    query: debouncedSearch,
    perPage: 20,
  });

  // Type assertion for data to help TypeScript understand the structure
  const typedData = data as InfiniteData<ImageResponse> | undefined;

  // Flatten the pages of images into a single array
  const images = typedData ? typedData.pages.flatMap((page) => page.hits) : [];

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  // Handle search form submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // The search is already debounced, so we don't need to do anything here
  }, []);

  // Fix the useEffect dependency
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search for images..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Image grid */}
        <ImageGrid
          images={images}
          loading={isLoading}
          error={error as Error}
          hasMore={!!hasNextPage}
          loadingMore={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
        />
      </main>
    </div>
  );
};

export default Home;
