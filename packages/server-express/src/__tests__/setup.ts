import { beforeAll, afterAll, vi } from 'vitest';

process.env.NODE_ENV = 'test';

beforeAll(() => {
});

afterAll(() => {
  vi.restoreAllMocks();
});
