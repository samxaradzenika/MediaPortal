import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Provider } from 'react-redux';
import { store } from '../store';

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return rtlRender(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>{ui}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
