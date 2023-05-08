import { handlers } from './handlers';
import { setupWorker } from 'msw';

const worker = setupWorker(...handlers);

if (import.meta.env.DEV) {
	worker.start();
}
