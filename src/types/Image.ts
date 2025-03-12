export interface Image {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  type: string;
  tags: string;
  views: number;
  downloads: number;
  favorites: number;
  likes: number;
  comments: number;
  user: string;
  userImageURL: string;
}
