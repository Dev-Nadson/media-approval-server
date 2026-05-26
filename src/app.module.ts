import { Module } from '@nestjs/common';
import { SessionsModule } from './sessions/sessions.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [AdminsModule, SessionsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
