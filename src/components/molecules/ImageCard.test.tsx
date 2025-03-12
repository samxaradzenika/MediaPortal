import { render, screen, fireEvent } from '@testing-library/react';
import { ImageCard } from './ImageCard';
import { Image } from '../../types/Image';

const mockImage: Image = {
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

describe('ImageCard', () => {
  test('renders image card with correct information', () => {
    const handleClick = jest.fn();
    render(<ImageCard image={mockImage} onClick={handleClick} />);

    expect(screen.getByAltText(/nature, landscape/i)).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument(); // views
    expect(screen.getByText('200')).toBeInTheDocument(); // likes
    expect(screen.getByText('50')).toBeInTheDocument(); // comments
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ImageCard image={mockImage} onClick={handleClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  test('renders user avatar with fallback', () => {
    const imageWithoutAvatar = { ...mockImage, userImageURL: '' };
    render(<ImageCard image={imageWithoutAvatar} onClick={() => {}} />);

    const avatar = screen.getByRole('img', { name: /test user/i });
    expect(avatar).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
  });
});
