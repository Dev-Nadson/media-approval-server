import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { UtilsService } from '@/common/utils';
import { AdminsCacheListener } from './admins-cache.listener';

@Module({
    imports: [],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsCacheListener, UtilsService],
})
export class AdminsModule { }
