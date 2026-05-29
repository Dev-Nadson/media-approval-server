import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { KnexHealthIndicator, RedisHealthIndicator } from './services-health.indicator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: KnexHealthIndicator,
        private cache: RedisHealthIndicator
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.pingCheck('postgresql'),
            // () => this.cache.pingCheck('redis'),
        ]);
    }
}
