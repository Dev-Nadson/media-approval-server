import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HealthController } from '@/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { bootstrapTestApp } from './test-global';
import { Cache } from 'cache-manager';

describe('HealthController (e2e)', () => {
  let controller: HealthController;
  let app: INestApplication<App>;
  let cacheManager: Cache;

  beforeAll(async () => {
    const setup = await bootstrapTestApp();
    app = setup.app;
    cacheManager = setup.cacheManager;
  })

  // TODO: Implementar o teste de health
  it('/api/health (GET) - Should return the services status', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
  });

  afterAll(async () => {
    await cacheManager.disconnect();
    await app.close();
  });
});
