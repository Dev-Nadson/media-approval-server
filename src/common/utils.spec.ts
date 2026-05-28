import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils';

describe('UtilsService (Unit Test)', () => {
    let service: UtilsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UtilsService],
        }).compile();

        service = module.get<UtilsService>(UtilsService);
    });

    describe('create_id', () => {
        it('should return a string with 24 characters (default Cuid2)', () => {
            const id = service.create_id();
            expect(typeof id).toBe('string');
            expect(id).toHaveLength(24);
        });

        it('should return different IDs in consecutive calls (uniqueness)', () => {
            const id1 = service.create_id();
            const id2 = service.create_id();
            expect(id1).not.toBe(id2);
        });
    });

    describe('create_nano_id', () => {
        it('should return a string with 8 characters (default Cuid2)', () => {
            const id = service.create_nano_id();
            expect(typeof id).toBe('string');
            expect(id).toHaveLength(8);
        });

        it('should return different IDs in consecutive calls (uniqueness)', () => {
            const id1 = service.create_nano_id();
            const id2 = service.create_nano_id();
            expect(id1).not.toBe(id2);
        });
    });

    describe('hash_password and compare_password', () => {
        const plainPassword = '12345678';

        it('should hash password successfully (generate hash different from plain text)', async () => {
            const hash = await service.hash_password(plainPassword);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(plainPassword);
            expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
        });

        it('should return true when comparing the correct password with its hash', async () => {
            const hash = await service.hash_password(plainPassword);
            const isMatch = await service.compare_password(plainPassword, hash);

            expect(isMatch).toBe(true);
        });

        it('should return false when comparing an incorrect password with the hash', async () => {
            const hash = await service.hash_password(plainPassword);
            const isMatch = await service.compare_password('wrong password', hash);

            expect(isMatch).toBe(false);
        });
    });

    describe('create_cache_version', () => {
        it('should return a string with 8 characters (default Cuid2)', () => {
            const id = service.create_cache_version();
            expect(typeof id).toBe('string');
            expect(id).toHaveLength(8);
        });

        it('should return different IDs in consecutive calls (uniqueness)', () => {
            const id1 = service.create_cache_version();
            const id2 = service.create_cache_version();
            expect(id1).not.toBe(id2);
        });
    });

    describe('get_cache_version', () => {
        it('should return the cached version if it exists', async () => {
            const cache = {
                get: jest.fn().mockResolvedValue('bv9kxspk'),
            };
            const version = await service.get_cache_version(cache, 'test');
            expect(version).toBe('bv9kxspk');
        });

        it('should return "initial" if the cached version does not exist', async () => {
            const cache = {
                get: jest.fn().mockResolvedValue(undefined),
            };
            const version = await service.get_cache_version(cache, 'test');
            expect(version).toBe('initial');
        });
    });
});
