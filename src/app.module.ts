import { Module } from '@nestjs/common';
import { SessionsModule } from './sessions/sessions.module';
import { AdminsModule } from './admins/admins.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { env } from './common/env.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KnexService } from './database/knex.service';

@Module({
  imports: [
    AdminsModule,
    SessionsModule,
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(env.REDIS_URL),
          ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
