import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsModule } from './sessions/sessions.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [AdminsModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
