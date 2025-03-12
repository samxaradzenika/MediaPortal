import { renderHook, waitFor } from '@testing-library/react';
import { useImageDetails } from '../useImageDetails';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('useImageDetails Hook', () => {
  const mockImage = {
    id: 1,
    webformatURL: 'https://example.com/image.jpg',
    largeImageURL: 'https://example.com/large-image.jpg',
    imageWidth: 800,
    imageHeight: 600,
    imageSize: 500000,
    type: 'photo',
    tags: 'nature, landscape',
    views: 1000,
    downloads: 500,
    favorites: 100,
    likes: 200,
    comments: 50,
    user: 'Test User',
    userImageURL: 'https://example.com/user.jpg',
  };

  test('fetches image details successfully', async () => {
    server.use(
      http.get('/api/images/:id', () => {
        return HttpResponse.json(mockImage);
      })
    );

    const { result } = renderHook(() => useImageDetails('1'));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.image).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.image).toEqual(mockImage);
    expect(result.current.error).toBe(null);
  });

  test('handles error when fetching image details fails', async () => {
    server.use(
      http.get('/api/images/:id', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    const { result } = renderHook(() => useImageDetails('1'));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.image).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.image).toBe(null);
    expect(result.current.error).toBe('Failed to load image details. Please try again.');
  });

  test('resets state when image id changes', async () => {
    server.use(
      http.get('/api/images/:id', ({ params }) => {
        const { id } = params;
        return HttpResponse.json({ ...mockImage, id: Number(id) });
      })
    );

    const { result, rerender } = renderHook((id: string) => useImageDetails(id), {
      initialProps: '1',
    });

    // Wait for the first image to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.image?.id).toBe(1);

    // Change the image id
    rerender('2');

    // Should be loading again
    expect(result.current.loading).toBe(true);
    expect(result.current.image).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the second image to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.image?.id).toBe(2);
  });
});
