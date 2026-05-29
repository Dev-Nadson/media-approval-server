import { Cache } from 'cache-manager';
import { bootstrapTestApp } from '@/../test/test-global';


describe('Cache (Unit Test)', () => {
    let cacheManager: Cache;
    beforeAll(async () => {
        const setup = await bootstrapTestApp()
        cacheManager = setup.cacheManager
    })

    it('shoud be able to set and get a value', async () => {
        await cacheManager.set('1', 'abc');
        const value = await cacheManager.get('1');
        expect(value).toBe('abc');
    });

    it('should be able to delete a value', async () => {
        await cacheManager.set('1', 'abc');
        await cacheManager.del('1');
        const value = await cacheManager.get('1');
        expect(value).toBeUndefined();
    })

    it('should be able to get the stores', async () => {
        const stores = await cacheManager.stores;
        expect(stores).toBeDefined();
    })
});
