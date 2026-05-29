import { Module } from '@nestjs/common';
import { UtilsService } from '@/common/utils';
import { AuthCacheListener } from './auth-cache.listener';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthCacheListener, UtilsService, AuthService],
})
export class AuthModule { }
