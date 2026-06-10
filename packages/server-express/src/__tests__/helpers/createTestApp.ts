import type { Express } from 'express';
import supertest from 'supertest';
import { createApp } from '../../app';

export interface TestAppContext {
  app: Express;
  request: supertest.SuperTest<supertest.Test>;
}

export function createTestApp(): TestAppContext {
  const app = createApp();
  const request = supertest(app);
  return { app, request };
}
