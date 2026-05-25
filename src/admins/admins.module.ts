import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { UtilsService } from '@/libs/utils';
import { KnexService } from '@/database/knex.service';

@Module({
  imports: [],
  controllers: [AdminsController],
  providers: [AdminsService, UtilsService, KnexService],
})
export class AdminsModule {}
