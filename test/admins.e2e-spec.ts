import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { KnexService } from '@/database/knex.service';
import { bootstrapTestApp } from './test-global';

describe('AdminsController (e2e)', () => {
    let app: INestApplication<App>;
    let knexService: KnexService;
    let createdAdminId: string;

    beforeAll(async () => {
        const setup = await bootstrapTestApp();
        app = setup.app;
        knexService = setup.knexService;

        await knexService.conn('admins').truncate();
    });

    it('/api/admins (GET) - Should return empty array initially', () => {
        return request(app.getHttpServer())
            .get('/api/admins')
            .expect(200)
            .expect([]);
    });

    it('/api/admins (POST) - Should create a new admin', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/admins')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'securepassword123'
            })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(typeof response.body.id).toBe('string');
        createdAdminId = response.body.id;
    });

    it('/api/admins (POST) - Should not create an admin when email already exists', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/admins')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'securepassword123'
            })
            .expect(409);

        expect(response.body).toHaveProperty('message', 'Admin already exists');
    });

    it('/api/admins/:id (GET) - Should retrieve the created admin', async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/admins/${createdAdminId}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', createdAdminId);
        expect(response.body).toHaveProperty('name', 'John Doe');
        expect(response.body).toHaveProperty('email', 'john.doe@example.com');
    });

    it('/api/admins/:id (GET) - Should return 404 when admin not found', async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/admins/aaaabbbbccccddddeeeeffff`)
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Admin not found');
    });

    it('/api/admins/:id (PUT) - Should update the admin details', async () => {
        const response = await request(app.getHttpServer())
            .put(`/api/admins/${createdAdminId}`)
            .send({
                name: 'John Updated',
                email: 'john.updated@example.com',
                password: 'newsecurepassword123'
            })
            .expect(200);

        expect(response.body).toEqual({ id: createdAdminId });
    });

    it('/api/admins/:id (PUT) - Should return 404 when admin not found', async () => {
        const response = await request(app.getHttpServer())
            .put(`/api/admins/aaaabbbbccccddddeeeeffff`)
            .send({
                name: 'John Updated',
                email: 'john.updated@example.com',
                password: 'newsecurepassword123'
            })
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Admin not found');
    });

    it('/api/admins/:id (DELETE) - Should delete the admin', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/api/admins/${createdAdminId}`)
            .expect(200);

        expect(response.body).toEqual({ id: createdAdminId });
    });

    it('/api/admins/:id (DELETE) - Should return 404 when admin not found', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/api/admins/aaaabbbbccccddddeeeeffff`)
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Admin not found');
    });

    afterAll(async () => {
        await app.close();
    });
});
