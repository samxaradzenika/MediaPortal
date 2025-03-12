import React, { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
// import { useSelector } from 'react-redux';
// import { RootState } from './store';
import { api } from './services/api';
import AppRoutes from './routes';

const App = () => {
  // const {} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const testApiRequest = async () => {
      try {
        console.log('Testing API connectivity...');

        try {
          const fetchResponse = await fetch('/api?page=1&per_page=5');
          const text = await fetchResponse.text();
          console.log('Fetch raw response:', text);

          let fetchData = null;
          if (text && text.trim()) {
            try {
              fetchData = JSON.parse(text);
              console.log('Fetch API test response:', fetchData);
            } catch (parseError) {
              console.error('Error parsing fetch response:', parseError);
            }
          } else {
            console.warn('Empty response received from fetch');
          }
        } catch (fetchError) {
          console.error('Fetch request failed:', fetchError);
        }

        try {
          const axiosResponse = await api.get('', {
            params: { page: 1, per_page: 5 },
          });
          console.log('Axios test response:', axiosResponse.data);

          if (!axiosResponse.data.hits) {
            console.warn('Axios response missing hits array!', axiosResponse.data);
          }
        } catch (axiosError) {
          console.error('Axios request failed:', axiosError);
        }
      } catch (error) {
        console.error('General API test error:', error);
      }
    };

    testApiRequest();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
