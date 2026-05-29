import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { KnexService } from '@/database/knex.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface TestAppSetup {
  app: INestApplication<App>;
  knexService: KnexService;
  cacheManager: Cache;
}

/**
 * Bootstraps the NestJS application with the correct test configuration,
 * including global prefixes, validation pipes, and runs pending migrations.
 */
export async function bootstrapTestApp(): Promise<TestAppSetup> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  const cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER);
  const knexService = moduleFixture.get<KnexService>(KnexService);

  await knexService.conn.migrate.rollback();
  await knexService.conn.migrate.latest();

  return { app, knexService, cacheManager };
}
