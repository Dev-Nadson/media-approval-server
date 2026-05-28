import { CACHE_KEYS } from '@/common/constants/cache-constants';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { Cache } from 'cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';

@Injectable()
export class AdminsCacheListener {
    private readonly logger = new Logger(AdminsCacheListener.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    private getRedisStore(store: any): KeyvRedis<string> | undefined {
        if (store instanceof KeyvRedis) return store;
        if (store instanceof Keyv && store.store instanceof KeyvRedis) return store.store as KeyvRedis<string>;
        return undefined;
    }

    private async deleteRedisPattern(redisStore: KeyvRedis<string>, pattern: string): Promise<void> {
        const client = await redisStore.getClient();
        let cursor = '0';
        do {
            const { cursor: nextCursor, keys } = await client.scan(cursor, {
                MATCH: pattern,
                COUNT: 100,
                TYPE: 'string',
            });
            cursor = nextCursor.toString();

            if (keys.length > 0) {
                await client.unlink(keys);
            }
        } while (cursor !== '0');
    }

    private async deleteKeyvPattern(keyv: Keyv, pattern: string): Promise<void> {
        const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
        const keysToDelete: string[] = [];

        // @ts-ignore
        for await (const [key] of keyv.iterator()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }

        if (keysToDelete.length > 0) {
            await Promise.all(keysToDelete.map(key => keyv.delete(key)));
        }
    }

    private async delByPattern(pattern: string): Promise<void> {
        const stores = this.cacheManager.stores as (Keyv | KeyvRedis<string>)[];

        await Promise.all(stores.map(async (store) => {
            try {
                const redisStore = this.getRedisStore(store);
                if (redisStore) {
                    return await this.deleteRedisPattern(redisStore, pattern);
                }

                if (store instanceof Keyv && typeof (store as any).iterator === 'function') {
                    return await this.deleteKeyvPattern(store, pattern);
                }

                if (!(store as any).client) {
                    this.logger.debug(`Store ${store.constructor.name} não suporta padrão. Limpando store completa para garantir consistência.`);
                    await store.clear();
                }
            } catch (error) {
                this.logger.error(`Falha ao invalidar padrão na store ${store.constructor.name}: ${error.message}`);
            }
        }));
    }


    @OnEvent('admins.mutated')
    public async handleAdminMutated({ id }: IdParamDto): Promise<void> {
        await Promise.all([
            this.cacheManager.del(CACHE_KEYS.ADMIN_GET(id)),
            this.delByPattern(`${CACHE_KEYS.ADMINS_LIST_PREFIX}*`),
        ]);

        this.logger.debug(`Cache invalidado com sucesso para admin "${id}"`);
    }
}