import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides default theme value', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const user = userEvent.setup();
    const button = screen.getByText(/toggle theme/i);

    await user.click(button);
    expect(screen.getByText(/current theme: dark/i)).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
  });

  it('persists theme in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('throws error when useTheme is used outside of ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });
});
