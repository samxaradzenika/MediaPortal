import { http, HttpResponse } from 'msw';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  age: number;
}

// Mock user database
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    age: 30,
  },
];

// Authentication handlers
const authHandlers = [
  // Login endpoint
  http.post('/api/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    // Validate required fields
    if (!email || !password) {
      return HttpResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Return user data without password (using _ prefix for unused vars is a common convention)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pwd, ...userWithoutPassword } = user;

    return HttpResponse.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    });
  }),

  // Register endpoint
  http.post('/api/register', async ({ request }) => {
    const data = (await request.json()) as RegisterRequest;

    // Validate required fields
    if (!data.email || !data.password) {
      return HttpResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Validate age
    if (!data.age || data.age < 18 || data.age > 99) {
      return HttpResponse.json({ message: 'Age must be between 18 and 99' }, { status: 400 });
    }

    // Check if user already exists
    if (users.some((u) => u.email === data.email)) {
      return HttpResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email: data.email,
      password: data.password,
      name: data.email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${data.email.split('@')[0]}`,
      age: data.age,
    };

    // Add to users array
    users.push(newUser);

    // Return user data without password (using _ prefix for unused vars is a common convention)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pwd, ...userWithoutPassword } = newUser;

    return HttpResponse.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    });
  }),

  // Logout endpoint
  http.post('/api/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];

// Create more realistic mock data that resembles Pixabay responses
const generateRealisticImageData = (page = 1, per_page = 10, query = '') => {
  console.log('Generating realistic image data with', { page, per_page, query });

  // Seed some categories for different queries
  const categories: Record<string, string[]> = {
    '': ['nature', 'landscape', 'background'],
    nature: ['forest', 'mountain', 'river', 'lake', 'sky'],
    food: ['fruit', 'vegetable', 'meal', 'dessert', 'breakfast'],
    animals: ['dog', 'cat', 'wildlife', 'bird', 'pet'],
    technology: ['computer', 'phone', 'digital', 'code', 'tech'],
    travel: ['beach', 'city', 'landmark', 'architecture', 'vacation'],
  };

  // Select relevant tags based on query
  const relevantQuery = query.toLowerCase();
  const tags = categories[relevantQuery] || categories[''];

  // Generate unique set of images for each page and query
  const seed = query.length > 0 ? query.charCodeAt(0) : 42;
  const startId = (page - 1) * per_page + 1 + seed * 100;

  const hits = Array.from({ length: per_page }, (_, i) => {
    const id = startId + i;
    const imageId = (id % 1084) + 1; // Pixabay has a limited number of images

    // Select tags relevant to the query with some randomness
    const imageTags = [
      tags[id % tags.length],
      tags[(id + 1) % tags.length],
      tags[(id + 2) % tags.length],
    ].join(', ');

    // Generate random but consistent dimensions
    const widthOptions = [640, 800, 1024, 1280];
    const heightOptions = [427, 533, 683, 853];
    const widthIndex = id % widthOptions.length;
    const width = widthOptions[widthIndex];
    const height = heightOptions[widthIndex];

    // Construct a realistic Pixabay-like object
    return {
      id,
      pageURL: `https://pixabay.com/photos/id-${id}/`,
      type: 'photo',
      tags: query ? `${query}, ${imageTags}` : imageTags,
      previewURL: `https://i.picsum.photos/id/${imageId}/150/100.jpg`,
      previewWidth: 150,
      previewHeight: 100,
      webformatURL: `https://picsum.photos/id/${imageId}/${width}/${height}`,
      webformatWidth: width,
      webformatHeight: height,
      largeImageURL: `https://picsum.photos/id/${imageId}/${width * 2}/${height * 2}`,
      imageWidth: width * 2,
      imageHeight: height * 2,
      imageSize: Math.floor(width * height * 0.1),
      views: Math.floor(10000 + ((id * 123) % 90000)),
      downloads: Math.floor(5000 + ((id * 71) % 45000)),
      collections: Math.floor(100 + ((id * 7) % 900)),
      likes: Math.floor(1000 + ((id * 53) % 9000)),
      comments: Math.floor(50 + ((id * 13) % 450)),
      favorites: Math.floor(200 + ((id * 17) % 800)), // Add favorites count
      user_id: Math.floor(10000 + ((id * 29) % 90000)),
      user: `Photographer${(id % 20) + 1}`,
      userImageURL: `https://i.pravatar.cc/150?img=${(id % 70) + 1}`,
    };
  });

  // Calculate total based on query to maintain consistency
  const totalHits = Math.min(500 + query.length * 100, 1000);
  const total = totalHits * 10; // Pixabay typically has totalHits < total

  return {
    total,
    totalHits,
    hits,
  };
};

