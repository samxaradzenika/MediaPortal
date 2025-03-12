import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create and export the MSW worker with the handlers
export const worker = setupWorker(...handlers);
