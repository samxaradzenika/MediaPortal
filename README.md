# MediaPortal

A modern React application for browsing and viewing images with user authentication.

## Features

- 🔐 **User Authentication**

  - Secure login and registration
  - Form validation
  - Protected routes

- 🖼️ **Image Gallery**

  - Infinite scroll image browsing
  - Search functionality
  - Detailed image information
  - User engagement metrics

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Loading skeletons
  - Smooth transitions

## Tech Stack

- ⚛️ React 18 with TypeScript
- 🎯 Redux Toolkit for state management
- 🛣️ React Router v6 for navigation
- 💅 TailwindCSS for styling
- 🧪 MSW for API mocking
- 🎣 Custom hooks for business logic
- 📱 Responsive design principles

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/MediaPortal.git
   cd MediaPortal
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_URL=https://pixabay.com/api

   # Get your API key from https://pixabay.com/api/docs/
   REACT_APP_PIXABAY_API_KEY=your_pixabay_api_key_here

   # Environment
   NODE_ENV=development

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── atoms/         # Basic building blocks
│   ├── molecules/     # Combinations of atoms
│   └── organisms/     # Complex components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── mocks/             # MSW handlers
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store
└── utils/             # Helper functions
```

## Component Architecture

The project follows the Atomic Design pattern:

- **Atoms**: Basic components like Button, Input, Skeleton
- **Molecules**: Composite components like FormField, ImageCard
- **Organisms**: Complex components like AuthForm, ImageGrid
- **Pages**: Full page components with business logic

## Features in Detail

### Authentication

- Email/password-based authentication
- Form validation with error messages
- Age verification for registration
- Protected routes for authenticated users

### Image Gallery

- Infinite scroll implementation
- Search functionality
- Loading states with skeleton placeholders
- Responsive grid layout

### Image Details

- Comprehensive image information display
- User engagement metrics
- Responsive image viewing
- Navigation between images

### Theme Support

- Dark/Light mode toggle
- System preference detection
- Persistent theme selection

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful component and function names
- Include JSDoc comments for complex functions

### Testing

- Write unit tests for utilities and hooks
- Create integration tests for components
- Use React Testing Library for component testing
- Mock API calls using MSW

### Performance

- Implement code splitting with React.lazy
- Use React.memo for expensive components
- Optimize images and assets
- Monitor bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request


## Environment Setup

1. Create a `.env` file in the root directory:

   ```env
   # API configuration
   REACT_APP_API_URL=https://pixabay.com/api

   # Get your API key from https://pixabay.com/api/docs/
   REACT_APP_PIXABAY_API_KEY=your_pixabay_api_key_here

   # Environment
   NODE_ENV=development


2. Get your Pixabay API key:
   - Sign up at https://pixabay.com/
   - Go to https://pixabay.com/api/docs/
   - Copy your API key
   - Replace `your_pixabay_api_key_here` in `.env` with your actual key

## Testing

Run the test suite:

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