// Pixabay API mock handler
const apiHandlers = [
  http.get('/api', ({ request }) => {
    // Check if request exists and has a url
    if (!request || !request.url) {
      console.error('MSW: Request or request.url is undefined');
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');

      // If id parameter is provided, return single image details
      if (id) {
        const numericId = parseInt(id, 10);
        console.log('MSW intercepted single image request for ID:', numericId);

        // Generate mock image data
        // Start with a default set of images
        const mockData = generateRealisticImageData(1, 50);
        let image = mockData.hits.find((img) => img.id === numericId);

        // If not found in first batch, try to generate a specific one
        if (!image) {
          // Create a specific image with the requested ID
          const imageId = (numericId % 1084) + 1;
          const width = 1280;
          const height = 853;

          image = {
            id: numericId,
            pageURL: `https://pixabay.com/photos/id-${numericId}/`,
            type: 'photo',
            tags: 'nature, landscape, beautiful',
            previewURL: `https://picsum.photos/id/${imageId}/150/100`,
            previewWidth: 150,
            previewHeight: 100,
            webformatURL: `https://picsum.photos/id/${imageId}/${width}/${height}`,
            webformatWidth: width,
            webformatHeight: height,
            largeImageURL: `https://picsum.photos/id/${imageId}/${width * 2}/${height * 2}`,
            imageWidth: width * 2,
            imageHeight: height * 2,
            imageSize: width * height * 0.1,
            views: 10000 + ((numericId * 123) % 90000),
            downloads: 5000 + ((numericId * 71) % 45000),
            collections: 100 + ((numericId * 7) % 900),
            likes: 1000 + ((numericId * 53) % 9000),
            comments: 50 + ((numericId * 13) % 450),
            favorites: 200 + ((numericId * 17) % 800), // Add favorites field
            user_id: 10000 + ((numericId * 29) % 90000),
            user: `Photographer${(numericId % 20) + 1}`,
            userImageURL: `https://i.pravatar.cc/150?img=${(numericId % 70) + 1}`,
          };
        }

        console.log('Returning mock image:', image);
        return HttpResponse.json(image);
      }

      // Otherwise, return image list
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const per_page = parseInt(url.searchParams.get('per_page') || '20', 10);
      const query = url.searchParams.get('q') || '';

      console.log('MSW intercepted API request:', { page, per_page, query });

      // Generate mock data
      const data = generateRealisticImageData(page, per_page, query);

      return HttpResponse.json(data);
    } catch (error) {
      console.error('Error in MSW handler:', error);
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }),
];

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...apiHandlers,
  // Add image detail endpoint handler
  http.get('/api/images/:id', ({ params }) => {
    try {
      const id = params.id;
      console.log('MSW intercepted image detail request for ID:', id);

      if (!id) {
        return HttpResponse.json({ error: 'Image ID is required' }, { status: 400 });
      }

      const numericId = parseInt(id.toString(), 10);

      // Generate a specific image with the requested ID
      const imageId = (numericId % 1084) + 1;
      const width = 1280;
      const height = 853;

      const image = {
        id: numericId,
        pageURL: `https://pixabay.com/photos/id-${numericId}/`,
        type: 'photo',
        tags: 'nature, landscape, beautiful',
        previewURL: `https://picsum.photos/id/${imageId}/150/100`,
        previewWidth: 150,
        previewHeight: 100,
        webformatURL: `https://picsum.photos/id/${imageId}/${width}/${height}`,
        webformatWidth: width,
        webformatHeight: height,
        largeImageURL: `https://picsum.photos/id/${imageId}/${width * 2}/${height * 2}`,
        imageWidth: width * 2,
        imageHeight: height * 2,
        imageSize: width * height * 0.1,
        views: 10000 + ((numericId * 123) % 90000),
        downloads: 5000 + ((numericId * 71) % 45000),
        collections: 100 + ((numericId * 7) % 900),
        likes: 1000 + ((numericId * 53) % 9000),
        comments: 50 + ((numericId * 13) % 450),
        favorites: 200 + ((numericId * 17) % 800),
        user_id: 10000 + ((numericId * 29) % 90000),
        user: `Photographer${(numericId % 20) + 1}`,
        userImageURL: `https://i.pravatar.cc/150?img=${(numericId % 70) + 1}`,
      };

      console.log('Returning mock image for /api/images/:id:', image);
      return HttpResponse.json(image);
    } catch (error) {
      console.error('Error in MSW image detail handler:', error);
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }),
];
