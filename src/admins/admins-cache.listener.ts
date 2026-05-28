import { CACHE_KEYS } from '@/common/constants/cache-constants';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { Cache } from 'cache-manager';

@Injectable()
export class AdminsCacheListener {
    private readonly logger = new Logger(AdminsCacheListener.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    @OnEvent('admins.mutated')
    public async handleAdminMutated({ id }: IdParamDto): Promise<void> {
        await Promise.all([
            this.cacheManager.del(CACHE_KEYS.ADMIN_GET(id)),
            this.cacheManager.del(CACHE_KEYS.ADMINS_LIST(1, 10)),
            // TODO: Invalidate all list caches
        ]);

        this.logger.debug(`Cache invalidado para o admin id="${id}" e listagens`);
    }
}