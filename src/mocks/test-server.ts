import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for tests
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

// Mock handlers for tests without initializing the server
// This approach avoids the TransformStream error

// Export handlers for tests to use directly
export { handlers };

// Setup test environment - no need to start/stop a server in tests
// Tests should use inline mocks or direct fetch mocking

// Mock global fetch for tests
global.fetch = jest.fn();
