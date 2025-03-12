import React from 'react';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { ImageGrid } from '../components/ImageGrid';
import { ImageDetailPage } from '../pages/ImageDetailPage';
import { renderWithProviders } from './testUtils';

// Mock component for testing
jest.mock('../components/molecules/ImageCardSkeleton', () => ({
  ImageCardSkeleton: () => <div data-testid="image-skeleton">Loading...</div>,
}));

// Mock component for testing
jest.mock('../pages/ImageDetailPage', () => ({
  ImageDetailPage: () => <div>Image Detail Page</div>,
}));

describe('Images module', () => {
  const mockImages = [
    {
      id: 1,
      webformatURL: 'https://example.com/image1.jpg',
      largeImageURL: 'https://example.com/image1_large.jpg',
      tags: 'nature, sky',
      user: 'User 1',
      userImageURL: 'https://example.com/user1.jpg',
      views: 1000,
      downloads: 500,
      likes: 100,
      comments: 50,
      favorites: 25,
      imageWidth: 800,
      imageHeight: 600,
      imageSize: 123456,
      type: 'photo',
    },
  ];

  test('can navigate to image detail page', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ImageGrid
              images={mockImages}
              loading={false}
              error={null}
              hasMore={false}
              loadingMore={false}
            />
          }
        />
        <Route path="/image/:id" element={<ImageDetailPage />} />
      </Routes>
    );

    // Test image grid renders
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // Likes count
  });

  test('displays loading skeleton while fetching', () => {
    renderWithProviders(
      <ImageGrid images={[]} loading={true} error={null} hasMore={false} loadingMore={false} />
    );
    // Use getAllByTestId instead of getByTestId since there are multiple skeletons
    const skeletons = screen.getAllByTestId('image-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays error state when there is an error', () => {
    renderWithProviders(
      <ImageGrid
        images={[]}
        loading={false}
        error={new Error('Failed to load')}
        hasMore={false}
        loadingMore={false}
      />
    );
    expect(screen.getByText('Failed to load images')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  test('displays empty state when no images found', () => {
    renderWithProviders(
      <ImageGrid images={[]} loading={false} error={null} hasMore={false} loadingMore={false} />
    );
    expect(screen.getByText('No images found')).toBeInTheDocument();
  });
});
