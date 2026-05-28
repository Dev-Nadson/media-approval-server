import { CACHE_KEYS } from '@/common/constants/cache-constants';
import { IdParamDto } from '@/common/dtos/id-param.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { Cache } from 'cache-manager';
import { UtilsService } from '@/common/utils';

@Injectable()
export class AdminsCacheListener {
    private readonly logger = new Logger(AdminsCacheListener.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly utils: UtilsService,
    ) { }

    @OnEvent('admins.mutated')
    public async handleAdminMutated({ id }: IdParamDto): Promise<void> {
        await Promise.all([
            this.cacheManager.del(CACHE_KEYS.ADMIN_GET(id)),

            this.cacheManager.set(
                CACHE_KEYS.ADMINS_VERSION,
                this.utils.create_cache_version()
            ),
        ]);

        this.logger.debug(`Versão do cache rotacionada e admin "${id}" invalidado`);
    }
}