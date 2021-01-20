import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message])],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
