import { KnexService } from "@/database/knex.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { HealthCheckError, HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";
import type { Cache } from "cache-manager";

@Injectable()
export class KnexHealthIndicator {
    constructor(
        private readonly knex: KnexService,
        private readonly healthIndicatorService: HealthIndicatorService
    ) { }

    async pingCheck(key: string): Promise<HealthIndicatorResult> {
        const status = await this.healthIndicatorService.check(key)

        try {
            await this.knex.conn.raw('SELECT 1')
            return status.up()
        } catch (error) {
            return status.down()
        }
    }
}

@Injectable()
export class RedisHealthIndicator {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly healthIndicatorService: HealthIndicatorService
    ) { }

    async pingCheck(key: string): Promise<HealthIndicatorResult> {
        const indicator = this.healthIndicatorService.check(key);

        try {
            await this.cacheManager.set('health:test', 'abc', 1000);
            const value = await this.cacheManager.get('health:test');

            if (value !== 'abc') {
                throw new Error('Redis is not returning the expected value');
            }

            return indicator.up();
        } catch (error) {
            return indicator.down({ message: error.message });
        }
    }
}