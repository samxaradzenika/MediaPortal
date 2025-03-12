import { worker } from './browser';

// This function initializes the MSW worker
export const initializeMSW = async () => {
  // Only initialize in development
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('%cInitializing Mock Service Worker...', 'color: purple; font-weight: bold;');

      // Log environment variables for debugging
      console.log('Environment variables:', {
        apiUrl: process.env.REACT_APP_API_URL,
        env: process.env.NODE_ENV,
      });

      // Clear any existing service workers first to avoid conflicts
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('Unregistered service worker:', registration.scope);
          }
        } catch (error) {
          console.error('Error unregistering service workers:', error);
        }
      }

      // Start the worker with simpler configuration
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        quiet: false, // Enable logs
      });

      console.log(
        '%cMock Service Worker activated successfully!',
        'color: green; font-weight: bold;'
      );
    } catch (error) {
      console.error('MSW worker initialization failed:', error);
    }
  } else {
    console.log('MSW not started in production mode');
  }

  // Always continue with app initialization
  return Promise.resolve();
};
