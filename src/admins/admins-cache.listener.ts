import { CACHE_KEYS } from "@/common/constants/cache-constants";
import { IdParamDto } from "@/common/dtos/id-param.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { Cache } from "cache-manager";

@Injectable()
export class AdminsCacheListener {
    private readonly logger = new Logger(AdminsCacheListener.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    @OnEvent('admins.mutated')
    public async handleAdminMutated({ id }: IdParamDto) {
        await this.cacheManager.del(CACHE_KEYS.ADMIN_GET(id))
        // TODO: invalidar lista geral de admins

        this.logger.debug(`Cache invalidado para o admin de id: ${id}`);
    }
}