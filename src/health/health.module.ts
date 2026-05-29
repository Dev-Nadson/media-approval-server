import { Module } from "@nestjs/common";
import { KnexHealthIndicator, RedisHealthIndicator } from "./services-health.indicator";
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
    providers: [KnexHealthIndicator, RedisHealthIndicator],
})

export class HealthModule { }