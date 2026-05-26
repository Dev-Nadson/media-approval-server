import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { KnexService } from '@/database/knex.service';

export interface TestAppSetup {
  app: INestApplication<App>;
  knexService: KnexService;
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

  const knexService = moduleFixture.get<KnexService>(KnexService);
  await knexService.conn.migrate.latest();

  return { app, knexService };
}
