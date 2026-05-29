import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { bootstrapTestApp } from './test-global';
import { Cache } from 'cache-manager';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;
    let cacheManager: Cache;

    beforeAll(async () => {
        const setup = await bootstrapTestApp();
        app = setup.app;
    })

    // TODO: Implementar o teste de signin
    it('/api/auth/signin (POST) - Should return the services status', () => {
        return request(app.getHttpServer())
            .post('/api/auth/signin')
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
