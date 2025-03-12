import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, EnhancedStore, Reducer } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/ThemeContext';
import authReducer, { AuthState } from '../store/slices/authSlice';

// Define RootState type that matches your actual store state
export interface RootState {
  auth: AuthState;
}

// Create a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create a properly typed version of configureStore
export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState as Partial<RootState>),
    ...renderOptions
  } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Use gcTime instead of cacheTime (which is deprecated)
        staleTime: 0,
      },
    },
  });

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
