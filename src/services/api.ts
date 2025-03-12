import axios from 'axios';

// Create API client with the correct base URL
export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api' // Use relative URL for development (will be intercepted by MSW)
      : process.env.REACT_APP_API_URL || 'https://pixabay.com/api', // Use actual API URL in production
});

console.log('API client initialized with baseURL:', api.defaults.baseURL);
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL from env:', process.env.REACT_APP_API_URL);

// Request interceptor for adding auth token and API key
api.interceptors.request.use((config) => {
  // Add authentication token for our API endpoints
  if (!config.url?.includes('pixabay')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Transform parameters for Pixabay API if in production
  if (process.env.NODE_ENV !== 'development') {
    // Add Pixabay API key
    config.params = {
      ...config.params,
      key: process.env.REACT_APP_PIXABAY_API_KEY,
    };

    // Map our internal parameter names to Pixabay's expected parameters
    if (config.params?.query) {
      config.params.q = config.params.query;
      delete config.params.query;
    }
  }

  // Ensure pagination parameters are numbers and within valid ranges
  if (config.params?.page) {
    config.params.page = Math.max(1, Number(config.params.page));
  }

  if (config.params?.per_page) {
    // Pixabay allows 3-200 items per page
    config.params.per_page = Math.max(3, Math.min(200, Number(config.params.per_page)));
  }

  // Log the actual request being made
  console.log('🚀 API Request:', {
    url: config.url,
    method: config.method,
    params: config.params,
    baseURL: config.baseURL,
  });

  return config;
});

// Response interceptor for handling errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses with pagination info
    if (response.data && 'hits' in response.data) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        items: response.data.hits.length,
        total: response.data.totalHits,
        page: response.config.params?.page || 1,
        hasMore:
          response.data.totalHits >
          (response.config.params?.page || 1) * (response.config.params?.per_page || 20),
      });

      // Validate response structure
      if (!Array.isArray(response.data.hits)) {
        console.error('❌ Invalid response structure - hits is not an array:', response.data);
        throw new Error('Invalid API response structure');
      }

      // Check for empty results when we expect data
      if (response.data.hits.length === 0 && response.data.totalHits > 0) {
        console.warn('⚠️ Got empty page despite totalHits > 0:', {
          page: response.config.params?.page,
          totalHits: response.data.totalHits,
        });
      }
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      response: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  age: number;
}

export interface User {
  id: string;
  email: string;
  age?: number;
  token: string;
}

export interface ImageSearchParams {
  query?: string;
  page?: number;
  per_page?: number;
}

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

export interface ImageSearchResponse {
  total: number;
  totalHits: number;
  hits: Image[];
}

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post<User>('/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<User>('/register', data);
    return response.data;
  },
};

export const imagesApi = {
  search: async (params: ImageSearchParams) => {
    try {
      console.log('📥 Calling imagesApi.search with params:', params);
      const response = await api.get<ImageSearchResponse>('', { params });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.hits)) {
        console.error('❌ Invalid API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      // Log pagination details
      console.log('📊 Search results:', {
        page: params.page || 1,
        perPage: params.per_page || 20,
        received: response.data.hits.length,
        total: response.data.totalHits,
        hasMore: response.data.totalHits > (params.page || 1) * (params.per_page || 20),
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error in imagesApi.search:', error);
      throw error; // Let the query hook handle the error
    }
  },

  getById: async (id: string) => {
    try {
      const endpoint = process.env.NODE_ENV === 'development' ? `/images/${id}` : `?id=${id}`;
      console.log(`🔍 Fetching image by ID (${id}) using endpoint: ${endpoint}`);

      const response = await api.get<Image>(endpoint);

      // Validate response
      if (!response.data || !response.data.id) {
        console.error('❌ Invalid image response:', response.data);
        throw new Error('Invalid image response');
      }

      console.log('✅ Successfully fetched image:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error in imagesApi.getById:', error);
      throw error;
    }
  },
};
