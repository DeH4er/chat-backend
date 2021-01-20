import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, ChannelModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
