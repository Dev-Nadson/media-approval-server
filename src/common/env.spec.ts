import { env } from './env.config';

describe('EnvConfig (Unit Test)', () => {
    it('should load env vars correctly', () => {
        expect(env).toBeDefined();
        expect(env.NODE_ENV).toBeDefined();
        expect(env.PORT).toBeDefined();
        expect(env.BCRYPT_ROUNDS).toBeDefined();
        expect(env.JWT_SECRET).toBeDefined();
        expect(env.REDIS_URL).toBeDefined();
        expect(env.DATABASE_URL).toBeDefined();
        expect(env.TEST_DATABASE_URL).toBeDefined();
    });
});
