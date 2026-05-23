import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { pokeapiServer } from '@/lib/pokeapi/mocks/server';

beforeAll(() => pokeapiServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => pokeapiServer.resetHandlers());
afterAll(() => pokeapiServer.close());
